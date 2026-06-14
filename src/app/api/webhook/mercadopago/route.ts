import { NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail, sendAdminOrderEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();

  // Mercado Pago envia notificações de diferentes tipos
  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) {
    return NextResponse.json({ error: "payment id ausente" }, { status: 400 });
  }

  const payment = await mpPayment.get({ id: paymentId });

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  // Idempotência: o Mercado Pago reenvia a mesma notificação várias vezes.
  // Se já registramos um pedido para este pagamento, não criamos outro.
  const mpPaymentId = String(paymentId);
  const existing = await db.order.findUnique({
    where: { mercadoPagoPaymentId: mpPaymentId },
  });
  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const meta = payment.metadata as {
    cart: Array<{ slug: string; size: string; qty: number }>;
    address: {
      name: string; email: string; cpf: string; phone: string;
      cep: string; street: string; number: string; complement?: string;
      district: string; city: string; state: string;
    };
    shipping: { id: number; name: string; price: number; days: number; company: string };
  };

  if (!meta?.cart?.length) {
    return NextResponse.json({ ok: true });
  }

  // Busca variantes para montar os order items
  const slugs = meta.cart.map((i) => i.slug);
  const products = await db.product.findMany({
    where: { slug: { in: slugs } },
    include: { variants: true },
  });

  const subtotal = meta.cart.reduce((sum, cartItem) => {
    const variant = products.find((p) => p.slug === cartItem.slug)?.variants[0];
    return sum + (variant?.price ?? 0) * cartItem.qty;
  }, 0);

  const shippingCents = Math.round(meta.shipping.price * 100);

  let order;
  try {
    order = await db.order.create({
    data: {
      status: "PAID",
      mercadoPagoPaymentId: mpPaymentId,
      paymentMethod: String((payment as unknown as Record<string, unknown>)["payment_type_id"] ?? "unknown"),
      subtotal,
      shippingPrice: shippingCents,
      total: subtotal + shippingCents,
      customerName: meta.address.name,
      customerEmail: meta.address.email,
      customerDocument: meta.address.cpf,
      customerPhone: meta.address.phone,
      shippingAddress: {
        name: meta.address.name,
        street: meta.address.street,
        number: meta.address.number,
        complement: meta.address.complement ?? "",
        district: meta.address.district,
        city: meta.address.city,
        state: meta.address.state,
        zipCode: meta.address.cep,
      },
      shippingService: meta.shipping.name,
      items: {
        create: meta.cart.flatMap((cartItem) => {
          const variant = products.find((p) => p.slug === cartItem.slug)?.variants[0];
          if (!variant) return [];
          return {
            variantId: variant.id,
            quantity: cartItem.qty,
            unitPrice: variant.price,
          };
        }),
      },
    },
    });
  } catch (err) {
    // P2002 = violação do unique em mercadoPagoPaymentId: outra notificação
    // concorrente já criou o pedido. Tratamos como sucesso (idempotente).
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return NextResponse.json({ ok: true });
    }
    throw err;
  }

  // E-mails de confirmação (cliente + admin). Falha de envio não derruba o
  // webhook — o pedido já está pago e registrado.
  try {
    const emailData = {
      customerName: meta.address.name,
      customerEmail: meta.address.email,
      items: meta.cart.map((ci) => {
        const p = products.find((p) => p.slug === ci.slug);
        return {
          name: p?.name ?? ci.slug,
          qty: ci.qty,
          unitPrice: p?.variants[0]?.price ?? 0,
        };
      }),
      subtotal,
      shippingPrice: shippingCents,
      total: subtotal + shippingCents,
      shippingService: meta.shipping.name,
      address: {
        street: meta.address.street,
        number: meta.address.number,
        complement: meta.address.complement,
        district: meta.address.district,
        city: meta.address.city,
        state: meta.address.state,
        cep: meta.address.cep,
      },
      orderRef: order.id.slice(-6).toUpperCase(),
    };
    await Promise.all([
      sendOrderConfirmationEmail(emailData),
      sendAdminOrderEmail(emailData),
    ]);
  } catch (err) {
    console.error("[order-email]", err);
  }

  return NextResponse.json({ ok: true });
}
