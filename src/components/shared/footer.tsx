import Link from 'next/link';
import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card text-sm">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-8">
        <div>
          <Link href="/" className="flex items-center space-x-2 mb-2">
            <Store className="h-5 w-5 text-primary" />
            <span className="font-bold">MarketConnect</span>
          </Link>
          <p className="text-muted-foreground text-xs">
            Connecter les vendeurs et acheteurs du Bénin.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1 text-xs">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Vendeurs</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Produits</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-xs">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Assistance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Légal</h4>
          <ul className="space-y-1 text-xs">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">CGU</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MarketConnect. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
