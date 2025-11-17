import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.promotionalPrice ?? product.price;
  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="flex-grow">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.name}
              data-ai-hint={product.imageHint}
              fill
              className="object-cover"
            />
             {hasDiscount && (
              <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                -
                {Math.round(
                  ((product.price - product.promotionalPrice!) / product.price) * 100
                )}
                %
              </div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <Link href={`/seller/${product.sellerId}`} className="text-sm text-muted-foreground hover:underline">{product.sellerName}</Link>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-accent">
                {displayPrice.toLocaleString('fr-FR')} F CFA
              </p>
              {hasDiscount && (
                <p className="text-sm text-muted-foreground line-through">
                  {product.price.toLocaleString('fr-FR')} F CFA
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </div>
       <div className="px-4 pb-4 mt-auto">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Commander</Button>
      </div>
    </Card>
  );
}
