import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Rota ONE-TIME: popula integration_tokens com o token do Melhor Envio a partir
// das env vars (que só são legíveis em runtime, não via `vercel env pull`).
// Protegida pelo AUTH_SECRET. Remover após usar.
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const accessToken = process.env.MELHOR_ENVIO_TOKEN;
  const refreshToken = process.env.MELHOR_ENVIO_REFRESH_TOKEN;
  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "MELHOR_ENVIO_TOKEN/REFRESH ausentes" }, { status: 400 });
  }
  const expiresAt = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
  await db.integrationToken.upsert({
    where: { provider: "melhor_envio" },
    update: { accessToken, refreshToken, expiresAt },
    create: { provider: "melhor_envio", accessToken, refreshToken, expiresAt },
  });
  return NextResponse.json({ ok: true, provider: "melhor_envio", expiresAt });
}
