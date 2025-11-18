
"use client";
import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { AdminProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPublicProfilePage() {
  const { getAdminProfile } = useAdmin();
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const adminProfile = getAdminProfile();
    setProfile(adminProfile);
  }, [getAdminProfile]);

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center p-4">
        <p>Chargement du profil administrateur...</p>
      </div>
    );
  }
  
  const whatsappLink = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis la plateforme MarketConnect.`)}`;

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center p-4 bg-muted/40">
       <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center gap-2"
          aria-label="Contacter sur WhatsApp"
      >
          <MessageCircle className="h-6 w-6" />
      </a>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto border-4 border-primary">
            <AvatarFallback>{profile.firstName?.[0] || 'A'}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-3xl">{profile.firstName || 'Admin'} {profile.lastName || 'MarketConnect'}</CardTitle>
          <CardDescription>Administrateur de la plateforme MarketConnect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center">
                 <h3 className="font-semibold mb-2">Biographie</h3>
                 <p className="text-muted-foreground text-sm max-w-md mx-auto">{profile.bio || 'Dédié à la promotion des artisans et vendeurs locaux du Bénin.'}</p>
            </div>
            <div className="border-t pt-6">
                <h3 className="font-semibold text-center mb-4">Informations de contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href={`mailto:${profile.email}`} className="text-sm hover:underline">{profile.email || 'Non défini'}</a>
                    </div>
                     <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-sm">{profile.phone || 'Non défini'}</span>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
