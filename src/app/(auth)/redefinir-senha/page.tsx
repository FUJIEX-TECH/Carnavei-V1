import Link from "next/link";
import Image from "next/image";
import ResetForm from "./ResetForm";

export const metadata = { title: "Redefinir senha · Carnavei" };

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="mb-10">
        <Image src="/carnavei-wordmark-color.svg" alt="Carnavei" width={140} height={36} className="h-9 w-auto" priority />
      </Link>

      <h1 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)] mb-2">
        Nova senha
      </h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8 max-w-xs">
        Crie uma nova senha para sua conta.
      </p>

      <ResetForm token={token ?? ""} />
    </div>
  );
}
