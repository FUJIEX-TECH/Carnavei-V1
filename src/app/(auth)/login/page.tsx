import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar · Carnavei" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/conta");

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="mb-10">
        <Image
          src="/carnavei-wordmark-color.svg"
          alt="Carnavei"
          width={140}
          height={36}
          className="h-9 w-auto"
          priority
        />
      </Link>

      <h1 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)] mb-2">
        Entrar
      </h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8 max-w-xs">
        Acesse sua conta para acompanhar seus pedidos.
      </p>

      <LoginForm />

      <p className="text-xs text-[var(--ink-faint)] mt-8 max-w-xs">
        Você não precisa de conta para comprar. O login serve para acompanhar
        seus pedidos.
      </p>

      <Link
        href="/"
        className="text-sm text-[var(--terracotta)] underline underline-offset-4 mt-6"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
