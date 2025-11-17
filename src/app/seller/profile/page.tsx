"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useAuthContext } from "@/hooks/use-auth-provider"
import { useSellers } from "@/hooks/use-sellers"
import { Seller } from "@/lib/types"
import { useEffect, useState } from "react"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useRouter } from "next/navigation"

export default function ManageSellerProfilePage() {
    const { user } = useAuthContext();
    const { getSellerById } = useSellers();
    const [seller, setSeller] = useState<Seller | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const sellerData = getSellerById(user.id);
            setSeller(sellerData);
        }
    }, [user, getSellerById]);

    if (!user || !seller) {
        return <p>Chargement...</p>;
    }
    
    const bannerImage = PlaceHolderImages.find(img => img.id === 'seller-banner-1') || { imageUrl: `https://picsum.photos/seed/${seller.id}-banner/1600/400` };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Gérer votre profil vendeur</CardTitle>
          <CardDescription>
            Gardez vos informations à jour pour attirer plus de clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            {/* Profile & Banner Images */}
            <div className="space-y-4">
              <div>
                <Label>Bannière de la boutique</Label>
                <Card className="mt-2 aspect-[4/1] relative overflow-hidden">
                  <Image src={bannerImage.imageUrl} alt="Bannière" fill className="object-cover" />
                </Card>
                <Input type="file" className="mt-2" disabled/>
                <p className="text-sm text-muted-foreground mt-1">La modification de la bannière n'est pas disponible pour le moment.</p>
              </div>
               <div>
                <Label>Photo de profil</Label>
                <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={seller.profilePicture} />
                        <AvatarFallback>{seller.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Input type="file" disabled/>
                </div>
                 <p className="text-sm text-muted-foreground mt-1">La modification de la photo de profil n'est pas disponible.</p>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input id="company-name" defaultValue={seller.companyName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie / Description de la boutique</Label>
                <Textarea id="bio" defaultValue={"Artisans passionnés, nous créons des pièces uniques qui racontent une histoire. Inspirés par la richesse de la culture béninoise, chaque article est fait main avec amour et dévouement."} rows={4} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={seller.email} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input id="phone" type="tel" defaultValue={seller.phone} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                    <Input id="whatsapp" type="tel" defaultValue={seller.whatsapp} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue={seller.address} />
                 </div>
                 <div className="space-y-2 col-span-full">
                    <Label htmlFor="google-maps">Lien Google Maps</Label>
                    <Input id="google-maps" defaultValue={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`} />
                 </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit" disabled>Sauvegarder (non fonctionnel)</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
