export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  eyebrow: string;
  tagline: string;
  hero: string;
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
    id: "bolsa-canarinho",
    name: "Bolsa Canarinho",
    category: "Bolsa",
    price: 289,
    eyebrow: "Edição limitada",
    tagline: "Carregue a seleção no ombro.",
    hero: "/images/bolsa-canarinho-ensaio-01.jpg",
    images: ["/images/bolsa-canarinho-ensaio-01.jpg", "/images/bolsa-canarinho-ensaio-02.jpg"],
    blurb: "Cristais azul-fumê, miçangas amarelo-canarinho e um troféu dourado pra dar sorte. Cada bolsa é trançada à mão — não existem duas iguais.",
    details: "Miçangas de cristal e acrílico · alça de cordão trançado · ferragens e charm de troféu banhados a ouro · ~18 × 14 cm. Feita à mão no Brasil.",
    sizes: ["Único"],
    soldOutSizes: [],
  },
  {
    id: "corrente-torcida",
    name: "Corrente Torcida",
    category: "Corrente",
    price: 169,
    eyebrow: "Mais amada",
    tagline: "Pra usar no jeans, na cintura, onde quiser.",
    hero: "/images/chain-ensaio-02.jpg",
    images: ["/images/chain-ensaio-01.jpg", "/images/chain-ensaio-02.jpg"],
    blurb: "Correntes em camadas com charms da torcida: a camisa 10, a bola, o coração verde-amarelo e a bandeirinha. Prata que não escurece.",
    details: "Corrente em aço inox prateado · charms em resina e esmalte · mosquetão reforçado. Comprimentos 40 / 45 / 50 cm.",
    sizes: ["40 cm", "45 cm", "50 cm"],
    soldOutSizes: ["50 cm"],
  },
  {
    id: "choker-bandeira",
    name: "Choker Bandeira",
    category: "Choker",
    price: 149,
    eyebrow: "Feito à mão",
    tagline: "Um lencinho verde, um ouro no pescoço.",
    hero: "/images/choker-ensaio-01.jpg",
    images: ["/images/choker-ensaio-01.jpg"],
    blurb: "Choker de bandana verde torcida com charms dourados — a chavinha e a bandeira esmaltada. Ajusta no pescoço como um nó de verão.",
    details: "Tecido de algodão estampado · charms banhados a ouro 18k · fecho ajustável. Comprimento ajustável.",
    sizes: ["Ajustável"],
    soldOutSizes: [],
  },
  {
    id: "colar-selecao",
    name: "Colar Seleção",
    category: "Colar",
    price: 199,
    eyebrow: "Novo",
    tagline: "A bandeira em miçangas, no peito.",
    hero: "/images/hero-1.jpg",
    images: ["/images/hero-1.jpg"],
    blurb: "Colar de miçangas com pingente da bandeira tecido ponto a ponto, e um charm da camisa 10. O verão de 1970 em volta do pescoço.",
    details: "Miçangas de vidro tecidas à mão · pingente bandeira + charm camisa · fio encerado. Comprimentos 42 / 50 cm.",
    sizes: ["42 cm", "50 cm"],
    soldOutSizes: [],
  },
];
