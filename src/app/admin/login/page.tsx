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

export default function AdminLoginPage() {
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
            <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" required />
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
