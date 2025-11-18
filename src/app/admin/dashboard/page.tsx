
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
import { Check, X, User, ShoppingBag, DollarSign, Users, LogOut } from "lucide-react";
import { useSellers } from "@/hooks/use-sellers";
import { useToast } from "@/hooks/use-toast";
import { SellerApplication, Seller, User as AppUser, Order } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageAdminProfilePage from "./manage-profile/page";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/use-auth-provider";

function MainDashboard({
  pendingSellers,
  onApprove,
  onReject,
  stats,
}: {
  pendingSellers: SellerApplication[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  stats: { totalSales: number; totalProducts: number; totalClients: number };
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendeurs en attente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSellers.length}</div>
            <p className="text-xs text-muted-foreground">Nouvelles demandes d'inscription</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('fr-FR')} F CFA</div>
            <p className="text-xs text-muted-foreground">Revenu total généré</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Nombre total de clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total des produits en ligne</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes d'inscription des vendeurs</CardTitle>
          <CardDescription>Approuvez ou rejetez les nouvelles demandes de vendeurs.</CardDescription>
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
                      <Button variant="outline" size="icon" className="mr-2 h-8 w-8 bg-green-500 hover:bg-green-600 text-white" onClick={() => onApprove(seller.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onReject(seller.id)}>
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
  )
}

export default function AdminDashboard() {
  const { getPendingSellers, approveSeller, rejectSeller } = useSellers();
  const [pendingSellers, setPendingSellers] = useState<SellerApplication[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { logout } = useAuthContext();
  const [stats, setStats] = useState({ totalSales: 0, totalProducts: 0, totalClients: 0 });

  const refreshData = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Refresh pending sellers
    setPendingSellers(getPendingSellers());

    // Calculate stats
    const approvedSellers: Seller[] = JSON.parse(localStorage.getItem('approved_sellers') || '[]');
    const allOrders: Order[] = JSON.parse(localStorage.getItem('marketconnect_orders') || '[]');
    const allBuyers: AppUser[] = JSON.parse(localStorage.getItem('buyers') || '[]');

    const totalSales = allOrders.reduce((sum, order) => sum + order.price, 0);
    const totalProducts = approvedSellers.reduce((sum, seller) => sum + (seller.products?.length || 0), 0);
    const totalClients = allBuyers.length;

    setStats({ totalSales, totalProducts, totalClients });

  }, [getPendingSellers]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);


  const handleApprove = (id: string) => {
    approveSeller(id);
    refreshData();
    toast({
        title: 'Vendeur approuvé',
        description: 'Le vendeur peut maintenant se connecter et utiliser la plateforme.',
    });
  }

  const handleReject = (id: string) => {
    rejectSeller(id);
    refreshData();
      toast({
        variant: 'destructive',
        title: 'Vendeur rejeté',
        description: 'La demande du vendeur a été rejetée et supprimée.',
    });
  }

  const handleLogout = () => {
    logout();
    toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté.',
    });
    router.push('/admin/login');
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tableau de bord Administrateur</h2>
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
            </Button>
        </div>
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Tableau de bord principal</TabsTrigger>
            <TabsTrigger value="profile">Gérer mon profil</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-4">
            <MainDashboard pendingSellers={pendingSellers} onApprove={handleApprove} onReject={handleReject} stats={stats} />
          </TabsContent>
          <TabsContent value="profile" className="mt-4">
            <ManageAdminProfilePage />
          </TabsContent>
      </Tabs>
    </div>
  );
}
