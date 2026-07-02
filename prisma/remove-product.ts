import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env") });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Slugs a retirar da vitrine (status -> DRAFT). Não deleta o produto nem
// seus pedidos — só some da loja.
const slugsToRemove = ["choker-branca"];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida no .env");

  const adapter = new PrismaNeon({ connectionString: url });
  const prisma = new PrismaClient({ adapter } as never);

  for (const slug of slugsToRemove) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      console.log(`  ⚠ produto "${slug}" não encontrado — pulando`);
      continue;
    }

    await prisma.product.update({
      where: { slug },
      data: { status: "DRAFT" },
    });

    console.log(`  ✓ ${existing.name} (${slug}) removido da vitrine`);
  }

  console.log("\nConcluído. Pedidos intactos.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
