'use client';
import { ReactNode, useEffect } from 'react';

interface OMGModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function OMGModal({ isOpen, onClose, title, subtitle, children }: OMGModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-[200]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="omg-sheet w-full">
        {/* Handle */}
        <div className="w-10 h-1 bg-black/20 rounded-full mx-auto mb-5" />
        {title && (
          <div className="font-grotesk text-[20px] font-black mb-[6px] text-[var(--omg-ink)]">{title}</div>
        )}
        {subtitle && (
          <div className="text-[14px] text-[var(--omg-muted)] mb-[22px] leading-[1.5]">{subtitle}</div>
        )}
        {children}
      </div>
    </div>
  );
}
