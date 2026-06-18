import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const products = [
  {
    slug: "choker-branca",
    name: "Choker Bandana Branca",
    category: "Choker",
    eyebrow: "Copa 2026",
    tagline: "O branco que torce junto.",
    blurb: "Bandana branca com charms dourados — apito, chuteira e a bandeira esmaltada do Brasil. Feita à mão pra quem vai torcer com estilo.",
    details: "Tecido de algodão estampado · charms banhados a ouro 18k · apito · chuteira · bandeira esmaltada · fecho ajustável",
    hero: "/images/choker-branca-2.jpg",
    thumbnail: "/images/choker-branca-6.jpg",
    images: [
      "/images/choker-branca-2.jpg",
      "/images/choker-branca-4.jpg",
      "/images/choker-branca-5.jpg",
      "/images/choker-branca-3.jpg",
      "/images/choker-branca-1.jpg",
      "/images/choker-branca-6.jpg",
    ],
    price: 6000,
    sizes: ["Ajustável"],
    weight: 300, width: 12, height: 2, length: 17,
  },
  {
    slug: "bolsa-canarinho",
    name: "Bolsa Canarinho",
    category: "Bolsa",
    eyebrow: "Edição limitada",
    tagline: "Carregue a seleção no ombro.",
    blurb: "Cristais verde-petróleo, miçangas amarelo-canarinho e um troféu dourado pra dar sorte. Cada bolsa é trançada à mão — não existem duas iguais.",
    details: "Miçangas de cristal verde-petróleo e acrílico · alça de cordão trançado · ferragens e charm de troféu banhados a ouro · ~18 × 14 cm. Feita à mão no Brasil.",
    hero: "/images/bolsa-canarinho-1.jpg",
    heroPosition: "center 92%",
    thumbnail: "/images/bolsa-canarinho-5.jpg",
    images: [
      "/images/bolsa-canarinho-capa-hero.jpg",
      "/images/bolsa-canarinho-1.jpg",
      "/images/bolsa-canarinho-2.jpg",
      "/images/bolsa-canarinho-4.jpg",
      "/images/bolsa-canarinho-5.jpg",
    ],
    price: 29000,
    sizes: ["Único"],
    weight: 500, width: 12, height: 2, length: 17,
  },
  {
    slug: "charm-chain",
    name: "Charm Chain",
    category: "Corrente",
    eyebrow: "Copa 2026",
    tagline: "Entra no jeans, sai na torcida.",
    blurb: "Corrente prata com 6 charms da Copa presa nos passantes do jeans. Bola, camisa 10, bandeira e coração verde-amarelo — tudo que a torcida precisa na cintura.",
    details: "Corrente em aço inox prateado · 6 charms em resina e esmalte · argola de fixação para passante de cinto · tamanho único",
    hero: "/images/charm-chain-hero.jpg",
    heroPosition: "center 65%",
    thumbnail: "/images/charm-chain-3.jpg",
    images: [
      "/images/charm-chain-hero.jpg",
      "/images/charm-chain-1.jpg",
      "/images/charm-chain-2.jpg",
      "/images/charm-chain-3.jpg",
    ],
    price: 4000,
    sizes: ["Único"],
    weight: 300, width: 12, height: 2, length: 17,
  },
  {
    slug: "choker-bandeira",
    name: "Choker Bandana Verde",
    category: "Choker",
    eyebrow: "Feito à mão",
    tagline: "Um lencinho verde, um ouro no pescoço.",
    blurb: "Choker de bandana verde torcida com charms dourados — a chavinha e a bandeira esmaltada. Ajusta no pescoço como um nó de verão.",
    details: "Tecido de algodão estampado · charms banhados a ouro 18k · fecho ajustável. Comprimento ajustável.",
    hero: "/images/choker-ensaio-01.jpg",
    heroExclude: true,
    images: ["/images/choker-ensaio-01.jpg"],
    price: 6000,
    sizes: ["Ajustável"],
    weight: 300, width: 12, height: 2, length: 17,
  },
  {
    slug: "colar-selecao",
    name: "Colar Brasil",
    category: "Colar",
    eyebrow: "Copa 2026",
    tagline: "A bandeira no pescoço, a torcida no coração.",
    blurb: "Miçangas seed bead verde e amarelo tecidas à mão, com pingente que reproduz a bandeira do Brasil ponto a ponto. Fecho lagosta e corrente de extensão dourados. Pra quem vai ao jogo ou assiste na arquibancada de casa — e quer chegar toda produzida.",
    details: "Miçangas de vidro seed bead · pingente bandeira tecido à mão · fecho lagosta e corrente de extensão banhados a ouro",
    hero: "/images/colar-brasil-micanga-bandeira-copa-2026.jpg",
    heroPosition: "center 30%",
    thumbnail: "/images/colar-brasil-micanga-bandeira-produto.jpg",
    images: [
      "/images/colar-brasil-micanga-bandeira-copa-2026.jpg",
      "/images/colar-brasil-micanga-detalhe-pingente.jpg",
      "/images/colar-brasil-micanga-bandeira-modelo-look.jpg",
      "/images/colar-brasil-micanga-bandeira-modelo-sorrindo.jpg",
      "/images/colar-brasil-micanga-bandeira-produto.jpg",
      "/images/colar-brasil-micanga-bandeira-produto-detalhe.jpg",
    ],
    price: 5000,
    sizes: ["Único"],
    weight: 300, width: 12, height: 2, length: 17,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida no .env");

  const adapter = new PrismaNeon({ connectionString: url });
  const prisma = new PrismaClient({ adapter } as never);

  console.log("Limpando dados anteriores...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.product.deleteMany();

  console.log("Inserindo produtos...");

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        eyebrow: p.eyebrow,
        tagline: p.tagline,
        blurb: p.blurb,
        details: p.details,
        hero: p.hero,
        heroPosition: p.heroPosition ?? null,
        heroExclude: p.heroExclude ?? false,
        thumbnail: p.thumbnail ?? null,
        images: p.images,
        status: "ACTIVE",
      },
    });

    const attribute = await prisma.productAttribute.create({
      data: { name: "Tamanho", productId: product.id },
    });

    for (const size of p.sizes) {
      const attrValue = await prisma.attributeValue.create({
        data: { value: size, attributeId: attribute.id },
      });

      await prisma.productVariant.create({
        data: {
          sku: `${p.slug}-${size.toLowerCase().replace(/\s/g, "-")}`,
          price: p.price,
          stock: 10,
          images: [],
          weight: p.weight,
          width: p.width,
          height: p.height,
          length: p.length,
          productId: product.id,
          attributeValues: { connect: { id: attrValue.id } },
        },
      });
    }

    console.log(`  ✓ ${p.name}`);
  }

  console.log("\nSeed concluído.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
