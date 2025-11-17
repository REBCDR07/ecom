"use client";
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
import { Check, X } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useSellers } from "@/hooks/use-sellers";
import { useToast } from "@/hooks/use-toast";
import { SellerApplication } from "@/lib/types";
import { useEffect, useState } from "react";

const salesData = [
  { month: "Jan", sales: 850000 },
  { month: "Fév", sales: 980000 },
  { month: "Mar", sales: 1100000 },
  { month: "Avr", sales: 1250000 },
];
const salesChartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--primary))",
  },
} 

const signupsData = [
  { month: "Jan", clients: 25, vendeurs: 5 },
  { month: "Fév", clients: 30, vendeurs: 8 },
  { month: "Mar", clients: 45, vendeurs: 4 },
  { month: "Avr", clients: 52, vendeurs: 7 },
];

const signupsChartConfig = {
  clients: {
    label: "Clients",
    color: "hsl(var(--chart-1))",
  },
  vendeurs: {
    label: "Vendeurs",
    color: "hsl(var(--chart-2))",
  },
}

export default function AdminDashboard() {
  const { getPendingSellers, approveSeller, rejectSeller } = useSellers();
  const [pendingSellers, setPendingSellers] = useState<SellerApplication[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPendingSellers(getPendingSellers());
  }, [getPendingSellers]);


  const handleApprove = (id: string) => {
    approveSeller(id);
    setPendingSellers(getPendingSellers());
    toast({
        title: 'Vendeur approuvé',
        description: 'Le vendeur peut maintenant se connecter et utiliser la plateforme.',
    });
  }

  const handleReject = (id: string) => {
    rejectSeller(id);
    setPendingSellers(getPendingSellers());
     toast({
        variant: 'destructive',
        title: 'Vendeur rejeté',
        description: 'La demande du vendeur a été rejetée et supprimée.',
    });
  }


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord Administrateur</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Vendeurs en attente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingSellers.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Nouvelles demandes d'inscription
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ventes totales (ce mois)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,250,000 F CFA</div>
                    <p className="text-xs text-muted-foreground">
                        +15% par rapport au mois dernier
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Nouveaux clients
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+52</div>
                     <p className="text-xs text-muted-foreground">
                        +2 depuis hier
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Produits actifs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">342</div>
                     <p className="text-xs text-muted-foreground">
                        Total des produits en ligne
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
                 <CardHeader>
                    <CardTitle>Évolution des ventes</CardTitle>
                    <CardDescription>Ventes des 4 derniers mois.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={salesChartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={salesData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                cursor={false}
                            />
                            <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Évolution des inscriptions</CardTitle>
                    <CardDescription>Inscriptions des 4 derniers mois.</CardDescription>
                </CardHeader>
                <CardContent  className="pl-2">
                     <ChartContainer config={signupsChartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={signupsData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                cursor={false}
                            />
                            <Bar dataKey="clients" fill="var(--color-clients)" radius={4} />
                            <Bar dataKey="vendeurs" fill="var(--color-vendeurs)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Demandes d'inscription des vendeurs</CardTitle>
                <CardDescription>
                    Approuvez ou rejetez les nouvelles demandes de vendeurs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nom de l'entreprise</TableHead>
                        <TableHead>Date de demande</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingSellers.length > 0 ? (
                            pendingSellers.map((seller) => (
                            <TableRow key={seller.id}>
                                <TableCell className="font-medium">{seller.companyName}</TableCell>
                                <TableCell>{new Date(seller.submissionDate).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="icon" className="mr-2 h-8 w-8 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApprove(seller.id)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleReject(seller.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Aucune demande en attente.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
