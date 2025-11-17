"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound, useRouter } from "next/navigation"
import { useSellers } from "@/hooks/use-sellers"
import { useAuthContext } from "@/hooks/use-auth-provider"
import { FormEvent, useEffect, useState } from "react"
import { Seller, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function EditProductPage({ params }: { params: { id: string, productId: string } }) {
  const router = useRouter()
  const { updateProduct } = useSellers()
  const { user } = useAuthContext()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (params.id && typeof window !== 'undefined') {
        const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
        const seller = approvedSellers.find(s => s.id === params.id);
        if (seller) {
            const foundProduct = seller.products?.find(p => p.id === params.productId);
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                notFound();
            }
        }
    }
  }, [params.id, params.productId]);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !product) return;

    const formData = new FormData(e.currentTarget);
    const updatedProductData: Product = {
      ...product,
      name: formData.get('product-name') as string,
      price: Number(formData.get('price')),
      promotionalPrice: formData.get('promotionalPrice') ? Number(formData.get('promotionalPrice')) : undefined,
      description: formData.get('description') as string,
      image: product.image, // Image upload not implemented in this version
      imageHint: product.imageHint,
    };
    
    updateProduct(user.id, updatedProductData);
    toast({
      title: "Produit mis à jour !",
      description: "Les informations de votre produit ont été sauvegardées.",
    });
    router.push(`/seller/dashboard`);
  };

  if (!product) {
    return <p>Chargement du produit...</p>
  }
  
  if (user?.id !== params.id) {
    return <p>Accès non autorisé.</p>
  }


  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le produit</CardTitle>
          <CardDescription>
            Mettez à jour les informations de votre produit ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="product-name">Nom du produit</Label>
              <Input id="product-name" name="product-name" defaultValue={product.name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (F CFA)</Label>
                <Input id="price" name="price" type="number" defaultValue={product.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Prix promotionnel (Optionnel)</Label>
                <Input id="promotionalPrice" name="promotionalPrice" type="number" defaultValue={product.promotionalPrice} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du produit</Label>
              <Textarea id="description" name="description" defaultValue={product.description} rows={5} />
            </div>
            
            <div className="space-y-2">
              <Label>Image actuelle</Label>
               <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Changer l'image du produit</Label>
              <Input id="image" type="file" disabled/>
              <p className="text-xs text-muted-foreground">Le changement d'image n'est pas disponible dans cette version.</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit">Sauvegarder les modifications</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
