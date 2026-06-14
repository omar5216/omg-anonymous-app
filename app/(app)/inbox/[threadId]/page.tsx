'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { threadsApi, messagesApi, reactionsApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { ThreadDetailDto, MessageDto, CreateReportDto } from '@/lib/api/types';
import { OMGChatBubble } from '@/components/omg/OMGChatBubble';
import { OMGAvatar } from '@/components/omg/OMGAvatar';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { OMGModal } from '@/components/omg/OMGModal';
import { OMGEmptyState, OMGShimmerList } from '@/components/omg/OMGEmptyState';

const REPORT_REASONS: { value: CreateReportDto['reason']; ico: string; label: string }[] = [
  { value: 'harassment',    ico: '😰', label: 'تحرش أو تهديد' },
  { value: 'spam',          ico: '🤬', label: 'محتوى مزعج أو سبام' },
  { value: 'inappropriate', ico: '🔞', label: 'محتوى مش لائق' },
  { value: 'other',         ico: '❓', label: 'سبب تاني' },
];

const QUICK_EMOJIS = ['❤️', '😂', '🔥', '👏', '😍', '😭'];

function formatTime(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// Backend returns newest-first. Reverse once so UI is oldest-top, newest-bottom.
function newestFirst(items: MessageDto[]): MessageDto[] {
  return items.slice().reverse();
}

export default function ChatPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const router = useRouter();

  const [thread, setThread] = useState<ThreadDetailDto | null>(null);
  // messages stored oldest-first (display order)
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [modal, setModal] = useState<'block' | 'report' | 'blocked-confirm' | 'share-card' | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<MessageDto | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reportStep, setReportStep] = useState<'pick' | 'done'>('pick');
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);

  // Optimistic reactions: messageId → emoji → count delta
  const [localReactions, setLocalReactions] = useState<Record<string, Record<string, number>>>({});

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior }), 50);
  };

  const fetchData = useCallback(async () => {
    if (!threadId) return;
    setError(null);
    try {
      const [threadData, msgsData] = await Promise.all([
        threadsApi.get(threadId),
        messagesApi.list(threadId),
      ]);
      setThread(threadData);

      // Backend newest-first → reverse for display
      setMessages(newestFirst(msgsData.items));
      setNextCursor(msgsData.nextCursor);

      // Mark seen using the newest message (index 0 in backend order)
      const newest = msgsData.items[0];
      if (newest?.sentAt && !threadData.isBlocked) {
        messagesApi.markSeen(threadId, { upToTimestamp: newest.sentAt }).catch(() => {});
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) { router.replace('/login'); return; }
        if (err.statusCode === 403) { setError('مش مسموحلك تشوف المحادثة دي'); return; }
        if (err.statusCode === 404) { setError('المحادثة دي مش موجودة'); return; }
      }
      setError('في مشكلة في التحميل — حاول تاني');
    } finally {
      setLoading(false);
    }
  }, [threadId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!loading) scrollToBottom('instant');
  }, [loading]);

  async function handleLoadOlder() {
    if (!nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const more = await messagesApi.list(threadId, nextCursor);
      // Older messages go to the front
      setMessages((prev) => [...newestFirst(more.items), ...prev]);
      setNextCursor(more.nextCursor);
    } catch {
      // swallow — button stays visible
    } finally {
      setLoadingOlder(false);
    }
  }

  async function handleSend() {
    if (!reply.trim() || !threadId || thread?.isBlocked) return;
    setSendError(null);
    setSending(true);
    const text = reply.trim();
    setReply('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Optimistic insert at bottom (newest)
    const tempMsg: MessageDto = {
      id: `temp-${Date.now()}`,
      authorRole: 'recipient',
      displayName: 'أنت',
      content: text,
      contentType: 'text',
      sentAt: new Date().toISOString(),
      seenAt: null,
      isFlagged: false,
      reactions: {},
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    try {
      await messagesApi.reply(threadId, { content: text });
      const fresh = await messagesApi.list(threadId);
      setMessages(newestFirst(fresh.items));
      setNextCursor(fresh.nextCursor);
      scrollToBottom();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setReply(text);
      if (err instanceof ApiError && err.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setSendError('مش قدرنا نبعت الرسالة — حاول تاني');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function handleReact(messageId: string, emoji: string) {
    setLocalReactions((prev) => ({
      ...prev,
      [messageId]: { ...(prev[messageId] ?? {}), [emoji]: ((prev[messageId] ?? {})[emoji] ?? 0) + 1 },
    }));
    try {
      await reactionsApi.react(messageId, { emoji });
    } catch {
      setLocalReactions((prev) => {
        const r = { ...(prev[messageId] ?? {}) };
        if ((r[emoji] ?? 0) > 1) r[emoji] -= 1; else delete r[emoji];
        return { ...prev, [messageId]: r };
      });
    }
  }

  async function handleBlock() {
    if (!threadId) return;
    setBlocking(true);
    try {
      await threadsApi.block(threadId);
      setThread((t) => t ? { ...t, isBlocked: true } : t);
      setModal('blocked-confirm');
    } catch {
      setSendError('مش قدرنا نحظر — حاول تاني');
      setModal(null);
    } finally {
      setBlocking(false);
    }
  }

  async function handleReport(reason: CreateReportDto['reason']) {
    if (!threadId) return;
    setReporting(true);
    try {
      await threadsApi.report(threadId, { reason });
    } catch {
      // best-effort — show success either way so user isn't confused
    } finally {
      setReporting(false);
      setReportStep('done');
    }
  }

  function startLongPress(msg: MessageDto) {
    longPressTimer.current = setTimeout(() => {
      setSelectedMsg(msg);
      setModal('share-card');
    }, 500);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function getMessageReactions(msg: MessageDto) {
    const base = msg.reactions ?? {};
    const local = localReactions[msg.id] ?? {};
    const merged: Record<string, number> = { ...base };
    for (const [emoji, delta] of Object.entries(local)) {
      merged[emoji] = (merged[emoji] ?? 0) + delta;
      if (merged[emoji] <= 0) delete merged[emoji];
    }
    return Object.entries(merged).map(([emoji, count]) => ({ emoji, count }));
  }

  const isBlocked = thread?.isBlocked ?? false;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <FullscreenShell>
        <HeaderSkeleton />
        <div className="flex-1 overflow-y-auto p-4">
          <OMGShimmerList count={5} />
        </div>
      </FullscreenShell>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !thread) {
    return (
      <FullscreenShell>
        <div className="flex items-center gap-3 px-4 py-4 border-b-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] omg-safe-top">
          <button onClick={() => router.push('/inbox')} className="text-[22px] font-black text-[var(--omg-ink)] min-w-[44px] min-h-[44px] flex items-center">←</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <OMGEmptyState
            emoji="💥"
            badge="مشكلة!"
            title="مش قادرين نفتح المحادثة"
            subtitle={error ?? 'تحقق من الإنترنت وحاول تاني'}
            actionLabel="حاول تاني 🔄"
            onAction={fetchData}
          />
        </div>
      </FullscreenShell>
    );
  }

  return (
    <>
      <FullscreenShell>
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 border-b-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] omg-safe-top pb-3 flex-shrink-0">
          <button
            onClick={() => router.push('/inbox')}
            className="text-[var(--omg-ink)] text-[22px] font-black flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center"
            aria-label="رجوع للرسائل"
          >←</button>
          <OMGAvatar emoji={thread.aliasName.slice(0, 1)} size="md" variant="purple" square />
          <div className="flex-1 min-w-0">
            <div className="font-grotesk text-[15px] font-black text-[var(--omg-ink)] truncate">{thread.aliasName}</div>
            <div className="text-[11px] text-[var(--omg-muted)] font-bold">
              {isBlocked ? '🚫 محظور' : '🔒 هوية مجهولة'}
            </div>
          </div>
          {!isBlocked && (
            <div className="flex gap-2 flex-shrink-0">
              <button className="icon-btn" onClick={() => setModal('report')} aria-label="بلّغ">🚩</button>
              <button className="icon-btn" onClick={() => setModal('block')} aria-label="حظر">🚫</button>
            </div>
          )}
        </div>

        {/* ── Messages area ─────────────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {/* Blocked banner */}
          {isBlocked && (
            <div className="mx-4 mt-3 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold text-center"
              style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
              🚫 حظرت المرسل ده — مش هيقدر يبعتلك تاني
            </div>
          )}

          {/* Load older messages */}
          {nextCursor && (
            <div className="flex justify-center pt-3 px-4">
              <button
                onClick={handleLoadOlder}
                disabled={loadingOlder}
                className="font-grotesk text-[11px] font-black px-5 py-[8px] rounded-full border-[2.5px] border-[var(--omg-ink)] bg-[var(--omg-card)] text-[var(--omg-muted)] disabled:opacity-50"
                style={{ boxShadow: '2px 2px 0 var(--omg-ink)' }}
              >
                {loadingOlder ? '⏳ جاري التحميل...' : '↑ رسائل أقدم'}
              </button>
            </div>
          )}

          {messages.length === 0 && !nextCursor && (
            <OMGEmptyState
              emoji="💬"
              badge="جديد!"
              title="ابدأ الردود"
              subtitle="لما تبعت ردك هيظهر هنا"
            />
          )}

          <div className="flex flex-col gap-[14px] p-4 pb-2">
            {messages.map((msg) => {
              const isMe = msg.authorRole === 'recipient';
              const reactions = getMessageReactions(msg);
              return (
                <div
                  key={msg.id}
                  onTouchStart={() => startLongPress(msg)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onContextMenu={(e) => { e.preventDefault(); setSelectedMsg(msg); setModal('share-card'); }}
                >
                  <OMGChatBubble
                    role={isMe ? 'me' : 'them'}
                    content={msg.content}
                    time={formatTime(msg.sentAt)}
                    seen={isMe && !!msg.seenAt}
                    avatarEmoji={isMe ? undefined : msg.displayName.slice(0, 1)}
                    reactions={reactions}
                    onReact={!isMe && !isBlocked ? (emoji) => handleReact(msg.id, emoji) : undefined}
                  />
                  {/* Quick-react strip — only on anonymous messages, only if not blocked */}
                  {!isMe && !isBlocked && (
                    <div className="flex gap-2 mt-2 mr-[44px] flex-wrap">
                      {QUICK_EMOJIS.map((e) => (
                        <button
                          key={e}
                          onClick={() => handleReact(msg.id, e)}
                          className="text-[18px] active:scale-90 transition-transform w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[var(--omg-card)] border-[2px] border-[var(--omg-ink)]"
                          style={{ boxShadow: '2px 2px 0 var(--omg-ink)' }}
                          aria-label={`React ${e}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Composer ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)]"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>

          {sendError && (
            <div className="mx-4 mt-3 p-[10px_14px] rounded-[12px] border-[2px] border-[var(--omg-red)] text-[12px] text-[var(--omg-red)] font-bold"
              style={{ background: '#FFF0F0' }}>
              ⚠️ {sendError}
            </div>
          )}

          {!isBlocked ? (
            <div className="flex gap-[10px] items-end px-4 pt-3">
              <textarea
                ref={inputRef}
                className="flex-1 bg-[var(--omg-bg)] border-[3px] border-[var(--omg-ink)] rounded-[20px] px-[16px] py-[11px] text-[15px] font-cairo outline-none text-[var(--omg-text)] resize-none min-h-[48px] max-h-[120px] leading-[1.5]"
                style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
                placeholder="اكتب ردك هنا..."
                dir="rtl"
                value={reply}
                rows={1}
                disabled={sending}
                onChange={(e) => {
                  setReply(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || !reply.trim()}
                className="bg-[var(--omg-yellow)] border-[3px] border-[var(--omg-ink)] rounded-full w-[52px] h-[52px] font-grotesk font-black text-[18px] flex-shrink-0 text-[var(--omg-ink)] disabled:opacity-40 flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px]"
                style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
                aria-label="إرسال"
              >
                {sending ? '⏳' : '→'}
              </button>
            </div>
          ) : (
            <div className="flex gap-2 justify-center px-4 pt-3">
              <OMGButton
                variant="white"
                size="sm"
                onClick={async () => {
                  try {
                    await threadsApi.unblock(threadId);
                    setThread((t) => t ? { ...t, isBlocked: false } : t);
                  } catch {
                    setSendError('مش قدرنا نلغي الحظر — حاول تاني');
                  }
                }}
                className="w-auto px-6"
              >
                إلغاء الحظر
              </OMGButton>
            </div>
          )}
        </div>
      </FullscreenShell>

      {/* ── Share as Card ─────────────────────────────────────────────── */}
      <OMGModal isOpen={modal === 'share-card'} onClose={() => { setModal(null); setSelectedMsg(null); }} title="شارك الرسالة 🃏">
        {selectedMsg && (
          <>
            <div
              className="mb-5 p-4 rounded-[16px] border-[2.5px] border-[var(--omg-ink)] text-[14px] text-[var(--omg-ink)] leading-[1.7]"
              style={{ background: 'var(--omg-bg)', boxShadow: '3px 3px 0 var(--omg-ink)' }}
            >
              {selectedMsg.content}
            </div>
            <OMGButton
              variant="purple"
              onClick={() => {
                const appHost = typeof window !== 'undefined' ? window.location.origin : '';
                const card = `💬 رسالة مجهولة وصلتني على OMG!\n\n"${selectedMsg.content}"\n\nابعت رسالتك المجهولة: ${appHost}`;
                navigator.clipboard?.writeText(card).catch(() => {});
                setModal(null);
                setSelectedMsg(null);
              }}
              className="mb-2"
            >
              📋 نسخ كـ كارت
            </OMGButton>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <OMGButton
                variant="yellow"
                onClick={() => {
                  const appHost = typeof window !== 'undefined' ? window.location.origin : '';
                  navigator.share?.({
                    text: `💬 رسالة مجهولة وصلتني على OMG!\n\n"${selectedMsg.content}"\n\nابعت رسالتك: ${appHost}`,
                  }).catch(() => {});
                  setModal(null);
                  setSelectedMsg(null);
                }}
                className="mb-2"
              >
                📤 شارك
              </OMGButton>
            )}
            <OMGButton variant="ghost" onClick={() => { setModal(null); setSelectedMsg(null); }}>إلغاء</OMGButton>
          </>
        )}
      </OMGModal>

      {/* ── Block confirmation ─────────────────────────────────────────── */}
      <OMGModal isOpen={modal === 'block'} onClose={() => setModal(null)} title={`حظر ${thread.aliasName}؟`}>
        <div className="flex items-center gap-4 mb-5">
          <OMGAvatar emoji={thread.aliasName.slice(0, 1)} size="lg" variant="purple" square />
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.6]">
            مش هيقدر يبعتلك رسائل تاني — وهويته هتفضل مجهولة.
          </p>
        </div>
        <div className="mb-5 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold leading-[1.7]"
          style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
          ⚠️ المرسل مش هيعرف إنك حظرته. المحادثة هتفضل موجودة عندك وتقدر تلغي الحظر أي وقت.
        </div>
        <OMGButton variant="red" disabled={blocking} onClick={handleBlock} className="mb-2">
          {blocking ? '⏳ جاري الحظر...' : '🚫 حظر المرسل'}
        </OMGButton>
        <OMGButton variant="ghost" onClick={() => setModal(null)}>إلغاء — خليني أفكر</OMGButton>
      </OMGModal>

      {/* ── Block success ──────────────────────────────────────────────── */}
      <OMGModal isOpen={modal === 'blocked-confirm'} onClose={() => setModal(null)}>
        <div className="text-center py-2">
          <div className="text-[52px] mb-3">🚫</div>
          <OMGSticker variant="red" className="mb-3">BLOCKED</OMGSticker>
          <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)] mb-2">تم الحظر</div>
          <p className="text-[13px] text-[var(--omg-muted)] mb-5 leading-[1.7]">
            المرسل ده مش هيقدر يبعتلك تاني.<br/>مش هيعرف إنك حظرته.
          </p>
          <OMGButton variant="white" size="sm" onClick={() => setModal(null)} className="w-auto px-8">تمام 👍</OMGButton>
        </div>
      </OMGModal>

      {/* ── Report ────────────────────────────────────────────────────── */}
      <OMGModal
        isOpen={modal === 'report'}
        onClose={() => { setModal(null); setReportStep('pick'); }}
        title={reportStep === 'pick' ? 'بلّغ عن المحادثة 🚩' : undefined}
        subtitle={reportStep === 'pick' ? 'ساعدنا نحافظ على OMG! آمن للجميع' : undefined}
      >
        {reportStep === 'pick' ? (
          <>
            {REPORT_REASONS.map((r) => (
              <button
                key={r.value}
                disabled={reporting}
                onClick={() => handleReport(r.value)}
                className="flex items-center gap-3 w-full p-[14px] bg-[var(--omg-bg)] rounded-[14px] mb-2 border-[2px] border-[var(--omg-ink)] text-right active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
                style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
              >
                <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[20px] bg-[var(--omg-card)] border-[2px] border-[var(--omg-ink)] flex-shrink-0">{r.ico}</div>
                <span className="flex-1 text-[14px] font-bold text-[var(--omg-ink)] text-right">{r.label}</span>
                <span className="font-black text-[var(--omg-muted)]">{reporting ? '⏳' : '›'}</span>
              </button>
            ))}
            <OMGButton variant="ghost" onClick={() => setModal(null)} className="mt-2">إلغاء</OMGButton>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="text-[52px] mb-3 omg-pop-in">✅</div>
            <OMGSticker variant="yellow" className="mb-3">REPORT SENT!</OMGSticker>
            <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)] mb-2">وصل البلاغ ✓</div>
            <p className="text-[13px] text-[var(--omg-muted)] mb-5 leading-[1.7]">
              شكراً — فريق OMG! هيراجعه في أقرب وقت.<br/>بياناتك محمية وهويتك مجهولة.
            </p>
            <OMGButton
              variant="white"
              size="sm"
              className="w-auto px-8"
              onClick={() => { setModal(null); setReportStep('pick'); }}
            >
              رجوع للمحادثة
            </OMGButton>
          </div>
        )}
      </OMGModal>
    </>
  );
}

function FullscreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="omg-grid-bg flex justify-center" style={{ height: '100dvh', overflow: 'hidden' }}>
      <div className="w-full flex flex-col" style={{ maxWidth: 430, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 pb-3 border-b-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] omg-safe-top flex-shrink-0">
      <div className="omg-shimmer w-[44px] h-[44px] rounded-full" />
      <div className="omg-shimmer w-[44px] h-[44px] rounded-[14px]" />
      <div className="flex-1">
        <div className="omg-shimmer h-[14px] w-[120px] rounded-full mb-2" />
        <div className="omg-shimmer h-[10px] w-[70px] rounded-full" />
      </div>
    </div>
  );
}
