"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/hooks/use-auth-provider";
import { useEffect, useState, useCallback } from "react";
import { Product, Seller } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useSellers } from "@/hooks/use-sellers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SellerDashboard() {
  const { user } = useAuthContext();
  const { deleteProduct } = useSellers();
  const { toast } = useToast();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalSales: "0 F CFA", totalOrders: 0 });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const refreshSellerData = useCallback(() => {
    if (user && user.type === 'seller' && typeof window !== 'undefined') {
        const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
        const currentSeller = approvedSellers.find(s => s.id === user.id);
        if (currentSeller) {
          setSeller(currentSeller);
          const sellerProducts = currentSeller.products || [];
          setProducts(sellerProducts);

          // This is a simplified metric. In a real app, this would come from order history.
          const totalSales = sellerProducts.reduce((acc, p) => {
            const price = p.promotionalPrice || p.price;
            // Let's assume each product was sold once for this estimation
            return acc + price;
          }, 0);

          setStats({
            totalSales: `${totalSales.toLocaleString('fr-FR')} F CFA`,
            totalOrders: sellerProducts.length, 
          });
        }
    }
  }, [user]);

  useEffect(() => {
    refreshSellerData();
  }, [user, refreshSellerData]);


  const handleDeleteProduct = () => {
    if (!user || !productToDelete) return;
    deleteProduct(user.id, productToDelete);
    refreshSellerData();
    toast({
      variant: 'destructive',
      title: 'Produit supprimé',
      description: 'Votre produit a été supprimé avec succès.',
    });
    setProductToDelete(null);
  };

  if (!user || !seller) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tableau de bord Vendeur</h2>
             <Button asChild>
                <Link href={`/seller/${user.id}/add-product`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
                </Link>
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Revenu Total (estimé)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                        Basé sur les prix de vos produits.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Produits en ligne
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Nombre total de produits dans votre boutique.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Taux de Conversion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">N/A</div>
                     <p className="text-xs text-muted-foreground">
                        Sera calculé avec les ventes réelles.
                    </p>
                </CardContent>
            </Card>
        </div>
        <AlertDialog>
        <Card>
            <CardHeader>
                <CardTitle>Vos Produits</CardTitle>
                <CardDescription>
                    Gérez vos produits et consultez leurs performances.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length > 0 ? products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant={"default"} className={"bg-green-600"}>
                                    En Stock
                                </Badge>
                            </TableCell>
                            <TableCell>{(product.promotionalPrice || product.price).toLocaleString('fr-FR')} F CFA</TableCell>
                            <TableCell>
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                          <Link href={`/seller/${user.id}/edit-product/${product.id}`}>Modifier</Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                       <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setProductToDelete(product.id)}>
                                          Supprimer
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        )) : (
                          <TableRow>
                              <TableCell colSpan={4} className="text-center h-24">Vous n'avez aucun produit.
                                <Link href={`/seller/${user.id}/add-product`} className="text-primary hover:underline font-bold ml-2">
                                  Commencez par en ajouter un !
                                </Link>
                              </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
                Cette action est irréversible. Le produit sera définitivement supprimé.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">
                Supprimer
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
