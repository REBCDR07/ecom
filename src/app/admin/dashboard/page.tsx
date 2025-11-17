"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Vendeurs en attente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
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
                    <CardTitle>Évolution des inscriptions</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <p className="text-center text-muted-foreground p-8">
                        Graphique des inscriptions à venir
                    </p>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Évolution des ventes</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-center text-muted-foreground p-8">
                        Graphique des ventes à venir
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}