import { NextResponse } from "next/server";
import { mpPreference } from "@/lib/mercadopago";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

type CheckoutBody = {
  shipping: {
    id: number;
    name: string;
    price: number;
    days: number;
    company: string;
  };
  address: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  };
};

export async function POST(req: Request) {
  try {
  const session = await getSession();
  const cart = session.cart ?? [];

  if (!cart.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const { shipping, address } = (await req.json()) as CheckoutBody;

  // Busca produtos do banco para montar os items da preferência
  const slugs = cart.map((i) => i.slug);
  const products = await db.product.findMany({
    where: { slug: { in: slugs } },
    include: { variants: true },
  });

  const items = cart.map((cartItem) => {
    const product = products.find((p) => p.slug === cartItem.slug)!;
    const variant = product.variants[0];
    return {
      id: product.slug,
      title: product.name,
      quantity: cartItem.qty,
      unit_price: variant.price / 100,
      currency_id: "BRL",
    };
  });

  // Item de frete
  items.push({
    id: `frete-${shipping.id}`,
    title: `Frete ${shipping.name} (${shipping.company})`,
    quantity: 1,
    unit_price: shipping.price,
    currency_id: "BRL",
  });

  // Parcelas máximas por faixa de valor (juros por conta do cliente, cobrados
  // pelo Mercado Pago): até R$300 → 4x; acima → 10x. O Pix segue à vista.
  const totalAmount = items.reduce((s, it) => s + it.unit_price * it.quantity, 0);
  const maxInstallments = totalAmount <= 300 ? 4 : 10;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Em sandbox (MP_TEST_BUYER_EMAIL definido) NÃO enviamos o pagador: passar
  // e-mail real dava "uma das partes é de teste", e passar e-mail de test_user
  // fazia o checkout exigir login dessa conta (que falha no mobile). Sem payer,
  // o Mercado Pago abre o checkout em modo convidado (paga só com o cartão).
  // Em produção, enviamos o pagador com o e-mail real do cliente.
  const isTest = !!process.env.MP_TEST_BUYER_EMAIL;
  const payer = isTest
    ? undefined
    : {
        name: address.name,
        email: address.email,
        identification: { type: "CPF", number: address.cpf },
        phone: { number: address.phone },
        address: {
          zip_code: address.cep,
          street_name: address.street,
          street_number: address.number,
        },
      };

  const preference = await mpPreference.create({
    body: {
      items,
      ...(payer ? { payer } : {}),
      payment_methods: {
        installments: maxInstallments, // máximo de parcelas no cartão
      },
      shipments: {
        // Sem `cost` aqui: o frete já entra como item (acima). Ter os dois
        // cobrava o frete em dobro. Mantemos só o endereço de entrega.
        mode: "not_specified",
        receiver_address: {
          zip_code: address.cep,
          street_name: address.street,
          street_number: address.number,
          apartment: address.complement,
          city_name: address.city,
          state_name: address.state,
        },
      },
      back_urls: {
        success: `${appUrl}/checkout/sucesso`,
        failure: `${appUrl}/checkout/falha`,
        pending: `${appUrl}/checkout/pendente`,
      },
      notification_url: `${appUrl}/api/webhook/mercadopago`,
      metadata: {
        cart: cart,
        address: address,
        shipping: shipping,
      },
    },
  });

  return NextResponse.json({
    preferenceId: preference.id,
    initPoint: preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  });
  } catch (err) {
    // Log completo no servidor; resposta genérica pro cliente (não vazar stack)
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}
