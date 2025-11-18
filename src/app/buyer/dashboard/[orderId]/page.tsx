
"use client";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Order } from "@/lib/types";
import { useAuthContext } from "@/hooks/use-auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Upload, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Helper function to read file as Data URL
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


function getStatusBadge(status: Order['status']) {
    switch(status) {
        case 'pending':
            return <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/80">En attente de paiement</Badge>;
        case 'awaiting_confirmation':
            return <Badge className="bg-orange-400 text-orange-900 hover:bg-orange-400/80">En attente de confirmation</Badge>;
        case 'shipped':
            return <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-400/80">Expédiée</Badge>;
        case 'delivered':
            return <Badge className="bg-green-500 text-green-900 hover:bg-green-500/80">Livrée</Badge>;
        default:
            return <Badge variant="secondary">Inconnu</Badge>;
    }
}

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading } = useAuthContext();
    const { getOrderById, submitPaymentProof } = useOrders();
    const { toast } = useToast();
    
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    const [order, setOrder] = useState<Order | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== 'buyer') {
            router.replace('/login');
            return;
        }

        const fetchedOrder = getOrderById(orderId);
        if (!fetchedOrder || fetchedOrder.buyerId !== user.id) {
            notFound();
        }
        setOrder(fetchedOrder);
    }, [orderId, user, loading, getOrderById, router]);

    const handlePayClick = () => {
        if (!order) return;
        const ussdCode = `*880*1*1*${order.sellerPhone}*${order.sellerPhone}*${order.price}*${order.price}#`;
        window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProofFile(e.target.files[0]);
        }
    };
    
    const handleProofSubmit = async () => {
        if (!paymentProofFile || !order) return;
        setIsSubmitting(true);
        try {
            const proofDataUrl = await toBase64(paymentProofFile);
            submitPaymentProof(order.id, proofDataUrl);
            toast({
                title: "Preuve de paiement envoyée !",
                description: "Le vendeur a été notifié et examinera votre paiement.",
            });
            // Refresh order data
            const updatedOrder = getOrderById(orderId);
            setOrder(updatedOrder);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Erreur d'envoi",
                description: "Impossible de traiter la capture d'écran.",
            });
        } finally {
            setIsSubmitting(false);
            setPaymentProofFile(null);
        }
    };

    if (loading || !user || !order) {
        return <div className="flex min-h-screen items-center justify-center"><p>Chargement de la commande...</p></div>;
    }

    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Détails de la Commande</CardTitle>
                            <CardDescription>Commande #{order.id.slice(-8)}</CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-4">
                            <Image src={order.productImage} alt={order.productName} width={80} height={80} className="rounded-md object-cover" />
                            <div>
                                <h3 className="font-semibold">{order.productName}</h3>
                                <p className="text-muted-foreground text-sm">Vendu par {order.sellerPhone}</p>
                                <p className="font-bold text-lg">{order.price.toLocaleString('fr-FR')} F CFA</p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2">Informations de livraison</h4>
                            <p className="text-sm text-muted-foreground">{order.buyerInfo.firstName} {order.buyerInfo.lastName}</p>
                            <p className="text-sm text-muted-foreground">{order.buyerInfo.address}</p>
                            <p className="text-sm text-muted-foreground">{order.buyerInfo.email} - {order.buyerInfo.phone}</p>
                        </div>
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-semibold text-center">Actions</h3>
                        {order.status === 'pending' && (
                            <div className="p-4 border rounded-lg bg-background space-y-4">
                               <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertTitle>Étape 1: Payer la commande</AlertTitle>
                                <AlertDescription>
                                    Cliquez sur le bouton ci-dessous pour initier le paiement via le code USSD MTN.
                                </AlertDescription>
                                </Alert>
                                <Button className="w-full" onClick={handlePayClick}>
                                    <CreditCard className="mr-2 h-4 w-4" /> Payer maintenant
                                </Button>
                                
                                <Separator />
                                
                                <Alert>
                                <Upload className="h-4 w-4" />
                                <AlertTitle>Étape 2: Confirmer le paiement</AlertTitle>
                                <AlertDescription>
                                    Après avoir payé, faites une capture d'écran de la confirmation et envoyez-la ici.
                                </AlertDescription>
                                </Alert>
                                <Input type="file" accept="image/*" onChange={handleFileChange} />
                                <Button className="w-full" onClick={handleProofSubmit} disabled={!paymentProofFile || isSubmitting}>
                                    {isSubmitting ? 'Envoi...' : 'Envoyer la preuve'}
                                </Button>
                            </div>
                        )}
                        {order.status === 'awaiting_confirmation' && (
                            <Alert variant="default" className="border-orange-500/50 text-orange-900 dark:text-orange-300">
                                <CheckCircle className="h-4 w-4 text-orange-500" />
                                <AlertTitle>Paiement en cours de validation</AlertTitle>
                                <AlertDescription>
                                    Votre preuve de paiement a été envoyée. Le vendeur la vérifiera bientôt.
                                </AlertDescription>
                            </Alert>
                        )}
                         {order.status === 'shipped' && (
                            <Alert variant="default" className="border-blue-500/50 text-blue-900 dark:text-blue-300">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <AlertTitle>Commande expédiée</AlertTitle>
                                <AlertDescription>
                                    Votre commande est en route !
                                </AlertDescription>
                            </Alert>
                        )}
                        {order.status === 'delivered' && (
                            <Alert variant="default" className="border-green-500/50 text-green-900 dark:text-green-300">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle>Commande livrée</AlertTitle>
                                <AlertDescription>
                                    Nous espérons que votre produit vous plaît !
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" onClick={() => router.back()}>Retour au tableau de bord</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
