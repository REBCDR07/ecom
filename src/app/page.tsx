
"use client";
import Image from 'next/image';
import Link from 'next/link';
import {
  Store,
  ShoppingBag,
  Wallet,
  LogIn,
  UserPlus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
    const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       <section className="relative h-[70vh] w-full flex flex-col items-center justify-center text-white text-center">
        <Carousel
          opts={{ loop: true }}
          className="absolute inset-0 w-full h-full -z-10"
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
        <div className="relative z-10 p-4">
          <h1 className="text-primary">
            MarketConnect
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            La première place de marché qui révèle le talent des artisans et vendeurs du Bénin. Découvrez, achetez et soutenez l'économie locale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Devenir Vendeur</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/products">Explorer les Produits</Link>
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
              <h3 className="mb-2">Transactions Simplifiées</h3>
              <p className="text-muted-foreground">
                Un système de commande direct et une communication facile avec les vendeurs pour des achats en toute confiance.
              </p>
            </div>
             <div className="flex flex-col items-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Soutien à l'Artisanat</h3>
              <p className="text-muted-foreground">
                Chaque achat est un soutien direct à l'économie locale et au savoir-faire de nos talentueux vendeurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* For Sellers */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-accent">Pour les Vendeurs</h3>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-8">                  
                    <li className="ml-6">            
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                            <UserPlus className="w-4 h-4 text-primary"/>
                        </span>
                        <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Créez votre boutique</h4>
                        <p className="text-base font-normal text-muted-foreground">Inscrivez-vous en quelques clics et soumettez votre profil de vendeur pour approbation.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                            <ShoppingBag className="w-4 h-4 text-primary"/>
                        </span>
                        <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Ajoutez vos produits</h4>
                        <p className="text-base font-normal text-muted-foreground">Utilisez votre tableau de bord pour mettre en ligne vos créations, gérer vos prix et descriptions.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                           <Wallet className="w-4 h-4 text-primary"/>
                        </span>
                        <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Gérez vos commandes</h4>
                        <p className="text-base font-normal text-muted-foreground">Recevez les commandes des clients, communiquez avec eux et organisez la livraison.</p>
                    </li>
                </ol>
            </div>
             {/* For Buyers */}
            <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-primary">Pour les Clients</h3>
                 <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-8">                  
                    <li className="ml-6">            
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                            <Search className="w-4 h-4 text-green-600"/>
                        </span>
                        <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Découvrez des trésors</h4>
                        <p className="text-base font-normal text-muted-foreground">Explorez des milliers de produits uniques faits par des artisans et vendeurs locaux.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                            <LogIn className="w-4 h-4 text-green-600"/>
                        </span>
                        <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Commandez facilement</h4>
                        <p className="text-base font-normal text-muted-foreground">Créez votre compte client, remplissez vos informations et passez commande en toute simplicité.</p>
                    </li>
                    <li className="ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                           <Store className="w-4 h-4 text-green-600"/>
                        </span>
                        <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Soutenez le local</h4>
                        <p className="text-base font-normal text-muted-foreground">Contactez directement les vendeurs et recevez des produits authentiques tout en soutenant l'économie locale.</p>
                    </li>
                </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
