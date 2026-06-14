"use server";

import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotState = { sent?: boolean; error?: string } | null;

export async function requestPasswordReset(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  if (!email) return { error: "Informe o e-mail." };

  const user = await db.user.findUnique({ where: { email } });

  // Só envia se a conta existe E tem senha (contas Google não têm senha).
  // Mesmo assim respondemos sempre de forma genérica, para não revelar
  // quais e-mails têm conta.
  if (user?.password) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await db.verificationToken.deleteMany({ where: { identifier: email } });
    await db.verificationToken.create({ data: { identifier: email, token, expires } });

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${token}`;
    try {
      await sendPasswordResetEmail(email, url);
    } catch (err) {
      console.error("[reset-email]", err);
      // Não revela erro de envio ao usuário (resposta genérica).
    }
  }

  return { sent: true };
}
