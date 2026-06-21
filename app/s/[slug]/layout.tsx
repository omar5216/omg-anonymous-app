import type { Metadata } from 'next';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://omg-backend-v2-production.up.railway.app/api/v1';

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://omgksa.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Dynamic OG image — generated per-user by /api/og?slug=<slug>
  const ogImage = `${APP_ORIGIN}/api/og?slug=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(`${API_BASE}/links/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('not found');

    const profile: { displayName?: string; bio?: string | null } = await res.json();
    const name = profile.displayName ?? 'صاحبك';

    const title = `OMG! ابعت رسالة مجهولة لـ ${name}`;
    const description =
      profile.bio
        ? `${profile.bio} — ابعت رسالة مجهولة لـ ${name} على OMG!`
        : `ابعت رسالة مجهولة لـ ${name} — هويتك محمية تماماً ✓`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${APP_ORIGIN}/s/${slug}`,
        siteName: 'OMG!',
        locale: 'ar_SA',
        type: 'website',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            type: 'image/png',
            alt: `ابعت رسالة مجهولة لـ ${name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    const ogImageFallback = `${APP_ORIGIN}/api/og`;
    return {
      title: 'OMG! Anonymous Chat',
      description: 'ابعتلي رسالة مجهولة 👀',
      openGraph: {
        title: 'OMG! Anonymous Chat',
        description: 'ابعتلي رسالة مجهولة 👀',
        url: `${APP_ORIGIN}/s/${slug}`,
        siteName: 'OMG!',
        type: 'website',
        images: [
          {
            url: ogImageFallback,
            width: 1200,
            height: 630,
            type: 'image/png',
            alt: 'OMG Anonymous Chat',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'OMG! Anonymous Chat',
        description: 'ابعتلي رسالة مجهولة 👀',
        images: [ogImageFallback],
      },
    };
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
