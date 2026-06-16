/**
 * OMGMessageShareCard — off-screen 1080×1350 poster rendered for PNG export.
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

interface OMGMessageShareCardProps {
  message: string;
  /** Optional anonymous alias (e.g. "Brave Eagle") */
  aliasName?: string;
  /** The app URL shown in footer */
  appUrl?: string;
}

export const OMGMessageShareCard = React.forwardRef<HTMLDivElement, OMGMessageShareCardProps>(
  function OMGMessageShareCard({ message, aliasName, appUrl = 'omg-anonymous-app.vercel.app' }, ref) {
    const isLong = message.length > 180;
    const fontSize = isLong ? 38 : message.length > 80 ? 48 : 58;

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
          background: COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Cairo', 'Arial', sans-serif",
          direction: 'rtl',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Square grid lines background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Top decorative blobs */}
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,110,176,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 64px 20px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Brand pill */}
          <div style={{
            background: COLORS.purple,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 100,
            padding: '14px 36px',
            boxShadow: `5px 5px 0 ${COLORS.ink}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 38,
              color: '#fff',
              letterSpacing: '-1px',
            }}>OMG!</span>
          </div>

          {/* Yellow badge */}
          <div style={{
            background: COLORS.yellow,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 100,
            padding: '14px 30px',
            boxShadow: `5px 5px 0 ${COLORS.ink}`,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 24,
              color: COLORS.ink,
              letterSpacing: '1px',
            }}>ANONYMOUS</span>
          </div>
        </div>

        {/* ── TITLE BAND ── */}
        <div style={{
          padding: '0 64px 16px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Cairo', 'Arial', sans-serif",
            fontWeight: 900,
            fontSize: 36,
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
              fontSize: 28,
              color: COLORS.purple,
              marginTop: 8,
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
        }}>
          <div style={{
            width: '100%',
            background: COLORS.card,
            border: `5px solid ${COLORS.ink}`,
            borderRadius: 40,
            padding: '40px 48px',
            boxShadow: `10px 10px 0 ${COLORS.ink}`,
            position: 'relative',
          }}>
            {/* Quote marks decoration */}
            <div style={{
              position: 'absolute',
              top: 24,
              right: 44,
              fontFamily: 'Georgia, serif',
              fontSize: 120,
              color: COLORS.purple,
              opacity: 0.12,
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
              lineHeight: 1.55,
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
          padding: '24px 64px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', 'Arial', sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: COLORS.muted,
          }}>
            {appUrl}
          </div>

          {/* OMG sticker */}
          <div style={{
            background: COLORS.yellow,
            border: `4px solid ${COLORS.ink}`,
            borderRadius: 16,
            padding: '12px 24px',
            boxShadow: `4px 4px 0 ${COLORS.ink}`,
            transform: 'rotate(-2deg)',
          }}>
            <span style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 28,
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
