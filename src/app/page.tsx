import type { Metadata } from "next";
import { StorefrontApp } from "@/components/store/StorefrontApp";
import { getProducts } from "@/lib/queries";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Carnavei — Acessórios Artesanais",
  description: "Acessórios artesanais femininos feitos à mão. Cada peça é única.",
};

export default async function Page() {
  const [products, session] = await Promise.all([getProducts(), getSession()]);
  return <StorefrontApp products={products} initialCart={session.cart ?? []} />;
}
