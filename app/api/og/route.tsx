import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Node.js runtime — lets us use fs to load fonts cleanly
export const runtime = 'nodejs';

// OMG visual identity
const C = {
  cream:  '#FAF7F2',
  purple: '#7B35F5',
  yellow: '#FDCA3A',
  pink:   '#FF4D9E',
  ink:    '#111111',
  white:  '#FFFFFF',
  muted:  '#555555',
};

// Load fonts once at module level (cold-start cache)
function loadFonts(): { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: 'normal' }[] {
  try {
    const buf = readFileSync(
      join(process.cwd(), 'public', 'fonts', 'Cairo-Black.ttf'),
    );
    // Node Buffers share a large backing ArrayBuffer — slice to get only our bytes
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return [{ name: 'Cairo', data: arrayBuffer, weight: 900, style: 'normal' }];
  } catch {
    return [];
  }
}

const FONTS = loadFonts();

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? '';

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
        const p: { displayName?: string } = await res.json();
        displayName = p.displayName ?? null;
      }
    } catch { /* fall through */ }
  }

  const handle      = slug ? `@${slug}` : '@username';
  const footerUrl   = slug ? `omgksa.com/s/${slug}` : 'omgksa.com';
  const shortHandle = handle.length > 22 ? handle.slice(0, 21) + '…' : handle;
  void displayName;

  const fontFamily = FONTS.length ? 'Cairo' : 'Arial, sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: C.cream,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: fontFamily,
        }}
      >
        {/* ── Dot-grid ──────────────────────────────────── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(17,17,17,0.12) 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
            display: 'flex',
          }}
        />

        {/* ── Ghost bubbles ─────────────────────────────── */}
        <div style={{ position: 'absolute', top: 40, left: 60, width: 180, height: 64, borderRadius: 32, background: 'rgba(123,53,245,0.07)', border: '2px solid rgba(123,53,245,0.12)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 80, right: 50, width: 140, height: 52, borderRadius: 26, background: 'rgba(253,202,58,0.15)', border: '2px solid rgba(253,202,58,0.2)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 200, left: 28, width: 100, height: 40, borderRadius: 20, background: 'rgba(255,77,158,0.08)', border: '2px solid rgba(255,77,158,0.13)', display: 'flex' }} />

        {/* ── Main white card ───────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 48, left: 64, right: 64, bottom: 48,
            background: C.white,
            border: `3px solid ${C.ink}`,
            borderRadius: 44,
            boxShadow: `8px 8px 0 ${C.ink}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 52px',
            overflow: 'hidden',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 100, padding: '10px 28px', boxShadow: `5px 5px 0 ${C.ink}`, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 38, color: C.white, letterSpacing: '-1px' }}>OMG!</span>
            </div>
            <div style={{ background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: 100, padding: '10px 24px', boxShadow: `5px 5px 0 ${C.ink}`, transform: 'rotate(2.5deg)', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 28, color: C.ink }}>{'مجهول 🔒'}</span>
            </div>
          </div>

          {/* Arabic headline */}
          <div style={{ fontWeight: 900, fontSize: 70, color: C.ink, lineHeight: 1.2, textAlign: 'right', direction: 'rtl', marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
            {'ابعتلي رسالة مجهولة'}
          </div>

          {/* Subtitle */}
          <div style={{ fontWeight: 900, fontSize: 32, color: C.muted, textAlign: 'right', direction: 'rtl', marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
            {'ومحدش هيعرف إنك أنت 👀'}
          </div>

          {/* CTA + handle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 }}>
            <div style={{ background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 100, padding: '14px 36px', boxShadow: `5px 5px 0 ${C.ink}`, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 30, color: C.white }}>{'اضغط وابعت 🚀'}</span>
            </div>
            <div style={{ background: 'rgba(123,53,245,0.08)', border: `2.5px solid ${C.purple}`, borderRadius: 100, padding: '10px 26px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 26, color: C.purple, direction: 'ltr' }}>{shortHandle}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 16, fontWeight: 600, fontSize: 18, color: '#9CA3AF', direction: 'ltr', display: 'flex' }}>
            {footerUrl}
          </div>
        </div>

        {/* ── Pink sticker ──────────────────────────────── */}
        <div style={{ position: 'absolute', bottom: 28, left: 28, background: C.pink, border: `3px solid ${C.ink}`, borderRadius: 20, padding: '9px 18px', boxShadow: `5px 5px 0 ${C.ink}`, transform: 'rotate(-3deg)', display: 'flex' }}>
          <span style={{ fontWeight: 900, fontSize: 20, color: C.white }}>{'بعت رسالتك! 🎯'}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: FONTS,
    }
  );
}
