import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-background">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Marca */}
          <div className="space-y-3">
            <Link href="/">
              <Image
                src="/carnavei-wordmark.png"
                alt="Carnavei"
                width={110}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[var(--ink-soft)] max-w-xs leading-relaxed">
              Acessórios artesanais femininos feitos à mão.
              <br />
              Cada peça é única. Pequenas variações são parte do charme.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-soft)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-faint)] mb-1">
              Loja
            </p>
            <Link href="/produtos" className="hover:text-[var(--terracotta)] transition-colors duration-200">Todos os produtos</Link>
            <Link href="/produtos?categoria=bolsa" className="hover:text-[var(--terracotta)] transition-colors duration-200">Bolsas</Link>
            <Link href="/produtos?categoria=choker" className="hover:text-[var(--terracotta)] transition-colors duration-200">Chokers</Link>
            <Link href="/produtos?categoria=corrente" className="hover:text-[var(--terracotta)] transition-colors duration-200">Correntes</Link>
          </div>

          {/* Ajuda */}
          <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-soft)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-faint)] mb-1">
              Ajuda
            </p>
            <Link href="/trocas" className="hover:text-[var(--terracotta)] transition-colors duration-200">Trocas e devoluções</Link>
            <Link href="/sobre" className="hover:text-[var(--terracotta)] transition-colors duration-200">Nossa história</Link>
            <Link href="/contato" className="hover:text-[var(--terracotta)] transition-colors duration-200">Contato</Link>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-soft)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-faint)] mb-1">
              Social
            </p>
            <a href="#" className="hover:text-[var(--terracotta)] transition-colors duration-200">Instagram</a>
            <a href="#" className="hover:text-[var(--terracotta)] transition-colors duration-200">WhatsApp</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--line)] text-xs text-[var(--ink-faint)] text-center">
          © {new Date().getFullYear()} Carnavei · Feito à mão no Brasil · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
