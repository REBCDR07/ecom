"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Home,
  Package,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
