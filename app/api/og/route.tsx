import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  let displayName: string | null = null;
  if (slug) {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        'https://omg-backend-v2-production.up.railway.app/api/v1';
      const res = await fetch(`${API_BASE}/links/${slug}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const profile: { displayName?: string } = await res.json();
        displayName = profile.displayName ?? null;
      }
    } catch {
      // fall through
    }
  }

  const subline = displayName ? `Send to ${displayName}` : 'Send an anonymous message';

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
            display: 'flex',
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
            display: 'flex',
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
            background: 'rgba(255,230,68,0.35)',
            display: 'flex',
          }}
        />

        {/* Main layout */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 80px',
            flex: 1,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
            {/* OMG pill */}
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
              <span style={{ fontWeight: 900, fontSize: 48, color: '#fff', letterSpacing: -2 }}>
                OMG!
              </span>
            </div>

            {/* Badge */}
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

          {/* Headline */}
          <div
            style={{
              fontWeight: 900,
              fontSize: 78,
              color: '#0A0A0A',
              lineHeight: 1.1,
              letterSpacing: -3,
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
              maxWidth: 700,
            }}
          >
            Anonymous messages.
          </div>

          {/* Subline */}
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
                padding: '8px 22px',
                boxShadow: '4px 4px 0 #0A0A0A',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 32, color: '#0A0A0A' }}>
                {subline} 👀
              </span>
            </div>
          </div>

          {/* Domain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
            <div
              style={{
                background: '#0A0A0A',
                borderRadius: 8,
                padding: '7px 18px',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 24, color: '#FFE644', letterSpacing: 1 }}>
                omgksa.com
              </span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18, color: '#6B6B6B' }}>
              🔒 Sender stays anonymous, always.
            </span>
          </div>
        </div>

        {/* Right side — lock sticker */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 80,
            width: 300,
            background: '#FFFCF5',
            border: '4px solid #0A0A0A',
            borderRadius: 24,
            boxShadow: '8px 8px 0 #0A0A0A',
            padding: '28px 32px',
            transform: 'rotate(3deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 60 }}>🔒</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0A0A0A',
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            Anonymous message
          </span>
          <div style={{ marginTop: 14, display: 'flex' }}>
            <div
              style={{
                background: '#7B2FFF',
                border: '2px solid #0A0A0A',
                borderRadius: 100,
                padding: '5px 16px',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 14, color: '#fff' }}>From: Unknown 👀</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
