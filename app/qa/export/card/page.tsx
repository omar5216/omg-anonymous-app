'use client';

/**
 * /qa/export/card?id=<cardId>
 * Renders a single OMGMessageShareCard at full export size — zero chrome.
 * Used by the puppeteer export script.
 */

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { OMGMessageShareCard, type CardVariant } from '@/components/omg/OMGMessageShareCard';

const CARDS: Record<string, { message: string; variant: CardVariant; appUrl: string }> = {
  'message-short-ar': {
    message: 'افتح المحادثة ازاي يا عمر',
    variant: 'short',
    appUrl: 'omgksa.com/s/omar',
  },
  'message-medium-ar': {
    message: 'بصراحة التطبيق فكرته حلوة جدًا بس محتاج يبقى أسرع شوية في فتح الشات',
    variant: 'medium',
    appUrl: 'omgksa.com/s/omar',
  },
  'message-long-ar': {
    message: 'أنا عايز أقولك إن الفكرة جامدة جدًا وممكن تنتشر بسرعة لو الشير كارد شكله كان روش وواضح والناس تحس إنها عايزة تبعته للستوري فورًا، وده بيخلي الموضوع كله أجمد بكتير.',
    variant: 'long',
    appUrl: 'omgksa.com/s/omar',
  },
  'message-short-en': {
    message: 'This app is actually fun, I wanted to say that anonymously',
    variant: 'short',
    appUrl: 'omgksa.com/s/omar',
  },
  'message-long-username': {
    message: 'افتح المحادثة ازاي يا عمر',
    variant: 'short',
    appUrl: 'omgksa.com/s/omglander_super_long_username_test',
  },
};

function CardRenderer() {
  const params = useSearchParams();
  const id = params.get('id') ?? 'message-short-ar';
  const cfg = CARDS[id] ?? CARDS['message-short-ar'];

  return (
    <OMGMessageShareCard
      message={cfg.message}
      appUrl={cfg.appUrl}
      variant={cfg.variant}
    />
  );
}

export default function CardPage() {
  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <Suspense fallback={null}>
        <CardRenderer />
      </Suspense>
    </div>
  );
}
