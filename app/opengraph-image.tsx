import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'OMG! Anonymous Chat — استقبل رسائل مجهولة وافتح شات لو حبيت';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
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
            padding: '64px 80px',
            flex: 1,
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
            {/* OMG Logo pill */}
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
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 44,
                  color: '#fff',
                  letterSpacing: -2,
                }}
              >
                OMG!
              </span>
            </div>

            {/* Anonymous badge */}
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
              fontSize: 86,
              color: '#0A0A0A',
              lineHeight: 1.1,
              letterSpacing: -3,
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
              maxWidth: 700,
            }}
          >
            استقبل رسائل مجهولة
          </div>

          {/* Sub headline with yellow highlight */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 40,
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
              <span style={{ fontWeight: 900, fontSize: 36, color: '#0A0A0A' }}>
                وافتح شات لو حبيت
              </span>
            </div>
          </div>

          {/* Domain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
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

        {/* Right side comic card */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            width: 340,
            background: '#FFFCF5',
            border: '4px solid #0A0A0A',
            borderRadius: 24,
            boxShadow: '8px 8px 0 #0A0A0A',
            padding: '28px 32px',
            transform: 'rotate(-3deg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', marginBottom: 10, letterSpacing: 1 }}>
            رسالة مجهولة 👀
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0A0A0A', lineHeight: 1.5 }}>
            "يا صاحبي انت من أجمل الناس في حياتي 🥹"
          </span>
          <div style={{ marginTop: 16, display: 'flex' }}>
            <div
              style={{
                background: '#FFE644',
                border: '2px solid #0A0A0A',
                borderRadius: 100,
                padding: '4px 14px',
                display: 'flex',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 13, color: '#0A0A0A' }}>من: مجهول 🔒</span>
            </div>
          </div>
        </div>

        {/* OMG! sticker on card */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            background: '#7B2FFF',
            border: '3px solid #0A0A0A',
            borderRadius: 12,
            padding: '8px 16px',
            boxShadow: '5px 5px 0 #0A0A0A',
            transform: 'rotate(-8deg)',
            display: 'flex',
          }}
        >
          <span style={{ fontWeight: 900, fontSize: 26, color: '#fff', letterSpacing: -1 }}>OMG!</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
