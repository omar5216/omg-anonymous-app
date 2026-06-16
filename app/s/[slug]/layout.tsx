import type { Metadata } from 'next';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://omg-backend-v2-production.up.railway.app/api/v1';

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
            url: `https://omgksa.com/s/${slug}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `OMG! Anonymous Chat — ابعت رسالة مجهولة لـ ${name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`https://omgksa.com/s/${slug}/opengraph-image`],
      },
    };
  } catch {
    return {
      title: 'OMG! Anonymous Chat',
      description: 'ابعت رسالة مجهولة وافتح شات لو حبيت',
      openGraph: {
        title: 'OMG! Anonymous Chat',
        description: 'ابعت رسالة مجهولة وافتح شات لو حبيت',
        images: [{ url: `https://omgksa.com/s/${slug}/opengraph-image`, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        images: [`https://omgksa.com/s/${slug}/opengraph-image`],
      },
    };
  }
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
