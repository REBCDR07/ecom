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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSellers } from '@/hooks/use-sellers';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const buyerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email est invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const sellerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email est invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  whatsapp: z.string().min(8, "Numéro WhatsApp invalide"),
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  address: z.string().min(5, "L'adresse est requise"),
  activity: z.string().min(5, "L'activité est requise"),
  whyPlatform: z.string().min(10, "Ce champ est requis"),
  password: z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});


type BuyerFormValues = z.infer<typeof buyerSchema>;
type SellerFormValues = z.infer<typeof sellerSchema>;

function BuyerRegisterForm() {
  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<BuyerFormValues> = (data) => {
    // For now, we just show a toast and redirect. Buyer logic can be added later.
     toast({
      title: "Compte client créé !",
      description: "Vous pouvez maintenant vous connecter.",
    });
    router.push('/login');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe (8+ caractères)</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Créer un compte client
        </Button>
      </form>
    </Form>
  );
}

function SellerRegisterForm() {
    const form = useForm<SellerFormValues>({
      resolver: zodResolver(sellerSchema),
    });
    const { addPendingSeller } = useSellers();
    const { toast } = useToast();
    const router = useRouter();


    const onSubmit: SubmitHandler<SellerFormValues> = (data) => {
        addPendingSeller(data);
        toast({
            title: "Demande soumise !",
            description: "Votre demande d'inscription a été envoyée. Elle sera examinée par un administrateur.",
        });
        router.push('/');
    };

    return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Numéro MTN</FormLabel><FormControl><Input type="tel" placeholder="ex: 97000000" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem><FormLabel>Numéro WhatsApp</FormLabel><FormControl><Input type="tel" placeholder="ex: 97000000" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem><FormLabel>Nom de l'entreprise</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem><FormLabel>Adresse & Lien Google Maps</FormLabel><FormControl><Input placeholder="ex: Rue 123, Cotonou" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="activity" render={({ field }) => (
            <FormItem><FormLabel>Activités de vente</FormLabel><FormControl><Input placeholder="ex: Vêtements, artisanat..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="whyPlatform" render={({ field }) => (
            <FormItem><FormLabel>Pourquoi choisir notre plateforme ?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Mot de passe (12+ caractères)</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirmer le mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
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
    </Form>
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
