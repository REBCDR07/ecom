
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Store, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthContext } from '@/hooks/use-auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import NotificationsPopover from './notifications-popover';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/sellers', label: 'Vendeurs' },
];

export function Header() {
  const { user, signOut } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  
  const handleLogout = async () => {
    if (!signOut) return;
    try {
      await signOut();
      toast({ title: 'Vous avez été déconnecté.' });
      router.push('/login');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erreur de déconnexion', description: error.message });
    }
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
                key={`${link.href}-${link.label}`}
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
                  <Link key={link.label} href={link.href}>
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
             {user && (user.role === 'seller' || user.role === 'admin') && <NotificationsPopover userType={user.role} />}
            
            {user ? (
              <>
                 {user.role === 'seller' && (
                    <Button variant="ghost" asChild size="sm">
                      <Link href="/seller/dashboard">Tableau de bord</Link>
                    </Button>
                 )}
                 {user.role === 'buyer' && (
                    <Button variant="ghost" asChild size="sm">
                        <Link href="/buyer/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Mes commandes
                        </Link>
                    </Button>
                 )}
                 {user.role === 'admin' && (
                    <Button variant="ghost" asChild size="sm">
                      <Link href="/admin/dashboard">Tableau de bord</Link>
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

    