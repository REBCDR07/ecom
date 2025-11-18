
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound, useRouter, useParams } from "next/navigation"
import { useSellers } from "@/hooks/use-sellers"
import { useAuthContext } from "@/hooks/use-auth-provider"
import { FormEvent, useEffect, useState } from "react"
import { Seller, Product } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Helper function to read file as Data URL
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


export default function EditProductPage() {
  const router = useRouter()
  const params = useParams();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const { updateProduct } = useSellers()
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user && user.type === 'seller' && productId && typeof window !== 'undefined') {
        const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
        const seller = approvedSellers.find(s => s.id === user.id);
        if (seller) {
            const foundProduct = seller.products?.find(p => p.id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                notFound();
            }
        }
    }
  }, [user, productId]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !product || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const promotionalPrice = formData.get('promotionalPrice');
    const imageFile = formData.get('image') as File;

    let imageUrl = product.image;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await toBase64(imageFile);
        } catch (error) {
            console.error("Error converting file to Base64", error);
            toast({
                variant: "destructive",
                title: "Erreur d'image",
                description: "Impossible de traiter le nouveau fichier image.",
            });
            setIsSubmitting(false);
            return;
        }
    }

    const updatedProductData: Product = {
      ...product,
      name: formData.get('product-name') as string,
      price: Number(formData.get('price')),
      promotionalPrice: promotionalPrice && Number(promotionalPrice) > 0 ? Number(promotionalPrice) : undefined,
      description: formData.get('description') as string,
      image: imageUrl, // Use new image if provided
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
  
  if (!user || user.type !== 'seller') {
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
              <Input id="product-name" name="product-name" defaultValue={product.name} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (F CFA)</Label>
                <Input id="price" name="price" type="number" defaultValue={product.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Prix promotionnel (Optionnel)</Label>
                <Input id="promotionalPrice" name="promotionalPrice" type="number" defaultValue={product.promotionalPrice} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du produit</Label>
              <Textarea id="description" name="description" defaultValue={product.description} rows={5} required />
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
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>Annuler</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
