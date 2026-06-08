import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { ProductPageClient } from "./ProductPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Carnavei`,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) notFound();

  const others = allProducts.filter((p) => p.id !== slug);

  return <ProductPageClient product={product} others={others} />;
}
