import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env") });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const newProducts = [
  {
    slug: "broche-bandeira",
    name: "Broche Bandeira",
    category: "Broche",
    eyebrow: "Copa 2026",
    tagline: "A bandeira no peito, o Brasil no coração.",
    blurb: "Broche artesanal com a bandeira do Brasil em resina e miçangas — feito à mão, peça por peça. Pra quem vai ao jogo ou assiste em casa com todo o estilo.",
    details: "Resina e miçangas · bordado à mão · fixação com alfinete seguro · peça única artesanal",
    hero: "/images/broche-bandeira-1.jpg",
    heroPosition: "center 40%",
    thumbnail: "/images/broche-bandeira-3.jpg",
    images: [
      "/images/broche-bandeira-1.jpg",
      "/images/broche-bandeira-2.jpg",
      "/images/broche-bandeira-3.jpg",
      "/images/broche-bandeira-4.jpg",
      "/images/broche-bandeira-5.jpg",
    ],
    price: 3000, // R$ 30,00 em centavos
    sizes: ["Único"],
    weight: 50, width: 5, height: 1, length: 5,
  },
  {
    slug: "lenco-br-summer",
    name: "Lenço BR Summer",
    category: "Lenço",
    eyebrow: "Copa 2026",
    tagline: "O Brasil no pescoço. O verão no coração.",
    blurb: "Lenço artesanal com estampa Copa 2026 — o amarelo e o verde em cada dobra. Usa no pescoço, na cabeça ou no cabelo: três looks, uma peça.",
    details: "Tecido leve · estampa Copa 2026 · uso versátil (pescoço, cabeça, cabelo) · tamanho único",
    hero: "/images/lenco-br-summer-1.jpg",
    heroPosition: "center 40%",
    thumbnail: "/images/lenco-br-summer-2.jpg",
    images: [
      "/images/lenco-br-summer-1.jpg",
      "/images/lenco-br-summer-2.jpg",
      "/images/lenco-br-summer-3.jpg",
      "/images/lenco-br-summer-4.jpg",
      "/images/lenco-br-summer-5.jpg",
      "/images/lenco-br-summer-6.jpg",
      "/images/lenco-br-summer-7.jpg",
      "/images/lenco-br-summer-8.jpg",
    ],
    price: 5000, // R$ 50,00 em centavos
    sizes: ["Único"],
    weight: 50, width: 15, height: 1, length: 15,
  },
  {
    slug: "lenco-made-in-br",
    name: "Lenço Made in BR",
    category: "Lenço",
    eyebrow: "Copa 2026",
    tagline: "Ela é brasileira — feito à mão, do Brasil pro mundo.",
    blurb: "Lenço artesanal com estampa tropical brasileira — ararajuba, hibisco e a energia da torcida. Para usar no pescoço, na cabeça ou no cabelo.",
    details: "Tecido leve · estampa tropical Copa 2026 · uso versátil (pescoço, cabeça, cabelo) · tamanho único",
    hero: "/images/lenco-made-br-1.jpg",
    heroPosition: "center 40%",
    thumbnail: "/images/lenco-made-br-4.jpg",
    images: [
      "/images/lenco-made-br-1.jpg",
      "/images/lenco-made-br-2.jpg",
      "/images/lenco-made-br-3.jpg",
      "/images/lenco-made-br-4.jpg",
      "/images/lenco-made-br-5.jpg",
      "/images/lenco-made-br-6.jpg",
      "/images/lenco-made-br-7.jpg",
    ],
    price: 5000, // R$ 50,00 em centavos
    sizes: ["Único"],
    weight: 50, width: 15, height: 1, length: 15,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida no .env");

  const adapter = new PrismaNeon({ connectionString: url });
  const prisma = new PrismaClient({ adapter } as never);

  for (const p of newProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`  ⚠ "${p.name}" já existe (slug: ${p.slug}) — pulando`);
      continue;
    }

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
        heroExclude: true,
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

    console.log(`  ✓ ${p.name} (R$ ${(p.price / 100).toFixed(2)})`);
  }

  console.log("\nConcluído. Pedidos intactos.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
