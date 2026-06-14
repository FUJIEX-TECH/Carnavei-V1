"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { registerUser, type RegisterState } from "./actions";
import { loginWithGoogle } from "../login/actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    null
  );

  return (
    <div className="w-full max-w-xs space-y-5">
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-[var(--line)] bg-white text-[var(--ink)] text-sm font-semibold hover:bg-[var(--paper)] transition-colors"
        >
          <GoogleIcon /> Cadastrar com Google
        </button>
      </form>

      <div className="flex items-center gap-3 text-[var(--ink-faint)]">
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="text-xs">ou com e-mail</span>
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      <form action={action} className="space-y-3 text-left">
        <div>
          <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Nome completo</label>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Seu nome"
            className="w-full px-4 py-2.5 text-sm border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
          />
        </div>
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
        <div>
          <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">WhatsApp</label>
          <div className="flex gap-2">
            <input
              name="ddi"
              type="text"
              inputMode="tel"
              defaultValue="+55"
              aria-label="DDI"
              className="w-14 px-2 py-2.5 text-sm text-center border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
            />
            <input
              name="ddd"
              type="text"
              inputMode="numeric"
              maxLength={2}
              required
              placeholder="DDD"
              aria-label="DDD"
              className="w-16 px-2 py-2.5 text-sm text-center border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
            />
            <input
              name="phone"
              type="text"
              inputMode="numeric"
              maxLength={9}
              required
              placeholder="99999-9999"
              aria-label="Número do WhatsApp"
              className="flex-1 px-4 py-2.5 text-sm border border-[var(--line)] rounded-xl bg-white text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
            />
          </div>
          <p className="text-[11px] text-[var(--ink-faint)] mt-1">Ex: +55 · 11 · 9 dígitos</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Senha</label>
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

        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--terracotta)] text-white text-sm font-semibold hover:bg-[var(--terracotta-hover)] disabled:opacity-50 transition-colors"
        >
          {pending ? <><Loader2 size={16} className="animate-spin" /> Criando conta...</> : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-[var(--ink-soft)]">
        Já tem conta?{" "}
        <Link href="/login" className="text-[var(--terracotta)] font-semibold underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
