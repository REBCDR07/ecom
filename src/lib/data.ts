import type { Product, Seller } from './types';
import { PlaceHolderImages } from './placeholder-images';

function findImage(id: string, defaultHint: string) {
    const image = PlaceHolderImages.find(img => img.id === id);
    return {
        url: image?.imageUrl || `https://picsum.photos/seed/${id}/400/400`,
        hint: image?.imageHint || defaultHint,
    };
}


export const featuredProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Bijoux faits main',
    price: 15000,
    promotionalPrice: 12500,
    image: findImage('product-1', 'handmade jewelry').url,
    imageHint: findImage('product-1', 'handmade jewelry').hint,
    sellerId: 'seller_1',
    sellerName: 'Artisans du Bénin',
    description: "De magnifiques bijoux faits à la main, parfaits pour toutes les occasions. Chaque pièce est unique et raconte une histoire."
  },
  {
    id: 'prod_2',
    name: 'Sac en cuir véritable',
    price: 35000,
    image: findImage('product-2', 'leather bag').url,
    imageHint: findImage('product-2', 'leather bag').hint,
    sellerId: 'seller_2',
    sellerName: 'Maroc & Co',
    description: "Un sac en cuir robuste et élégant, idéal pour un usage quotidien. Fabriqué avec les meilleurs cuirs pour une durabilité maximale."
  },
  {
    id: 'prod_3',
    name: 'Épices locales',
    price: 5000,
    image: findImage('product-3', 'spices').url,
    imageHint: findImage('product-3', 'spices').hint,
    sellerId: 'seller_3',
    sellerName: 'Saveurs d\'Afrique',
    description: "Un assortiment d'épices locales pour relever tous vos plats. Saveurs garanties pour un voyage culinaire inoubliable."
  },
  {
    id: 'prod_4',
    name: 'Panier tressé',
    price: 8000,
    promotionalPrice: 7000,
    image: findImage('product-4', 'woven basket').url,
    imageHint: findImage('product-4', 'woven basket').hint,
    sellerId: 'seller_4',
    sellerName: 'Tissage Royal',
    description: "Panier tressé à la main par nos artisans. Parfait pour le marché, la plage ou comme élément de décoration."
  },
  {
    id: 'prod_5',
    name: 'Poterie artisanale',
    price: 12000,
    image: findImage('product-5', 'pottery').url,
    imageHint: findImage('product-5', 'pottery').hint,
    sellerId: 'seller_1',
    sellerName: 'Artisans du Bénin',
    description: "Vases et bols en poterie, modelés et peints à la main. Chaque pièce apporte une touche d'authenticité à votre intérieur."
  },
  {
    id: 'prod_6',
    name: 'Tissus colorés',
    price: 9500,
    image: findImage('product-6', 'colorful textiles').url,
    imageHint: findImage('product-6', 'colorful textiles').hint,
    sellerId: 'seller_4',
    sellerName: 'Tissage Royal',
    description: "Tissus africains aux motifs vibrants et colorés. Idéal pour la confection de vêtements, d'accessoires ou pour la décoration."
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
