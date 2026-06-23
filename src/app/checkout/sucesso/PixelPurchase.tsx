"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function PixelPurchase() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;

    const value = parseFloat(sessionStorage.getItem("mp_order_total") ?? "0");
    const numItems = parseInt(sessionStorage.getItem("mp_order_items") ?? "0", 10);

    window.fbq("track", "Purchase", {
      currency: "BRL",
      value,
      num_items: numItems,
    });

    sessionStorage.removeItem("mp_order_total");
    sessionStorage.removeItem("mp_order_items");
  }, []);

  return null;
}
