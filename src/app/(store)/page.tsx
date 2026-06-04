import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Produtos mockados — substituir pelo seed do Prisma no Dia 2
const PRODUCTS_MOCK = [
  {
    id: "1",
    slug: "choker-branca",
    name: "Choker Branca",
    price: 15900,
    eyebrow: "COPA 2026",
    image: "/images/choker-branca-2.jpg",
  },
  {
    id: "2",
    slug: "bolsa-canarinho",
    name: "Bolsa Canarinho",
    price: 18900,
    eyebrow: "FEITO À MÃO",
    image: "/images/bolsa-canarinho-ensaio-01.jpg",
  },
  {
    id: "3",
    slug: "corrente-torcida",
    name: "Corrente Torcida",
    price: 16900,
    eyebrow: "MAIS AMADA",
    image: "/images/chain-ensaio-01.jpg",
  },
  {
    id: "4",
    slug: "choker-bandeira",
    name: "Choker Bandeira",
    price: 14900,
    eyebrow: "FEITO À MÃO",
    image: "/images/choker-ensaio-01.jpg",
  },
];

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatInstallment(cents: number, n: number) {
  return `${n}x ${formatPrice(Math.ceil(cents / n))}`;
}

export default function HomePage() {
  return (
    <>
      {/* Hero — full-bleed com scrim lateral e nav de texto */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--paper-deep)]">
        {/* Foto full-bleed */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-1.jpg"
            alt="Carnavei — acessórios artesanais"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Scrim gradiente da esquerda */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(43,37,48,.62) 0%, rgba(43,37,48,.32) 38%, rgba(43,37,48,0) 62%)",
            }}
          />
        </div>

        {/* Conteúdo sobre a foto */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-24">
          <div className="max-w-sm space-y-6">
            {/* Eyebrow */}
            <p
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: "#FBDAD3" }}
            >
              Feito à mão no Brasil
            </p>

            {/* Headline */}
            <h1
              className="font-heading text-5xl md:text-6xl leading-[1.04] tracking-tight text-white"
              style={{ fontStyle: "italic" }}
            >
              Vista o Brasil.
            </h1>

            <p className="text-white/75 text-base leading-relaxed max-w-xs">
              Acessórios artesanais feitos à mão — cada peça é única.
            </p>

            {/* CTA — terracota pill */}
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 font-semibold text-sm uppercase tracking-[0.18em] px-6 py-3 rounded-full transition-colors duration-200"
              style={{
                background: "var(--terracotta)",
                color: "#FFF7F1",
              }}
            >
              Ver a coleção <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Eyebrow editorial — canto inferior direito */}
        <div className="absolute right-10 bottom-14 z-10 text-right text-white hidden md:block">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: "#FBDAD3" }}
          >
            Coleção Copa 2026
          </p>
          <p
            className="font-heading text-2xl mt-1 opacity-90"
            style={{ fontStyle: "italic" }}
          >
            Saudade. Brilho.
          </p>
        </div>
      </section>

      {/* Faixa de diferenciais */}
      <section className="border-y border-[var(--line)] bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          <span>✦ Feito à mão</span>
          <span>✦ Entrega para todo o Brasil</span>
          <span>✦ Troca fácil em 7 dias</span>
          <span>✦ Pix com 5% de desconto</span>
        </div>
      </section>

      {/* Grade de produtos */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.26em] mb-2"
              style={{ color: "var(--terracotta)" }}
            >
              Coleção atual
            </p>
            <h2 className="font-heading text-3xl md:text-4xl">
              Nova Coleção · Copa 2026
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Ver todos <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS_MOCK.map((product) => (
            <Link key={product.id} href={`/produto/${product.slug}`} className="group">
              {/* Frame arredondado com sombra suave */}
              <div
                className="aspect-square rounded-[var(--radius)] overflow-hidden bg-white mb-3 relative"
                style={{ boxShadow: "0 6px 20px -8px rgba(43,37,48,.14)" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[480ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              {/* Meta — aparece no hover */}
              <div className="transition-opacity duration-200 group-hover:opacity-100 opacity-90">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1"
                  style={{ color: "var(--terracotta)" }}
                >
                  {product.eyebrow}
                </p>
                <p className="font-heading text-lg leading-tight">{product.name}</p>
                <p
                  className="text-sm font-semibold mt-0.5"
                  style={{ color: "var(--terracotta-hover)" }}
                >
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                  ou {formatInstallment(product.price, 3)} sem juros
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaque — Bolsa Canarinho */}
      <section style={{ background: "var(--blush)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Imagem */}
          <div
            className="relative aspect-square rounded-[var(--radius)] hidden md:block overflow-hidden"
            style={{ boxShadow: "0 18px 50px -16px rgba(43,37,48,.20)" }}
          >
            <Image
              src="/images/bolsa-canarinho-ensaio-02.jpg"
              alt="Bolsa Canarinho"
              fill
              className="object-cover"
            />
          </div>

          {/* Copy */}
          <div className="space-y-4">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.26em]"
              style={{ color: "var(--terracotta)" }}
            >
              Destaque
            </p>
            <h2 className="font-heading text-4xl md:text-5xl leading-[1.04]">
              Bolsa Canarinho
            </h2>
            <p className="text-[var(--ink-soft)] leading-relaxed max-w-md">
              Cristais smoke-blue e <em>miçangas</em> canarinho, alça trançada verde.
              Um pequeno troféu de sorte incluso. Carregue a{" "}
              <em>seleção</em> no ombro.
            </p>
            <p className="font-heading text-3xl" style={{ color: "var(--terracotta)" }}>
              R$ 189,00
            </p>
            <p className="text-sm text-[var(--ink-soft)]">ou 3x R$ 63,00 sem juros</p>
            <p className="text-xs text-[var(--ink-faint)]">
              Cada peça é única. Pequenas variações são parte do charme.
            </p>
            <Link
              href="/produto/bolsa-canarinho"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full mt-2 transition-colors duration-200"
              style={{ background: "var(--terracotta)", color: "#FFF7F1" }}
            >
              Ver produto
            </Link>
          </div>
        </div>
      </section>

      {/* Seção lilac — manifesto da marca */}
      <section style={{ background: "var(--lilac)" }}>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--ink-soft)]"
          >
            Feito à mão no Brasil
          </p>
          <h2 className="font-heading text-4xl md:text-5xl leading-tight text-[var(--ink)]">
            <em>Paixão</em> que se usa.
          </h2>
          <p className="text-[var(--ink-soft)] leading-relaxed max-w-md mx-auto">
            Cada peça nasce de referências reais — o bordado das torcidas, as cores da
            bandeira, o brilho do campeonato. Feitas à mão, em pequenas tiragens,
            pra quem ama o Brasil do jeito certo.
          </p>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)] hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Nossa história <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
