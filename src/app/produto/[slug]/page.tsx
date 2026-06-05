"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PRODUCTS, BRL } from "@/lib/products";
import { ProductDetailsSection } from "@/components/store/ProductDetailsSection";
import "../produto.css";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.id === slug);
  const others = PRODUCTS.filter((p) => p.id !== slug);

  const [size, setSize] = useState(() => {
    const p = PRODUCTS.find((p) => p.id === slug);
    return p?.sizes[0] ?? "";
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const detailsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight")
        setLightboxIdx((i) =>
          i !== null && product && i < product.images.length - 1 ? i + 1 : i
        );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, product]);

  const scrollToDetails = () =>
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!product) {
    return (
      <div style={{ padding: 48, fontFamily: "sans-serif", fontSize: 14 }}>
        Produto não encontrado.{" "}
        <Link href="/" style={{ color: "#D46429" }}>
          Voltar à loja
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <div className="pdp-shell">
      {/* ── Mobile topbar (hidden on desktop via CSS) ── */}
      <div className="pdp-topbar">
        <Link href="/" className="pdp-back">← Carnavei</Link>
      </div>

      {/* ── Coluna esquerda ── */}
      <aside className="pdp-left">
        <Link href="/" className="pdp-back">
          ← Carnavei
        </Link>

        <p className="pdp-eyebrow">{product.eyebrow}</p>
        <h1 className="pdp-name">{product.name}</h1>
        <p className="pdp-price">{BRL(product.price)}</p>
        <p className="pdp-installment">
          ou 3× {BRL(Math.ceil(product.price / 3))} sem juros
        </p>

        <p className="pdp-label">Tamanho</p>
        <div className="pdp-sizes">
          {product.sizes.map((s) => {
            const off = product.soldOutSizes.includes(s);
            return (
              <button
                key={s}
                className={`pdp-size-btn${s === size ? " active" : ""}${off ? " off" : ""}`}
                onClick={() => !off && setSize(s)}
              >
                {s}
              </button>
            );
          })}
        </div>

        <p className="pdp-label">Quantidade</p>
        <div className="pdp-sizes">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`pdp-size-btn${n === qty ? " active" : ""}`}
              onClick={() => setQty(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <button className="pdp-add-btn" onClick={handleAdd}>
          Adicionar à sacola
        </button>

        {added && (
          <div className="pdp-added">
            <Check size={13} /> Adicionado
          </div>
        )}

        <p className="pdp-shipping">
          Frete grátis acima de R$ 250
          <br />
          Entrega em todo o Brasil
        </p>
      </aside>

      {/* ── Galeria central ── */}
      <main className="pdp-gallery">
        {product.images.map((src, i) => (
          <div
            key={i}
            className="pdp-gallery-item pdp-gallery-item--clickable"
            onClick={() => setLightboxIdx(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${product.name} ${i + 1}`} />
            <span className="pdp-gallery-expand" aria-hidden>⤢</span>
          </div>
        ))}
        <ProductDetailsSection product={product} ref={detailsRef} />
      </main>

      {/* ── Coluna direita — outros produtos ── */}
      <nav className="pdp-right">
        {others.map((p) => (
          <Link key={p.id} href={`/produto/${p.id}`} className="pdp-other-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]} alt={p.name} />
            <span className="pdp-other-label">{p.name}</span>
          </Link>
        ))}
      </nav>

      {/* ── Barra inferior ── */}
      <div className="pdp-details-bar">
        {/* Desktop: scroll para seção de detalhes */}
        <button className="pdp-details-trigger" onClick={scrollToDetails}>
          Detalhes ↓
        </button>
        {/* Mobile: botão Adicionar à sacola (details-trigger fica oculto) */}
        <button className="pdp-add-btn pdp-details-cta" onClick={handleAdd}>
          Adicionar à sacola
        </button>
        {added && (
          <div className="pdp-added pdp-details-added">
            <Check size={13} /> Adicionado
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div className="pdp-lightbox" onClick={() => setLightboxIdx(null)}>
          {lightboxIdx > 0 && (
            <button
              className="pdp-lightbox-nav pdp-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
            >
              <ChevronLeft size={28} />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[lightboxIdx]}
            alt={`${product.name} ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxIdx < product.images.length - 1 && (
            <button
              className="pdp-lightbox-nav pdp-lightbox-next"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
            >
              <ChevronRight size={28} />
            </button>
          )}
          <button
            className="pdp-lightbox-close"
            onClick={() => setLightboxIdx(null)}
          >
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
