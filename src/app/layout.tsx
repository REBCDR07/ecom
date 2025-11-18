
import type { Metadata } from 'next';
import { Montserrat, Roboto } from 'next/font/google';
import 'globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth-provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-heading',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'MarketConnect - Votre marché en ligne',
  description: 'Connecter les vendeurs et acheteurs du Bénin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          montserrat.variable,
          roboto.variable
        )}
      >
        <AuthProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
