
"use client";
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Product, Seller } from '@/lib/types';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
      const allProducts = approvedSellers.flatMap(seller => seller.products || []);
      setProducts(allProducts);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center mb-12">Explorez tous nos produits</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg">
          <h2 className="text-xl font-semibold">Aucun produit à afficher</h2>
          <p className="text-muted-foreground mt-2">
            De nouveaux articles seront bientôt disponibles. Revenez plus tard !
          </p>
        </div>
      )}
    </div>
  );
}
