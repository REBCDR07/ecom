
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
import { User, SellerApplication } from '@/lib/types';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  profilePicture: z.instanceof(File).optional(),
  bannerPicture: z.instanceof(File).optional(),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<BuyerFormValues> = (data) => {
    const buyers: User[] = JSON.parse(localStorage.getItem('buyers') || '[]');
    const newBuyer: User = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      type: 'buyer',
    };
    localStorage.setItem('buyers', JSON.stringify([...buyers, newBuyer]));
    
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
            <FormControl>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} {...field} />
                 <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
             <FormControl>
              <div className="relative">
                <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                 <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </FormControl>
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

// Helper function to read file as Data URL
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


function SellerRegisterForm() {
    const form = useForm<SellerFormValues>({
      resolver: zodResolver(sellerSchema),
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',
        companyName: '',
        address: '',
        activity: '',
        whyPlatform: '',
        password: '',
        confirmPassword: ''
      }
    });
    const { addPendingSeller } = useSellers();
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const onSubmit: SubmitHandler<SellerFormValues> = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const profilePicFile = form.getValues('profilePicture');
        const bannerPicFile = form.getValues('bannerPicture');

        let profilePictureUrl = '';
        let bannerPictureUrl = '';

        try {
            if (profilePicFile) {
                profilePictureUrl = await toBase64(profilePicFile);
            }
             if (bannerPicFile) {
                bannerPictureUrl = await toBase64(bannerPicFile);
            }
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erreur d'image",
                description: "Impossible de traiter un des fichiers image.",
            });
            setIsSubmitting(false);
            return;
        }

        const sellerApplicationData: Omit<SellerApplication, 'id' | 'submissionDate' | 'status' | 'type'> & { profilePicture: string, bannerPicture: string } = {
          ...data,
          profilePicture: profilePictureUrl,
          bannerPicture: bannerPictureUrl
        };
        
        addPendingSeller(sellerApplicationData);
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
            <FormItem><FormLabel>Mot de passe (12+ caractères)</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} {...field} />
                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                        </button>
                    </div>
                </FormControl>
            <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                        </button>
                    </div>
                </FormControl>
            <FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
             <FormField control={form.control} name="profilePicture" render={({ field: { onChange, ...props } }) => (
                <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="bannerPicture" render={({ field: { onChange, ...props } }) => (
                <FormItem>
                    <FormLabel>Bannière de couverture</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
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
