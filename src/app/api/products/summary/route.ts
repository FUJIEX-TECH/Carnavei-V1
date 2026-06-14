import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slugsParam = url.searchParams.get("slugs") ?? "";
  const slugs = slugsParam.split(",").filter(Boolean);

  if (slugs.length === 0) return NextResponse.json([]);

  const products = await db.product.findMany({
    where: { slug: { in: slugs } },
    select: {
      slug: true,
      name: true,
      thumbnail: true,
      variants: { select: { price: true }, take: 1 },
    },
  });

  return NextResponse.json(
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      thumbnail: p.thumbnail,
      price: (p.variants[0]?.price ?? 0) / 100,
    }))
  );
}
