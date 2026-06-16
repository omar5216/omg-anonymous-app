/**
 * OMGMessageShareCard — off-screen 1200×876 poster rendered for PNG export.
 *
 * Rendered inside a hidden div; caller uses html-to-image to capture it.
 * All styles are inline (no Tailwind classes) because html-to-image clones
 * the DOM without loading external CSS variables.
 */
import React from 'react';

const COLORS = {
  bg:     '#FDF6EC',
  card:   '#FFFCF5',
  ink:    '#0A0A0A',
  purple: '#7B2FFF',
  yellow: '#FFE644',
  pink:   '#FF6EB0',
  muted:  '#6B6B6B',
};

export const CARD_WIDTH  = 1200;
export const CARD_HEIGHT = 876;

interface OMGMessageShareCardProps {
  message: string;
  /** Optional anonymous alias (e.g. "Brave Eagle") */
  aliasName?: string;
  /** The app URL shown in footer */
  appUrl?: string;
}

export const OMGMessageShareCard = React.forwardRef<HTMLDivElement, OMGMessageShareCardProps>(
  function OMGMessageShareCard({ message, aliasName, appUrl = 'omgksa.com' }, ref) {
    const fontSize = message.length > 180 ? 34 : message.length > 80 ? 42 : 50;

    return (
      <div
        ref={ref}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Cairo', 'Arial', sans-serif",
          direction: 'rtl',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,110,176,0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 64px 14px',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}>
          {/* Brand pill */}
          <div style={{
            background: COLORS.purple,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 100,
            padding: '10px 32px',
            boxShadow: `5px 5px 0 ${COLORS.ink}`,
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 34,
              color: '#fff',
              letterSpacing: '-1px',
            }}>OMG!</span>
          </div>

          {/* Yellow badge */}
          <div style={{
            background: COLORS.yellow,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 100,
            padding: '10px 26px',
            boxShadow: `5px 5px 0 ${COLORS.ink}`,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 20,
              color: COLORS.ink,
              letterSpacing: '1px',
            }}>ANONYMOUS</span>
          </div>
        </div>

        {/* ── TITLE BAND ── */}
        <div style={{
          padding: '0 64px 10px',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Cairo', 'Arial', sans-serif",
            fontWeight: 900,
            fontSize: 28,
            color: COLORS.muted,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            رسالة مجهولة 👀
          </div>
          {aliasName && (
            <div style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: COLORS.purple,
              marginTop: 4,
            }}>
              من: {aliasName}
            </div>
          )}
        </div>

        {/* ── MESSAGE CARD ── */}
        <div style={{
          flex: 1,
          padding: '0 52px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          minHeight: 0,
        }}>
          <div style={{
            width: '100%',
            background: COLORS.card,
            border: `5px solid ${COLORS.ink}`,
            borderRadius: 32,
            padding: '36px 48px',
            boxShadow: `10px 10px 0 ${COLORS.ink}`,
            position: 'relative',
          }}>
            {/* Quote decoration */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 40,
              fontFamily: 'Georgia, serif',
              fontSize: 100,
              color: COLORS.purple,
              opacity: 0.10,
              lineHeight: 1,
              userSelect: 'none',
            }}>
              "
            </div>

            <div style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 800,
              fontSize: fontSize,
              color: COLORS.ink,
              lineHeight: 1.6,
              direction: 'rtl',
              textAlign: 'right',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              position: 'relative',
              zIndex: 1,
            }}>
              {message}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: '14px 64px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', 'Arial', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: COLORS.muted,
          }}>
            {appUrl}
          </div>

          {/* Sticker */}
          <div style={{
            background: COLORS.yellow,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 14,
            padding: '10px 20px',
            boxShadow: `4px 4px 0 ${COLORS.ink}`,
            transform: 'rotate(-2deg)',
          }}>
            <span style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: COLORS.ink,
            }}>
              🔒 بعت رسالتك!
            </span>
          </div>
        </div>
      </div>
    );
  }
);
