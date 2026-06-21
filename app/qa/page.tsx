'use client';

/**
 * /qa — Visual QA page for OG preview + Message Share Cards
 * Tests all variants and messages. Dev-only.
 */

import { OMGMessageShareCard } from '@/components/omg/OMGMessageShareCard';

const SHORT_AR  = 'افتح المحادثة ازاي يا عمر';
const MEDIUM_AR = 'بصراحة التطبيق فكرته حلوة جدًا بس محتاج يبقى أسرع شوية في فتح الشات';
// >160 chars to trigger long variant
const LONG_AR   = 'أنا عايز أقولك إن الفكرة جامدة جدًا وممكن تنتشر بسرعة لو الشير كارد شكله كان روش وواضح والناس تحس إنها عايزة تبعته للستوري فورًا، وده بيخلي الموضوع كله أجمد بكتير.';
const ENGLISH   = 'This app is actually fun, I wanted to say that anonymously';

const OG_SLUG = 'test-user';
const LONG_SLUG = 'omglander_super_long_username_test';

const appUrl = (slug: string) => `omgksa.com/s/${slug}`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 80 }}>
      <h2 style={{
        fontFamily: 'sans-serif', fontSize: 18, fontWeight: 900,
        color: '#111', marginBottom: 16, padding: '8px 16px',
        background: '#FDCA3A', border: '3px solid #111',
        borderRadius: 8, display: 'inline-block',
        boxShadow: '4px 4px 0 #111',
      }}>{title}</h2>
      {children}
    </div>
  );
}

function ScaledCard({ children, canvasW, canvasH, scale = 0.4, label }: {
  children: React.ReactNode;
  canvasW: number;
  canvasH: number;
  scale?: number;
  label: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        fontFamily: 'monospace', fontSize: 12, color: '#555',
        marginBottom: 8,
      }}>{label} — {canvasW}×{canvasH} (shown at {Math.round(scale * 100)}%)</div>
      <div style={{
        width: canvasW * scale,
        height: canvasH * scale,
        overflow: 'hidden',
        border: '2px solid #ddd',
        borderRadius: 8,
        position: 'relative',
      }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: canvasW,
          height: canvasH,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function OGImagePreview({ slug }: { slug: string }) {
  const url = `/api/og?slug=${encodeURIComponent(slug)}`;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#555', marginBottom: 8 }}>
        OG Image — /api/og?slug={slug} — 1200×630
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`OG for ${slug}`}
        style={{
          width: 600, height: 315,
          border: '2px solid #ddd', borderRadius: 8,
          display: 'block',
        }}
      />
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', marginTop: 6 }}>
        Rendered at 600×315 (50%)
      </div>
    </div>
  );
}

export default function QAPage() {
  return (
    <div style={{
      background: '#F0EDE8',
      minHeight: '100vh',
      padding: '48px 40px',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{
        fontSize: 28, fontWeight: 900, color: '#111',
        marginBottom: 8,
      }}>OMG! Visual QA</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 60 }}>
        All share cards + OG images at scaled-down preview. Check Arabic rendering, proportions, colors.
      </p>

      {/* ── OG PREVIEW IMAGES ──────────────────────────────────────────────── */}
      <Section title="01 · OG Preview — /api/og (1200×630)">
        <OGImagePreview slug={OG_SLUG} />
        <OGImagePreview slug={LONG_SLUG} />
      </Section>

      {/* ── SHORT CARD ─────────────────────────────────────────────────────── */}
      <Section title="02 · Short Arabic Message — 1200×800">
        <ScaledCard canvasW={1200} canvasH={800} scale={0.42} label="Short · Arabic">
          <OMGMessageShareCard
            message={SHORT_AR}
            appUrl={appUrl('omar')}
            variant="short"
          />
        </ScaledCard>
      </Section>

      {/* ── MEDIUM CARD ────────────────────────────────────────────────────── */}
      <Section title="03 · Medium Arabic Message — 1200×1000">
        <ScaledCard canvasW={1200} canvasH={1000} scale={0.4} label="Medium · Arabic">
          <OMGMessageShareCard
            message={MEDIUM_AR}
            appUrl={appUrl('omar')}
            variant="medium"
          />
        </ScaledCard>
      </Section>

      {/* ── LONG CARD ──────────────────────────────────────────────────────── */}
      <Section title="04 · Long Arabic Message — 1080×1350">
        <ScaledCard canvasW={1080} canvasH={1350} scale={0.38} label="Long · Arabic">
          <OMGMessageShareCard
            message={LONG_AR}
            appUrl={appUrl('omar')}
            variant="long"
          />
        </ScaledCard>
      </Section>

      {/* ── ENGLISH CARD ───────────────────────────────────────────────────── */}
      <Section title="05 · English Message — Short variant">
        <ScaledCard canvasW={1200} canvasH={800} scale={0.42} label="Short · English (auto-LTR)">
          <OMGMessageShareCard
            message={ENGLISH}
            appUrl={appUrl('omar')}
            variant="short"
          />
        </ScaledCard>
      </Section>

      {/* ── LONG USERNAME ──────────────────────────────────────────────────── */}
      <Section title="06 · Long Username — short card + long slug appUrl">
        <ScaledCard canvasW={1200} canvasH={800} scale={0.42} label="Long slug footer test">
          <OMGMessageShareCard
            message={SHORT_AR}
            appUrl={`omgksa.com/s/${LONG_SLUG}`}
            variant="short"
          />
        </ScaledCard>
      </Section>

      {/* ── AUTO-VARIANT (no explicit variant prop) ─────────────────────────── */}
      <Section title="07 · Auto-Variant Detection (no explicit variant prop)">
        <ScaledCard canvasW={1200} canvasH={800} scale={0.42} label={`Auto: short (${SHORT_AR.length} chars)`}>
          <OMGMessageShareCard message={SHORT_AR} appUrl={appUrl('omar')} />
        </ScaledCard>
        <ScaledCard canvasW={1200} canvasH={1000} scale={0.4} label={`Auto: medium (${MEDIUM_AR.length} chars)`}>
          <OMGMessageShareCard message={MEDIUM_AR} appUrl={appUrl('omar')} />
        </ScaledCard>
        <ScaledCard canvasW={1080} canvasH={1350} scale={0.38} label={`Auto: long (${LONG_AR.length} chars)`}>
          <OMGMessageShareCard message={LONG_AR} appUrl={appUrl('omar')} />
        </ScaledCard>
      </Section>

    </div>
  );
}
