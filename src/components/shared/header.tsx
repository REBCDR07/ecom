"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Store, Bell, LogOut } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '#', label: 'Vendeurs' },
  { href: '#', label: 'FAQ' },
  { href: '#', label: 'Contact' },
];

const notifications = [
    {
        title: "Nouvelle vente!",
        description: "Votre produit 'Bijoux faits main' a été vendu.",
    },
    {
        title: "Vendeur approuvé",
        description: "Félicitations, votre boutique est maintenant en ligne!",
    },
    {
        title: "Nouveau message",
        description: "Un client vous a posé une question sur le 'Sac en cuir'.",
    },
];

function NotificationsPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute top-1 right-1 h-4 w-4 justify-center p-0 text-xs" variant="destructive">
                        {notifications.length}
                    </Badge>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            Vos 3 dernières notifications.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {notifications.map((notification, index) => (
                             <div
                                key={index}
                                className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {notification.description}
                                </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    toast({ title: 'Vous avez été déconnecté.' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              MarketConnect
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <Store className="mr-2 h-5 w-5 text-primary" />
              <span className="font-bold">MarketConnect</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search bar here later */}
          </div>
          <nav className="flex items-center">
            {user && <NotificationsPopover />}
            
            {user ? (
              <>
                 {user.type === 'seller' && (
                    <Button variant="ghost" asChild size="sm">
                      <Link href="/seller/dashboard">Tableau de bord</Link>
                    </Button>
                 )}
                <Button variant="ghost" onClick={handleLogout} size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm">
                    <Link href="/admin/login">Accès Admin</Link>
                </Button>
                <Button asChild size="sm">
                    <Link href="/login">Connexion</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
