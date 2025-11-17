import type { Product, Seller } from './types';

export const featuredProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Bijoux faits main',
    price: 15000,
    promotionalPrice: 12500,
    image: 'https://picsum.photos/seed/product-jewelry/400/400',
    imageHint: 'handmade jewelry',
    sellerId: 'seller_1',
    sellerName: 'Artisans du Bénin',
    description: "De magnifiques bijoux faits à la main, parfaits pour toutes les occasions. Chaque pièce est unique et raconte une histoire."
  },
  {
    id: 'prod_2',
    name: 'Sac en cuir véritable',
    price: 35000,
    image: 'https://picsum.photos/seed/product-bag/400/400',
    imageHint: 'leather bag',
    sellerId: 'seller_2',
    sellerName: 'Maroc & Co',
    description: "Un sac en cuir robuste et élégant, idéal pour un usage quotidien. Fabriqué avec les meilleurs cuirs pour une durabilité maximale."
  },
  {
    id: 'prod_3',
    name: 'Épices locales',
    price: 5000,
    image: 'https://picsum.photos/seed/product-spices/400/400',
    imageHint: 'spices',
    sellerId: 'seller_3',
    sellerName: 'Saveurs d\'Afrique',
    description: "Un assortiment d'épices locales pour relever tous vos plats. Saveurs garanties pour un voyage culinaire inoubliable."
  },
  {
    id: 'prod_4',
    name: 'Panier tressé',
    price: 8000,
    promotionalPrice: 7000,
    image: 'https://picsum.photos/seed/product-basket/400/400',
    imageHint: 'woven basket',
    sellerId: 'seller_4',
    sellerName: 'Tissage Royal',
    description: "Panier tressé à la main par nos artisans. Parfait pour le marché, la plage ou comme élément de décoration."
  },
  {
    id: 'prod_5',
    name: 'Poterie artisanale',
    price: 12000,
    image: 'https://picsum.photos/seed/product-pottery/400/400',
    imageHint: 'pottery',
    sellerId: 'seller_1',
    sellerName: 'Artisans du Bénin',
    description: "Vases et bols en poterie, modelés et peints à la main. Chaque pièce apporte une touche d'authenticité à votre intérieur."
  },
  {
    id: 'prod_6',
    name: 'Tissus colorés',
    price: 9500,
    image: 'https://picsum.photos/seed/product-textiles/400/400',
    imageHint: 'colorful textiles',
    sellerId: 'seller_4',
    sellerName: 'Tissage Royal',
    description: "Tissus africains aux motifs vibrants et colorés. Idéal pour la confection de vêtements, d'accessoires ou pour la décoration."
  },
];

export const topSellers: Seller[] = [
  {
    id: 'seller_1',
    companyName: 'Artisans du Bénin',
    profilePicture: 'https://picsum.photos/seed/seller-woman1/100/100',
    imageHint: 'portrait woman',
    firstName: "Marie",
    lastName: "Adan",
    email: "seller1@test.com",
    phone: "96000001",
    whatsapp: "96000001",
    address: "Rue de l'artisan, Cotonou",
    type: 'seller'
  },
  {
    id: 'seller_2',
    companyName: 'Maroc & Co',
    profilePicture: 'https://picsum.photos/seed/seller-man1/100/100',
    imageHint: 'portrait man',
    firstName: "Hassan",
    lastName: "Alaoui",
    email: "seller2@test.com",
    phone: "96000002",
    whatsapp: "96000002",
    address: "Avenue du cuir, Porto-Novo",
    type: 'seller'
  },
  {
    id: 'seller_3',
    companyName: 'Saveurs d\'Afrique',
    profilePicture: 'https://picsum.photos/seed/seller-woman2/100/100',
    imageHint: 'portrait smiling',
     firstName: "Aicha",
    lastName: "Diallo",
    email: "seller3@test.com",
    phone: "96000003",
    whatsapp: "96000003",
    address: "Carrefour des épices, Parakou",
    type: 'seller'
  },
  {
    id: 'seller_4',
    companyName: 'Tissage Royal',
    profilePicture: 'https://picsum.photos/seed/seller-man2/100/100',
    imageHint: 'portrait craftsman',
    firstName: "Koffi",
    lastName: "Zinsou",
    email: "seller4@test.com",
    phone: "96000004",
    whatsapp: "96000004",
    address: "Boulevard du textile, Abomey",
    type: 'seller'
  },
   {
    id: 'seller_5',
    companyName: 'Beauté Naturelle',
    profilePicture: 'https://picsum.photos/seed/seller-woman3/100/100',
    imageHint: 'portrait entrepreneur',
    firstName: "Fatou",
    lastName: "N'Diaye",
    email: "seller5@test.com",
    phone: "96000005",
    whatsapp: "96000005",
    address: "Place du karité, Natitingou",
    type: 'seller'
  },
];


export const sellerDashboardData = {
  products: [
    {
      id: 'prod_1',
      name: 'Bijoux faits main',
      price: 15000,
      stock: 25,
      sales: 120,
    },
    {
      id: 'prod_5',
      name: 'Poterie artisanale',
      price: 12000,
      stock: 40,
      sales: 85,
    },
  ],
  stats: {
    totalSales: '4,575,000 F CFA',
    totalOrders: 205,
    conversionRate: '5.2%',
  }
}
