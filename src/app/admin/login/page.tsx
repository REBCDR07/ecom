"use client";

import { useEffect, useState } from 'react';
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
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/hooks/use-auth-provider';

const ADMIN_PASSWORD_KEY = 'admin_password';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuthContext();

  useEffect(() => {
    // Set the admin password in localStorage if it's not already there.
    if (typeof window !== 'undefined' && !localStorage.getItem(ADMIN_PASSWORD_KEY)) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, 'BeninShell@2025');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    
    if (password === storedPassword) {
      // Use the login function to set an admin user type
      login('admin', password, true);
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
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Connexion
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
