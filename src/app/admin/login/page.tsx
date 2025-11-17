"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // IMPORTANT: This is a temporary and insecure way to handle admin login.
    // In a real application, you MUST use a proper authentication system.
    if (password === 'BeninShell@25ad') {
      // In a real app, you'd set a secure, http-only cookie or a session token.
      // For this prototype, we'll just redirect.
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Accès refusé',
        description: 'Le mot de passe est incorrect.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit">
                <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl mt-4">Accès Administrateur</CardTitle>
            <CardDescription>
            Cette page est réservée au super admin.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Connexion
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}