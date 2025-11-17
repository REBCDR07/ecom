import Link from 'next/link';
import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12">
        <div>
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">MarketConnect</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Connecter les vendeurs et acheteurs du Bénin.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Vendeurs</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Produits</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Assistance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Légal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Conditions Générales d'Utilisation</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Politique de confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MarketConnect. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
