"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import "./storefront.css";

type CartItem = { slug: string; size: string; qty: number };
type Summary = { slug: string; name: string; thumbnail?: string; price: number };

// Drawer de sacola autônomo: lê o carrinho real do /api/cart e os dados dos
// produtos do /api/products/summary. Mesmo visual (.cv-cart) da sacola da home,
// para manter "uma sacola só" no site. Usado na página de produto.
export function CartDrawer({
  open,
  onClose,
  reloadKey = 0,
}: {
  open: boolean;
  onClose: () => void;
  reloadKey?: number; // muda quando um item é adicionado, para recarregar
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cart: CartItem[] = await fetch("/api/cart").then((r) => r.json());
      setItems(Array.isArray(cart) ? cart : []);
      const slugs = [...new Set((cart ?? []).map((i) => i.slug))];
      if (slugs.length) {
        const sums: Summary[] = await fetch(
          `/api/products/summary?slugs=${slugs.join(",")}`
        ).then((r) => r.json());
        setProducts(Array.isArray(sums) ? sums : []);
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, reloadKey, load]);

  async function remove(item: CartItem) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: item.slug, size: item.size }),
    });
    load();
  }

  const lines = items.map((it) => ({
    ...it,
    p: products.find((x) => x.slug === it.slug),
  }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + (l.p?.price ?? 0) * l.qty, 0);
  const brl = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  if (!open) return null;

  return (
    <>
      <div className="cv-cart-backdrop cv-fixed" onClick={onClose} />
      <aside className="cv-cart cv-fixed">
        <div className="cv-cart-top">
          <div className="cv-cart-title">Sacola ({count})</div>
          <button className="cv-cart-x" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="cv-cart-items">
          {!loading && lines.length === 0 && (
            <div className="cv-cart-empty">Sua sacola está vazia — por enquanto. ✦</div>
          )}
          {lines.map((l, i) => (
            <div className="cv-li" key={`${l.slug}-${l.size}-${i}`}>
              <div className="cv-li-thumb">
                {l.p?.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.p.thumbnail} alt={l.p?.name ?? l.slug} />
                )}
              </div>
              <div className="cv-li-info">
                <div className="cv-li-name">{l.p?.name ?? l.slug}</div>
                <div className="cv-li-var">{l.size}</div>
                <div className="cv-li-price">{brl((l.p?.price ?? 0) * l.qty)}</div>
              </div>
              <div className="cv-li-end">
                <span className="cv-li-qty" style={{ cursor: "default" }}>{l.qty}×</span>
                <button className="cv-li-rm" onClick={() => remove(l)}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="cv-cart-foot">
            <div className="cv-cart-sub">
              <span>Subtotal ({count} {count === 1 ? "item" : "itens"})</span>
              <b>{brl(subtotal)}</b>
            </div>
            <Link href="/checkout" className="cv-btn cv-btn-primary cv-btn-block">
              Finalizar compra
            </Link>
            <button className="cv-btn cv-btn-ghost cv-btn-block" onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
