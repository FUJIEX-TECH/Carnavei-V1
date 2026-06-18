/**
 * PDPDrawer — Componente preservado para uso futuro.
 *
 * Drawer lateral que exibia detalhes do produto inline dentro do StorefrontApp.
 * Substituído por navegação para /produto/[slug] em 05/06/2026 para padronizar
 * o comportamento e garantir URLs por produto (SEO + compartilhamento).
 *
 * Para reativar: importar no StorefrontApp, adicionar estado pdpOpen/pdpId,
 * e renderizar ao fim do componente (antes do CartDrawer).
 */

"use client";

import { useState, useEffect } from "react";
import { X, Check, ChevronUp, ChevronDown } from "lucide-react";
import { BRL } from "@/lib/products";
import type { Product } from "@/lib/products";

// ─── Types ───────────────────────────────────────────────────────────────────

type CartLine = { id: string; size: string; qty: number };

// ─── Size selector ────────────────────────────────────────────────────────────

function SizeSelect({ product, value, onChange }: { product: Product; value: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const single = product.sizes.length === 1;
  return (
    <div className="cv-select">
      <button className="cv-select-btn" onClick={() => !single && setOpen(o => !o)}>
        {value || "Tamanho"}
        {!single && (open ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
      </button>
      {open && (
        <div className="cv-pop">
          <div className="cv-pop-head">Tamanho</div>
          <div className="cv-size-grid">
            {product.sizes.map(s => {
              const off = product.soldOutSizes.includes(s);
              return (
                <button
                  key={s}
                  className={`cv-size${s === value ? " sel" : ""}${off ? " off" : ""}`}
                  onClick={() => { if (!off) { onChange(s); setOpen(false); } }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function QtySelect({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cv-select">
      <button className="cv-select-btn" onClick={() => setOpen(o => !o)}>
        {value} {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="cv-pop" style={{ minWidth: 72 }}>
          <div className="cv-qty-list">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className={`cv-qty${n === value ? " sel" : ""}`}
                onClick={() => { onChange(n); setOpen(false); }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PDPDrawer ────────────────────────────────────────────────────────────────

export function PDPDrawer({
  products, activeId, onPick, onClose, onAdd,
}: {
  products: Product[];
  activeId: string;
  onPick: (id: string) => void;
  onClose: () => void;
  onAdd: (line: CartLine) => void;
}) {
  const p = products.find(x => x.id === activeId) ?? products[0];
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(() => p.sizes.length === 1 ? p.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  useEffect(() => {
    setImgIdx(0);
    setSize(p.sizes.length === 1 ? p.sizes[0] : "");
    setQty(1);
    setAdded(false);
  }, [activeId, p.sizes.length]);

  const ready = !!size;
  const add = () => {
    if (!ready) return;
    onAdd({ id: p.id, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const accs = [
    { id: "desc", label: "Descrição", body: p.blurb },
    { id: "spec", label: "Detalhes do produto", body: p.details },
    { id: "ship", label: "Envio", body: "Entregamos para todo o Brasil. Frete calculado no checkout. Cada peça é única; pequenas variações são parte do encanto." },
  ];

  return (
    <>
      <div className="cv-pdp-backdrop" onClick={onClose} />
      <div className="cv-pdp-drawer">
        {/* Header */}
        <div className="cv-pdp-header">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {products.map(prod => (
              <button
                key={prod.id}
                onClick={() => onPick(prod.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0,
                  fontSize: 13,
                  fontFamily: "var(--font-display)",
                  color: prod.id === activeId ? "var(--ink)" : "var(--ink-faint)",
                  fontStyle: prod.id === activeId ? "italic" : "normal",
                  transition: "color 200ms",
                }}
              >
                {prod.name}
              </button>
            ))}
          </div>
          <button className="cv-pdp-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="cv-pdp-scroll">
          <div className="cv-pdp-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[imgIdx]} alt={p.name} />
          </div>

          {p.images.length > 1 && (
            <div className="cv-pdp-thumbs">
              {p.images.map((src, i) => (
                <button
                  key={i}
                  className={`cv-pdp-thumb${imgIdx === i ? " active" : ""}`}
                  onClick={() => setImgIdx(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${p.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <p className="cv-pdp-eyebrow">{p.eyebrow}</p>
          <h2 className="cv-pdp-name">{p.name}</h2>
          <p className="cv-pdp-price">{BRL(p.price)}</p>
          <p className="cv-pdp-installment">ou 3× {BRL(Math.ceil(p.price / 3))} sem juros</p>
          <p className="cv-pdp-blurb">{p.blurb}</p>

          <div className="cv-selectors">
            <SizeSelect product={p} value={size} onChange={setSize} />
            <QtySelect value={qty} onChange={setQty} />
          </div>

          <button
            className={`cv-btn cv-btn-block ${ready ? "cv-btn-primary" : "cv-btn-disabled"}`}
            onClick={add}
          >
            {ready ? "Adicionar à sacola" : "Selecione um tamanho"}
          </button>
          {added && (
            <div className="cv-added">
              <Check size={14} /> Adicionado à sacola
            </div>
          )}

          <div className="cv-acc-list">
            {accs.map(acc => (
              <div key={acc.id} className={`cv-acc${openAcc === acc.id ? " open" : ""}`}>
                <div className="cv-acc-head" onClick={() => setOpenAcc(o => o === acc.id ? null : acc.id)}>
                  {acc.label}
                  {openAcc === acc.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
                {openAcc === acc.id && <div className="cv-acc-body">{acc.body}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
