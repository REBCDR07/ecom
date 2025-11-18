"use client";
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Store,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Product, Seller, Order } from '@/lib/types';

export default function Home() {
    const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [topSellers, setTopSellers] = useState<Seller[]>([]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
            const allOrders: Order[] = JSON.parse(localStorage.getItem('marketconnect_orders') || '[]');

            // Get all products from approved sellers
            const productsFromSellers = approvedSellers.flatMap(seller => seller.products || []);
            setAllProducts(productsFromSellers);

            // Calculate seller scores and rank them
            const rankedSellers = approvedSellers.map(seller => {
                const productCount = seller.products?.length || 0;
                const salesCount = allOrders.filter(order => order.sellerId === seller.id).length;
                
                // Simple scoring: more sales and more products are better
                const score = (salesCount * 5) + productCount;

                return { ...seller, score };
            })
            .sort((a, b) => b.score - a.score) // Sort descending by score
            .slice(0, 10); // Take top 10

            setTopSellers(rankedSellers);
        }
    }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       <section className="relative h-[70vh] w-full text-white">
        <Carousel
          opts={{ loop: true }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  data-ai-hint={image.imageHint}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
          <h1 className="text-primary">
            MarketConnect
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            La première place de marché qui révèle le talent des artisans et vendeurs du Bénin. Découvrez, achetez et soutenez l'économie locale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Devenir Vendeur</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#featured-products">Explorer les Produits</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Us Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">
            Pourquoi choisir MarketConnect ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Visibilité Accrue</h3>
              <p className="text-muted-foreground">
                Exposez vos produits à des milliers d'acheteurs potentiels à travers le Bénin et au-delà.
              </p>
            </div>
             <div className="flex flex-col items-center">
              <div className="bg-accent/20 p-4 rounded-full mb-4">
                <Wallet className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-2">Paiements Simplifiés</h3>
              <p className="text-muted-foreground">
                Recevez vos paiements directement et en toute sécurité via MTN Mobile Money, sans tracas.
              </p>
            </div>
             <div className="flex flex-col items-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Soutien aux Artisans</h3>
              <p className="text-muted-foreground">
                Chaque achat est un soutien direct à l'économie locale et au savoir-faire de nos talentueux vendeurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">
            Produits à la une
          </h2>
          {allProducts.length > 0 ? (
            <Carousel
              opts={{
                align: 'start',
                loop: allProducts.length > 4,
              }}
              className="w-full"
            >
              <CarouselContent>
                {allProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Aucun produit n'est actuellement en vente. Devenez le premier vendeur !</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-16 lg-py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">
            Nos meilleurs vendeurs
          </h2>
           {topSellers.length > 0 ? (
            <Carousel
              opts={{
                align: 'start',
                loop: topSellers.length > 5,
              }}
              className="w-full"
            >
              <CarouselContent>
                {topSellers.map((seller) => (
                    <CarouselItem key={seller.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                        <div className="p-1">
                            <Link href={`/seller/${seller.id}`}>
                                <Card className="overflow-hidden text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 flex flex-col items-center gap-2">
                                    <Avatar className="h-20 w-20 border-2 border-primary">
                                    <AvatarImage
                                        src={seller.profilePicture}
                                        alt={seller.companyName}
                                        data-ai-hint={seller.imageHint}
                                    />
                                    <AvatarFallback>{seller.companyName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-semibold text-sm truncate w-full">
                                    {seller.companyName}
                                    </h4>
                                </CardContent>
                                </Card>
                            </Link>
                        </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          ) : (
             <div className="text-center py-12">
                <p className="text-muted-foreground">Les vendeurs arrivent bientôt !</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-accent text-lg">
              <Link href="/sellers">
                Voir tous les vendeurs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
