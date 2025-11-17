import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { topSellers, featuredProducts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function ContactDialog({seller}: {seller: any}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Contact</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Contacter {seller.companyName}</DialogTitle>
                <DialogDescription>
                    Voici les informations pour contacter ce vendeur.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${seller.email}`} className="text-sm hover:underline">{seller.email}</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{seller.phone}</span>
                    </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="text-sm">
                            <p>{seller.address.street}</p>
                            {seller.address.googleMapsUrl && (
                                <a href={seller.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                                    Voir sur Google Maps
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


export default function SellerProfilePage({ params }: { params: { id: string } }) {
    const sellerData = {
        ...topSellers.find(s => s.id === params.id),
        bio: 'Artisans passionnés, nous créons des pièces uniques qui racontent une histoire. Inspirés par la richesse de la culture béninoise, chaque article est fait main avec amour et dévouement.',
        bannerImage: 'https://picsum.photos/seed/seller-banner-1/1600/400',
        bannerHint: 'artisan workshop',
        email: 'contact@artisansdubenin.com',
        phone: '+229 97 00 00 00',
        whatsapp: '+22997000000',
        address: {
            street: 'Rue 123, Quartier Agla, Cotonou',
            googleMapsUrl: 'https://maps.app.goo.gl/YourMapLink'
        }
    };

    if (!sellerData.companyName) {
        notFound();
    }

    const sellerProducts = featuredProducts.filter(p => p.sellerId === params.id);
    const whatsappLink = `https://wa.me/${sellerData.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par vos produits sur MarketConnect.`)}`;

    return (
        <div>
            {/* WhatsApp Floating Button */}
            <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center gap-2"
            >
                <MessageCircle className="h-6 w-6" />
            </a>

            {/* Banner Section */}
            <section className="relative h-64 md:h-80 w-full">
                <Image
                    src={sellerData.bannerImage}
                    alt={`Bannière de ${sellerData.companyName}`}
                    data-ai-hint={sellerData.bannerHint}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
            </section>
            
            <div className="container mx-auto px-4 -mt-20">
                {/* Profile Header */}
                <div className="relative bg-card p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-32 w-32 border-4 border-background absolute -top-16 left-1/2 md:left-6 -translate-x-1/2 md:-translate-x-0">
                        <AvatarImage src={sellerData.profilePicture} alt={sellerData.companyName} data-ai-hint={sellerData.imageHint}/>
                        <AvatarFallback>{sellerData.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="pt-16 md:pt-0 md:pl-40 text-center md:text-left flex-grow">
                        <h1 className="text-3xl font-bold">{sellerData.companyName}</h1>
                        <p className="text-muted-foreground mt-2">{sellerData.bio}</p>
                    </div>
                    <div className="flex-shrink-0">
                       <ContactDialog seller={sellerData} />
                    </div>
                </div>

                {/* Seller's Products */}
                <section className="py-16">
                    <h2 className="text-2xl font-bold mb-8">Produits de {sellerData.companyName}</h2>
                    {sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sellerProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-muted-foreground">Ce vendeur n'a pas encore de produits en ligne.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
