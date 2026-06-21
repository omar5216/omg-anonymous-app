/**
 * OMGMessageShareCard — off-screen 1200×1350 poster rendered for PNG export.
 *
 * Rendered inside a hidden div; caller uses html-to-image to capture it.
 * All styles MUST be inline — html-to-image clones the DOM without Tailwind
 * CSS variables, so every color and layout value is hardcoded here.
 *
 * Privacy: aliasName is shown only as the anonymous alias (e.g. "Brave Eagle").
 * No real identity is ever passed here; the caller must enforce this.
 */
import React from 'react';

const C = {
  bg:     '#FDF6EC',
  card:   '#FFFCF5',
  ink:    '#0A0A0A',
  purple: '#7B2FFF',
  yellow: '#FFE644',
  pink:   '#FF6EB0',
  muted:  '#6B6B6B',
};

// Portrait 4:5 — works great on Instagram, Twitter, WhatsApp, and Stories
export const CARD_WIDTH  = 1080;
export const CARD_HEIGHT = 1350;

/** Adaptive font size — 5 tiers based on character count. */
function getMessageFontSize(len: number): number {
  if (len <= 70)  return 58;
  if (len <= 150) return 48;
  if (len <= 260) return 40;
  if (len <= 420) return 32;
  return 26;
}

/** Max message height in px — overflow is hidden beyond this. */
const MAX_MSG_HEIGHT = 720;

interface OMGMessageShareCardProps {
  message: string;
  /** Anonymous alias shown purely for context — NOT the sender's real identity */
  aliasName?: string;
  appUrl?: string;
}

export const OMGMessageShareCard = React.forwardRef<HTMLDivElement, OMGMessageShareCardProps>(
  function OMGMessageShareCard({ message, appUrl = 'omgksa.com' }, ref) {
    const fontSize  = getMessageFontSize(message.length);
    const lineHeight = 1.65;

    return (
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Cairo', 'Arial', sans-serif",
          direction: 'rtl',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Grid background ─────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }} />

        {/* ── Decorative colour blobs ──────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 380, height: 380, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(123,47,255,0.20) 0%, transparent 68%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 80, left: -80,
          width: 320, height: 320, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,110,176,0.18) 0%, transparent 68%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: 200,
          width: 260, height: 260, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,230,68,0.25) 0%, transparent 68%)',
        }} />

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '44px 60px 0px',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          {/* OMG! brand pill */}
          <div style={{
            background: C.purple, border: `5px solid ${C.ink}`,
            borderRadius: 100, padding: '12px 36px',
            boxShadow: `6px 6px 0 ${C.ink}`,
            display: 'flex', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900, fontSize: 42, color: '#fff', letterSpacing: '-1px',
            }}>OMG!</span>
          </div>

          {/* ANONYMOUS badge */}
          <div style={{
            background: C.yellow, border: `5px solid ${C.ink}`,
            borderRadius: 100, padding: '12px 28px',
            boxShadow: `6px 6px 0 ${C.ink}`,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900, fontSize: 24, color: C.ink, letterSpacing: '1px',
            }}>🔒 ANONYMOUS</span>
          </div>
        </div>

        {/* ── Sub-title ────────────────────────────────────────────────────── */}
        <div style={{
          padding: '18px 60px 0px',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Cairo', 'Arial', sans-serif",
            fontWeight: 900, fontSize: 30,
            color: C.muted, letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            رسالة مجهولة 👀
          </div>
        </div>

        {/* ── MESSAGE CARD ─────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, padding: '24px 52px',
          display: 'flex', alignItems: 'center',
          position: 'relative', zIndex: 1, minHeight: 0,
        }}>
          <div style={{
            width: '100%',
            background: C.card,
            border: `6px solid ${C.ink}`,
            borderRadius: 40,
            padding: '44px 52px',
            boxShadow: `12px 12px 0 ${C.ink}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative quote mark */}
            <div style={{
              position: 'absolute', top: 10, right: 44,
              fontFamily: 'Georgia, serif',
              fontSize: 160, color: C.purple, opacity: 0.08,
              lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>"</div>

            {/* Message text */}
            <div style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 800,
              fontSize: fontSize,
              color: C.ink,
              lineHeight: lineHeight,
              direction: 'rtl',
              textAlign: 'right',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              // Preserve composer line breaks
              whiteSpace: 'pre-wrap',
              // Hard cap — content beyond this is hidden rather than overflowing
              maxHeight: MAX_MSG_HEIGHT,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}>
              {message}
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: '0px 60px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', 'Arial', sans-serif",
            fontWeight: 700, fontSize: 26, color: C.muted,
          }}>
            {appUrl}
          </div>

          {/* Tilted sticker */}
          <div style={{
            background: C.yellow, border: `5px solid ${C.ink}`,
            borderRadius: 16, padding: '12px 24px',
            boxShadow: `5px 5px 0 ${C.ink}`,
            transform: 'rotate(-2.5deg)',
          }}>
            <span style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 900, fontSize: 28, color: C.ink,
            }}>بعت رسالتك! 🎯</span>
          </div>
        </div>
      </div>
    );
  },
);
