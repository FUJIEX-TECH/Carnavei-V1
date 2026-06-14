import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = { title: "Minha conta · Carnavei" };

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

function brl(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export default async function ContaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/conta");

  // Pedidos do cliente: vinculados por e-mail (checkout é guest, sem userId)
  const orders = await db.order.findMany({
    where: { customerEmail: session.user.email ?? "" },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/carnavei-wordmark-color.svg" alt="Carnavei" width={110} height={28} className="h-7 w-auto" priority />
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] underline underline-offset-4">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--ink)]">
              Olá, {session.user.name?.split(" ")[0] ?? "cliente"}
            </h1>
            <p className="text-sm text-[var(--ink-soft)]">{session.user.email}</p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-[var(--ink)] mb-4">Meus pedidos</h2>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center">
            <p className="text-[var(--ink-soft)] mb-4">Você ainda não tem pedidos.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[var(--terracotta)] text-white rounded-full text-sm font-semibold hover:bg-[var(--terracotta-hover)] transition-colors"
            >
              Começar a comprar
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-[var(--line)] bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[var(--ink-faint)]">
                    {order.createdAt.toLocaleDateString("pt-BR")} · #{order.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--blush)]/40 text-[var(--ink)]">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-[var(--ink-soft)] mb-3">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>{it.variant.product.name} ×{it.quantity}</span>
                      <span>{brl(it.unitPrice * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between border-t border-[var(--line)] pt-3 text-sm font-bold text-[var(--ink)]">
                  <span>Total</span>
                  <span>{brl(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
