"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Mock data, replace with actual seller data from your backend
const sellerData = {
  companyName: "Artisans du Bénin",
  bio: "Artisans passionnés, nous créons des pièces uniques qui racontent une histoire. Inspirés par la richesse de la culture béninoise, chaque article est fait main avec amour et dévouement.",
  profilePicture: "https://picsum.photos/seed/seller-woman1/100/100",
  bannerImage: "https://picsum.photos/seed/seller-banner-1/1600/400",
  email: "contact@artisansdubenin.com",
  phone: "+229 97 00 00 00",
  whatsapp: "+229 97 00 00 00",
  address: {
    street: "Rue 123, Quartier Agla, Cotonou",
    googleMapsUrl: "https://maps.app.goo.gl/YourMapLink",
  },
}

export default function ManageSellerProfilePage() {
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
                  <Image src={sellerData.bannerImage} alt="Bannière" fill className="object-cover" />
                </Card>
                <Input type="file" className="mt-2" />
              </div>
               <div>
                <Label>Photo de profil</Label>
                <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={sellerData.profilePicture} />
                        <AvatarFallback>{sellerData.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Input type="file" />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input id="company-name" defaultValue={sellerData.companyName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie / Description de la boutique</Label>
                <Textarea id="bio" defaultValue={sellerData.bio} rows={4} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={sellerData.email} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input id="phone" type="tel" defaultValue={sellerData.phone} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                    <Input id="whatsapp" type="tel" defaultValue={sellerData.whatsapp} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue={sellerData.address.street} />
                 </div>
                 <div className="space-y-2 col-span-full">
                    <Label htmlFor="google-maps">Lien Google Maps</Label>
                    <Input id="google-maps" defaultValue={sellerData.address.googleMapsUrl} />
                 </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Sauvegarder les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
