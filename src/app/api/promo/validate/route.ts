import { NextResponse } from "next/server";
import { validatePromo } from "@/lib/promo";

export async function POST(req: Request) {
  const { code, subtotal } = (await req.json()) as {
    code?: string;
    subtotal?: number; // centavos
  };
  const result = await validatePromo(String(code ?? ""), Number(subtotal ?? 0));
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
