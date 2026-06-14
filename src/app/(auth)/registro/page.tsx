import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "Criar conta · Carnavei" };

export default async function RegistroPage() {
  const session = await auth();
  if (session?.user) redirect("/conta");

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
        Criar conta
      </h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8 max-w-xs">
        Crie sua conta para acompanhar seus pedidos e comprar mais rápido.
      </p>

      <RegisterForm />

      <Link
        href="/"
        className="text-sm text-[var(--terracotta)] underline underline-offset-4 mt-6"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
