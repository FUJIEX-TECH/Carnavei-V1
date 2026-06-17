import { db } from "@/lib/db";

export const ME_BASE =
  process.env.MELHOR_ENVIO_ENV === "sandbox"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";

const UA = "Carnavei (fernando.fujie@gmail.com)";
const PROVIDER = "melhor_envio";
const RENEW_THRESHOLD_MS = 5 * 24 * 60 * 60 * 1000; // renova com 5 dias de folga

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

async function refreshToken(refresh: string): Promise<TokenResponse> {
  const res = await fetch(`${ME_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": UA },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
      client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`refresh Melhor Envio falhou: ${res.status} ${await res.text()}`);
  return res.json();
}

// Retorna um access_token válido do Melhor Envio. Lê do banco (integration_tokens)
// e renova automaticamente via refresh_token quando está perto de expirar.
// Fallback para a env MELHOR_ENVIO_TOKEN se ainda não houver registro no banco.
export async function getMelhorEnvioToken(): Promise<string> {
  // Dev/sandbox: token fixo da env (não usa o banco, que guarda o de produção).
  if (process.env.MELHOR_ENVIO_ENV === "sandbox") {
    return process.env.MELHOR_ENVIO_TOKEN ?? "";
  }

  const rec = await db.integrationToken.findUnique({ where: { provider: PROVIDER } });
  if (!rec) return process.env.MELHOR_ENVIO_TOKEN ?? "";

  if (rec.expiresAt.getTime() - Date.now() > RENEW_THRESHOLD_MS) {
    return rec.accessToken;
  }

  // Perto de expirar → renova e persiste
  try {
    const t = await refreshToken(rec.refreshToken);
    await db.integrationToken.update({
      where: { provider: PROVIDER },
      data: {
        accessToken: t.access_token,
        refreshToken: t.refresh_token,
        expiresAt: new Date(Date.now() + t.expires_in * 1000),
      },
    });
    return t.access_token;
  } catch (err) {
    console.error("[melhor-envio-refresh]", err);
    return rec.accessToken; // ainda pode estar válido; não derruba o cálculo de frete
  }
}
