'use client';
import { OMGSticker } from './OMGSticker';
import { OMGButton } from './OMGButton';

interface OMGShareCardProps {
  displayName: string;
  slug: string;
  baseUrl?: string;
  onCopy?: () => void;
  onShare?: () => void;
}

export function OMGShareCard({ displayName, slug, baseUrl = 'omg.app', onCopy, onShare }: OMGShareCardProps) {
  const shareUrl = `${baseUrl}/s/${slug}`;

  return (
    <div className="omg-card-hero">
      {/* Pink glow blob */}
      <div
        className="absolute -top-5 -right-5 w-[140px] h-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,110,176,0.3) 0%, transparent 70%)' }}
      />

      <div className="flex justify-between items-center mb-3">
        <OMGSticker variant="yellow">● LIVE</OMGSticker>
        <OMGSticker variant="yellow" shape="circle" size={38}>NEW</OMGSticker>
      </div>

      <div className="font-grotesk text-[11px] font-black text-[var(--omg-muted)] uppercase tracking-[1px] mb-1">
        رابطك الـ OMG!
      </div>
      <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)] leading-[1.2] mb-4">
        {displayName} 👀
      </div>

      <div className="link-pill mb-4">
        <span className="link-url">{shareUrl}</span>
        <button onClick={onCopy} className="text-[16px] cursor-pointer">📋</button>
      </div>

      <div className="flex gap-2">
        <OMGButton variant="purple" half size="sm" onClick={onShare}>شارك 🔥</OMGButton>
        <OMGButton variant="yellow" half size="sm" onClick={onCopy}>انسخ 📋</OMGButton>
      </div>
    </div>
  );
}
