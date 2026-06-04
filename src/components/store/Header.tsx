"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center">
          <Image
            src="/carnavei-wordmark.png"
            alt="Carnavei"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--ink-soft)]">
          <Link
            href="/produtos"
            className="hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Bolsas
          </Link>
          <Link
            href="/produtos?categoria=choker"
            className="hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Chokers
          </Link>
          <Link
            href="/produtos?categoria=corrente"
            className="hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Correntes
          </Link>
          <Link
            href="/produtos?categoria=acessorio"
            className="hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            Acessórios
          </Link>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-5 text-[var(--ink-soft)]">
          <Link
            href="/conta"
            className="hover:text-[var(--terracotta)] transition-colors duration-200"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/carrinho"
            className="hover:text-[var(--terracotta)] transition-colors duration-200 relative"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
