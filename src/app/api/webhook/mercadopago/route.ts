import { NextResponse } from "next/server";
import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { mpPayment } from "@/lib/mercadopago";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail, sendAdminOrderEmail, sendWelcomeEmail } from "@/lib/email";

// Valida a assinatura HMAC do Mercado Pago (header x-signature).
// Manifest: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" assinado com
// MP_WEBHOOK_SECRET (chave configurada no painel do MP). Se o segredo não
// estiver definido (dev), a validação é pulada.
function verifyMpSignature(req: Request, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

  const sig = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";
  const parts = Object.fromEntries(
    sig.split(",").map((p) => p.split("=").map((s) => s.trim()))
  ) as { ts?: string; v1?: string };
  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${parts.ts};`;
  const hmac = createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = await req.json();

  // Mercado Pago envia notificações de diferentes tipos
  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) {
    return NextResponse.json({ error: "payment id ausente" }, { status: 400 });
  }

  // Segurança: rejeita notificações sem assinatura válida (em produção).
  const dataId = url.searchParams.get("data.id") || String(paymentId);
  if (!verifyMpSignature(req, dataId)) {
    return NextResponse.json({ error: "assinatura inválida" }, { status: 401 });
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
    promo?: { code: string; discount: number } | null;
  };

  if (!meta?.cart?.length) {
    return NextResponse.json({ ok: true });
  }

  const discountCents = meta.promo?.discount ?? 0;
  const promoCodeUsed = meta.promo?.code ?? null;

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

  // Auto-cadastro: vincula o pedido a uma conta. Se o cliente ainda não tem
  // conta, cria uma (sem senha) e gera um link para ele definir a senha.
  const email = meta.address.email.toLowerCase().trim();
  let userId: string | undefined;
  let welcomeUrl: string | undefined;
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const newUser = await db.user.create({
      data: {
        email,
        name: meta.address.name,
        phone: meta.address.phone,
        role: "CUSTOMER",
      },
    });
    userId = newUser.id;
    // Token de 7 dias para definir a senha (reusa o fluxo de /redefinir-senha)
    const token = randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    welcomeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${token}`;
  }

  let order;
  try {
    order = await db.order.create({
    data: {
      status: "PAID",
      userId,
      mercadoPagoPaymentId: mpPaymentId,
      paymentMethod: String((payment as unknown as Record<string, unknown>)["payment_type_id"] ?? "unknown"),
      subtotal,
      discountAmount: discountCents,
      promoCodeUsed,
      shippingPrice: shippingCents,
      total: subtotal - discountCents + shippingCents,
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

  // Conta o uso do cupom (só após o pedido ser criado com sucesso)
  if (promoCodeUsed) {
    await db.promoCode
      .update({ where: { code: promoCodeUsed }, data: { usedCount: { increment: 1 } } })
      .catch((err) => console.error("[promo-increment]", err));
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
      // Só para conta recém-criada: convite para definir a senha
      welcomeUrl
        ? sendWelcomeEmail(email, meta.address.name, welcomeUrl)
        : Promise.resolve(),
    ]);
  } catch (err) {
    console.error("[order-email]", err);
  }

  return NextResponse.json({ ok: true });
}
