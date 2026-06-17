import type { Metadata } from 'next';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://omg-backend-v2-production.up.railway.app/api/v1';

// Static image — no edge function, no API call, always 200 instantly.
// Version query busts any previous bad cache on Twitter/Facebook.
const STATIC_OG_IMAGE = 'https://omgksa.com/og-link-preview.png?v=5';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

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
        url: `https://omgksa.com/s/${slug}`,
        siteName: 'OMG!',
        locale: 'ar_SA',
        type: 'website',
        images: [
          {
            url: STATIC_OG_IMAGE,
            width: 1200,
            height: 630,
            type: 'image/png',
            alt: 'OMG Anonymous Chat',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [STATIC_OG_IMAGE],
      },
    };
  } catch {
    return {
      title: 'OMG! Anonymous Chat',
      description: 'ابعتلي رسالة مجهولة 👀',
      openGraph: {
        title: 'OMG! Anonymous Chat',
        description: 'ابعتلي رسالة مجهولة 👀',
        url: `https://omgksa.com/s/${slug}`,
        siteName: 'OMG!',
        type: 'website',
        images: [
          {
            url: STATIC_OG_IMAGE,
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
        images: [STATIC_OG_IMAGE],
      },
    };
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
