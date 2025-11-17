"use client";
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
import { useAuth } from '@/hooks/use-auth';
import { FormEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${user.firstName}!`,
      });
      if (user.type === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: 'Email ou mot de passe incorrect.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Accédez à votre compte vendeur ou client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="#"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié?
              </Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Se connecter
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Pas encore de compte?{' '}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
