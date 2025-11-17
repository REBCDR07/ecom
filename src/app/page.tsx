import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Store,
  ShoppingBag,
  CheckCircle,
  User,
  Package,
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
import { featuredProducts, topSellers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const heroImage =
    'https://picsum.photos/seed/market-hero/1600/900';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full text-white">
        <Image
          src={heroImage}
          alt="Marché animé"
          data-ai-hint="market stall"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            MarketConnect
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            La plateforme qui connecte les meilleurs vendeurs du Bénin avec des
            acheteurs passionnés.
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

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Sellers */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold flex items-center gap-3">
                <Store className="text-accent" />
                Pour les Vendeurs
              </h3>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Créez votre boutique</h4>
                  <p className="text-muted-foreground">
                    Inscrivez-vous en quelques minutes et personnalisez votre
                    profil pour attirer les clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Ajoutez vos produits</h4>
                  <p className="text-muted-foreground">
                    Mettez en vente vos articles avec des photos et des
                    descriptions attrayantes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Vendez et prospérez</h4>
                  <p className="text-muted-foreground">
                    Gérez vos commandes, communiquez avec vos clients et suivez
                    vos ventes facilement.
                  </p>
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold flex items-center gap-3">
                <ShoppingBag className="text-primary" />
                Pour les Acheteurs
              </h3>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Découvrez des trésors</h4>
                  <p className="text-muted-foreground">
                    Explorez des milliers de produits uniques proposés par des
                    vendeurs locaux.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Commandez facilement</h4>
                  <p className="text-muted-foreground">
                    Payez en toute sécurité avec MTN Mobile Money en quelques
                    clics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Recevez votre commande</h4>
                  <p className="text-muted-foreground">
                    Contactez directement le vendeur via WhatsApp pour
                    coordonner la livraison.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Produits à la une
          </h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos meilleurs vendeurs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {topSellers.map((seller) => (
              <Link href="#" key={seller.id}>
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
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-accent text-lg">
              <Link href="#">
                Voir tous les vendeurs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
