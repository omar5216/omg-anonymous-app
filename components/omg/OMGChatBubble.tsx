interface Reaction { emoji: string; count: number; active?: boolean; }

interface OMGChatBubbleProps {
  role: 'them' | 'me';
  content: string;
  time?: string;
  seen?: boolean;
  reactions?: Reaction[];
  avatarEmoji?: string;
  onReact?: (emoji: string) => void;
  onLongPress?: () => void;
}

export function OMGChatBubble({ role, content, time, seen, reactions, avatarEmoji = '👤', onReact }: OMGChatBubbleProps) {
  const isMe = role === 'me';

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && (
        <div
          className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center text-[15px] flex-shrink-0 border-[2.5px] border-[var(--omg-ink)]"
          style={{ background: 'var(--omg-pink)', boxShadow: '2px 2px 0px var(--omg-ink)' }}
        >
          {avatarEmoji}
        </div>
      )}
      <div className="omg-bubble-wrap">
        <div className={`omg-bubble ${isMe ? 'omg-bubble-me' : 'omg-bubble-them'}`}>
          {content}
        </div>

        {reactions && reactions.length > 0 && (
          <div className="flex gap-[6px] flex-wrap mt-[6px]">
            {reactions.map((r) => (
              <button
                key={r.emoji}
                className={`react-chip ${r.active ? 'react-chip-on' : ''}`}
                onClick={() => onReact?.(r.emoji)}
              >
                {r.emoji}
                <span className="font-grotesk text-[10px] text-[var(--omg-muted)] font-bold">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        {time && (
          <div
            className={`font-grotesk text-[10px] font-bold mt-1 ${seen ? 'text-[var(--omg-purple)]' : 'text-[var(--omg-muted)]'} ${isMe ? 'text-left' : ''}`}
            dir="ltr"
          >
            {seen ? `Seen 👀 ${time}` : time}
          </div>
        )}
      </div>
    </div>
  );
}
