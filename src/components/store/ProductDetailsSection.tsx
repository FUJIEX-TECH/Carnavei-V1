"use client";

import { forwardRef } from "react";
import type { Product } from "@/lib/products";

const SHIPPING_ITEMS = [
  "Entrega em todo o Brasil",
  "Frete calculado no checkout",
  "Cada peça é única — pequenas variações fazem parte do encanto",
  "Prazo estimado: 5–12 dias úteis após envio",
];

export const ProductDetailsSection = forwardRef<HTMLElement, { product: Product }>(
  function ProductDetailsSection({ product }, ref) {
    const detailItems = product.details.split(" · ").map((s) => s.trim());

    return (
      <section className="pdp-info-section" ref={ref}>
        <div className="pdp-info-rule" />

        {/* Descrição */}
        <div className="pdp-info-desc-block">
          <p className="pdp-info-label">Descrição</p>
          <p className="pdp-info-blurb">{product.blurb}</p>
        </div>

        <div className="pdp-info-rule pdp-info-rule--light" />

        {/* Detalhes + Envio */}
        <div className="pdp-info-grid">
          <div className="pdp-info-col">
            <p className="pdp-info-label">Detalhes do produto</p>
            <ul className="pdp-info-list">
              {detailItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="pdp-info-col">
            <p className="pdp-info-label">Envio &amp; entrega</p>
            <ul className="pdp-info-list">
              {SHIPPING_ITEMS.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }
);
