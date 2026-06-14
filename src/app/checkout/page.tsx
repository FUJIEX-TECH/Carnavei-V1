"use client";

import { type ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ChevronDown, ChevronUp, Truck, Check } from "lucide-react";

type CartItem = { slug: string; size: string; qty: number };

type ShippingOption = {
  id: number;
  name: string;
  company: string;
  price: number;
  days: number;
};

type Address = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

const EMPTY: Address = {
  name: "", email: "", cpf: "", phone: "",
  cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
};

function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskCEP(v: string) {
  return v.replace(/\D/g, "").slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addr, setAddr] = useState<Address>(EMPTY);
  const [cepLoading, setCepLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"address" | "shipping" | "payment">("address");

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => setCart(Array.isArray(d) ? d : []));
  }, []);

  function set(field: keyof Address, value: string) {
    setAddr((prev) => ({ ...prev, [field]: value }));
  }

  async function lookupCEP(rawCep: string) {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddr((prev) => ({
          ...prev,
          street: data.logradouro ?? prev.street,
          district: data.bairro ?? prev.district,
          city: data.localidade ?? prev.city,
          state: data.uf ?? prev.state,
        }));
      }
    } finally {
      setCepLoading(false);
    }
  }

  async function calculateShipping() {
    if (cart.length === 0) return;
    const digits = addr.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setShippingLoading(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: digits,
          items: cart.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setShippingOptions(data);
        if (data.length > 0) setSelectedShipping(data[0]);
      }
    } finally {
      setShippingLoading(false);
    }
  }

  async function handleCheckout() {
    if (!selectedShipping) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping: selectedShipping, address: addr }),
      });
      const data = await res.json();
      const url = data.sandboxInitPoint ?? data.initPoint;
      if (url) window.location.href = url;
    } catch {
      setSubmitting(false);
    }
  }

  const addressComplete =
    addr.name && addr.email && addr.cpf.length >= 14 &&
    addr.cep.replace(/\D/g, "").length === 8 &&
    addr.street && addr.number && addr.city && addr.state;

  return (
    <div className="min-h-screen bg-[var(--paper)] font-[var(--font-sans)]">
      {/* Header mínimo */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/carnavei-wordmark.png" alt="Carnavei" width={110} height={30} className="h-7 w-auto" priority />
          </Link>
          <span className="text-sm text-[var(--ink-soft)]">Finalizar compra</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Coluna esquerda — formulário */}
        <div className="space-y-8">

          {/* ── Endereço ─────────────────────────────── */}
          <Section
            title="1. Endereço de entrega"
            open={step === "address"}
            done={step !== "address" && !!addressComplete}
            onEdit={() => setStep("address")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome completo" value={addr.name}
                onChange={(v) => set("name", v)} placeholder="Fulana da Silva" className="sm:col-span-2" />
              <Field label="E-mail" type="email" value={addr.email}
                onChange={(v) => set("email", v)} placeholder="fulana@email.com" />
              <Field label="CPF" value={addr.cpf}
                onChange={(v) => set("cpf", maskCPF(v))} placeholder="000.000.000-00" />
              <Field label="Telefone" value={addr.phone}
                onChange={(v) => set("phone", maskPhone(v))} placeholder="(11) 91234-5678" />

              {/* CEP com lookup */}
              <div className="relative">
                <Field label="CEP" value={addr.cep}
                  onChange={(v) => {
                    const masked = maskCEP(v);
                    set("cep", masked);
                    if (masked.replace(/\D/g, "").length === 8) lookupCEP(masked);
                  }}
                  placeholder="00000-000"
                />
                {cepLoading && (
                  <Loader2 size={14} className="animate-spin absolute right-3 top-[38px] text-[var(--ink-faint)]" />
                )}
              </div>

              <Field label="Número" value={addr.number}
                onChange={(v) => set("number", v)} placeholder="123" />
              <Field label="Rua" value={addr.street}
                onChange={(v) => set("street", v)} placeholder="Rua das Flores" className="sm:col-span-2" />
              <Field label="Complemento" value={addr.complement}
                onChange={(v) => set("complement", v)} placeholder="Apto 4, bloco B (opcional)" className="sm:col-span-2" />
              <Field label="Bairro" value={addr.district}
                onChange={(v) => set("district", v)} placeholder="Centro" />
              <Field label="Cidade" value={addr.city}
                onChange={(v) => set("city", v)} placeholder="São Paulo" />
              <Field label="Estado (UF)" value={addr.state}
                onChange={(v) => set("state", v.toUpperCase().slice(0, 2))} placeholder="SP" />
            </div>

            <button
              disabled={!addressComplete}
              onClick={() => {
                setStep("shipping");
                calculateShipping();
              }}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-[var(--terracotta)] text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--terracotta-hover)] transition-colors"
            >
              Calcular frete
            </button>
          </Section>

          {/* ── Frete ────────────────────────────────── */}
          <Section
            title="2. Escolha o frete"
            open={step === "shipping"}
            done={step === "payment" && !!selectedShipping}
            onEdit={() => { setStep("shipping"); if (shippingOptions.length === 0) calculateShipping(); }}
          >
            {shippingLoading && (
              <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)] py-4">
                <Loader2 size={16} className="animate-spin" /> Calculando opções de frete...
              </div>
            )}

            {!shippingLoading && shippingOptions.length > 0 && (
              <div className="space-y-2">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedShipping?.id === opt.id
                        ? "border-[var(--terracotta)] bg-[var(--blush)]/30"
                        : "border-border hover:border-[var(--terracotta)]/40"
                    }`}
                  >
                    <input type="radio" name="shipping" className="sr-only"
                      checked={selectedShipping?.id === opt.id}
                      onChange={() => setSelectedShipping(opt)} />
                    <div className="flex items-center gap-3">
                      <Truck size={18} className="text-[var(--ink-soft)] shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{opt.name}</p>
                        <p className="text-xs text-[var(--ink-soft)]">{opt.company} · {opt.days} dia{opt.days !== 1 ? "s" : ""} útil{opt.days !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[var(--terracotta)] whitespace-nowrap">
                      {opt.price === 0 ? "Grátis" : `R$ ${opt.price.toFixed(2).replace(".", ",")}`}
                    </span>
                  </label>
                ))}

                <button
                  disabled={!selectedShipping}
                  onClick={() => setStep("payment")}
                  className="mt-4 w-full sm:w-auto px-8 py-3 bg-[var(--terracotta)] text-white rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[var(--terracotta-hover)] transition-colors"
                >
                  Continuar para pagamento
                </button>
              </div>
            )}

            {!shippingLoading && shippingOptions.length === 0 && step === "shipping" && (
              <p className="text-sm text-[var(--ink-soft)] py-2">Não foi possível calcular o frete para esse CEP.</p>
            )}
          </Section>

          {/* ── Pagamento ────────────────────────────── */}
          <Section
            title="3. Pagamento"
            open={step === "payment"}
            done={false}
          >
            <p className="text-sm text-[var(--ink-soft)] mb-6">
              Você será redirecionado para o Mercado Pago onde poderá pagar com cartão, Pix ou boleto.
            </p>
            <button
              disabled={submitting || !selectedShipping}
              onClick={handleCheckout}
              className="w-full py-4 bg-[var(--terracotta)] text-white rounded-xl font-bold text-base disabled:opacity-40 hover:bg-[var(--terracotta-hover)] transition-colors flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 size={18} className="animate-spin" /> Redirecionando...</>
                : "Ir para pagamento"}
            </button>
          </Section>
        </div>

        {/* Coluna direita — resumo */}
        <OrderSummary cart={cart} shipping={selectedShipping} />
      </main>
    </div>
  );
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function Section({
  title, open, done, onEdit, children,
}: {
  title: string;
  open: boolean;
  done: boolean;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${open ? "border-[var(--terracotta)]/40 shadow-sm" : "border-border"} bg-white overflow-hidden`}>
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="font-semibold text-[var(--ink)] flex items-center gap-2">
          {done && <Check size={16} className="text-[var(--terracotta)]" />}
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {done && onEdit && (
            <button onClick={onEdit} className="text-xs text-[var(--terracotta)] underline underline-offset-2">editar</button>
          )}
          {open ? <ChevronUp size={16} className="text-[var(--ink-faint)]" /> : <ChevronDown size={16} className="text-[var(--ink-faint)]" />}
        </div>
      </div>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-[var(--paper)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 focus:border-[var(--terracotta)]/60 transition"
      />
    </div>
  );
}

function OrderSummary({ cart, shipping }: { cart: CartItem[]; shipping: ShippingOption | null }) {
  const [products, setProducts] = useState<Array<{ slug: string; name: string; price: number; thumbnail?: string }>>([]);

  useEffect(() => {
    if (cart.length === 0) return;
    const slugs = cart.map((i) => i.slug).join(",");
    fetch(`/api/products/summary?slugs=${slugs}`)
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {});
  }, [cart]);

  const itemsTotal = cart.reduce((sum, item) => {
    const p = products.find((p) => p.slug === item.slug);
    return sum + (p?.price ?? 0) * item.qty;
  }, 0);

  const shippingPrice = shipping?.price ?? 0;
  const total = itemsTotal + shippingPrice;

  return (
    <aside className="rounded-2xl border border-border bg-white p-6 h-fit sticky top-24 space-y-5">
      <h3 className="font-semibold text-[var(--ink)] text-sm">Resumo do pedido</h3>

      {cart.length === 0 ? (
        <p className="text-sm text-[var(--ink-soft)]">Carrinho vazio.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {cart.map((item, i) => {
            const p = products.find((p) => p.slug === item.slug);
            return (
              <li key={i} className="flex justify-between gap-2">
                <span className="text-[var(--ink)] truncate">
                  {p?.name ?? item.slug} <span className="text-[var(--ink-faint)]">({item.size})</span>
                </span>
                <span className="text-[var(--ink-soft)] shrink-0">×{item.qty}</span>
              </li>
            );
          })}
        </ul>
      )}

      <hr className="border-border" />

      <div className="space-y-2 text-sm">
        {shipping && (
          <div className="flex justify-between text-[var(--ink-soft)]">
            <span>Frete ({shipping.name})</span>
            <span>R$ {shippingPrice.toFixed(2).replace(".", ",")}</span>
          </div>
        )}
        {total > 0 && (
          <div className="flex justify-between font-bold text-[var(--ink)]">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
