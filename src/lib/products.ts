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

export const PRODUCTS: Product[] = [
  {
    id: "choker-branca",
    name: "Choker Bandana Branca",
    category: "Choker",
    price: 60,
    eyebrow: "Copa 2026",
    tagline: "O branco que torce junto.",
    hero: "/images/choker-branca-2.jpg",
    thumbnail: "/images/choker-branca-6.jpg",
    images: [
      "/images/choker-branca-2.jpg",
      "/images/choker-branca-4.jpg",
      "/images/choker-branca-5.jpg",
      "/images/choker-branca-3.jpg",
      "/images/choker-branca-1.jpg",
      "/images/choker-branca-6.jpg",
    ],
    blurb: "Bandana branca com charms dourados — apito, chuteira e a bandeira esmaltada do Brasil. Feita à mão pra quem vai torcer com estilo.",
    details: "Tecido de algodão estampado · charms banhados a ouro 18k · apito · chuteira · bandeira esmaltada · fecho ajustável",
    sizes: ["Ajustável"],
    soldOutSizes: [],
  },
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
    thumbnail: "/images/charm-chain-4.jpg",
    images: [
      "/images/charm-chain-hero.jpg",
      "/images/charm-chain-1.jpg",
      "/images/charm-chain-2.jpg",
      "/images/charm-chain-3.jpg",
      "/images/charm-chain-4.jpg",
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
    id: "colar-selecao",
    name: "Colar Brasil",
    category: "Colar",
    price: 50,
    eyebrow: "Novo",
    tagline: "A bandeira em miçangas, no peito.",
    hero: "/images/hero-1.jpg",
    heroExclude: true,
    images: ["/images/hero-1.jpg"],
    blurb: "Colar de miçangas com pingente da bandeira tecido ponto a ponto, e um charm da camisa 10. O verão de 1970 em volta do pescoço.",
    details: "Miçangas de vidro tecidas à mão · pingente bandeira + charm camisa · fio encerado. Comprimentos 42 / 50 cm.",
    sizes: ["42 cm", "50 cm"],
    soldOutSizes: [],
  },
];
