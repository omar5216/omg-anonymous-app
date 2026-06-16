'use client';

/**
 * OMGShareCardExportModal
 *
 * Renders the OMGMessageShareCard off-screen at 1080×1350, converts it to
 * a PNG via html-to-image, shows the user a live preview, then lets them:
 *   • Download the PNG
 *   • Share via Web Share API (with file, falls back to download)
 *   • Cancel
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { OMGMessageShareCard } from './OMGMessageShareCard';
import { OMGModal } from './OMGModal';
import { OMGButton } from './OMGButton';
import { getAppOrigin } from '@/lib/utils/url';

interface OMGShareCardExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  aliasName?: string;
}

type ExportState = 'rendering' | 'ready' | 'exporting' | 'error';

const APP_URL = getAppOrigin();

export function OMGShareCardExportModal({
  isOpen,
  onClose,
  message,
  aliasName,
}: OMGShareCardExportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [state, setState] = useState<ExportState>('rendering');
  const [shareNote, setShareNote] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!cardRef.current || !isOpen) return;
    setState('rendering');
    setPngUrl(null);
    setPngBlob(null);
    setShareNote(null);

    // Small delay so the hidden element is painted before capture
    await new Promise((r) => setTimeout(r, 120));

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        skipFonts: false,
        cacheBust: true,
        style: {
          // ensure the hidden container is treated as visible during capture
          visibility: 'visible',
          opacity: '1',
        },
      });

      // Convert data URL to Blob for Web Share API
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      setPngUrl(dataUrl);
      setPngBlob(blob);
      setState('ready');
    } catch {
      setState('error');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      generate();
    } else {
      // cleanup on close
      setPngUrl(null);
      setPngBlob(null);
      setState('rendering');
      setShareNote(null);
    }
  }, [isOpen, generate]);

  function handleDownload() {
    if (!pngUrl) return;
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `omg-message-card-${Date.now()}.png`;
    a.click();
  }

  async function handleShare() {
    if (!pngBlob) return;
    setState('exporting');

    const file = new File([pngBlob], `omg-message-card-${Date.now()}.png`, { type: 'image/png' });

    const canShareFiles =
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      'canShare' in navigator &&
      navigator.canShare({ files: [file] });

    if (canShareFiles) {
      try {
        await navigator.share({
          files: [file],
          title: 'OMG! Anonymous Message',
        });
        setState('ready');
        return;
      } catch {
        // user cancelled or API failed — fall through to download
      }
    }

    // Fallback: download + show note
    handleDownload();
    setShareNote('تم تحميل الصورة — شاركها من تطبيق الصور 📱');
    setState('ready');
  }

  return (
    <>
      {/* ── Off-screen render target ── */}
      {isOpen && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: 1080,
            height: 1080,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          <OMGMessageShareCard
            ref={cardRef}
            message={message}
            aliasName={aliasName}
            appUrl={APP_URL}
          />
        </div>
      )}

      {/* ── Preview modal ── */}
      <OMGModal
        isOpen={isOpen}
        onClose={onClose}
        title={state === 'rendering' ? 'جاري إنشاء الكارت...' : 'كارت الرسالة 🃏'}
        subtitle={state === 'ready' ? 'حمّل أو شارك الكارت' : undefined}
      >
        {/* Rendering state */}
        {state === 'rendering' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div
              className="w-[64px] h-[64px] rounded-full border-[4px] border-[var(--omg-purple)] border-t-transparent"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <div className="text-[13px] font-bold text-[var(--omg-muted)]">بيتصمم كارتك...</div>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-[48px]">💥</div>
            <div className="text-[14px] font-black text-[var(--omg-ink)]">مش قدرنا نعمل الصورة</div>
            <p className="text-[12px] text-[var(--omg-muted)] text-center leading-[1.7]">
              الجهاز مش بيدعم التصدير — جرب من متصفح تاني
            </p>
            <OMGButton variant="white" size="sm" onClick={generate} className="w-auto px-8">
              حاول تاني 🔄
            </OMGButton>
          </div>
        )}

        {/* Ready — show preview */}
        {(state === 'ready' || state === 'exporting') && pngUrl && (
          <div className="flex flex-col gap-4">
            {/* Preview thumbnail (scaled down from 1080×1350) */}
            <div
              className="rounded-[16px] overflow-hidden border-[3px] border-[var(--omg-ink)]"
              style={{ boxShadow: '5px 5px 0 var(--omg-ink)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pngUrl}
                alt="OMG Message Card Preview"
                style={{ width: '100%', display: 'block', aspectRatio: '1/1' }}
              />
            </div>

            {shareNote && (
              <div
                className="p-3 rounded-[14px] border-[2px] border-[var(--omg-purple)] text-[12px] text-[var(--omg-purple)] font-bold text-center leading-[1.6]"
                style={{ background: 'rgba(123,47,255,0.06)' }}
              >
                {shareNote}
              </div>
            )}

            <OMGButton
              variant="purple"
              disabled={state === 'exporting'}
              onClick={handleShare}
            >
              {state === 'exporting' ? '⏳ جاري المشاركة...' : '📤 شارك الكارت'}
            </OMGButton>
            <OMGButton variant="yellow" onClick={handleDownload}>
              ⬇️ حمّل PNG
            </OMGButton>
            <OMGButton variant="ghost" onClick={onClose}>
              إلغاء
            </OMGButton>
          </div>
        )}
      </OMGModal>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
