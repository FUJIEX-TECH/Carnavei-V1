"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { resetPassword, type ResetState } from "./actions";

export default function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(
    resetPassword,
    null
  );

  if (state?.ok) {
    return (
      <div className="w-full max-w-xs text-center space-y-4">
        <CheckCircle2 size={40} className="text-[var(--terracotta)] mx-auto" strokeWidth={1.5} />
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
          Senha redefinida com sucesso! Já pode entrar com a nova senha.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 rounded-full bg-[var(--terracotta)] text-white text-sm font-semibold hover:bg-[var(--terracotta-hover)] transition-colors"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-xs text-center space-y-4">
        <p className="text-sm text-[var(--ink-soft)]">Link inválido ou incompleto.</p>
        <Link href="/esqueci-senha" className="text-sm text-[var(--terracotta)] font-semibold underline underline-offset-4">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="w-full max-w-xs space-y-4 text-left">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Nova senha</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          className="w-full px-4 py-2.5 text-sm border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Confirmar nova senha</label>
        <input
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Repita a senha"
          className="w-full px-4 py-2.5 text-sm border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
        />
      </div>

      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--terracotta)] text-white text-sm font-semibold hover:bg-[var(--terracotta-hover)] disabled:opacity-50 transition-colors"
      >
        {pending ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : "Redefinir senha"}
      </button>
    </form>
  );
}
