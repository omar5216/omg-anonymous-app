'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { threadsApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { ThreadSummaryDto } from '@/lib/api/types';
import { OMGBottomNav } from '@/components/omg/OMGBottomNav';
import { OMGEmptyState, OMGShimmerList } from '@/components/omg/OMGEmptyState';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGSticker } from '@/components/omg/OMGSticker';

const AVATAR_COLORS = ['var(--omg-purple)', 'var(--omg-pink)', 'var(--omg-yellow)'] as const;

function avatarColor(i: number) { return AVATAR_COLORS[i % AVATAR_COLORS.length]; }

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} س`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'أمس';
  if (days < 7) return `${days} أيام`;
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}

function ThreadCard({ thread, index, onClick }: { thread: ThreadSummaryDto; index: number; onClick: () => void }) {
  const color = avatarColor(index);
  const letter = thread.aliasName.slice(0, 1);
  const time = formatRelativeTime(thread.lastMessageAt);

  return (
    <button
      onClick={onClick}
      className="omg-thread w-full text-right"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-[22px] border-[2.5px] border-[var(--omg-ink)] font-grotesk font-black text-[var(--omg-card)]"
          style={{ background: color }}
        >
          {letter}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-black text-[var(--omg-ink)] mb-[3px] truncate">{thread.aliasName}</div>
        <div className="text-[12px] text-[var(--omg-muted)] font-bold">
          {thread.messageCount > 0
            ? `${thread.messageCount} ${thread.messageCount === 1 ? 'رسالة' : 'رسائل'}`
            : 'محادثة جديدة'}
        </div>
      </div>

      {/* Time + badge */}
      <div className="flex flex-col items-end gap-[6px] flex-shrink-0">
        {time && (
          <span className="font-grotesk text-[10px] text-[var(--omg-muted)] font-bold">{time}</span>
        )}
        {thread.messageCount > 0 && (
          <div
            className="font-grotesk text-[9px] font-black px-[8px] py-[3px] rounded-full border-[2px] border-[var(--omg-ink)] bg-[var(--omg-yellow)] text-[var(--omg-ink)]"
          >
            {thread.messageCount} ✦
          </div>
        )}
      </div>
    </button>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<ThreadSummaryDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (cursor?: string, replace = true) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const res = await threadsApi.list(cursor);
      setThreads((prev) => replace ? res.items : [...prev, ...res.items]);
      setNextCursor(res.nextCursor);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setError('مش قادرين نحمّل الرسائل — تحقق من الإنترنت وحاول تاني');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    await load(undefined, true);
  }

  return (
    <div className="flex flex-col min-h-screen pb-[calc(88px+env(safe-area-inset-bottom,0px))]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 omg-safe-top pb-4 flex-shrink-0">
        <div>
          <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)] tracking-[-0.5px]">
            الرسائل 📬
          </div>
          {!loading && !error && threads.length > 0 && (
            <div className="text-[12px] text-[var(--omg-muted)] mt-[2px] font-bold">
              {threads.length} محادثة مجهولة
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="icon-btn"
          aria-label="تحديث"
        >
          {refreshing ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Loading */}
      {loading && <OMGShimmerList count={4} />}

      {/* Error */}
      {!loading && error && (
        <div className="px-4 mt-4 flex-1">
          <OMGEmptyState
            emoji="💥"
            badge="مشكلة!"
            title="مش قادرين نحمّل"
            subtitle={error}
            actionLabel="حاول تاني 🔄"
            onAction={() => load()}
          />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && threads.length === 0 && (
        <OMGEmptyState
          emoji="📭"
          badge="فارغة!"
          title="الصندوق فاضي"
          subtitle="شارك رابطك وانتظر الـ OMG! الأولى 👀"
          actionLabel="شارك رابطك 🔗"
          onAction={() => router.push('/home')}
        />
      )}

      {/* Thread list */}
      {!loading && !error && threads.length > 0 && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {threads.map((t, i) => (
            <ThreadCard
              key={t.id}
              thread={t}
              index={i}
              onClick={() => router.push(`/inbox/${t.id}`)}
            />
          ))}

          {/* Load more */}
          {nextCursor && (
            <div className="flex justify-center py-2">
              <OMGButton
                variant="white"
                size="sm"
                disabled={loadingMore}
                onClick={() => load(nextCursor, false)}
                className="w-auto px-8"
              >
                {loadingMore ? '⏳ جاري التحميل...' : 'شوف أكتر ↓'}
              </OMGButton>
            </div>
          )}

          {!nextCursor && threads.length > 0 && (
            <div className="flex justify-center py-2">
              <OMGSticker variant="yellow">✓ كل المحادثات</OMGSticker>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-full pointer-events-auto" style={{ maxWidth: 430 }}>
          <OMGBottomNav active="inbox" />
        </div>
      </div>
    </div>
  );
}
