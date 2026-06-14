import { NextResponse } from "next/server";

// Callback OAuth do Melhor Envio — não usado na V1 (token pessoal)
export async function GET() {
  return NextResponse.json({ ok: true });
}
