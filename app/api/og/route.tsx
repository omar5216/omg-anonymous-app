import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

const C = {
  cream:  '#FAF7F2',
  purple: '#7B35F5',
  yellow: '#FDCA3A',
  ink:    '#111111',
  white:  '#FFFFFF',
  muted:  '#555555',
  faint:  '#9CA3AF',
};

function loadFonts(): { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: 'normal' }[] {
  try {
    const buf = readFileSync(join(process.cwd(), 'public', 'fonts', 'Cairo-Black.ttf'));
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return [{ name: 'Cairo', data: ab, weight: 900, style: 'normal' }];
  } catch {
    return [];
  }
}

const FONTS = loadFonts();

/*
 * Satori Arabic RTL — definitive fix:
 *
 * Satori splits any string containing spaces into separate flex items, one per
 * word. Setting direction:rtl on the container reverses the main axis AND adds
 * stretch-justification gaps between the word-items, producing scattered text.
 * Using <span> does not help — Satori still word-splits span children.
 *
 * Working approach: split the phrase into individual single-word <span>s
 * yourself (no spaces inside spans), then use flexDirection:'row-reverse' on
 * the parent so Satori lays them out right-to-left without the justify glitch.
 * Gap between words is controlled via the `gap` style, not Satori's bidi.
 *
 * Each Arabic word is a single connected text run with no spaces, so Satori's
 * HarfBuzz shaper can shape the glyphs correctly.
 */

/**
 * Render an Arabic phrase as a RTL flex row.
 *
 * Satori splits space-separated Arabic strings into flex items and mangles
 * their order. The fix: one <span> per word (no spaces), listed in VISUAL
 * LEFT-TO-RIGHT order (i.e. reversed from Arabic reading order). Normal
 * flex `row` places them left→right on screen; an Arabic reader reads them
 * right→left and gets the correct sentence.
 *
 * Pass words in Arabic reading order (right-to-left); this helper reverses
 * them internally before rendering.
 */
function ArabicLine({
  words,
  fontSize,
  color,
  fontWeight = 900,
  justify = 'center',
}: {
  words: string[];
  fontSize: number;
  color: string;
  fontWeight?: number;
  gap?: number;
  justify?: string;
}) {
  // Single <span> with the full Arabic phrase as one text run.
  // Satori's HarfBuzz shaper handles RTL ordering and glyph shaping for a
  // single text node without the flex-item-splitting / bidi-reversal issues
  // that occur when words are in separate spans.
  const text = words.join(' ');
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justify as React.CSSProperties['justifyContent'],
        width: '100%',
      }}
    >
      <span style={{ fontWeight, fontSize, color, lineHeight: 1.3, direction: 'rtl' }}>
        {text}
      </span>
    </div>
  );
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? '';

  if (slug) {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        'https://omg-backend-v2-production.up.railway.app/api/v1';
      await fetch(`${API_BASE}/links/${slug}`, { signal: AbortSignal.timeout(3000) });
    } catch { /* fall through */ }
  }

  const handle      = slug ? `@${slug}` : '@username';
  const footerUrl   = slug ? `omgksa.com/s/${slug}` : 'omgksa.com';
  const shortHandle = handle.length > 20   ? handle.slice(0, 19)    + '…' : handle;
  const shortUrl    = footerUrl.length > 34 ? footerUrl.slice(0, 33) + '…' : footerUrl;

  const ff = FONTS.length ? 'Cairo' : 'Arial, sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: C.cream,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: ff,
        }}
      >
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(17,17,17,0.12) 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
          display: 'flex',
        }} />

        {/* Blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,53,245,0.10) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(253,202,58,0.16) 0%, transparent 70%)', display: 'flex' }} />

        {/* ── Main white card ────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: 44, left: 56, right: 56, bottom: 44,
          background: C.white,
          border: `3px solid ${C.ink}`,
          borderRadius: 44,
          boxShadow: `8px 8px 0 ${C.ink}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '36px 48px 32px',
          overflow: 'hidden',
        }}>

          {/* Top row: OMG! left | مجهول right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            {/* OMG! — Latin, no RTL issue */}
            <div style={{ background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 100, padding: '8px 26px', boxShadow: `4px 4px 0 ${C.ink}`, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 36, color: C.white, letterSpacing: '-1px' }}>OMG!</span>
            </div>
            {/* مجهول 🔒 — visual order: 🔒 left, مجهول right */}
            <div style={{
              background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: 100,
              padding: '8px 22px', boxShadow: `4px 4px 0 ${C.ink}`, transform: 'rotate(2.5deg)',
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 22 }}>{'🔒'}</span>
              <span style={{ fontWeight: 900, fontSize: 26, color: C.ink }}>{'anonymous'}</span>
            </div>
          </div>

          {/* ── Headline ──────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <span style={{ fontWeight: 900, fontSize: 68, color: C.ink, lineHeight: 1.2, textAlign: 'center' }}>
              send me an anonymous message
            </span>
          </div>

          {/* ── Subtitle ──────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18, marginTop: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 36, color: C.muted, lineHeight: 1.3, textAlign: 'center' }}>
              {"no one will know it's you 👀"}
            </span>
          </div>

          {/* ── Handle badge — centered ────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'auto' }}>
            <div style={{
              background: 'rgba(123,53,245,0.08)', border: `2.5px solid ${C.purple}`,
              borderRadius: 100, padding: '8px 22px', display: 'flex', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: 24, color: C.purple, direction: 'ltr' }}>
                {shortHandle}
              </span>
            </div>
          </div>

          {/* ── Bottom: CTA left | URL right ─────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            {/* CTA pill — visual order: 🚀 left, وابعت middle, اضغط right */}
            <div style={{
              background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 100,
              padding: '12px 32px', boxShadow: `5px 5px 0 ${C.ink}`,
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 26 }}>{'🚀'}</span>
              <span style={{ fontWeight: 900, fontSize: 28, color: C.white }}>{'tap & send'}</span>
            </div>
            {/* URL */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 22, color: C.faint, direction: 'ltr' }}>
                {shortUrl}
              </span>
            </div>
          </div>

        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: FONTS },
  );
}
