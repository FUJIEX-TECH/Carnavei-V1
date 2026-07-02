export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  eyebrow: string;
  tagline: string;
  hero: string;
  heroPosition?: string;
  heroExclude?: boolean;
  thumbnail?: string;
  images: string[];
  blurb: string;
  details: string;
  sizes: string[];
  soldOutSizes: string[];
};

export const BRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

// Máximo de parcelas no cartão por faixa de valor (em reais). Juros por conta
// do cliente (cobrados pelo Mercado Pago). Deve casar com a regra no checkout.
export const maxInstallments = (priceReais: number): number =>
  priceReais <= 300 ? 4 : 10;

export const PRODUCTS: Product[] = [
  {
    id: "bolsa-canarinho",
    name: "Bolsa Canarinho",
    category: "Bolsa",
    price: 290,
    eyebrow: "Edição limitada",
    tagline: "Carregue a seleção no ombro.",
    hero: "/images/bolsa-canarinho-1.jpg",
    heroPosition: "center 92%",
    thumbnail: "/images/bolsa-canarinho-5.jpg",
    images: [
      "/images/bolsa-canarinho-capa-hero.jpg",
      "/images/bolsa-canarinho-1.jpg",
      "/images/bolsa-canarinho-2.jpg",
      "/images/bolsa-canarinho-4.jpg",
      "/images/bolsa-canarinho-5.jpg",
    ],
    blurb: "Cristais verde-petróleo, miçangas amarelo-canarinho e um troféu dourado pra dar sorte. Cada bolsa é trançada à mão — não existem duas iguais.",
    details: "Miçangas de cristal verde-petróleo e acrílico · alça de cordão trançado · ferragens e charm de troféu banhados a ouro · ~18 × 14 cm. Feita à mão no Brasil.",
    sizes: ["Único"],
    soldOutSizes: [],
  },
  {
    id: "charm-chain",
    name: "Charm Chain",
    category: "Corrente",
    price: 40,
    eyebrow: "Copa 2026",
    tagline: "Entra no jeans, sai na torcida.",
    hero: "/images/charm-chain-hero.jpg",
    heroPosition: "center 65%",
    thumbnail: "/images/charm-chain-3.jpg",
    images: [
      "/images/charm-chain-hero.jpg",
      "/images/charm-chain-1.jpg",
      "/images/charm-chain-2.jpg",
      "/images/charm-chain-3.jpg",
    ],
    blurb: "Corrente prata com 6 charms da Copa presa nos passantes do jeans. Bola, camisa 10, bandeira e coração verde-amarelo — tudo que a torcida precisa na cintura.",
    details: "Corrente em aço inox prateado · 6 charms em resina e esmalte · argola de fixação para passante de cinto · tamanho único",
    sizes: ["Único"],
    soldOutSizes: [],
  },
  {
    id: "choker-bandeira",
    name: "Choker Bandana Verde",
    category: "Choker",
    price: 60,
    eyebrow: "Feito à mão",
    tagline: "Um lencinho verde, um ouro no pescoço.",
    hero: "/images/choker-ensaio-01.jpg",
    heroExclude: true,
    images: ["/images/choker-ensaio-01.jpg"],
    blurb: "Choker de bandana verde torcida com charms dourados — a chavinha e a bandeira esmaltada. Ajusta no pescoço como um nó de verão.",
    details: "Tecido de algodão estampado · charms banhados a ouro 18k · fecho ajustável. Comprimento ajustável.",
    sizes: ["Ajustável"],
    soldOutSizes: [],
  },
  {
    id: "lenco-fauna-br",
    name: "Lenço Fauna BR",
    category: "Lenço",
    price: 50,
    eyebrow: "Copa 2026",
    tagline: "Um lenço. Mil jeitos de torcer.",
    hero: "/images/lenco-brasil-estampa-copa-top.jpg",
    heroPosition: "center 20%",
    thumbnail: "/images/lenco-brasil-estampa-copa-produto.jpg",
    images: [
      "/images/lenco-brasil-estampa-copa-top.jpg",
      "/images/lenco-brasil-estampa-copa-pescoco.jpg",
      "/images/lenco-brasil-estampa-copa-detalhe.jpg",
      "/images/lenco-brasil-estampa-copa-pescoco-detalhe.jpg",
      "/images/lenco-brasil-estampa-copa-cabeca.jpg",
      "/images/lenco-brasil-estampa-copa-braco.jpg",
      "/images/lenco-brasil-estampa-copa-produto.jpg",
    ],
    blurb: "Cetim 70×70 cm com estampa exclusiva da fauna brasileira — onça, tucano, beija-flor e golfinho no círculo azul da bandeira. Use como top, no pescoço, no braço ou na cabeça. Uma peça, um monte de looks.",
    details: "Cetim de poliéster · estampa digital exclusiva · 70×70 cm · lavagem à mão",
    sizes: ["Único"],
    soldOutSizes: [],
  },
  {
    id: "colar-selecao",
    name: "Colar Brasil",
    category: "Colar",
    price: 50,
    eyebrow: "Copa 2026",
    tagline: "A bandeira no pescoço, a torcida no coração.",
    hero: "/images/colar-brasil-micanga-bandeira-copa-2026.jpg",
    heroPosition: "center 30%",
    thumbnail: "/images/colar-brasil-micanga-bandeira-produto.jpg",
    images: [
      "/images/colar-brasil-micanga-bandeira-copa-2026.jpg",
      "/images/colar-brasil-micanga-detalhe-pingente.jpg",
      "/images/colar-brasil-micanga-bandeira-modelo-look.jpg",
      "/images/colar-brasil-micanga-bandeira-modelo-sorrindo.jpg",
      "/images/colar-brasil-micanga-bandeira-produto.jpg",
      "/images/colar-brasil-micanga-bandeira-produto-detalhe.jpg",
    ],
    blurb: "Miçangas seed bead verde e amarelo tecidas à mão, com pingente que reproduz a bandeira do Brasil ponto a ponto. Fecho lagosta e corrente de extensão dourados. Pra quem vai ao jogo ou assiste na arquibancada de casa — e quer chegar toda produzida.",
    details: "Miçangas de vidro seed bead · pingente bandeira tecido à mão · fecho lagosta e corrente de extensão banhados a ouro",
    sizes: ["Único"],
    soldOutSizes: [],
  },
];
