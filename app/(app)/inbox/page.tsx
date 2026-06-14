'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { threadsApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { ThreadSummaryDto, SentThreadSummaryDto } from '@/lib/api/types';
import { OMGBottomNav } from '@/components/omg/OMGBottomNav';
import { OMGEmptyState, OMGShimmerList } from '@/components/omg/OMGEmptyState';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { OMGModal } from '@/components/omg/OMGModal';
import { OMGShareCardExportModal } from '@/components/omg/OMGShareCardExportModal';

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

function ReceivedThreadCard({ thread, index, onClick }: { thread: ThreadSummaryDto; index: number; onClick: () => void }) {
  const color = avatarColor(index);
  const letter = thread.aliasName.slice(0, 1);
  const time = formatRelativeTime(thread.lastMessageAt);

  return (
    <button onClick={onClick} className="omg-thread w-full text-right">
      <div className="relative flex-shrink-0">
        <div
          className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-[22px] border-[2.5px] border-[var(--omg-ink)] font-grotesk font-black text-[var(--omg-card)]"
          style={{ background: color }}
        >
          {letter}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-black text-[var(--omg-ink)] mb-[3px] truncate">{thread.aliasName}</div>
        <div className="text-[12px] text-[var(--omg-muted)] font-bold truncate">
          {thread.lastMessagePreview ?? (thread.messageCount > 0
            ? `${thread.messageCount} ${thread.messageCount === 1 ? 'رسالة' : 'رسائل'}`
            : 'محادثة جديدة')}
        </div>
      </div>
      <div className="flex flex-col items-end gap-[6px] flex-shrink-0">
        {time && <span className="font-grotesk text-[10px] text-[var(--omg-muted)] font-bold">{time}</span>}
        {thread.messageCount > 0 && (
          <div className="font-grotesk text-[9px] font-black px-[8px] py-[3px] rounded-full border-[2px] border-[var(--omg-ink)] bg-[var(--omg-yellow)] text-[var(--omg-ink)]">
            {thread.messageCount} ✦
          </div>
        )}
      </div>
    </button>
  );
}

function SentThreadCard({ thread, index, onClick }: { thread: SentThreadSummaryDto; index: number; onClick: () => void }) {
  const color = avatarColor(index);
  const letter = thread.recipientName.slice(0, 1);
  const time = formatRelativeTime(thread.lastMessageAt);

  return (
    <button onClick={onClick} className="omg-thread w-full text-right">
      <div className="relative flex-shrink-0">
        <div
          className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-[22px] border-[2.5px] border-[var(--omg-ink)] font-grotesk font-black text-[var(--omg-card)]"
          style={{ background: color }}
        >
          {letter}
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full border-[2px] border-[var(--omg-ink)] flex items-center justify-center text-[9px]"
          style={{ background: 'var(--omg-purple)', color: 'white' }}
        >
          ↑
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-black text-[var(--omg-ink)] mb-[3px] truncate">إلى {thread.recipientName}</div>
        <div className="text-[12px] text-[var(--omg-muted)] font-bold truncate">
          {thread.lastMessagePreview ?? `${thread.messageCount} ${thread.messageCount === 1 ? 'رسالة' : 'رسائل'}`}
        </div>
      </div>
      <div className="flex flex-col items-end gap-[6px] flex-shrink-0">
        {time && <span className="font-grotesk text-[10px] text-[var(--omg-muted)] font-bold">{time}</span>}
        <OMGSticker variant="purple" className="text-[8px] px-[6px]">مرسل</OMGSticker>
      </div>
    </button>
  );
}

export default function InboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'received' | 'sent'>(
    searchParams.get('tab') === 'sent' ? 'sent' : 'received',
  );

  // Received tab state
  const [threads, setThreads] = useState<ThreadSummaryDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedThread, setSelectedThread] = useState<ThreadSummaryDto | null>(null);
  const [shareCardThread, setShareCardThread] = useState<ThreadSummaryDto | null>(null);

  // Sent tab state
  const [sentThreads, setSentThreads] = useState<SentThreadSummaryDto[]>([]);
  const [sentNextCursor, setSentNextCursor] = useState<string | null>(null);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentLoadingMore, setSentLoadingMore] = useState(false);
  const [sentError, setSentError] = useState<string | null>(null);
  const [sentLoaded, setSentLoaded] = useState(false);

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

  const loadSent = useCallback(async (cursor?: string, replace = true) => {
    if (replace) setSentLoading(true);
    else setSentLoadingMore(true);
    setSentError(null);
    try {
      const res = await threadsApi.listSent(cursor);
      setSentThreads((prev) => replace ? res.items : [...prev, ...res.items]);
      setSentNextCursor(res.nextCursor);
      setSentLoaded(true);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setSentError('مش قادرين نحمّل الرسائل المرسلة');
    } finally {
      setSentLoading(false);
      setSentLoadingMore(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (tab === 'sent' && !sentLoaded) loadSent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTabChange(t: 'received' | 'sent') {
    setTab(t);
    if (t === 'sent' && !sentLoaded) {
      loadSent();
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    if (tab === 'received') {
      await load(undefined, true);
    } else {
      await loadSent(undefined, true);
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-[calc(88px+env(safe-area-inset-bottom,0px))]">
      {/* Header */}
      <div className="flex justify-between items-center px-5 omg-safe-top pb-3 flex-shrink-0">
        <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)] tracking-[-0.5px]">
          الرسائل 📬
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading || sentLoading}
          className="icon-btn"
          aria-label="تحديث"
        >
          {refreshing ? '⏳' : '🔄'}
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 px-5 pb-4">
        <button
          onClick={() => handleTabChange('received')}
          className="flex-1 py-[10px] rounded-[14px] text-[13px] font-black border-[2.5px] transition-all"
          style={{
            background: tab === 'received' ? 'var(--omg-ink)' : 'var(--omg-card)',
            color: tab === 'received' ? 'var(--omg-card)' : 'var(--omg-muted)',
            borderColor: 'var(--omg-ink)',
            boxShadow: tab === 'received' ? '3px 3px 0 var(--omg-purple)' : 'none',
          }}
        >
          📬 واردة
        </button>
        <button
          onClick={() => handleTabChange('sent')}
          className="flex-1 py-[10px] rounded-[14px] text-[13px] font-black border-[2.5px] transition-all"
          style={{
            background: tab === 'sent' ? 'var(--omg-ink)' : 'var(--omg-card)',
            color: tab === 'sent' ? 'var(--omg-card)' : 'var(--omg-muted)',
            borderColor: 'var(--omg-ink)',
            boxShadow: tab === 'sent' ? '3px 3px 0 var(--omg-purple)' : 'none',
          }}
        >
          📨 مرسلة
        </button>
      </div>

      {/* ── Received tab ── */}
      {tab === 'received' && (
        <>
          {loading && <OMGShimmerList count={4} />}

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

          {!loading && !error && threads.length > 0 && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {threads.map((t, i) => (
                <ReceivedThreadCard key={t.id} thread={t} index={i} onClick={() => setSelectedThread(t)} />
              ))}
              {nextCursor && (
                <div className="flex justify-center py-2">
                  <OMGButton variant="white" size="sm" disabled={loadingMore} onClick={() => load(nextCursor, false)} className="w-auto px-8">
                    {loadingMore ? '⏳ جاري التحميل...' : 'شوف أكتر ↓'}
                  </OMGButton>
                </div>
              )}
              {!nextCursor && (
                <div className="flex justify-center py-2">
                  <OMGSticker variant="yellow">✓ كل المحادثات</OMGSticker>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Sent tab ── */}
      {tab === 'sent' && (
        <>
          {sentLoading && <OMGShimmerList count={4} />}

          {!sentLoading && sentError && (
            <div className="px-4 mt-4 flex-1">
              <OMGEmptyState
                emoji="💥"
                badge="مشكلة!"
                title="مش قادرين نحمّل"
                subtitle={sentError}
                actionLabel="حاول تاني 🔄"
                onAction={() => loadSent()}
              />
            </div>
          )}

          {!sentLoading && !sentError && sentThreads.length === 0 && (
            <OMGEmptyState
              emoji="📨"
              badge="فارغة!"
              title="مبعتش رسائل لسه"
              subtitle="ادخل على رابط حد وابعتله رسالة مجهولة 🔥"
              actionLabel="ابحث عن روابط 🔍"
              onAction={() => router.push('/home')}
            />
          )}

          {!sentLoading && !sentError && sentThreads.length > 0 && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              {sentThreads.map((t, i) => (
                <SentThreadCard
                  key={t.threadId}
                  thread={t}
                  index={i}
                  onClick={() => router.push(`/inbox/${t.threadId}`)}
                />
              ))}
              {sentNextCursor && (
                <div className="flex justify-center py-2">
                  <OMGButton variant="white" size="sm" disabled={sentLoadingMore} onClick={() => loadSent(sentNextCursor, false)} className="w-auto px-8">
                    {sentLoadingMore ? '⏳ جاري التحميل...' : 'شوف أكتر ↓'}
                  </OMGButton>
                </div>
              )}
              {!sentNextCursor && (
                <div className="flex justify-center py-2">
                  <OMGSticker variant="yellow">✓ كل الرسائل المرسلة</OMGSticker>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Received thread decision modal */}
      {selectedThread && (
        <OMGModal
          isOpen
          onClose={() => setSelectedThread(null)}
          title={`رسالة من ${selectedThread.aliasName} 👀`}
        >
          {selectedThread.lastMessagePreview && (
            <div
              className="mb-5 p-4 rounded-[16px] border-[2.5px] border-[var(--omg-ink)] text-[14px] text-[var(--omg-ink)] leading-[1.7]"
              style={{ background: 'var(--omg-bg)', boxShadow: '3px 3px 0 var(--omg-ink)' }}
            >
              {selectedThread.lastMessagePreview}
            </div>
          )}
          <OMGButton
            variant="purple"
            onClick={() => {
              setShareCardThread(selectedThread);
              setSelectedThread(null);
            }}
            className="mb-2"
          >
            🃏 شارك كـ كارت
          </OMGButton>
          <OMGButton
            variant="yellow"
            onClick={() => {
              router.push(`/inbox/${selectedThread.id}`);
              setSelectedThread(null);
            }}
          >
            💬 افتح المحادثة
          </OMGButton>
        </OMGModal>
      )}

      {/* Share card image export modal */}
      <OMGShareCardExportModal
        isOpen={!!shareCardThread}
        onClose={() => setShareCardThread(null)}
        message={shareCardThread?.lastMessagePreview ?? ''}
        aliasName={shareCardThread?.aliasName}
      />

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-full pointer-events-auto" style={{ maxWidth: 430 }}>
          <OMGBottomNav active="inbox" />
        </div>
      </div>
    </div>
  );
}
