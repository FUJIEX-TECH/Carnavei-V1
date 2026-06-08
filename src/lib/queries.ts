import { db } from "./db";
import type { Product } from "./products";

const productInclude = {
  variants: {
    include: {
      attributeValues: {
        include: { attribute: true },
      },
    },
  },
} as const;

type DbProduct = Awaited<ReturnType<typeof db.product.findFirst>> & {
  variants: Array<{
    price: number;
    stock: number;
    attributeValues: Array<{
      value: string;
      attribute: { name: string };
    }>;
  }>;
};

function toProduct(p: NonNullable<DbProduct>): Product {
  const sizeAttr = p.variants[0]?.attributeValues.find(
    (av) => av.attribute.name === "Tamanho"
  );

  const sizes = p.variants
    .flatMap((v) =>
      v.attributeValues
        .filter((av) => av.attribute.name === "Tamanho")
        .map((av) => av.value)
    )
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const soldOutSizes = p.variants
    .filter((v) => v.stock === 0)
    .flatMap((v) =>
      v.attributeValues
        .filter((av) => av.attribute.name === "Tamanho")
        .map((av) => av.value)
    );

  const price = p.variants[0]?.price ?? 0;

  return {
    id: p.slug,
    name: p.name,
    category: p.category,
    price: price / 100,
    eyebrow: p.eyebrow ?? "",
    tagline: p.tagline ?? "",
    hero: p.hero ?? p.images[0] ?? "",
    heroPosition: p.heroPosition ?? undefined,
    heroExclude: p.heroExclude,
    thumbnail: p.thumbnail ?? undefined,
    images: p.images,
    blurb: p.blurb ?? "",
    details: p.details ?? "",
    sizes,
    soldOutSizes,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
    include: productInclude,
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  if (!row) return null;
  return toProduct(row);
}
