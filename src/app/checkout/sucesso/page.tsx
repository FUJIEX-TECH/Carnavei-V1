import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import ClearCart from "./ClearCart";

export default function CheckoutSucesso() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-4 text-center">
      <ClearCart />
      <Link href="/" className="mb-10">
        <Image src="/carnavei-wordmark.png" alt="Carnavei" width={120} height={32} className="h-8 w-auto" />
      </Link>

      <CheckCircle2 size={56} className="text-[var(--terracotta)] mb-6" strokeWidth={1.5} />

      <h1 className="text-2xl font-bold text-[var(--ink)] mb-3">Pedido confirmado!</h1>
      <p className="text-[var(--ink-soft)] max-w-md mb-2">
        Obrigada pela sua compra. Você vai receber um e-mail com os detalhes do pedido em breve.
      </p>
      <p className="text-sm text-[var(--ink-faint)] mb-10">
        Após a confirmação do pagamento, seu pedido será separado e enviado.
      </p>

      <Link
        href="/"
        className="px-8 py-3 bg-[var(--terracotta)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--terracotta-hover)] transition-colors"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
