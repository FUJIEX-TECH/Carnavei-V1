"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";

export type RegisterState = { error?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  // WhatsApp: DDI + DDD + número. BR (DDI 55) exige DDD de 2 e número de 9 dígitos.
  const ddi = String(formData.get("ddi") ?? "+55").replace(/\D/g, "");
  const ddd = String(formData.get("ddd") ?? "").replace(/\D/g, "");
  const num = String(formData.get("phone") ?? "").replace(/\D/g, "");

  if (!name || name.length < 2) return { error: "Informe seu nome." };
  if (!EMAIL_RE.test(email)) return { error: "E-mail inválido." };
  if (password.length < 6) return { error: "A senha precisa de ao menos 6 caracteres." };

  if (!ddi || ddi.length > 3) return { error: "DDI inválido." };
  if (ddi === "55") {
    if (ddd.length !== 2) return { error: "DDD deve ter 2 dígitos." };
    if (num.length !== 9) return { error: "O WhatsApp deve ter 9 dígitos." };
  } else {
    if (ddd.length < 1 || num.length < 6) return { error: "WhatsApp inválido." };
  }
  const phone = `+${ddi}${ddd}${num}`;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: existing.password
        ? "Já existe uma conta com esse e-mail. Faça login."
        : "Esse e-mail já está cadastrado pelo Google. Entre com Google.",
    };
  }

  const hash = await bcrypt.hash(password, 10);
  await db.user.create({
    data: { name, email, password: hash, phone, role: "CUSTOMER" },
  });

  // Loga automaticamente após o cadastro. `signIn` redireciona em caso de sucesso
  // (lança NEXT_REDIRECT, que não deve ser capturado) — por isso fica fora do try.
  await signIn("credentials", { email, password, redirectTo: "/conta" });
  return null;
}
