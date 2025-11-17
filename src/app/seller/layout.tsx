"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Home,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const navItems = [
    { href: "/seller/dashboard", icon: Home, label: "Tableau de bord" },
    { href: "/seller/products", icon: Package, label: "Produits" },
    { href: "/seller/profile", icon: Settings, label: "Mon profil" },
]

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user === null || user.type !== 'seller') {
        toast({
            variant: "destructive",
            title: "Accès non autorisé",
            description: "Vous devez être connecté en tant que vendeur pour accéder à cette page.",
        })
        router.replace('/login');
    }
  }, [user, router, toast]);

  const handleLogout = () => {
    logout();
    toast({ title: "Vous avez été déconnecté."})
    router.push('/login');
  }

  // Render nothing or a loading state until the check is complete
  if (!user || user.type !== 'seller') {
      return (
          <div className="flex min-h-screen items-center justify-center">
              <p>Vérification de l'authentification...</p>
          </div>
      )
  }


  return (
    <div className="grid min-h-[calc(100vh-57px)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span className="">Espace Vendeur</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
             {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    { "bg-muted text-primary": pathname.startsWith(item.href) }
                    )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
             ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
