import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Noto_Sans_Devanagari, Rozha_One, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import OfflineBanner from '@/components/pwa/OfflineBanner';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import UtmTracker from '@/components/marketing/UtmTracker';
import CustomerCareButton from '@/components/customer-care/CustomerCareButton';
import { LanguageProvider } from '@/lib/i18n/context';
import RouteProgressBar from '@/components/layout/RouteProgressBar';
import ScrollProgress from '@/components/layout/ScrollProgress';
import CosmicStarfield from '@/components/common/CosmicStarfield';
import PageTransition from '@/components/layout/PageTransition';

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-devanagari',
  display: 'swap',
});

const rozhaOne = Rozha_One({
  subsets: ['devanagari', 'latin'],
  weight: ['400'],
  variable: '--font-rozha',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0b0e17',
};

export const metadata: Metadata = {
  title: 'AstroVeda | एस्ट्रोवेदा - प्रामाणिक वैदिक ज्ञान एवं जीवन मार्गदर्शन',
  description:
    'प्राचीन वैदिक ज्ञान • आधुनिक जीवन का सटीक मार्गदर्शन। कुंडली विश्लेषण, नवग्रह शांति, विवाह, धन एवं करियर समाधान।',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AstroVeda',
  },
  openGraph: {
    title: 'AstroVeda | एस्ट्रोवेदा - अपनी जन्म कुंडली के रहस्य जानें',
    description: 'प्राचीन वैदिक ज्ञान • आधुनिक जीवन का सटीक मार्गदर्शन।',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hi"
      className={`dark ${devanagari.variable} ${rozhaOne.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-navy-950 font-sans text-gray-100 antialiased selection:bg-gold-500 selection:text-navy-950">
        <LanguageProvider>
          <RouteProgressBar />
          <ScrollProgress />
          <CosmicStarfield />
          <OfflineBanner />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0 relative z-10 flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <MobileNav />
          <CustomerCareButton />
          <InstallPrompt />
          <ServiceWorkerRegister />
          <UtmTracker />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </LanguageProvider>
      </body>
    </html>
  );
}
