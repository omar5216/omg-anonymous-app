import { ReactNode } from 'react';
import Link from 'next/link';

interface OMGPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: ReactNode;
}

export function OMGPageHeader({ title, subtitle, backHref, right }: OMGPageHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-5 pt-[14px] pb-2">
      {backHref && (
        <Link href={backHref} className="text-[var(--omg-ink)] text-[22px] font-black leading-none">
          ←
        </Link>
      )}
      <div className="flex-1">
        <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)] leading-tight">{title}</div>
        {subtitle && <div className="text-[12px] text-[var(--omg-muted)] font-bold mt-[2px]">{subtitle}</div>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
