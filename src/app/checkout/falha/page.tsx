import Link from "next/link";
import Image from "next/image";
import { XCircle } from "lucide-react";

export default function CheckoutFalha() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10">
        <Image src="/carnavei-wordmark.png" alt="Carnavei" width={120} height={32} className="h-8 w-auto" />
      </Link>

      <XCircle size={56} className="text-red-400 mb-6" strokeWidth={1.5} />

      <h1 className="text-2xl font-bold text-[var(--ink)] mb-3">Pagamento não aprovado</h1>
      <p className="text-[var(--ink-soft)] max-w-md mb-2">
        Houve um problema ao processar seu pagamento. Por favor, tente novamente ou use outro método de pagamento.
      </p>
      <p className="text-sm text-[var(--ink-faint)] mb-10">
        Seu carrinho foi mantido. Você pode tentar finalizar a compra novamente.
      </p>

      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="px-8 py-3 bg-[var(--terracotta)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--terracotta-hover)] transition-colors"
        >
          Tentar novamente
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-border rounded-xl font-semibold text-sm text-[var(--ink-soft)] hover:border-[var(--terracotta)]/40 transition-colors"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
