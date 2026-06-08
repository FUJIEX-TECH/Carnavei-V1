"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { BRL } from "@/lib/products";
import type { Product } from "@/lib/products";
import { ProductDetailsSection } from "@/components/store/ProductDetailsSection";
import "../produto.css";

export function ProductPageClient({
  product,
  others,
}: {
  product: Product;
  others: Product[];
}) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const detailsRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight")
        setLightboxIdx((i) =>
          i !== null && i < product.images.length - 1 ? i + 1 : i
        );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, product]);

  const scrollToDetails = () =>
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToDetailsSlide = () => {
    const el = carouselRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const w = el.clientWidth || el.getBoundingClientRect().width;
      if (w) el.scrollLeft = product.images.length * w;
    });
  };

  // Contador de slides do carrossel.
  // iOS Safari não dispara `scroll`/`scrollend` de forma confiável com scroll-snap,
  // então fazemos polling via rAF enquanto o dedo está em contato (touchstart→touchend).
  // No desktop, o listener de `scroll` cobre o arrasto com mouse/trackpad.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const sync = () => {
      const w = el.clientWidth;
      if (w) setSlideIdx(Math.round(el.scrollLeft / w));
    };

    // --- mobile: polling durante o toque ---
    let rafId = 0;
    let polling = false;
    let stopTimer = 0;
    const poll = () => {
      sync();
      if (polling) rafId = requestAnimationFrame(poll);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      const r = el.getBoundingClientRect();
      if (t.clientY >= r.top && t.clientY <= r.bottom) {
        polling = true;
        rafId = requestAnimationFrame(poll);
      }
    };
    const onTouchEnd = () => {
      if (!polling) return;
      clearTimeout(stopTimer);
      // mantém o polling por mais 450ms para capturar o snap final
      stopTimer = window.setTimeout(() => {
        polling = false;
        cancelAnimationFrame(rafId);
        sync();
      }, 450) as unknown as number;
    };

    // --- desktop: scroll nativo ---
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(sync, 80);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(stopTimer);
      clearTimeout(scrollTimer);
    };
  }, []);

  const handleAdd = () => {
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: product.id, size, qty }),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <div className="pdp-shell">
      {/* ── Mobile topbar ── */}
      <div className="pdp-topbar">
        <Link href="/" className="pdp-back">← Carnavei</Link>
      </div>

      {/* ── Carrossel mobile — antes do pdp-left para flex column funcionar ── */}
      <div className="pdp-carousel-wrap">
        <div className="pdp-carousel" ref={carouselRef}>
          {product.images.map((src, i) => (
            <div key={i} className="pdp-slide pdp-slide--img">
              <button
                className="pdp-slide-btn"
                onClick={() => setLightboxIdx(i)}
                aria-label={`Ampliar foto ${i + 1} de ${product.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${product.name} ${i + 1}`} />
              </button>
            </div>
          ))}
          <div className="pdp-slide pdp-slide--details">
            <ProductDetailsSection product={product} />
          </div>
        </div>
        <div className="pdp-carousel-counter">
          {slideIdx + 1} / {product.images.length + 1}
        </div>
      </div>

      {/* ── Coluna esquerda ── */}
      <aside className="pdp-left">
        <Link href="/" className="pdp-back">← Carnavei</Link>

        <div className="pdp-eyebrow-row">
          <p className="pdp-eyebrow">{product.eyebrow}</p>
          <button className="pdp-details-jump" onClick={scrollToDetailsSlide}>
            <Plus size={13} />
            Detalhes
          </button>
        </div>
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

        {/* Mobile: dropdowns lado a lado */}
        <div className="pdp-selects-row">
          <div className="pdp-select-group">
            <label className="pdp-label" htmlFor="pdp-select-size">Tamanho</label>
            <select
              id="pdp-select-size"
              className="pdp-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {product.sizes.map((s) => (
                <option key={s} value={s} disabled={product.soldOutSizes.includes(s)}>
                  {s}{product.soldOutSizes.includes(s) ? " (esgotado)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="pdp-select-group">
            <label className="pdp-label" htmlFor="pdp-select-qty">Quantidade</label>
            <select
              id="pdp-select-qty"
              className="pdp-select"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
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

      {/* ── Galeria central (desktop) ── */}
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
        <button className="pdp-details-trigger" onClick={scrollToDetails}>
          Detalhes ↓
        </button>
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
