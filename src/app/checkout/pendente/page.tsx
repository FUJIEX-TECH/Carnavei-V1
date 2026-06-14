import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

export default function CheckoutPendente() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10">
        <Image src="/carnavei-wordmark.png" alt="Carnavei" width={120} height={32} className="h-8 w-auto" />
      </Link>

      <Clock size={56} className="text-amber-400 mb-6" strokeWidth={1.5} />

      <h1 className="text-2xl font-bold text-[var(--ink)] mb-3">Pagamento em análise</h1>
      <p className="text-[var(--ink-soft)] max-w-md mb-2">
        Seu pagamento está sendo processado. Assim que for confirmado, você receberá um e-mail com os detalhes do pedido.
      </p>
      <p className="text-sm text-[var(--ink-faint)] mb-10">
        Isso pode levar alguns minutos para Pix, ou até 2 dias úteis para boleto.
      </p>

      <Link
        href="/"
        className="px-8 py-3 bg-[var(--terracotta)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--terracotta-hover)] transition-colors"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
