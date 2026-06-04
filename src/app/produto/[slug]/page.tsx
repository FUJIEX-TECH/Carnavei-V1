"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { X, Check } from "lucide-react";
import Link from "next/link";
import { PRODUCTS, BRL } from "@/lib/products";
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
  const [detailsOpen, setDetailsOpen] = useState(false);

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
          <div key={i} className="pdp-gallery-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${product.name} ${i + 1}`} />
          </div>
        ))}
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
        <button
          className="pdp-details-trigger"
          onClick={() => setDetailsOpen(true)}
        >
          Details ↑
        </button>
      </div>

      {/* ── Painel slide-up ── */}
      {detailsOpen && (
        <>
          <div
            className="pdp-overlay"
            onClick={() => setDetailsOpen(false)}
          />
          <div className="pdp-panel">
            <button
              className="pdp-panel-close"
              onClick={() => setDetailsOpen(false)}
            >
              <X size={17} />
            </button>
            <p className="pdp-panel-blurb">{product.blurb}</p>
            <p className="pdp-panel-spec">{product.details}</p>
          </div>
        </>
      )}
    </div>
  );
}
