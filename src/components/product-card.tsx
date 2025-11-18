
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { FormEvent, useState } from 'react';
import { useAuthContext } from '@/hooks/use-auth-provider';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

function OrderForm({ product, user, onOrderPlaced }: { product: Product; user: User; onOrderPlaced: () => void }) {
  const { createOrder } = useOrders();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderData = {
      buyerInfo: {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
      }
    };

    createOrder(product, user, orderData);

    toast({
      title: 'Commande envoyée !',
      description: 'Votre commande a été transmise au vendeur.',
    });
    onOrderPlaced();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" defaultValue={user.displayName?.split(' ')[0]} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" defaultValue={user.displayName?.split(' ')[1]} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="Votre numéro pour la livraison" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Adresse de livraison</Label>
        <Textarea id="address" name="address" placeholder="Votre adresse complète" required />
      </div>
      <Button type="submit" className="w-full">Envoyer la commande</Button>
    </form>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.promotionalPrice ?? product.price;
  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
  const { user } = useAuthContext();
  const router = useRouter();
  const [isOrderFormOpen, setOrderFormOpen] = useState(false);

  const handleOrderClick = () => {
    if (user && user.role === 'buyer') {
      setOrderFormOpen(true);
    } else if (user && (user.role === 'seller' || user.role === 'admin')) {
      // Sellers and Admins can't order, so do nothing.
    } else {
      router.push('/login');
    }
  };
  
  const canOrder = !user || user.role === 'buyer';


  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Dialog open={isOrderFormOpen} onOpenChange={setOrderFormOpen}>
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
            {canOrder && (
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleOrderClick}>
                Commander
                </Button>
            )}
        </div>
        
        {user && user.role === 'buyer' && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Passer une commande pour "{product.name}"</DialogTitle>
              <DialogDescription>
                Veuillez confirmer vos informations pour la livraison. Le vendeur vous contactera.
              </DialogDescription>
            </DialogHeader>
            <OrderForm product={product} user={user} onOrderPlaced={() => setOrderFormOpen(false)} />
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}
