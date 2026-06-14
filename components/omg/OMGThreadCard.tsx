'use client';

interface OMGThreadCardProps {
  aliasName: string;
  lastMessage?: string;
  time?: string;
  unread?: boolean;
  badgeCount?: number;
  emoji?: string;
  avatarVariant?: 'purple' | 'pink' | 'yellow';
  onClick?: () => void;
}

const avatarBg: Record<string, string> = {
  purple: 'var(--omg-purple)',
  pink:   'var(--omg-pink)',
  yellow: 'var(--omg-yellow)',
};

export function OMGThreadCard({ aliasName, lastMessage, time, unread, badgeCount, emoji = '👤', avatarVariant = 'purple', onClick }: OMGThreadCardProps) {
  return (
    <div
      className={`omg-thread ${unread ? 'omg-thread-unread' : ''}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[24px] border-[2.5px] border-[var(--omg-ink)]"
          style={{ background: avatarBg[avatarVariant] }}
        >
          {emoji}
        </div>
        {unread && (
          <div className="absolute -top-1 -right-1 w-[14px] h-[14px] bg-[var(--omg-purple)] rounded-full border-[2.5px] border-[var(--omg-ink)]" />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-black mb-[3px] text-[var(--omg-ink)]">{aliasName}</div>
        {lastMessage && (
          <div className="text-[13px] text-[var(--omg-muted)] whitespace-nowrap overflow-hidden text-ellipsis">{lastMessage}</div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-[6px] flex-shrink-0">
        {time && <span className="font-grotesk text-[10px] text-[var(--omg-muted)] font-bold">{time}</span>}
        {badgeCount && (
          <div className="w-5 h-5 rounded-full bg-[var(--omg-purple)] border-[2px] border-[var(--omg-ink)] flex items-center justify-center font-grotesk text-[10px] font-black text-white">
            {badgeCount}
          </div>
        )}
      </div>
    </div>
  );
}
