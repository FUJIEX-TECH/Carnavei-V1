import { db } from "@/lib/db";

export type PromoResult =
  | { ok: true; code: string; discountCents: number; label: string }
  | { ok: false; error: string };

// Valida um cupom contra o subtotal (em centavos) e retorna o desconto.
// Centraliza a regra para ser reusada na UI (/api/promo/validate) e no
// checkout (re-validação antes de criar a preferência) — nunca confiar só no
// que vem do cliente.
export async function validatePromo(
  rawCode: string,
  subtotalCents: number
): Promise<PromoResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Informe um cupom." };

  const promo = await db.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active) return { ok: false, error: "Cupom inválido." };
  if (promo.expiresAt && promo.expiresAt < new Date())
    return { ok: false, error: "Cupom expirado." };
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses)
    return { ok: false, error: "Cupom esgotado." };
  if (promo.minOrder != null && subtotalCents < promo.minOrder)
    return {
      ok: false,
      error: `Válido para pedidos a partir de ${brl(promo.minOrder)}.`,
    };

  // value: pontos percentuais (percent) ou centavos (fixed)
  const discountCents =
    promo.type === "PERCENT"
      ? Math.round((subtotalCents * promo.value) / 100)
      : Math.min(promo.value, subtotalCents); // nunca descontar mais que o subtotal

  const label =
    promo.type === "PERCENT" ? `${promo.value}% off` : `${brl(promo.value)} off`;

  return { ok: true, code, discountCents, label };
}

function brl(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}
