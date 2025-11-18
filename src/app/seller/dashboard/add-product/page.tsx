
"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useSellers } from "@/hooks/use-sellers"
import { useAuthContext } from "@/hooks/use-auth-provider"
import { FormEvent, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/types";

// Helper function to read file as Data URL
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


export default function AddProductPage() {
  const router = useRouter()
  const { addProduct } = useSellers()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const promotionalPrice = formData.get('promotionalPrice');
    const imageFile = formData.get('image') as File;

    let imageUrl = `https://picsum.photos/seed/${Math.random()}/400/400`;

    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await toBase64(imageFile);
        } catch (error) {
            console.error("Error converting file to Base64", error);
            toast({
                variant: "destructive",
                title: "Erreur d'image",
                description: "Impossible de traiter le fichier image.",
            });
            setIsSubmitting(false);
            return;
        }
    }


    const newProductData: Omit<Product, 'id' | 'sellerId' | 'sellerName'> = {
      name: formData.get('product-name') as string,
      price: Number(formData.get('price')),
      promotionalPrice: promotionalPrice ? Number(promotionalPrice) : undefined,
      description: formData.get('description') as string,
      image: imageUrl,
      imageHint: 'new product',
    };
    
    addProduct(user.id, newProductData);
    toast({
      title: "Produit ajouté !",
      description: "Votre nouveau produit est maintenant dans votre boutique.",
    });
    router.push('/seller/dashboard');
  };
  
  if (!user || user.type !== 'seller') {
    // This part should be handled by the layout, but as a fallback:
    if (typeof window !== 'undefined') {
        router.replace('/login');
    }
    return <p>Accès non autorisé. Redirection...</p>
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau produit</CardTitle>
          <CardDescription>
            Remplissez les informations de votre nouveau produit ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="product-name">Nom du produit</Label>
              <Input id="product-name" name="product-name" placeholder="Ex: Collier en perles" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (F CFA)</Label>
                <Input id="price" name="price" type="number" placeholder="Ex: 15000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Prix promotionnel (Optionnel)</Label>
                <Input id="promotionalPrice" name="promotionalPrice" type="number" placeholder="Ex: 12500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du produit</Label>
              <Textarea id="description" name="description" placeholder="Description détaillée du produit ici..." rows={5} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image du produit</Label>
              <Input id="image" name="image" type="file" accept="image/*" required />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Ajout en cours..." : "Ajouter le produit"}
                </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
