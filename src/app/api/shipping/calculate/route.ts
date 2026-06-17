import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMelhorEnvioToken, ME_BASE as ME_ROOT } from "@/lib/melhor-envio";

const ME_BASE = `${ME_ROOT}/api/v2`;

type RequestBody = {
  cep: string;
  items: { slug: string; qty: number }[];
};

export async function POST(req: Request) {
  const { cep, items } = (await req.json()) as RequestBody;

  if (!cep || !items?.length) {
    return NextResponse.json({ error: "cep e items são obrigatórios" }, { status: 400 });
  }

  // Busca variantes dos produtos para obter dimensões e preço
  const slugs = items.map((i) => i.slug);
  const products = await db.product.findMany({
    where: { slug: { in: slugs } },
    include: { variants: true },
  });

  const meProducts = items.flatMap(({ slug, qty }) => {
    const product = products.find((p) => p.slug === slug);
    const variant = product?.variants[0];
    if (!variant) return [];

    return {
      id: slug,
      width: variant.width,
      height: variant.height,
      length: variant.length,
      weight: variant.weight / 1000, // gramas → kg
      insurance_value: variant.price / 100, // centavos → reais
      quantity: qty,
    };
  });

  if (!meProducts.length) {
    return NextResponse.json({ error: "Nenhum produto encontrado" }, { status: 400 });
  }

  const fromCep = process.env.MELHOR_ENVIO_FROM_CEP!.replace(/\D/g, "");
  const toCep = cep.replace(/\D/g, "");
  const meToken = await getMelhorEnvioToken();

  const res = await fetch(`${ME_BASE}/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${meToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Carnavei (fernando.fujie@gmail.com)",
    },
    body: JSON.stringify({
      from: { postal_code: fromCep },
      to: { postal_code: toCep },
      products: meProducts,
      options: {
        receipt: false,
        own_hand: false,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();

  // Filtra apenas opções com preço (sem erro) e formata para o frontend
  const options = (data as Array<{
    id: number;
    name: string;
    price: string;
    delivery_time: number;
    company: { name: string };
    error?: string;
  }>)
    .filter((o) => !o.error && o.price)
    .map((o) => ({
      id: o.id,
      name: o.name,
      company: o.company.name,
      price: parseFloat(o.price),
      days: o.delivery_time,
    }))
    .sort((a, b) => a.price - b.price);

  return NextResponse.json(options);
}
