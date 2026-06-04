import type { Metadata } from "next";
import { Cormorant, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/store/CustomCursor";

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Carnavei — Acessórios Artesanais",
  description:
    "Acessórios artesanais femininos feitos à mão. Bolsas, chokers, broches e muito mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${hanken.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
