"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { featuredProducts } from "@/lib/data"
import { notFound } from "next/navigation"

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const product = featuredProducts.find(p => p.id === params.productId)

  if (!product) {
    notFound()
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-name">Nom du produit</Label>
              <Input id="product-name" defaultValue={product.name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (F CFA)</Label>
                <Input id="price" type="number" defaultValue={product.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Prix promotionnel (Optionnel)</Label>
                <Input id="promotionalPrice" type="number" defaultValue={product.promotionalPrice} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du produit</Label>
              <Textarea id="description" defaultValue="Description détaillée du produit ici..." rows={5} />
            </div>
            
            <div className="space-y-2">
              <Label>Image actuelle</Label>
               <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Changer l'image du produit</Label>
              <Input id="image" type="file" />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">Annuler</Button>
                <Button type="submit">Sauvegarder les modifications</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
