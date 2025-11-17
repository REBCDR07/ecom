"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Seller } from '@/lib/types';

export default function AllSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
      setSellers(approvedSellers);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center mb-12">Découvrez tous nos vendeurs</h1>
      {sellers.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {sellers.map((seller) => (
            <Link href={`/seller/${seller.id}`} key={seller.id}>
              <Card className="overflow-hidden text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 h-full">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage
                      src={seller.profilePicture}
                      alt={seller.companyName}
                      data-ai-hint={seller.imageHint}
                    />
                    <AvatarFallback>{seller.companyName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-base truncate w-full">
                    {seller.companyName}
                  </h4>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg">
          <h2 className="text-xl font-semibold">Aucun vendeur trouvé</h2>
          <p className="text-muted-foreground mt-2">
            Notre place de marché est en pleine croissance. Revenez bientôt !
          </p>
        </div>
      )}
    </div>
  );
}
