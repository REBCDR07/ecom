
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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const profileSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  bio: z.string().optional(),
  email: z.string().email("L'email est invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  whatsapp: z.string().min(8, "Numéro WhatsApp invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  googleMaps: z.string().url("Veuillez entrer une URL valide pour Google Maps").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ManageSellerProfilePage() {
    const { user } = useAuthContext();
    const { getSellerById, updateSellerProfile } = useSellers();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        companyName: '',
        bio: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        googleMaps: '',
      }
    });

    const [seller, setSeller] = useState<Seller | null>(null);

    useEffect(() => {
        if (user && user.role === 'seller') {
            const sellerData = getSellerById(user.id);
            if (sellerData) {
              setSeller(sellerData);
              form.reset({
                companyName: sellerData.companyName,
                bio: "Artisans passionnés, nous créons des pièces uniques qui racontent une histoire. Inspirés par la richesse de la culture béninoise, chaque article est fait main avec amour et dévouement.",
                email: sellerData.email,
                phone: sellerData.phone,
                whatsapp: sellerData.whatsapp,
                address: sellerData.address,
                googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sellerData.address)}`,
              });
            }
        }
    }, [user, getSellerById, form]);

    const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
        if (!user) return;
        updateSellerProfile(user.id, data);
        toast({
            title: "Profil mis à jour !",
            description: "Vos informations ont été sauvegardées avec succès.",
        });
        router.push('/seller/dashboard');
    }

    if (!user || !seller) {
        return <p>Chargement...</p>;
    }
    
    const bannerImage = seller.bannerPicture || `https://picsum.photos/seed/${seller.id}-banner/1600/400`;

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
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile & Banner Images */}
            <div className="space-y-4">
              <div>
                <Label>Bannière de la boutique</Label>
                <Card className="mt-2 aspect-[4/1] relative overflow-hidden">
                  <Image src={bannerImage} alt="Bannière" fill className="object-cover" />
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
              <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem><FormLabel>Nom de l'entreprise</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Biographie / Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Numéro de téléphone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="whatsapp" render={({ field }) => (
                      <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="col-span-full">
                     <FormField control={form.control} name="googleMaps" render={({ field }) => (
                        <FormItem><FormLabel>Lien Google Maps</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit">Sauvegarder les modifications</Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
