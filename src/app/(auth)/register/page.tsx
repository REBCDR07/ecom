import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

function BuyerRegisterForm() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">Prénom</Label>
          <Input id="first-name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Nom</Label>
          <Input id="last-name" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe (8+ caractères)</Label>
        <Input id="password" type="password" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
        <Input id="confirm-password" type="password" required />
      </div>
      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        Créer un compte client
      </Button>
    </form>
  );
}

function SellerRegisterForm() {
    return (
    <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="seller-first-name">Prénom</Label>
                <Input id="seller-first-name" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="seller-last-name">Nom</Label>
                <Input id="seller-last-name" required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="seller-email">Email</Label>
            <Input id="seller-email" type="email" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Numéro MTN</Label>
                <Input id="phone" type="tel" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                <Input id="whatsapp" type="tel" required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input id="company-name" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="activity">Activités de vente</Label>
            <Input id="activity" placeholder="ex: Vêtements, artisanat, produits frais..." required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="why-platform">Pourquoi choisir notre plateforme ?</Label>
            <Textarea id="why-platform" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="seller-password">Mot de passe (12+ caractères)</Label>
            <Input id="seller-password" type="password" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="seller-confirm-password">Confirmer le mot de passe</Label>
            <Input id="seller-confirm-password" type="password" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="profile-pic">Photo de profil</Label>
                <Input id="profile-pic" type="file" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="banner-pic">Bannière de couverture</Label>
                <Input id="banner-pic" type="file" />
            </div>
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Soumettre la demande
        </Button>
    </form>
    );
}

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez notre communauté de vendeurs et d'acheteurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">Je suis un client</TabsTrigger>
            <TabsTrigger value="seller">Je suis un vendeur</TabsTrigger>
          </TabsList>
          <TabsContent value="buyer" className="mt-6">
            <BuyerRegisterForm />
          </TabsContent>
          <TabsContent value="seller" className="mt-6">
            <SellerRegisterForm />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm">
          Déjà un compte?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
