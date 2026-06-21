'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MessageDto } from '@/lib/api/types';

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

export interface MenuAnchor {
  x: number;
  y: number;
}

interface Props {
  message: MessageDto | null;
  anchor: MenuAnchor | null;
  onClose: () => void;
  // Which emoji (if any) the current user has already reacted with on this message
  myEmoji: string | null;
  // Whether the current user is allowed to react (recipient viewing incoming msgs)
  canReact: boolean;
  // Whether the current user is the recipient (link owner)
  isRecipientView: boolean;
  // Whether the thread is already blocked
  isBlocked: boolean;
  onReact: (emoji: string) => void;
  onCopy: () => void;
  onReport: () => void;
  onBlock: () => void;
  onSaveCard?: () => void;
}

export function OMGMessageMenu({
  message,
  anchor,
  onClose,
  myEmoji,
  canReact,
  isRecipientView,
  isBlocked,
  onReact,
  onCopy,
  onReport,
  onBlock,
  onSaveCard,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Track which side of the viewport to render on
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Compute floating position for desktop
  useEffect(() => {
    if (!anchor || isMobile) { setPos(null); return; }
    const MENU_W = 200;
    const reactionRowH = canReact ? 48 : 0;
    const actionCount = (onSaveCard ? 2 : 1) + (isRecipientView ? 2 : 0);
    const MENU_H = reactionRowH + actionCount * 36 + 12;

    let left = anchor.x - MENU_W / 2;
    let top = anchor.y + 4; // 4px below click point — tighter than before

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - MENU_W - 8));
    if (top + MENU_H > window.innerHeight - 8) top = anchor.y - MENU_H - 4;
    top = Math.max(8, top);

    setPos({ top, left });
  }, [anchor, isMobile, canReact, isRecipientView, onSaveCard]);

  // Escape key and outside click
  useEffect(() => {
    if (!message) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [message, onClose]);

  if (!message || typeof window === 'undefined') return null;

  const menuContent = (
    <div ref={menuRef} role="menu" aria-label="خيارات الرسالة" dir="rtl">
      {/* ── Reaction strip ─────────────────────────────────────── */}
      {canReact && (
        <div className="flex items-center justify-around px-2 py-[6px] border-b-[2.5px] border-[var(--omg-ink)]">
          {REACTION_EMOJIS.map((e) => (
            <button
              key={e}
              role="menuitem"
              onClick={() => { onReact(e); onClose(); }}
              className={`text-[20px] w-[34px] h-[34px] flex items-center justify-center rounded-full transition-transform active:scale-90 ${
                myEmoji === e
                  ? 'bg-[var(--omg-yellow)] scale-110 border-[2px] border-[var(--omg-ink)]'
                  : 'hover:bg-[var(--omg-bg)]'
              }`}
              aria-label={`تفاعل بـ ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* ── Action list ─────────────────────────────────────────── */}
      <div className="py-[3px]">
        <MenuItem
          icon="📋"
          label="نسخ الرسالة"
          onClick={() => { onCopy(); onClose(); }}
        />
        {onSaveCard && (
          <MenuItem
            icon="🃏"
            label="احفظ كـ كارت"
            onClick={() => { onSaveCard(); onClose(); }}
          />
        )}
        {isRecipientView && !message.isMine && (
          <>
            <MenuItem
              icon="🚩"
              label="بلّغ عن الرسالة"
              onClick={() => { onReport(); onClose(); }}
              danger
            />
            {!isBlocked && (
              <MenuItem
                icon="🚫"
                label="حظر المرسل"
                onClick={() => { onBlock(); onClose(); }}
                danger
              />
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  if (isMobile) {
    return createPortal(
      <>
        {/* Scrim */}
        <div
          className="fixed inset-0 z-[100] bg-black/30"
          onMouseDown={onClose}
          onTouchStart={(e) => { e.preventDefault(); onClose(); }}
          aria-hidden="true"
        />
        {/* Sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 z-[101] bg-[var(--omg-card)] border-t-[3px] border-[var(--omg-ink)] rounded-t-[24px]"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-[10px] pb-[4px]" aria-hidden="true">
            <div className="w-[36px] h-[4px] rounded-full bg-[var(--omg-dim)]" />
          </div>
          {menuContent}
        </div>
      </>,
      document.body,
    );
  }

  // ── Desktop: floating popup ───────────────────────────────────────────────
  return createPortal(
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div className="fixed inset-0 z-[100]" onMouseDown={onClose} aria-hidden="true" />
      {/* Popup */}
      <div
        className="fixed z-[101] bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[20px] overflow-hidden"
        style={{
          top: pos?.top ?? -9999,
          left: pos?.left ?? -9999,
          width: 200,
          boxShadow: '4px 4px 0 var(--omg-ink)',
        }}
      >
        {menuContent}
      </div>
    </>,
    document.body,
  );
}

// ── MenuItem helper ───────────────────────────────────────────────────────────
function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-[8px] text-[13px] font-bold font-cairo text-right transition-colors active:bg-[var(--omg-bg)] hover:bg-[var(--omg-bg)] ${
        danger ? 'text-[var(--omg-red)]' : 'text-[var(--omg-ink)]'
      }`}
    >
      <span className="text-[18px] flex-shrink-0" aria-hidden="true">{icon}</span>
      <span className="flex-1 text-right">{label}</span>
    </button>
  );
}
