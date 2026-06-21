'use client';

/**
 * /qa/export — auto-renders all share cards and exports PNGs via html-to-image.
 * Results are stored in window.__omgExports so we can read them via eval.
 */

import { useEffect, useRef, useState } from 'react';
import { OMGMessageShareCard, getCardDimensions, type CardVariant } from '@/components/omg/OMGMessageShareCard';

const CARDS: Array<{ id: string; message: string; variant: CardVariant; appUrl: string }> = [
  {
    id: 'message-short-ar',
    message: 'افتح المحادثة ازاي يا عمر',
    variant: 'short',
    appUrl: 'omgksa.com/s/omar',
  },
  {
    id: 'message-medium-ar',
    message: 'بصراحة التطبيق فكرته حلوة جدًا بس محتاج يبقى أسرع شوية في فتح الشات',
    variant: 'medium',
    appUrl: 'omgksa.com/s/omar',
  },
  {
    id: 'message-long-ar',
    message: 'أنا عايز أقولك إن الفكرة جامدة جدًا وممكن تنتشر بسرعة لو الشير كارد شكله كان روش وواضح والناس تحس إنها عايزة تبعته للستوري فورًا، وده بيخلي الموضوع كله أجمد بكتير.',
    variant: 'long',
    appUrl: 'omgksa.com/s/omar',
  },
  {
    id: 'message-short-en',
    message: 'This app is actually fun, I wanted to say that anonymously',
    variant: 'short',
    appUrl: 'omgksa.com/s/omar',
  },
  {
    id: 'message-long-username',
    message: 'افتح المحادثة ازاي يا عمر',
    variant: 'short',
    appUrl: 'omgksa.com/s/omglander_super_long_username_test',
  },
];

type ExportMap = Record<string, string>; // id → data URL

declare global {
  interface Window { __omgExports?: ExportMap; __omgExportDone?: boolean; }
}

export default function ExportPage() {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [status, setStatus] = useState<string>('Rendering cards…');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Give React time to paint
      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;

      const { toPng } = await import('html-to-image');
      const results: ExportMap = {};

      for (const card of CARDS) {
        const el = refs.current[card.id];
        if (!el) { results[card.id] = 'ERROR: element not found'; continue; }

        setStatus(`Exporting ${card.id}…`);
        const { width, height } = getCardDimensions(card.variant);

        try {
          const dataUrl = await toPng(el, {
            width,
            height,
            pixelRatio: 2,
            skipFonts: false,
            cacheBust: true,
            style: { visibility: 'visible', opacity: '1' },
          });
          results[card.id] = dataUrl;
        } catch (e) {
          results[card.id] = `ERROR: ${e}`;
        }
      }

      if (!cancelled) {
        window.__omgExports = results;
        window.__omgExportDone = true;
        setStatus(`✅ All ${Object.keys(results).length} cards exported. Read via window.__omgExports.`);
        setDone(true);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#111', minHeight: '100vh', color: '#0f0' }}>
      <div style={{ fontSize: 14, marginBottom: 24 }}>OMG! Card Exporter — {status}</div>
      {done && (
        <div style={{ fontSize: 12, color: '#aaa' }}>
          IDs: {CARDS.map(c => c.id).join(', ')}
        </div>
      )}

      {/* Off-screen render targets */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        {CARDS.map(card => {
          const { width, height } = getCardDimensions(card.variant);
          return (
            <div
              key={card.id}
              style={{ width, height, overflow: 'hidden', flexShrink: 0 }}
            >
              <OMGMessageShareCard
                ref={el => { refs.current[card.id] = el; }}
                message={card.message}
                appUrl={card.appUrl}
                variant={card.variant}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
