
"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useSellers } from "@/hooks/use-sellers"
import { useAuthContext } from "@/hooks/use-auth-provider"
import { FormEvent } from "react"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/types";

export default function AddProductPage() {
  const router = useRouter()
  const { addProduct } = useSellers()
  const { user } = useAuthContext()
  const { toast } = useToast()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const promotionalPrice = formData.get('promotionalPrice');

    const newProductData: Omit<Product, 'id' | 'sellerId' | 'sellerName'> = {
      name: formData.get('product-name') as string,
      price: Number(formData.get('price')),
      promotionalPrice: promotionalPrice ? Number(promotionalPrice) : undefined,
      description: formData.get('description') as string,
      image: `https://picsum.photos/seed/${Math.random()}/400/400`,
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
    return <p>Accès non autorisé.</p>
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
              <Input id="image" name="image" type="file" required />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit">Ajouter le produit</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
