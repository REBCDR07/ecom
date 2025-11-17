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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { sellerDashboardData } from "@/lib/data";

export default function SellerDashboard() {
  const { products, stats } = sellerDashboardData;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tableau de bord Vendeur</h2>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Revenu Total
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                        Basé sur toutes vos ventes.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Commandes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Nombre total de commandes reçues.
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
                    <div className="text-2xl font-bold">{stats.conversionRate}</div>
                     <p className="text-xs text-muted-foreground">
                        Visites vs Ventes.
                    </p>
                </CardContent>
            </Card>
        </div>
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
                        <TableHead>Ventes</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant={product.stock > 0 ? "default" : "destructive"} className={product.stock > 0 ? "bg-green-600" : ""}>
                                    {product.stock > 0 ? 'En Stock' : 'Épuisé'}
                                </Badge>
                            </TableCell>
                            <TableCell>{product.price.toLocaleString('fr-FR')} F CFA</TableCell>
                            <TableCell>{product.sales}</TableCell>
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
                                        <Link href={`/seller/your-seller-id/edit-product/${product.id}`}>Modifier</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
