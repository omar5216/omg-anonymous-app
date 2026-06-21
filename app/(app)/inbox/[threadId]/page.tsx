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
import { OMGShareCardExportModal } from '@/components/omg/OMGShareCardExportModal';
import { OMGMessageMenu, type MenuAnchor } from '@/components/omg/OMGMessageMenu';

const REPORT_REASONS: { value: CreateReportDto['reason']; ico: string; label: string }[] = [
  { value: 'harassment',    ico: '😰', label: 'تحرش أو تهديد' },
  { value: 'spam',          ico: '🤬', label: 'محتوى مزعج أو سبام' },
  { value: 'inappropriate', ico: '🔞', label: 'محتوى مش لائق' },
  { value: 'other',         ico: '❓', label: 'سبب تاني' },
];


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
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [modal, setModal] = useState<'block' | 'report' | 'blocked-confirm' | null>(null);
  const [reportStep, setReportStep] = useState<'pick' | 'done'>('pick');
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);

  // Message action menu
  const [menuMsg, setMenuMsg] = useState<MessageDto | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);

  const [shareCardMsg, setShareCardMsg] = useState<MessageDto | null>(null);

  // Copy toast
  const [copyToast, setCopyToast] = useState(false);
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Optimistic reactions: messageId → emoji → count delta
  const [localReactions, setLocalReactions] = useState<Record<string, Record<string, number>>>({});
  // Track which emoji the current user sent per message (for toggle support)
  const [myReactionMap, setMyReactionMap] = useState<Record<string, string | null>>({});

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      setMessages(newestFirst(msgsData.items));
      setNextCursor(msgsData.nextCursor);

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

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!loading) scrollToBottom('instant');
  }, [loading]);

  // ── Load older ──────────────────────────────────────────────────────────────
  async function handleLoadOlder() {
    if (!nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const more = await messagesApi.list(threadId, nextCursor);
      setMessages((prev) => [...newestFirst(more.items), ...prev]);
      setNextCursor(more.nextCursor);
    } catch {
      // swallow — button stays visible
    } finally {
      setLoadingOlder(false);
    }
  }

  // ── Send reply ──────────────────────────────────────────────────────────────
  async function handleSend() {
    if (!reply.trim() || !threadId || thread?.isBlocked) return;
    setSendError(null);
    setSending(true);
    const text = reply.trim();
    setReply('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const tempMsg: MessageDto = {
      id: `temp-${Date.now()}`,
      authorRole: isRecipientView ? 'recipient' : 'anonymous',
      displayName: 'أنت',
      isMine: true,
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

  // ── Reactions (with toggle support) ────────────────────────────────────────
  async function handleReact(messageId: string, emoji: string) {
    const currentEmoji = myReactionMap[messageId] ?? null;
    const isToggleOff = currentEmoji === emoji;

    // Optimistic update
    if (isToggleOff) {
      // Remove reaction
      setMyReactionMap((prev) => ({ ...prev, [messageId]: null }));
      setLocalReactions((prev) => ({
        ...prev,
        [messageId]: { ...(prev[messageId] ?? {}), [emoji]: ((prev[messageId] ?? {})[emoji] ?? 0) - 1 },
      }));
    } else {
      // Add or change reaction
      if (currentEmoji) {
        // Remove old emoji delta first
        setLocalReactions((prev) => ({
          ...prev,
          [messageId]: { ...(prev[messageId] ?? {}), [currentEmoji]: ((prev[messageId] ?? {})[currentEmoji] ?? 0) - 1 },
        }));
      }
      setMyReactionMap((prev) => ({ ...prev, [messageId]: emoji }));
      setLocalReactions((prev) => ({
        ...prev,
        [messageId]: { ...(prev[messageId] ?? {}), [emoji]: ((prev[messageId] ?? {})[emoji] ?? 0) + 1 },
      }));
    }

    try {
      if (isToggleOff) {
        await reactionsApi.unreact(messageId);
      } else {
        await reactionsApi.react(messageId, { emoji });
      }
    } catch {
      // Roll back optimistic update
      if (isToggleOff) {
        setMyReactionMap((prev) => ({ ...prev, [messageId]: emoji }));
        setLocalReactions((prev) => ({
          ...prev,
          [messageId]: { ...(prev[messageId] ?? {}), [emoji]: ((prev[messageId] ?? {})[emoji] ?? 0) + 1 },
        }));
      } else {
        setMyReactionMap((prev) => ({ ...prev, [messageId]: currentEmoji }));
        setLocalReactions((prev) => {
          const r = { ...(prev[messageId] ?? {}) };
          if ((r[emoji] ?? 0) > 1) r[emoji] -= 1; else delete r[emoji];
          if (currentEmoji) r[currentEmoji] = (r[currentEmoji] ?? 0) + 1;
          return { ...prev, [messageId]: r };
        });
      }
    }
  }

  // ── Block ───────────────────────────────────────────────────────────────────
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

  // ── Report ──────────────────────────────────────────────────────────────────
  async function handleReport(reason: CreateReportDto['reason']) {
    if (!threadId) return;
    setReporting(true);
    try {
      await threadsApi.report(threadId, { reason, messageId: menuMsg?.id });
    } catch {
      // best-effort — show success regardless
    } finally {
      setReporting(false);
      setReportStep('done');
    }
  }

  // ── Copy ────────────────────────────────────────────────────────────────────
  async function handleCopy(content: string) {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = content;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    if (copyToastTimer.current) clearTimeout(copyToastTimer.current);
    setCopyToast(true);
    copyToastTimer.current = setTimeout(() => setCopyToast(false), 2000);
  }

  // ── Message menu open/close ─────────────────────────────────────────────────
  function openMenu(msg: MessageDto, x: number, y: number) {
    setMenuMsg(msg);
    setMenuAnchor({ x, y });
  }

  function closeMenu() {
    setMenuMsg(null);
    setMenuAnchor(null);
  }

  // ── Long press (mobile) ─────────────────────────────────────────────────────
  function startLongPress(msg: MessageDto, e: React.TouchEvent) {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      openMenu(msg, touch.clientX, touch.clientY);
    }, 500);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  // ── Merged reactions for display ────────────────────────────────────────────
  function getMessageReactions(msg: MessageDto) {
    const base = msg.reactions ?? {};
    const local = localReactions[msg.id] ?? {};
    const merged: Record<string, number> = { ...base };
    for (const [emoji, delta] of Object.entries(local)) {
      merged[emoji] = (merged[emoji] ?? 0) + delta;
      if (merged[emoji] <= 0) delete merged[emoji];
    }
    return Object.entries(merged).map(([emoji, count]) => ({
      emoji,
      count,
      active: myReactionMap[msg.id] === emoji,
    }));
  }

  const isBlocked = thread?.isBlocked ?? false;
  const isRecipientView = thread?.viewerRole !== 'sender';

  // ── Loading ─────────────────────────────────────────────────────────────────
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

  // ── Error ───────────────────────────────────────────────────────────────────
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
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 border-b-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] omg-safe-top pb-3 flex-shrink-0">
          <button
            onClick={() => router.push(isRecipientView ? '/inbox' : '/inbox?tab=sent')}
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
          {isRecipientView && !isBlocked && (
            <div className="flex gap-2 flex-shrink-0">
              <button className="icon-btn" onClick={() => setModal('report')} aria-label="بلّغ">🚩</button>
              <button className="icon-btn" onClick={() => setModal('block')} aria-label="حظر">🚫</button>
            </div>
          )}
        </div>

        {/* ── Messages area ───────────────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isRecipientView && isBlocked && (
            <div className="mx-4 mt-3 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold text-center"
              style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
              🚫 حظرت المرسل ده — مش هيقدر يبعتلك تاني
            </div>
          )}

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
              const isMe = msg.isMine;
              const reactions = getMessageReactions(msg);
              const canReact = isRecipientView && !isMe && !isBlocked;

              return (
                <div
                  key={msg.id}
                  className="group relative"
                  onTouchStart={(e) => startLongPress(msg, e)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onContextMenu={(e) => { e.preventDefault(); openMenu(msg, e.clientX, e.clientY); }}
                >
                  {/* Bubble + desktop hover action button */}
                  <div className="relative">
                    <OMGChatBubble
                      role={isMe ? 'me' : 'them'}
                      content={msg.content}
                      time={formatTime(msg.sentAt)}
                      seen={isMe && !!msg.seenAt}
                      avatarEmoji={isMe ? undefined : msg.displayName.slice(0, 1)}
                      reactions={reactions}
                      onReact={canReact ? (emoji) => handleReact(msg.id, emoji) : undefined}
                    />

                    {/* Desktop hover "⋮" trigger — appears on group-hover, sm+ only */}
                    <button
                      className={`
                        hidden sm:flex items-center justify-center
                        absolute top-0 w-[28px] h-[28px] rounded-full
                        bg-[var(--omg-card)] border-[2px] border-[var(--omg-ink)]
                        text-[var(--omg-muted)] text-[14px] font-black
                        opacity-0 group-hover:opacity-100 transition-opacity
                        hover:bg-[var(--omg-yellow)] hover:text-[var(--omg-ink)]
                        ${isMe ? 'right-0' : 'left-0'}
                      `}
                      style={{ boxShadow: '2px 2px 0 var(--omg-ink)' }}
                      onClick={(e) => { e.stopPropagation(); openMenu(msg, e.clientX, e.clientY); }}
                      aria-label="خيارات الرسالة"
                    >
                      ⋮
                    </button>
                  </div>

                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Copy toast ──────────────────────────────────────────────────── */}
        {copyToast && (
          <div
            className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-[50] bg-[var(--omg-ink)] text-white font-grotesk font-bold text-[12px] px-4 py-[8px] rounded-full pointer-events-none"
            aria-live="polite"
            style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
          >
            تم النسخ ✓
          </div>
        )}

        {/* ── Composer ────────────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 border-t-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)]"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
        >
          {sendError && (
            <div className="mx-4 mt-3 p-[10px_14px] rounded-[12px] border-[2px] border-[var(--omg-red)] text-[12px] text-[var(--omg-red)] font-bold"
              style={{ background: '#FFF0F0' }}>
              ⚠️ {sendError}
            </div>
          )}

          {(!isRecipientView || !isBlocked) ? (
            <div className="px-4 pt-3">
              <div className="flex gap-[10px] items-end">
                <textarea
                  ref={inputRef}
                  className="flex-1 bg-[var(--omg-bg)] border-[3px] border-[var(--omg-ink)] rounded-[20px] px-[16px] py-[11px] text-[15px] font-cairo outline-none text-[var(--omg-text)] resize-none min-h-[48px] leading-[1.5] overflow-y-auto"
                  style={{ boxShadow: '3px 3px 0 var(--omg-ink)', maxHeight: 160 }}
                  placeholder={isRecipientView ? 'اكتب ردك هنا...' : 'أرسل رسالة مجهولة...'}
                  dir="rtl"
                  value={reply}
                  rows={1}
                  disabled={sending}
                  onChange={(e) => {
                    setReply(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !reply.trim()}
                  className="bg-[var(--omg-yellow)] border-[3px] border-[var(--omg-ink)] rounded-full w-[52px] h-[52px] font-grotesk font-black text-[18px] flex-shrink-0 text-[var(--omg-ink)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] transition-opacity"
                  style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
                  aria-label="إرسال"
                >
                  {sending ? '⏳' : '→'}
                </button>
              </div>
              <p className="text-[10px] text-[var(--omg-muted)] text-center mt-[6px] font-cairo" dir="rtl">
                Enter = سطر جديد &nbsp;·&nbsp; Ctrl/⌘ + Enter = إرسال
              </p>
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

      {/* ── Message action menu ──────────────────────────────────────────── */}
      <OMGMessageMenu
        message={menuMsg}
        anchor={menuAnchor}
        onClose={closeMenu}
        myEmoji={menuMsg ? (myReactionMap[menuMsg.id] ?? null) : null}
        canReact={menuMsg ? (isRecipientView && !menuMsg.isMine && !isBlocked) : false}
        isRecipientView={isRecipientView}
        isBlocked={isBlocked}
        onReact={(emoji) => { if (menuMsg) handleReact(menuMsg.id, emoji); }}
        onCopy={() => { if (menuMsg) handleCopy(menuMsg.content); }}
        onReport={() => { setReportStep('pick'); setModal('report'); }}
        onBlock={() => setModal('block')}
        onSaveCard={() => { if (menuMsg) setShareCardMsg(menuMsg); }}
      />

      {/* ── Save-as-card export ──────────────────────────────────────────── */}
      <OMGShareCardExportModal
        isOpen={!!shareCardMsg}
        onClose={() => setShareCardMsg(null)}
        message={shareCardMsg?.content ?? ''}
        aliasName={thread?.aliasName}
      />

      {/* ── Block confirmation ───────────────────────────────────────────── */}
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

      {/* ── Block success ────────────────────────────────────────────────── */}
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

      {/* ── Report ──────────────────────────────────────────────────────── */}
      <OMGModal
        isOpen={modal === 'report'}
        onClose={() => { setModal(null); setReportStep('pick'); }}
        title={reportStep === 'pick' ? 'بلّغ عن الرسالة 🚩' : undefined}
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
