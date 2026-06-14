"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { requestPasswordReset, type ForgotState } from "./actions";

export default function ForgotForm() {
  const [state, action, pending] = useActionState<ForgotState, FormData>(
    requestPasswordReset,
    null
  );

  if (state?.sent) {
    return (
      <div className="w-full max-w-xs text-center space-y-4">
        <MailCheck size={40} className="text-[var(--terracotta)] mx-auto" strokeWidth={1.5} />
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
          Se existir uma conta com esse e-mail, enviamos um link para redefinir a
          senha. Confira sua caixa de entrada (e o spam).
        </p>
        <Link href="/login" className="inline-block text-sm text-[var(--terracotta)] font-semibold underline underline-offset-4">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="w-full max-w-xs space-y-4 text-left">
      <div>
        <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">E-mail</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@email.com"
          className="w-full px-4 py-2.5 text-sm border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
        />
      </div>

      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--terracotta)] text-white text-sm font-semibold hover:bg-[var(--terracotta-hover)] disabled:opacity-50 transition-colors"
      >
        {pending ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : "Enviar link de recuperação"}
      </button>

      <p className="text-sm text-[var(--ink-soft)] text-center pt-2">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-[var(--terracotta)] font-semibold underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </form>
  );
}
