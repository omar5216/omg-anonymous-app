/**
 * OMGMessageShareCard — dynamic proportional layout.
 *
 * The message card position and padding are computed from the actual message
 * length / estimated line count so the composition tightens as text grows.
 * No fixed per-variant padding: everything is derived from content.
 */
import React from 'react';

// ── Identity ─────────────────────────────────────────────────────────────────
const C = {
  cream:  '#FAF7F2',
  purple: '#7B35F5',
  yellow: '#FDCA3A',
  ink:    '#111111',
  white:  '#FFFFFF',
  muted:  '#888888',
};

const DOT_GRID =
  `radial-gradient(circle, rgba(17,17,17,0.11) 1.5px, transparent 1.5px)`;

// ── Variants ─────────────────────────────────────────────────────────────────
export type CardVariant = 'short' | 'medium' | 'long';

export function getCardVariant(message: string): CardVariant {
  const len = message.length;
  if (len <= 60)  return 'short';
  if (len <= 160) return 'medium';
  return 'long';
}

// Static per-variant values that never change with message length.
const STATIC = {
  short: {
    canvasW: 1200, canvasH: 800,
    cardTilt: -1.5,
    cardBorderRadius: 52,
    labelFontSize: 28,
    yellowFontSize: 28,
    footerFontSize: 22,
    stickerTop: 40, stickerLeft: 44, stickerFontSize: 28,
  },
  medium: {
    canvasW: 1200, canvasH: 1000,
    cardTilt: 1.0,
    cardBorderRadius: 52,
    labelFontSize: 26,
    yellowFontSize: 26,
    footerFontSize: 22,
    stickerTop: 44, stickerLeft: 44, stickerFontSize: 28,
  },
  long: {
    canvasW: 1080, canvasH: 1350,
    cardTilt: -0.8,
    cardBorderRadius: 52,
    labelFontSize: 24,
    yellowFontSize: 26,
    footerFontSize: 22,
    stickerTop: 44, stickerLeft: 40, stickerFontSize: 26,
  },
};

export function getCardDimensions(variant: CardVariant): { width: number; height: number } {
  return { width: STATIC[variant].canvasW, height: STATIC[variant].canvasH };
}

// ── Dynamic layout engine ─────────────────────────────────────────────────────
interface CardLayout {
  cardWidth: number;
  cardPaddingTop: number;
  cardPaddingX: number;
  cardPaddingBottom: number;
  messageFontSize: number;
  topMargin: number;
  footerGap: number;
}

function getMessageCardLayout({
  messageText,
  variant,
  canvasWidth,
  canvasHeight,
}: {
  messageText: string;
  variant: CardVariant;
  canvasWidth: number;
  canvasHeight: number;
}): CardLayout {
  const isArabic = /[؀-ۿ]/.test(messageText);

  // 1. Estimate line count
  const charsPerLine =
    variant === 'short'
      ? (isArabic ? 28 : 38)
      : variant === 'medium'
        ? (isArabic ? 36 : 48)
        : (isArabic ? 42 : 56);

  const estimatedLines = Math.ceil(messageText.length / charsPerLine);
  const lines = Math.max(1, Math.min(estimatedLines, 8));

  // 2. Adaptive font size — shrinks slightly as line count grows
  const baseFont =
    variant === 'short' ? 62 :
    variant === 'medium' ? 50 :
    42;
  const fontFloor =
    variant === 'short' ? 40 :
    variant === 'medium' ? 34 :
    28;
  // non-Arabic short messages: cap to avoid overly huge single word
  const baseFontCapped = (!isArabic && variant === 'short') ? Math.min(baseFont, 44) : baseFont;
  const messageFontSize = Math.max(
    fontFloor,
    lines <= 2 ? baseFontCapped :
    lines <= 4 ? baseFontCapped - 6 :
    baseFontCapped - 12,
  );

  // 3. Vertical card padding (fixed per variant, not per message)
  const paddingTop    = variant === 'short' ? 64 : variant === 'medium' ? 60 : 72;
  const paddingBottom = variant === 'short' ? 84 : variant === 'medium' ? 80 : 96;
  const paddingX      = 56;

  // 4. Estimate card height so we can compute topMargin
  const labelArea    = 44; // label line-height + gap
  const messageArea  = messageFontSize * 1.5 * lines;
  const estCardH     = paddingTop + labelArea + messageArea + paddingBottom;
  // long gets more vertical room so large messages don't feel cramped
  const maxCardH     = canvasHeight * (variant === 'long' ? 0.76 : 0.70);
  const clampedCardH = Math.min(estCardH, maxCardH);

  // 5. topMargin: shrinks as card grows so the composition stays tight.
  //    medium uses a higher coefficient (0.50) to distribute space more evenly
  //    above and below the card — short and long stay at 0.28 (anchored high).
  const remaining   = canvasHeight - clampedCardH;
  const belowCard   = 40; // footer + gap below card
  const usable      = remaining - belowCard;
  // medium: 0.50 → even vertical distribution
  // long:   0.42 → card sits slightly above center, not top-anchored
  // short:  0.28 → punchy, anchored high
  const coefficient = variant === 'medium' ? 0.50 : variant === 'long' ? 0.42 : 0.28;
  const minTopM     = variant === 'long' ? 80  : 100;
  const maxTopM     = variant === 'medium' ? 340 : variant === 'long' ? 380 : 200;
  const topMargin   = Math.max(minTopM, Math.min(maxTopM, usable * coefficient));

  // 6. Card width — generous to keep lines from wrapping too early
  const cardWidth =
    variant === 'short' ? Math.round(canvasWidth * 0.88) :
    variant === 'medium' ? Math.round(canvasWidth * 0.92) :
    Math.round(canvasWidth * 0.90);

  return {
    cardWidth,
    cardPaddingTop: paddingTop,
    cardPaddingX: paddingX,
    cardPaddingBottom: paddingBottom,
    messageFontSize,
    topMargin,
    footerGap: 18,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface OMGMessageShareCardProps {
  message: string;
  appUrl?: string;
  variant?: CardVariant;
}

export const OMGMessageShareCard = React.forwardRef<HTMLDivElement, OMGMessageShareCardProps>(
  function OMGMessageShareCard({ message, appUrl = 'omgksa.com', variant }, ref) {
    const rv      = variant ?? getCardVariant(message);
    const S       = STATIC[rv];
    const isArab  = /[؀-ۿ]/.test(message);
    const layout  = getMessageCardLayout({
      messageText:  message,
      variant:      rv,
      canvasWidth:  S.canvasW,
      canvasHeight: S.canvasH,
    });
    const footerText = appUrl.length > 44 ? appUrl.slice(0, 43) + '…' : appUrl;

    return (
      <div
        ref={ref}
        style={{
          width:      S.canvasW,
          height:     S.canvasH,
          background: C.cream,
          position:   'relative',
          overflow:   'hidden',
          fontFamily: "'Cairo', 'Arial', sans-serif",
        }}
      >
        {/* ── Dot grid ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: DOT_GRID,
          backgroundSize: '28px 28px',
          zIndex: 0,
        }} />

        {/* ── Soft blobs ───────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,53,245,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253,202,58,0.14) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── OMG! sticker — top-left ───────────────────────── */}
        <div style={{
          position:  'absolute',
          top:       S.stickerTop,
          left:      S.stickerLeft,
          background:  C.purple,
          border:      `3px solid ${C.ink}`,
          borderRadius: 100,
          padding:     '8px 22px',
          boxShadow:   `4px 4px 0 ${C.ink}`,
          transform:   'rotate(-5deg)',
          zIndex:      20,
          display:     'flex',
          alignItems:  'center',
        }}>
          <span style={{
            fontWeight: 900,
            fontSize:   S.stickerFontSize,
            color:      C.white,
            letterSpacing: '-0.5px',
          }}>OMG!</span>
        </div>

        {/* ── Content block: card + footer, positioned from topMargin ── */}
        <div style={{
          position:  'absolute',
          top:       layout.topMargin,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     layout.cardWidth,
          display:   'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap:       layout.footerGap,
          zIndex:    10,
        }}>
          {/* Message card — auto-height from content */}
          <div style={{
            width:        '100%',
            background:   C.white,
            border:       `3px solid ${C.ink}`,
            borderRadius: S.cardBorderRadius,
            boxShadow:    `8px 8px 0 ${C.ink}`,
            transform:    `rotate(${S.cardTilt}deg)`,
            paddingTop:   layout.cardPaddingTop,
            paddingLeft:  layout.cardPaddingX,
            paddingRight: layout.cardPaddingX,
            paddingBottom: layout.cardPaddingBottom,
            position:     'relative',
            overflow:     'visible',
          }}>
            {/* Label */}
            <div style={{
              fontWeight: 700,
              fontSize:   S.labelFontSize,
              color:      C.purple,
              direction:  'rtl',
              textAlign:  'right',
              marginBottom: 16,
              width: '100%',
            }}>
              رسالة مجهولة 👀
            </div>

            {/* Message — the hero */}
            <div style={{
              fontWeight:    900,
              fontSize:      layout.messageFontSize,
              color:         C.ink,
              direction:     isArab ? 'rtl' : 'ltr',
              textAlign:     isArab ? 'right' : 'left',
              lineHeight:    1.5,
              wordBreak:     'break-word',
              overflowWrap:  'break-word',
              width:         '100%',
            }}>
              {message}
            </div>

            {/* Yellow sticker — overlaps bottom edge */}
            <div style={{
              position:   'absolute',
              bottom:     -18,
              left:       isArab ? 'auto' : 32,
              right:      isArab ? 32 : 'auto',
              background: C.yellow,
              border:     `3px solid ${C.ink}`,
              borderRadius: 100,
              padding:    '7px 20px',
              boxShadow:  `4px 4px 0 ${C.ink}`,
              transform:  'rotate(-2deg)',
              zIndex:     30,
              display:    'flex',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: S.yellowFontSize, color: C.ink }}>
                من: مجهول 🔒
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            fontWeight:   600,
            fontSize:     S.footerFontSize,
            color:        C.muted,
            direction:    'ltr',
            textAlign:    'center',
            marginTop:    8,
            paddingLeft:  24,
            paddingRight: 24,
            maxWidth:     '100%',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {footerText}
          </div>
        </div>
      </div>
    );
  },
);

// Legacy constants
export const CARD_WIDTH  = 1200;
export const CARD_HEIGHT = 800;
