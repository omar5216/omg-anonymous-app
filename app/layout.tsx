import type { Metadata } from 'next';
import { Cairo, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/components/omg/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '';

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
  metadataBase: new URL('https://omgksa.com'),
  title: 'OMG! Anonymous Chat',
  description: 'استقبل رسائل مجهولة، افتح شات خاص، وشارك الرسائل ككارت. مجاني 100%.',
  openGraph: {
    title: 'OMG! Anonymous Chat',
    description: 'استقبل رسائل مجهولة، افتح شات خاص، وشارك الرسائل ككارت.',
    url: 'https://omgksa.com',
    siteName: 'OMG!',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: 'https://omgksa.com/api/og?v=4',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'OMG! Anonymous Chat — استقبل رسائل مجهولة وافتح شات لو حبيت',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMG! Anonymous Chat',
    description: 'استقبل رسائل مجهولة، افتح شات خاص، وشارك الرسائل ككارت.',
    images: ['https://omgksa.com/api/og?v=4'],
  },
};

// GoogleOAuthProvider requires a non-empty clientId to initialise correctly.
// When the env var is absent we wrap with a noop fragment instead.
function MaybeGoogleProvider({ children }: { children: React.ReactNode }) {
  if (!GOOGLE_CLIENT_ID) return <>{children}</>;
  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
}

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
        <MaybeGoogleProvider>
          <AuthProvider>{children}</AuthProvider>
        </MaybeGoogleProvider>

        {/* Apple Sign In JS SDK — loaded lazily only when Apple is configured */}
        {APPLE_CLIENT_ID && (
          <Script
            src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
