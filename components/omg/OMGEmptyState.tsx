import { ReactNode } from 'react';
import { OMGSticker } from './OMGSticker';
import { OMGButton } from './OMGButton';

interface OMGEmptyStateProps {
  emoji: string;
  badge?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function OMGEmptyState({ emoji, badge, title, subtitle, actionLabel, onAction }: OMGEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-[52px] px-6 text-center gap-[14px]">
      <div className="text-[64px] omg-float">{emoji}</div>
      {badge && <OMGSticker variant="yellow">{badge}</OMGSticker>}
      <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)]">{title}</div>
      {subtitle && <div className="text-[14px] text-[var(--omg-muted)] leading-[1.6] max-w-[200px]">{subtitle}</div>}
      {actionLabel && onAction && (
        <OMGButton variant="purple" size="sm" className="mt-1 w-auto px-6" onClick={onAction}>
          {actionLabel}
        </OMGButton>
      )}
    </div>
  );
}

interface OMGShimmerListProps {
  count?: number;
}

export function OMGShimmerList({ count = 3 }: OMGShimmerListProps) {
  return (
    <div className="flex flex-col gap-3 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="omg-card flex gap-3 items-center">
          <div className="omg-shimmer w-[52px] h-[52px] rounded-[14px] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="omg-shimmer h-[14px] rounded w-[60%]" />
            <div className="omg-shimmer h-[12px] rounded w-[80%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
