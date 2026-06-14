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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const preference = await mpPreference.create({
    body: {
      items,
      payer: {
        name: address.name,
        email: address.email,
        identification: { type: "CPF", number: address.cpf },
        phone: { number: address.phone },
        address: {
          zip_code: address.cep,
          street_name: address.street,
          street_number: address.number,
        },
      },
      shipments: {
        cost: shipping.price,
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
