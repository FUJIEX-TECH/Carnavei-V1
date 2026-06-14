"use client";

import { useEffect } from "react";

// Esvazia o carrinho ao chegar na página de sucesso. O webhook do Mercado Pago
// é server-to-server e não tem acesso ao cookie da sessão do cliente, então a
// limpeza acontece aqui, no retorno do checkout.
export default function ClearCart() {
  useEffect(() => {
    fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }, []);

  return null;
}
