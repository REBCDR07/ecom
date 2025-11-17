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
  },
  {
    id: 'prod_2',
    name: 'Sac en cuir véritable',
    price: 35000,
    image: 'https://picsum.photos/seed/product-bag/400/400',
    imageHint: 'leather bag',
    sellerId: 'seller_2',
    sellerName: 'Maroc & Co',
  },
  {
    id: 'prod_3',
    name: 'Épices locales',
    price: 5000,
    image: 'https://picsum.photos/seed/product-spices/400/400',
    imageHint: 'spices',
    sellerId: 'seller_3',
    sellerName: 'Saveurs d\'Afrique',
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
  },
  {
    id: 'prod_5',
    name: 'Poterie artisanale',
    price: 12000,
    image: 'https://picsum.photos/seed/product-pottery/400/400',
    imageHint: 'pottery',
    sellerId: 'seller_1',
    sellerName: 'Artisans du Bénin',
  },
  {
    id: 'prod_6',
    name: 'Tissus colorés',
    price: 9500,
    image: 'https://picsum.photos/seed/product-textiles/400/400',
    imageHint: 'colorful textiles',
    sellerId: 'seller_4',
    sellerName: 'Tissage Royal',
  },
];

export const topSellers: Seller[] = [
  {
    id: 'seller_1',
    companyName: 'Artisans du Bénin',
    profilePicture: 'https://picsum.photos/seed/seller-woman1/100/100',
    imageHint: 'portrait woman',
  },
  {
    id: 'seller_2',
    companyName: 'Maroc & Co',
    profilePicture: 'https://picsum.photos/seed/seller-man1/100/100',
    imageHint: 'portrait man',
  },
  {
    id: 'seller_3',
    companyName: 'Saveurs d\'Afrique',
    profilePicture: 'https://picsum.photos/seed/seller-woman2/100/100',
    imageHint: 'portrait smiling',
  },
  {
    id: 'seller_4',
    companyName: 'Tissage Royal',
    profilePicture: 'https://picsum.photos/seed/seller-man2/100/100',
    imageHint: 'portrait craftsman',
  },
   {
    id: 'seller_5',
    companyName: 'Beauté Naturelle',
    profilePicture: 'https://picsum.photos/seed/seller-woman3/100/100',
    imageHint: 'portrait entrepreneur',
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
