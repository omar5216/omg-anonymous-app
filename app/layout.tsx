import type { Metadata } from 'next';
import { Cairo, Space_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/components/omg/AuthProvider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OMG! Anonymous Chat',
  description: 'Send and receive anonymous messages, open private chats, and share messages as cards.',
  openGraph: {
    title: 'OMG! Anonymous Chat',
    description: 'استقبل رسائل مجهولة، افتح شات خاص، وشارك الرسائل ككارت.',
    url: 'https://omgksa.com',
    siteName: 'OMG!',
    locale: 'ar_SA',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className="omg-grid-bg min-h-screen"
        style={{ fontFamily: "var(--font-cairo), 'Cairo', system-ui, sans-serif" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
