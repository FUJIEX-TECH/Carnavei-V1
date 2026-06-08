import type { Metadata } from "next";
import { StorefrontApp } from "@/components/store/StorefrontApp";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Carnavei — Loja",
  description: "Acessórios artesanais femininos feitos à mão. Cada peça é única.",
};

export default async function LojaPage() {
  const products = await getProducts();
  return <StorefrontApp products={products} />;
}
