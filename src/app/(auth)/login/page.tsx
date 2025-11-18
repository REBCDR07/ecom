
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
import { useAuthContext } from '@/hooks/use-auth-provider';
import { FormEvent, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { signIn, user } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      // The redirection will be handled by the useEffect below
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue !`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: error.message || 'Email ou mot de passe incorrect.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // This effect redirects the user once they are successfully logged in.
  useEffect(() => {
    // Only act if `user` is not undefined (i.e., auth state has loaded)
    if (user) {
        if (user.role === 'seller') router.replace('/seller/dashboard');
        else if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'buyer') router.replace('/');
    }
    // The `user` dependency ensures this runs when the auth state changes.
  }, [user, router]);
  
  // Displays a loading state while authentication is initializing.
  if (user === undefined) {
    return <div className="flex items-center justify-center h-full"><p>Chargement...</p></div>;
  }

  // If the user is already logged in, they will be redirected by the useEffect.
  // We can show a message during this brief moment.
  if (user) {
    return <div className="flex items-center justify-center h-full"><p>Vous êtes déjà connecté. Redirection...</p></div>;
  }

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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
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
