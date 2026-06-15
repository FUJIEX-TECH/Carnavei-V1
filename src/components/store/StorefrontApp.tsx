"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { BRL } from "@/lib/products";
import type { Product } from "@/lib/products";
import "./storefront.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type CartLine = { id: string; size: string; qty: number };
type CartItem = { slug: string; size: string; qty: number };

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  products, items, onClose, onQty, onRemove,
}: {
  products: Product[];
  items: CartLine[];
  onClose: () => void;
  onQty: (i: number) => void;
  onRemove: (i: number) => void;
}) {
  const lines = items.map(it => ({ ...it, p: products.find(x => x.id === it.id)! }));
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      <div className="cv-cart-backdrop" onClick={onClose} />
      <aside className="cv-cart">
        <div className="cv-cart-top">
          <div className="cv-cart-title">Sacola ({count})</div>
          <button className="cv-cart-x" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="cv-cart-items">
          {lines.length === 0 && (
            <div className="cv-cart-empty">Sua sacola está vazia — por enquanto. ✦</div>
          )}
          {lines.map((l, i) => (
            <div className="cv-li" key={i}>
              <div className="cv-li-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.p.images[0]} alt={l.p.name} />
              </div>
              <div className="cv-li-info">
                <div className="cv-li-name">{l.p.name}</div>
                <div className="cv-li-var">{l.p.category} / {l.size}</div>
                <div className="cv-li-price">{BRL(l.p.price * l.qty)}</div>
              </div>
              <div className="cv-li-end">
                <button className="cv-li-qty" onClick={() => onQty(i)}>
                  {l.qty} <ChevronDown size={11} style={{ display: "inline" }} />
                </button>
                <button className="cv-li-rm" onClick={() => onRemove(i)}>Remover</button>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="cv-cart-foot">
            <div className="cv-cart-sub">
              <span>Subtotal ({count} {count === 1 ? "item" : "itens"})</span>
              <b>{BRL(subtotal)}</b>
            </div>
            <Link href="/checkout" className="cv-btn cv-btn-primary cv-btn-block" onClick={onClose}>Finalizar compra</Link>
            <button className="cv-btn cv-btn-ghost cv-btn-block" onClick={onClose}>Continuar comprando</button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export function StorefrontApp({
  products,
  initialCart = [],
  user = null,
}: {
  products: Product[];
  initialCart?: CartItem[];
  user?: { name?: string | null; image?: string | null } | null;
}) {
  const heroProducts = products.filter(p => !p.heroExclude);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>(
    initialCart.map((i) => ({ id: i.slug, size: i.size, qty: i.qty }))
  );

  // Refs for each section (products + grid)
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array(heroProducts.length).fill(null));
  const gridRef = useRef<HTMLElement | null>(null);

  // IntersectionObserver com root: null (viewport) — mais confiável no iOS Safari
  // do que root: container (scroll element). O overflow: scroll do cv-store clips
  // as seções fora de vista, então só a seção ativa intersecta o viewport.
  useEffect(() => {
    const sections = [
      ...sectionRefs.current.filter(Boolean),
      gridRef.current,
    ].filter(Boolean) as HTMLElement[];

    sections.forEach(s => s.classList.add("in-view"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: null, threshold: 0.5 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((idx: number) => {
    const allSections = [
      ...sectionRefs.current.filter(Boolean),
      gridRef.current,
    ].filter(Boolean) as HTMLElement[];
    allSections[idx]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Cart helpers — otimistas: atualiza UI imediatamente, persiste em background
  const cycleQty = (i: number) => {
    setCart((prev) => {
      const next = prev.map((l, j) => j === i ? { ...l, qty: (l.qty % 5) + 1 } : l);
      const line = next[i];
      fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: line.id, size: line.size, qty: line.qty }),
      });
      return next;
    });
  };
  const removeLine = (i: number) => {
    setCart((prev) => {
      const line = prev[i];
      fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: line.id, size: line.size }),
      });
      return prev.filter((_, j) => j !== i);
    });
  };

  const count = cart.reduce((s, l) => s + l.qty, 0);
  const dark = activeIndex < heroProducts.length;
  const gridSection = activeIndex === heroProducts.length;

  return (
    <div className="cv-shell">
      {/* ── Scroll snap container ── */}
      <div className="cv-store" ref={containerRef}>

        {/* Product hero sections */}
        {heroProducts.map((p, i) => (
          <section
            key={p.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
            className="cv-snap-section"
          >
            {/* Full-bleed background */}
            <div className="cv-snap-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.hero} alt={p.name} loading={i === 0 ? "eager" : "lazy"} style={p.heroPosition ? { objectPosition: p.heroPosition } : undefined} />
              <div className="cv-hero-scrim" />
            </div>

            {/* Full-section link — covers the bg area (z-index 2, below content at 10) */}
            <Link href={`/produto/${p.id}`} className="cv-hero-link" tabIndex={-1} aria-hidden="true" />

            {/* Content — staggered entrance */}
            <div className="cv-snap-content">
              <p className="cv-snap-eyebrow">{p.eyebrow}</p>
              <h2 className="cv-snap-name">{p.name}</h2>
              <p className="cv-snap-tagline">{p.tagline}</p>
              <p className="cv-snap-price">{BRL(p.price)}</p>
              <Link href={`/produto/${p.id}`} className="cv-btn cv-btn-primary">
                Ver produto
              </Link>
            </div>

            {/* Counter bottom-right */}
            <div className="cv-snap-counter">{i + 1} / {heroProducts.length}</div>

            {/* Scroll hint on first section only */}
            {i === 0 && (
              <div className="cv-scroll-hint">
                <ChevronDown size={14} />
                scroll
              </div>
            )}
          </section>
        ))}

        {/* Grid section */}
        <section
          ref={(el) => { gridRef.current = el; }}
          className="cv-snap-section cv-snap-grid"
        >
          <div className="cv-grid-inner">
            <div className="cv-grid-header">
              <p className="cv-grid-eyebrow">Coleção completa</p>
              <h2 className="cv-grid-title">Todos os produtos</h2>
            </div>
            <div className="cv-product-grid">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  className="cv-card"
                >
                  <div className="cv-card-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.thumbnail ?? p.images[0]} alt={p.name} />
                  </div>
                  <div className="cv-card-meta">
                    <p className="cv-card-eyebrow">{p.eyebrow}</p>
                    <p className="cv-card-name">{p.name}</p>
                    <p className="cv-card-price">{BRL(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>{/* /cv-store */}

      {/* ── Fixed chrome — absolute inside cv-shell ── */}

      {/* Wordmark */}
      <div
        className={`cv-top${dark ? " on-dark" : ""}${gridSection ? " cv-top--grid" : ""}`}
        onClick={() => scrollToSection(0)}
        role="button"
        aria-label="Início"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToSection(0)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/carnavei-wordmark.svg" alt="Carnavei" />
      </div>

      {/* Account / login — top-right, espelha o wordmark */}
      <Link
        href={user ? "/conta" : "/login"}
        className={`cv-account${dark ? " on-dark" : ""}${gridSection ? " cv-account--grid" : ""}`}
        aria-label={user ? "Minha conta" : "Entrar"}
      >
        {user ? (
          user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cv-account-avatar" src={user.image} alt="" />
          ) : (
            <span className="cv-account-initial">
              {(user.name ?? "?").trim().charAt(0).toUpperCase()}
            </span>
          )
        ) : (
          <span className="cv-account-text">Entrar</span>
        )}
      </Link>

      {/* Cart button */}
      <button
        className={`cv-cart-btn${dark ? " on-dark" : ""}${gridSection ? " cv-cart-btn--grid" : ""}`}
        onClick={() => setCartOpen(true)}
      >
        Sacola ({count})
      </button>

      {/* Drag handle */}
      <div className={`cv-handle${dark ? " on-dark" : ""}`} />

      {/* Sidebar product nav */}
      <nav className={`cv-snap-nav${dark ? " on-dark" : ""}`}>
        {heroProducts.map((p, i) => (
          <button
            key={p.id}
            className={activeIndex === i ? "active" : ""}
            onClick={() => scrollToSection(i)}
          >
            {p.name}
          </button>
        ))}
        <button
          className={`cv-nav-all${activeIndex === heroProducts.length ? " active" : ""}`}
          onClick={() => scrollToSection(heroProducts.length)}
        >
          Todos os produtos
        </button>
      </nav>

      {/* ── Overlays ── */}
      {cartOpen && (
        <CartDrawer
          products={products}
          items={cart}
          onClose={() => setCartOpen(false)}
          onQty={cycleQty}
          onRemove={removeLine}
        />
      )}
    </div>
  );
}
