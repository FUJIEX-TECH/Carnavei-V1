import type { Metadata } from "next";
import { StorefrontApp } from "@/components/store/StorefrontApp";

export const metadata: Metadata = {
  title: "Carnavei — Acessórios Artesanais",
  description: "Acessórios artesanais femininos feitos à mão. Cada peça é única.",
};

export default function Page() {
  return <StorefrontApp />;
}
