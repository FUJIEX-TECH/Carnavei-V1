"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export type ResetState = { ok?: boolean; error?: string } | null;

export async function resetPassword(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "Link inválido." };
  if (password.length < 6) return { error: "A senha precisa de ao menos 6 caracteres." };
  if (password !== confirm) return { error: "As senhas não coincidem." };

  const vt = await db.verificationToken.findFirst({ where: { token } });
  if (!vt || vt.expires < new Date()) {
    return { error: "Este link expirou ou é inválido. Solicite um novo." };
  }

  const hash = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { email: vt.identifier },
    data: { password: hash },
  });
  // Invalida todos os tokens desse e-mail (uso único).
  await db.verificationToken.deleteMany({ where: { identifier: vt.identifier } });

  return { ok: true };
}
