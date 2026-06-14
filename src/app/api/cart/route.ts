import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { CartItem } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session.cart ?? []);
}

export async function POST(req: Request) {
  const session = await getSession();
  const body = (await req.json()) as CartItem;

  const cart = session.cart ?? [];
  const idx = cart.findIndex(
    (i) => i.slug === body.slug && i.size === body.size
  );

  if (idx >= 0) {
    cart[idx].qty = Math.min(cart[idx].qty + body.qty, 10);
  } else {
    cart.push({ slug: body.slug, size: body.size, qty: body.qty });
  }

  session.cart = cart;
  await session.save();
  return NextResponse.json(cart);
}

export async function DELETE(req: Request) {
  const session = await getSession();
  const body = (await req.json().catch(() => ({}))) as {
    slug?: string;
    size?: string;
    all?: boolean;
  };

  // Sem slug ou com `all: true` → esvazia o carrinho inteiro (pós-pagamento)
  if (body.all || !body.slug) {
    session.cart = [];
  } else {
    session.cart = (session.cart ?? []).filter(
      (i) => !(i.slug === body.slug && i.size === body.size)
    );
  }
  await session.save();
  return NextResponse.json(session.cart);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  const { slug, size, qty } = (await req.json()) as CartItem;

  session.cart = (session.cart ?? []).map((i) =>
    i.slug === slug && i.size === size ? { ...i, qty } : i
  );
  await session.save();
  return NextResponse.json(session.cart);
}
