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
import { Product, Seller, Order } from "@/lib/types";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useOrders } from "@/hooks/use-orders";

function ProductsTab({ products, user, setProductToDelete, refreshSellerData }: { products: Product[], user: Seller, setProductToDelete: (id: string | null) => void, refreshSellerData: () => void }) {
  const { deleteProduct } = useSellers();
  const { toast } = useToast();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setCurrentProductId(productId);
    setProductToDelete(productId);
    setAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!user || !currentProductId) return;
    deleteProduct(user.id, currentProductId);
    refreshSellerData();
    toast({
      variant: 'destructive',
      title: 'Produit supprimé',
      description: 'Votre produit a été supprimé avec succès.',
    });
    setProductToDelete(null);
    setCurrentProductId(null);
    setAlertOpen(false);
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Vos Produits</CardTitle>
            <CardDescription>
                Gérez vos produits et consultez leurs performances.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href={`/seller/${user.id}/add-product`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><Badge variant={"default"} className={"bg-green-600"}>En Stock</Badge></TableCell>
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
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(product.id)}>
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
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function OrdersTab({ orders, sellerId }: { orders: Order[], sellerId: string }) {
    const { updateOrderStatus } = useOrders();
    const [currentOrders, setCurrentOrders] = useState(orders);

    const handleStatusChange = (orderId: string, newStatus: 'pending' | 'shipped' | 'delivered') => {
        updateOrderStatus(orderId, newStatus);
        const updatedOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setCurrentOrders(updatedOrders);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Commandes Reçues</CardTitle>
                <CardDescription>
                    Voici les commandes passées pour vos produits.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Produit</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentOrders.length > 0 ? currentOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image alt={order.productName} className="aspect-square rounded-md object-cover" height="64" src={order.productImage} width="64" />
                                </TableCell>
                                <TableCell className="font-medium">{order.productName}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{order.buyerFirstName} {order.buyerLastName}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {order.buyerEmail}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className={
                                        order.status === 'pending' ? 'bg-yellow-400' : 
                                        order.status === 'shipped' ? 'bg-blue-400' : 'bg-green-500'
                                    }>
                                        {order.status === 'pending' && 'En attente'}
                                        {order.status === 'shipped' && 'Expédiée'}
                                        {order.status === 'delivered' && 'Livrée'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Changer Statut</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'pending')}>En attente</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>Expédiée</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>Livrée</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Aucune commande pour le moment.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function SellerDashboard() {
  const { user } = useAuthContext();
  const { getOrdersForSeller } = useOrders();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalSales: "0 F CFA", totalOrders: 0, productsOnline: 0 });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const refreshSellerData = useCallback(() => {
    if (user && user.type === 'seller' && typeof window !== 'undefined') {
        const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
        const currentSeller = approvedSellers.find(s => s.id === user.id);
        if (currentSeller) {
          setSeller(currentSeller);
          const sellerProducts = currentSeller.products || [];
          setProducts(sellerProducts);

          const sellerOrders = getOrdersForSeller(user.id);
          setOrders(sellerOrders);

          const totalSales = sellerOrders.reduce((acc, order) => acc + (order.price * order.quantity), 0);

          setStats({
            totalSales: `${totalSales.toLocaleString('fr-FR')} F CFA`,
            totalOrders: sellerOrders.length,
            productsOnline: sellerProducts.length,
          });
        }
    }
  }, [user, getOrdersForSeller]);

  useEffect(() => {
    refreshSellerData();
  }, [user, refreshSellerData]);

  if (!user || !seller) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tableau de bord Vendeur</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSales}</div>
                    <p className="text-xs text-muted-foreground">Basé sur les commandes reçues.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Nombre total de commandes reçues.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produits en ligne</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.productsOnline}</div>
                    <p className="text-xs text-muted-foreground">Nombre total de produits dans votre boutique.</p>
                </CardContent>
            </Card>
        </div>
        <Tabs defaultValue="orders">
            <TabsList>
                <TabsTrigger value="orders">Commandes ({orders.length})</TabsTrigger>
                <TabsTrigger value="products">Produits ({products.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4">
                <OrdersTab orders={orders} sellerId={user.id} />
            </TabsContent>
            <TabsContent value="products" className="mt-4">
                <ProductsTab products={products} user={seller} setProductToDelete={setProductToDelete} refreshSellerData={refreshSellerData} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
