
"use client";
import { useAuthContext } from "@/hooks/use-auth-provider";
import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function BuyerDashboardPage() {
    const { user, loading } = useAuthContext();
    const { getOrdersForBuyer } = useOrders();
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (loading) return; // Wait for auth state to load

        if (!user || user.role !== 'buyer') {
            toast({
                variant: 'destructive',
                title: 'Accès non autorisé',
                description: 'Vous devez être connecté en tant que client.',
            });
            router.replace('/login');
        } else {
            const buyerOrders = getOrdersForBuyer(user.id);
            setOrders(buyerOrders);
        }
    }, [user, loading, getOrdersForBuyer, router, toast]);

    if (loading || !user || user.role !== 'buyer') {
        return <div className="flex min-h-[calc(100vh-57px)] items-center justify-center"><p>Redirection...</p></div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Mes Commandes</CardTitle>
                    <CardDescription>
                        Retrouvez ici l'historique de toutes vos commandes.
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
                                <TableHead>Vendeur</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Prix</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                            alt={order.productName}
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={order.productImage}
                                            width="64"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{order.productName}</TableCell>
                                    <TableCell>
                                         <Link href={`/seller/${order.sellerId}`} className="hover:underline text-primary">
                                            {/* This logic might be faulty if seller name isn't stored on product. Let's find it from the order itself if possible */}
                                            {orders.find(o => o.productId === order.productId)?.productName.split(" par ")[1] || "Vendeur"}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString('fr-FR')}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className={
                                            order.status === 'pending' ? 'bg-yellow-400 text-yellow-900' : 
                                            order.status === 'shipped' ? 'bg-blue-400 text-blue-900' : 'bg-green-500 text-green-900'
                                        }>
                                            {order.status === 'pending' && 'En attente'}
                                            {order.status === 'shipped' && 'Expédiée'}
                                            {order.status === 'delivered' && 'Livrée'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{order.price.toLocaleString('fr-FR')} F CFA</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Vous n'avez passé aucune commande pour le moment.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
