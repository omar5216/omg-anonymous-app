import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'OMG! ابعتلي رسالة مجهولة';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://omg-backend-v2-production.up.railway.app/api/v1';

export default async function SlugOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let displayName: string | null = null;
  try {
    const res = await fetch(`${API_BASE}/links/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const profile: { displayName?: string } = await res.json();
      displayName = profile.displayName ?? null;
    }
  } catch {
    // fall through to generic copy
  }

  const headline = displayName
    ? `ابعت رسالة مجهولة لـ ${displayName} 👀`
    : 'ابعتلي رسالة مجهولة 👀';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#FDF6EC',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.055) 1px,transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Purple blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(123,47,255,0.15)',
            filter: 'blur(60px)',
          }}
        />

        {/* Yellow blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255,230,68,0.3)',
            filter: 'blur(50px)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 72px',
            flex: 1,
            direction: 'rtl',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div
              style={{
                background: '#7B2FFF',
                border: '4px solid #0A0A0A',
                borderRadius: 16,
                padding: '10px 28px',
                boxShadow: '6px 6px 0 #0A0A0A',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 44, color: '#fff', letterSpacing: -2 }}>
                OMG!
              </span>
            </div>
            <div
              style={{
                background: '#FFE644',
                border: '3px solid #0A0A0A',
                borderRadius: 100,
                padding: '8px 24px',
                boxShadow: '4px 4px 0 #0A0A0A',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 22, color: '#0A0A0A', letterSpacing: 1 }}>
                ANONYMOUS CHAT
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontWeight: 900,
              fontSize: displayName ? 68 : 80,
              color: '#0A0A0A',
              lineHeight: 1.2,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              maxWidth: 900,
              textAlign: 'right',
            }}
          >
            {headline}
          </div>

          {/* Sub copy */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 'auto',
            }}
          >
            <div
              style={{
                background: '#FFE644',
                border: '3px solid #0A0A0A',
                borderRadius: 10,
                padding: '6px 20px',
                boxShadow: '4px 4px 0 #0A0A0A',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 30, color: '#0A0A0A' }}>
                هويتك محمية تماماً ✓
              </span>
            </div>
          </div>

          {/* Domain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
            <div
              style={{
                background: '#0A0A0A',
                borderRadius: 8,
                padding: '6px 16px',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 22, color: '#FFE644', letterSpacing: 1 }}>
                omgksa.com
              </span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18, color: '#6B6B6B' }}>
              🔒 المرسل مجهول دايماً
            </span>
          </div>
        </div>

        {/* Right side — lock card */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 72,
            width: 280,
            background: '#FFFCF5',
            border: '4px solid #0A0A0A',
            borderRadius: 24,
            boxShadow: '8px 8px 0 #0A0A0A',
            padding: '24px 28px',
            transform: 'rotate(-4deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 52 }}>🔒</span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#0A0A0A',
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            رسالة مجهولة
          </span>
          <div style={{ marginTop: 12, display: 'flex' }}>
            <div
              style={{
                background: '#7B2FFF',
                border: '2px solid #0A0A0A',
                borderRadius: 100,
                padding: '4px 14px',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 13, color: '#fff' }}>من: مجهول 👀</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
