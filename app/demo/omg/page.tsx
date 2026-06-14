'use client';

/**
 * /demo/omg — Design Review Route
 *
 * Shows ALL screens with mock data. No API calls. Dev-only.
 * Do not use mock data anywhere else in the app.
 */

import { useState } from 'react';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGInput, OMGTextarea } from '@/components/omg/OMGInput';
import { OMGCard } from '@/components/omg/OMGCard';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { OMGAvatar } from '@/components/omg/OMGAvatar';
import { OMGStatPill } from '@/components/omg/OMGStatPill';
import { OMGThreadCard } from '@/components/omg/OMGThreadCard';
import { OMGChatBubble } from '@/components/omg/OMGChatBubble';
import { OMGEmptyState, OMGShimmerList } from '@/components/omg/OMGEmptyState';
import { OMGModal } from '@/components/omg/OMGModal';
import { OMGShareCard } from '@/components/omg/OMGShareCard';

// ── DEMO PHONE FRAME ─────────────────────────────────────────────────────────

function PhoneFrame({ label, children, height }: { label: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="flex flex-col items-center gap-[14px]">
      <div
        className="font-grotesk text-[10px] font-black px-[14px] py-[5px] rounded-full border-[3px] border-[var(--omg-ink)] uppercase tracking-[1px]"
        style={{ background: 'var(--omg-yellow)', boxShadow: '3px 3px 0 var(--omg-ink)' }}
      >
        {label}
      </div>
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          width: 375,
          height: height ?? 812,
          background: 'var(--omg-bg)',
          borderRadius: 44,
          border: '4px solid var(--omg-ink)',
          boxShadow: '8px 8px 0px var(--omg-ink)',
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-7 bg-[var(--omg-ink)] rounded-[20px] z-[200]" />
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-1 bg-[var(--omg-ink)] rounded-full z-[200] opacity-25" />

        {/* Screen */}
        <div
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{
            backgroundImage: 'linear-gradient(var(--omg-grid, rgba(0,0,0,.055)) 1px, transparent 1px), linear-gradient(90deg, var(--omg-grid, rgba(0,0,0,.055)) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            backgroundColor: 'var(--omg-bg)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="pt-[50px] pb-[6px] px-[22px] flex justify-between items-center" dir="ltr">
      <span className="font-grotesk text-[14px] font-black text-[var(--omg-ink)]">9:41</span>
      <div className="font-grotesk text-[12px] text-[var(--omg-ink)] flex gap-1">📶 🔋</div>
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mt-[88px] mb-9">
      <span className="font-grotesk text-[10px] font-black text-[var(--omg-purple)] tracking-[3px] uppercase flex-shrink-0">{num}</span>
      <span className="font-grotesk text-[21px] font-black flex-shrink-0 text-[var(--omg-ink)]">{title}</span>
      <div className="flex-1 h-[2.5px] bg-[var(--omg-ink)] opacity-10" />
    </div>
  );
}

function Ticker() {
  const items = ['OMG!', 'ANONYMOUS', 'BOOM 💥', 'MYSTERY SENDER', 'WOW 🔥'];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-[10px] border-t-[2.5px] border-b-[2.5px] border-black/10 bg-[var(--omg-card)]">
      <div className="omg-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i}>
            <span className="font-grotesk font-black text-[11px] text-[var(--omg-ink)] uppercase tracking-[2px] px-3">{item}</span>
            <span className="text-[var(--omg-purple)] font-black px-1">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AppNav({ active }: { active: 'home' | 'inbox' | 'settings' }) {
  const tabs = [
    { id: 'home', emoji: '🏠', label: 'الرئيسية' },
    { id: 'inbox', emoji: '💬', label: 'الرسائل' },
    { id: 'settings', emoji: '⚙️', label: 'الإعدادات' },
  ];
  return (
    <div className="omg-bot-nav sticky bottom-0">
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer">
          <span className="text-[20px]">{t.emoji}</span>
          <span className="font-grotesk text-[9px] font-black uppercase tracking-[0.5px]"
            style={{ color: t.id === active ? 'var(--omg-purple)' : 'var(--omg-muted)' }}>
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── SCREEN: LOGIN ─────────────────────────────────────────────────────────────

function ScreenLogin() {
  return (
    <div className="relative">
      <div className="absolute -top-10 -right-10 w-[220px] h-[220px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,110,176,.28) 0%, transparent 70%)' }} />
      <StatusBar />

      {/* Floating stickers */}
      <div className="absolute top-[76px] left-3 omg-fl-stk" style={{ ['--r-start' as string]: '-13deg', ['--r-end' as string]: '3deg' }}>
        <OMGSticker variant="yellow">BOOM! 💥</OMGSticker>
      </div>
      <div className="absolute top-[104px] right-[14px] omg-fl-stk" style={{ animationDelay: '0.8s' }}>
        <OMGSticker variant="yellow" shape="circle" size={46}>NEW</OMGSticker>
      </div>

      <div className="text-center pt-[112px] px-7 relative z-10">
        <div className="font-grotesk font-black text-[68px] text-[var(--omg-purple)] leading-[0.88] tracking-[-3px]">OMG!</div>
        <div className="text-[14px] text-[var(--omg-muted)] mt-[10px] font-bold">اعرف اللي الناس عايزين يقولوه</div>
        <div className="mt-3 flex justify-center">
          <OMGSticker variant="yellow">● ANONYMOUS CHAT</OMGSticker>
        </div>
      </div>

      <div className="px-[22px] mt-7 relative z-10">
        <OMGInput label="الإيميل" placeholder="ايميلك هنا..." type="email" dir="ltr" />
        <OMGInput label="كلمة السر" placeholder="••••••••" type="password" dir="ltr" />
        <OMGButton variant="purple" className="mb-3">دخول ✨</OMGButton>
        <OMGButton variant="white" size="sm">مفيش حساب؟ سجّل الآن</OMGButton>

        <p className="text-[11px] text-[var(--omg-muted)] text-center mt-[18px] leading-[1.6]">
          بالدخول بتوافق على <span className="text-[var(--omg-purple)] font-bold">الخصوصية</span> و<span className="text-[var(--omg-purple)] font-bold">الشروط</span>
        </p>
      </div>
    </div>
  );
}

// ── SCREEN: REGISTER ──────────────────────────────────────────────────────────

function ScreenRegister() {
  return (
    <div className="relative">
      <div className="absolute -top-10 -left-10 w-[200px] h-[200px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(123,47,255,.18) 0%, transparent 70%)' }} />
      <StatusBar />

      <div className="text-center pt-[80px] px-7 relative z-10">
        <div className="font-grotesk font-black text-[48px] text-[var(--omg-ink)] leading-[0.95] tracking-[-2px]">
          سجّل في <span className="text-[var(--omg-purple)]">OMG!</span>
        </div>
        <div className="text-[13px] text-[var(--omg-muted)] mt-[10px] font-bold">هويتك هتفضل مجهولة تماماً</div>
      </div>

      <div className="px-[22px] mt-6 relative z-10">
        <OMGInput label="اسمك" placeholder="اكتب اسمك..." />
        <OMGInput label="الإيميل" placeholder="ايميلك هنا..." type="email" dir="ltr" />
        <OMGInput label="كلمة السر" placeholder="••••••••" type="password" dir="ltr" />
        <div className="mb-4" />
        <OMGButton variant="purple" className="mb-3">سجّل وابدأ 🎯</OMGButton>
        <OMGButton variant="white" size="sm">عندي حساب — ادخل</OMGButton>
      </div>
    </div>
  );
}

// ── SCREEN: HOME ─────────────────────────────────────────────────────────────

function ScreenHome() {
  return (
    <div>
      <StatusBar />
      <div className="flex justify-between items-center px-5 py-0 mb-3">
        <span className="font-grotesk font-black text-[22px] text-[var(--omg-ink)] tracking-[-1px]">
          <span className="text-[var(--omg-purple)]">OMG!</span>
        </span>
        <div className="flex gap-2 items-center">
          <div className="icon-btn">🔔</div>
          <OMGAvatar emoji="😎" size="md" variant="pink" />
        </div>
      </div>

      <Ticker />

      <div className="px-5 my-4">
        <OMGShareCard
          displayName="من بيفكر فيك؟"
          slug="omar"
          baseUrl="omg.app"
          onCopy={() => {}}
          onShare={() => {}}
        />
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-2">
          <OMGStatPill number={42} label="رسالة" />
          {/* TODO: backend does not return message count — showing openedCount only */}
          <OMGStatPill number={156} label="مشاهدة" />
          <OMGStatPill number={8} label="محادثة" />
        </div>
      </div>

      <div className="px-5 pb-[100px]">
        <OMGButton variant="white">📬 افتح صندوق الرسائل</OMGButton>
      </div>

      <AppNav active="home" />
    </div>
  );
}

// ── SCREEN: PUBLIC SEND ───────────────────────────────────────────────────────

function ScreenPublicSend() {
  const [charCount, setCharCount] = useState(0);
  return (
    <div>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center gap-[10px] mb-4">
        <span className="text-[var(--omg-ink)] text-[22px] font-black cursor-pointer">←</span>
        <span className="font-grotesk text-[14px] font-bold text-[var(--omg-muted)]">OMG! Chat</span>
      </div>

      <div className="text-center px-5 mb-5">
        <OMGAvatar emoji="🦁" size="xl" variant="purple" className="mx-auto" />
        <div className="font-grotesk text-[22px] font-black mt-[14px] text-[var(--omg-ink)]">omar ✨</div>
        <div className="text-[13px] text-[var(--omg-muted)] mt-[2px]">@omar</div>
        <div className="mt-[10px] flex justify-center">
          <OMGSticker variant="purple">🔒 ANONYMOUS MODE</OMGSticker>
        </div>
      </div>

      <div className="px-5">
        <OMGCard className="mb-[14px]">
          <div className="text-[11px] font-black text-[var(--omg-muted)] mb-[10px] font-grotesk uppercase tracking-[1px]">رسالتك</div>
          <OMGTextarea
            placeholder="قول ما في قلبك... 👀"
            maxChars={200}
            charCount={charCount}
            onChange={(e) => setCharCount(e.target.value.length)}
            className="bg-[var(--omg-bg)] min-h-[100px] shadow-none border-[var(--omg-dim)]"
          />
          <div className="flex justify-between items-center mt-2">
            <OMGSticker variant="yellow" className="text-[9px]">هوية مجهولة 🔒</OMGSticker>
          </div>
        </OMGCard>
        <OMGButton variant="purple" className="mb-3">ابعت OMG! 🎯</OMGButton>
        <p className="text-[11px] text-[var(--omg-muted)] text-center leading-[1.6]">omar مش هيعرف مين انت إطلاقاً ✓</p>
      </div>
    </div>
  );
}

function ScreenPublicSendGuest() {
  return (
    <div>
      <StatusBar />
      <div className="px-5 pt-2 flex items-center gap-[10px] mb-4">
        <span className="text-[var(--omg-ink)] text-[22px] font-black">←</span>
        <span className="font-grotesk text-[14px] font-bold text-[var(--omg-muted)]">OMG! Chat</span>
      </div>

      <div className="text-center px-5 mb-5">
        <OMGAvatar emoji="🦁" size="xl" variant="purple" className="mx-auto" />
        <div className="font-grotesk text-[22px] font-black mt-[14px] text-[var(--omg-ink)]">omar ✨</div>
        <div className="text-[13px] text-[var(--omg-muted)] mt-[2px]">@omar</div>
      </div>

      <div className="px-5">
        <div className="relative">
          {/* Blurred background */}
          <div className="opacity-30" style={{ filter: 'blur(3px)', pointerEvents: 'none' }}>
            <OMGCard className="mb-3">
              <OMGTextarea placeholder="قول ما في قلبك..." className="bg-[var(--omg-bg)] min-h-[90px] shadow-none" disabled />
            </OMGCard>
            <OMGButton variant="purple">ابعت OMG!</OMGButton>
          </div>

          {/* Auth gate overlay */}
          <div className="absolute inset-0 flex items-center">
            <div
              className="w-full bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[28px] p-6 text-center"
              style={{ boxShadow: '6px 6px 0 var(--omg-ink)' }}
            >
              <div className="text-[40px] mb-3">👀</div>
              <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)] mb-2">حابب تبعت؟</div>
              <div className="text-[13px] text-[var(--omg-muted)] mb-5 leading-[1.6]">
                اعمل حساب مجاني — هويتك تفضل مجهولة تماماً
              </div>
              <div className="flex flex-col gap-2">
                <OMGButton variant="purple" size="sm">اعمل حساب مجاني</OMGButton>
                <OMGButton variant="white" size="sm">عندي حساب — ادخل</OMGButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenSentSuccess() {
  return (
    <div className="relative min-h-full">
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,230,68,.38) 0%, transparent 70%)' }} />
      <StatusBar />
      <div className="flex flex-col items-center justify-center min-h-[640px] px-8 text-center relative z-10">
        <div className="text-[80px] mb-5 omg-pop-in">🎯</div>
        <OMGSticker variant="purple" className="mb-4">RECEIVED!</OMGSticker>
        <div className="font-grotesk text-[28px] font-black text-[var(--omg-ink)] mb-3">وصلت! 💙</div>
        <div className="text-[16px] text-[var(--omg-muted)] leading-[1.7] mb-7">
          رسالتك اتبعتت بنجاح<br />هويتك محمية تماماً
        </div>
        <div className="flex gap-2 flex-wrap justify-center mb-7">
          <OMGSticker variant="yellow">✓ مجهول</OMGSticker>
          <OMGSticker variant="white">✓ آمن</OMGSticker>
        </div>
        <OMGButton variant="purple" className="mb-3">ابعت تاني</OMGButton>
        <OMGButton variant="yellow">عمل حساب وشارك 🔥</OMGButton>
      </div>
    </div>
  );
}

// ── SCREEN: INBOX ─────────────────────────────────────────────────────────────

const mockThreads = [
  { aliasName: 'Anonymous Fox 🦊', lastMessage: 'فاكرتني؟ 😏', time: '2 د', unread: true, badgeCount: 2, emoji: '🦊', avatarVariant: 'purple' as const },
  { aliasName: 'Mystery Panda 🐼', lastMessage: 'عندي حاجة عايز أقولهالك', time: '15 د', unread: false, emoji: '🐼', avatarVariant: 'pink' as const },
  { aliasName: 'Pixel Ghost 👾', lastMessage: 'OMG بجد انت الأحسن 🔥', time: '1 س', unread: true, badgeCount: 1, emoji: '👾', avatarVariant: 'yellow' as const },
  { aliasName: 'Shadow Jester 🎭', lastMessage: 'اسألني بعدين 😅', time: 'أمس', unread: false, emoji: '🎭', avatarVariant: 'purple' as const },
  { aliasName: 'Night Owl 🌙', lastMessage: '🔥🔥🔥', time: 'أمس', unread: false, emoji: '🌙', avatarVariant: 'pink' as const },
];

function ScreenInbox() {
  const [filter, setFilter] = useState<'all' | 'new'>('all');
  return (
    <div>
      <StatusBar />
      <div className="flex justify-between items-center px-5 pt-0 mb-3">
        <div>
          <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)]">صندوق الرسائل 📬</div>
          <div className="text-[12px] text-[var(--omg-muted)] mt-[2px]">3 رسائل جديدة</div>
        </div>
        <OMGSticker variant="yellow" shape="circle" size={40}>NEW</OMGSticker>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 pb-4">
        {(['all', 'new'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="font-grotesk text-[10px] font-black px-4 py-[7px] rounded-full border-[3px] border-[var(--omg-ink)] uppercase tracking-[0.5px] cursor-pointer"
            style={{
              background: filter === f ? 'var(--omg-purple)' : 'var(--omg-card)',
              color: filter === f ? '#fff' : 'var(--omg-muted)',
              boxShadow: '3px 3px 0 var(--omg-ink)',
            }}
          >
            {f === 'all' ? 'الكل' : 'جديد 🔴'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-[100px]">
        {mockThreads.map((t) => (
          <OMGThreadCard key={t.aliasName} {...t} />
        ))}
      </div>

      <AppNav active="inbox" />
    </div>
  );
}

// ── SCREEN: CHAT ──────────────────────────────────────────────────────────────

function ScreenChat() {
  return (
    <div className="flex flex-col h-full">
      <StatusBar />

      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] sticky top-0 z-50">
        <span className="text-[var(--omg-ink)] text-[22px] font-black cursor-pointer">←</span>
        <OMGAvatar emoji="🦊" size="md" variant="purple" square />
        <div className="flex-1">
          <div className="font-grotesk text-[16px] font-black text-[var(--omg-ink)]">anonymous</div>
          <div className="text-[11px] text-[var(--omg-muted)] font-bold">tap to reveal · maybe</div>
        </div>
        <OMGSticker variant="yellow" shape="circle" size={36}>new</OMGSticker>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-[10px] p-4 flex-1">
        <OMGChatBubble role="them" content="i think u're cool 😊" time="9:30 م" avatarEmoji="🦊" />
        <OMGChatBubble role="me" content="OMG who is this 👀" time="9:31 م" />
        <OMGChatBubble role="them" content="guess." time="9:32 م" avatarEmoji="🦊" />
        <OMGChatBubble role="me" content="tell me 🙏" time="9:33 م" />
        <OMGChatBubble
          role="them"
          content="مش هقولك 🤫 بس افتكر إنك حلو جداً"
          time="9:34 م"
          avatarEmoji="🦊"
          reactions={[
            { emoji: '😍', count: 2, active: true },
            { emoji: '😭', count: 1 },
            { emoji: '🔥', count: 3 },
          ]}
        />
        <div className="font-grotesk text-[10px] font-black text-[var(--omg-purple)] text-left" dir="ltr">Seen 👀 9:35 م</div>
      </div>

      {/* Input bar */}
      <div
        className="px-4 pb-8 pt-3 border-t-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] flex gap-[10px] items-center sticky bottom-0"
      >
        <input
          className="flex-1 bg-[var(--omg-bg)] border-[3px] border-[var(--omg-ink)] rounded-full px-[18px] py-[11px] text-[15px] font-cairo outline-none text-[var(--omg-text)]"
          style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
          placeholder="send anonymously..."
          dir="rtl"
        />
        <button
          className="bg-[var(--omg-yellow)] border-[3px] border-[var(--omg-ink)] rounded-full px-4 py-[10px] font-grotesk font-black text-[12px] tracking-[0.5px] uppercase flex-shrink-0 text-[var(--omg-ink)]"
          style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
        >
          SEND →
        </button>
      </div>
    </div>
  );
}

// ── SCREEN: SETTINGS ──────────────────────────────────────────────────────────

function ScreenSettings() {
  return (
    <div>
      <StatusBar />
      <div className="px-5 pt-0 mb-4">
        <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)]">الإعدادات ⚙️</div>
      </div>

      <div className="px-5 mb-4">
        <div className="omg-card-hero text-center py-6">
          <OMGAvatar emoji="😎" size="xl" variant="purple" className="mx-auto" />
          <div className="font-grotesk text-[20px] font-black mt-[14px] text-[var(--omg-ink)]">omar ✨</div>
          <div className="text-[13px] text-[var(--omg-muted)] mt-[3px]">@omar</div>
          <div className="link-pill my-[14px]">
            <span className="link-url">omg.app/s/omar</span>
            <span className="text-[14px] cursor-pointer">📋</span>
          </div>
          <OMGButton variant="white" size="sm">✏️ تعديل الملف الشخصي</OMGButton>
        </div>
      </div>

      <div className="px-5">
        <div className="omg-set-group mb-3">
          <div className="font-grotesk text-[9px] font-black text-[var(--omg-muted)] uppercase tracking-[2px] px-4 pt-3 pb-[6px]">الحساب</div>
          {[
            { ico: '✏️', title: 'الاسم', sub: 'omar' },
            { ico: '🔗', title: 'اليوزرنيم', sub: '@omar' },
          ].map((row) => (
            <div key={row.title} className="omg-set-row">
              <div className="w-9 h-9 rounded-[10px] bg-[var(--omg-bg)] flex items-center justify-content-center text-[17px] border-[2px] border-[var(--omg-ink)/10] flex-shrink-0 flex items-center justify-center">{row.ico}</div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-[var(--omg-ink)]">{row.title}</div>
                <div className="text-[12px] text-[var(--omg-muted)]">{row.sub}</div>
              </div>
              <span className="text-[var(--omg-ink)] text-[18px] font-black">›</span>
            </div>
          ))}
        </div>

        <div className="omg-set-group mb-3">
          <div className="font-grotesk text-[9px] font-black text-[var(--omg-muted)] uppercase tracking-[2px] px-4 pt-3 pb-[6px]">الإشعارات</div>
          <div className="omg-set-row">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--omg-bg)] flex items-center justify-center text-[17px] flex-shrink-0 border-[2px] border-black/10">🔔</div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[var(--omg-ink)]">الإشعارات</div>
              <div className="text-[12px] text-[var(--omg-muted)]">إشعارات الرسائل الجديدة</div>
            </div>
            <div className="omg-toggle" />
          </div>
        </div>

        <div className="omg-set-group mb-4">
          <div className="font-grotesk text-[9px] font-black text-[var(--omg-muted)] uppercase tracking-[2px] px-4 pt-3 pb-[6px]">القانوني</div>
          {[{ ico: '🔒', title: 'سياسة الخصوصية' }, { ico: '📄', title: 'الشروط والأحكام' }].map((row) => (
            <div key={row.title} className="omg-set-row">
              <div className="w-9 h-9 rounded-[10px] bg-[var(--omg-bg)] flex items-center justify-center text-[17px] flex-shrink-0 border-[2px] border-black/10">{row.ico}</div>
              <div className="flex-1 text-[14px] font-bold text-[var(--omg-ink)]">{row.title}</div>
              <span className="text-[var(--omg-ink)] text-[18px] font-black">›</span>
            </div>
          ))}
        </div>

        <OMGButton variant="white" className="mb-2">🚪 تسجيل خروج</OMGButton>
        <OMGButton variant="red">🗑️ حذف الحساب</OMGButton>
      </div>

      <div className="pb-[100px]" />
      <AppNav active="settings" />
    </div>
  );
}

// ── MODALS ────────────────────────────────────────────────────────────────────

function ModalBlock({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end z-[200]">
      <div className="omg-sheet w-full">
        <div className="w-10 h-1 bg-black/20 rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-[14px] mb-5">
          <OMGAvatar emoji="🦊" size="lg" variant="purple" square />
          <div>
            <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)]">حظر Anonymous Fox؟</div>
            <div className="text-[13px] text-[var(--omg-muted)]">مش هيقدر يبعتلك رسائل تاني</div>
          </div>
        </div>
        <div className="bg-[#FFF0F0] border-[2.5px] border-[var(--omg-red)] rounded-[14px] p-[12px_16px] mb-5" style={{ boxShadow: '3px 3px 0 var(--omg-red)' }}>
          <div className="text-[13px] text-[var(--omg-red)] leading-[1.6] font-bold">⚠️ مش هيعرف إنك حظرته. المحادثة هتتشال.</div>
        </div>
        <OMGButton variant="red" className="mb-2">🚫 حظر المرسل</OMGButton>
        <OMGButton variant="ghost" onClick={onClose}>إلغاء</OMGButton>
      </div>
    </div>
  );
}

function ModalReport({ onClose }: { onClose: () => void }) {
  const options = [
    { ico: '🤬', label: 'محتوى مسيء أو مزعج' },
    { ico: '😰', label: 'تحرش أو تهديد' },
    { ico: '🔞', label: 'محتوى غير لائق' },
    { ico: '❓', label: 'سبب تاني' },
  ];
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end z-[200]">
      <div className="omg-sheet w-full">
        <div className="w-10 h-1 bg-black/20 rounded-full mx-auto mb-5" />
        <div className="font-grotesk text-[20px] font-black mb-[6px] text-[var(--omg-ink)]">بلغ عن رسالة 🚩</div>
        <div className="text-[14px] text-[var(--omg-muted)] mb-[22px] leading-[1.5]">ساعدنا نحافظ على الـ OMG! آمن للجميع</div>
        {options.map((o) => (
          <div key={o.label} className="flex items-center gap-3 p-[13px] bg-[var(--omg-bg)] rounded-[14px] mb-2 cursor-pointer border-[2px] border-[var(--omg-ink)]" style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}>
            <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[19px] bg-[var(--omg-card)] border-[2px] border-[var(--omg-ink)] flex-shrink-0">{o.ico}</div>
            <span className="flex-1 text-[14px] font-bold text-[var(--omg-ink)]">{o.label}</span>
            <span className="text-[var(--omg-ink)] font-black text-[16px]">›</span>
          </div>
        ))}
        <OMGButton variant="ghost" onClick={onClose} className="mt-3">إلغاء</OMGButton>
      </div>
    </div>
  );
}

function ModalDeleteAccount({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-end z-[200]">
      <div className="omg-sheet w-full text-center">
        <div className="w-10 h-1 bg-black/20 rounded-full mx-auto mb-5" />
        <div className="text-[52px] mb-3">⚠️</div>
        <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)] mb-2">حذف الحساب نهائياً؟</div>
        <div className="text-[14px] text-[var(--omg-muted)] mb-5 leading-[1.6]">كل بياناتك ورسائلك هتتمسح ومش هيرجعوا</div>
        <div className="bg-[#FFF0F0] border-[2.5px] border-[var(--omg-red)] rounded-[14px] p-[14px_16px] mb-5 text-start" style={{ boxShadow: '3px 3px 0 var(--omg-red)' }}>
          <div className="text-[13px] text-[var(--omg-red)] leading-[1.7] font-bold">
            🔴 الرسائل مش هترجع<br />🔴 رابطك الـ OMG! هيتعطل<br />🔴 المحادثات هتتمسح
          </div>
        </div>
        <OMGButton variant="red" className="mb-2">🗑️ نعم، احذف حسابي</OMGButton>
        <OMGButton variant="ghost" onClick={onClose}>لأ، ارجع</OMGButton>
      </div>
    </div>
  );
}

// ── MAIN DEMO PAGE ────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [activeModal, setActiveModal] = useState<'block' | 'report' | 'delete' | null>(null);

  return (
    <div className="max-w-[1600px] mx-auto px-8 pt-[72px] pb-[140px]" dir="rtl">

      {/* Hero */}
      <header className="text-center mb-[80px]">
        <div className="font-grotesk font-black text-[clamp(48px,8vw,96px)] text-[var(--omg-ink)] tracking-[-4px] leading-[0.92]">
          <span className="text-[var(--omg-purple)]">OMG!</span> Design System
        </div>
        <p className="font-grotesk text-[16px] text-[var(--omg-muted)] mt-[14px]">Anonymous Chat App — V2 · Comic · Poster · Chunky · RTL Arabic</p>
        <div className="flex gap-2 justify-center flex-wrap mt-5">
          {['Cream + Grid Background', 'Thick Black Outlines', 'Comic Offset Shadow', 'Purple + Yellow Palette', 'Chunky Bold Type', 'RTL Arabic'].map((c) => (
            <span key={c} className="font-grotesk text-[9px] font-black px-[13px] py-[5px] rounded-full border-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)] uppercase tracking-[1px]" style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}>{c}</span>
          ))}
        </div>
      </header>

      {/* Design System Preview */}
      <div className="omg-card-hero mb-[90px]">
        <div className="text-[9px] font-grotesk font-black text-[var(--omg-muted)] uppercase tracking-[2px] mb-4 pb-2 border-b border-black/10">Design Tokens — Colors</div>
        <div className="flex gap-3 flex-wrap mb-6">
          {[
            { color: '#FDF6EC', label: '--bg' },
            { color: '#7B2FFF', label: '--purple' },
            { color: '#FFE644', label: '--yellow' },
            { color: '#FF6EB0', label: '--pink' },
            { color: '#0A0A0A', label: '--ink' },
            { color: '#FF3333', label: '--red' },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-[6px]">
              <div className="w-[52px] h-[52px] rounded-[14px] border-[3px] border-[var(--omg-ink)]" style={{ background: t.color, boxShadow: '3px 3px 0 var(--omg-ink)' }} />
              <span className="font-grotesk text-[9px] font-bold text-[var(--omg-muted)] uppercase">{t.label}</span>
            </div>
          ))}
        </div>

        <div className="text-[9px] font-grotesk font-black text-[var(--omg-muted)] uppercase tracking-[2px] mb-4 pb-2 border-b border-black/10">Sticker Badges</div>
        <div className="flex gap-2 flex-wrap items-center mb-6">
          <OMGSticker variant="yellow">OMG! 💥</OMGSticker>
          <OMGSticker variant="purple">ANONYMOUS</OMGSticker>
          <OMGSticker variant="white">👀 SEEN</OMGSticker>
          <OMGSticker variant="pink">● LIVE</OMGSticker>
          <OMGSticker variant="red">BLOCKED</OMGSticker>
          <OMGSticker variant="yellow" shape="circle" size={40}>WOW</OMGSticker>
          <OMGSticker variant="purple" shape="circle" size={40}>👀</OMGSticker>
        </div>

        <div className="text-[9px] font-grotesk font-black text-[var(--omg-muted)] uppercase tracking-[2px] mb-4 pb-2 border-b border-black/10">Buttons</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 mb-6">
          <OMGButton variant="purple">شارك رابطك 🔥</OMGButton>
          <OMGButton variant="yellow">ابعت OMG! 🎯</OMGButton>
          <OMGButton variant="white">انسخ الرابط 📋</OMGButton>
          <OMGButton variant="ghost">إلغاء</OMGButton>
          <OMGButton variant="red">حذف الحساب</OMGButton>
        </div>

        <div className="text-[9px] font-grotesk font-black text-[var(--omg-muted)] uppercase tracking-[2px] mb-4 pb-2 border-b border-black/10">Inputs</div>
        <div className="grid grid-cols-2 gap-4">
          <OMGInput label="الإيميل" placeholder="ايميلك هنا..." />
          <OMGInput label="اليوزرنيم" prefix="omg.app/s/" placeholder="slug" dir="ltr" />
        </div>
      </div>

      {/* 01 Login */}
      <SectionHeader num="01" title="Login / Register" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Login Default"><ScreenLogin /></PhoneFrame>
        <PhoneFrame label="Register"><ScreenRegister /></PhoneFrame>
      </div>

      {/* 02 Home */}
      <SectionHeader num="02" title="Home Screen" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Main Dashboard"><ScreenHome /></PhoneFrame>
      </div>

      {/* 03 Public Send */}
      <SectionHeader num="03" title="Public Profile / Send" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Logged In — Compose"><ScreenPublicSend /></PhoneFrame>
        <PhoneFrame label="Logged Out — Auth Gate"><ScreenPublicSendGuest /></PhoneFrame>
        <PhoneFrame label="Message Sent 🎯"><ScreenSentSuccess /></PhoneFrame>
      </div>

      {/* 04 Inbox */}
      <SectionHeader num="04" title="Inbox Screen" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Thread List"><ScreenInbox /></PhoneFrame>
        <PhoneFrame label="Empty Inbox" height={620}>
          <StatusBar />
          <div className="px-5 pt-0 mb-3"><div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)]">صندوق الرسائل 📬</div></div>
          <OMGEmptyState emoji="📬" badge="NO OMGS YET!" title="لا يوجد OMGs!" subtitle="شارك رابطك وانتظر المفاجأة 👀" actionLabel="شارك رابطك 🔥" onAction={() => {}} />
        </PhoneFrame>
        <PhoneFrame label="Loading Skeleton" height={620}>
          <StatusBar />
          <div className="px-5 pt-0 mb-3"><div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)]">جار التحميل...</div></div>
          <OMGShimmerList count={3} />
        </PhoneFrame>
        <PhoneFrame label="Error State" height={620}>
          <StatusBar />
          <OMGEmptyState emoji="💥" badge="ERROR!" title="حصل مشكلة!" subtitle="الإنترنت وقف أو في مشكلة مؤقتة" actionLabel="حاول تاني 🔄" onAction={() => {}} />
        </PhoneFrame>
      </div>

      {/* 05 Chat */}
      <SectionHeader num="05" title="Chat Screen" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Active Conversation"><ScreenChat /></PhoneFrame>
        <PhoneFrame label="Blocked Thread" height={620}>
          <StatusBar />
          <div className="px-5 pt-2 flex items-center gap-[10px] mb-4">
            <span className="text-[var(--omg-ink)] text-[22px] font-black">←</span>
            <span className="font-grotesk text-[16px] font-bold text-[var(--omg-ink)]">Anonymous Fox 🦊</span>
          </div>
          <OMGEmptyState
            emoji="🚫"
            badge="BLOCKED"
            title="تم الحظر"
            subtitle="مش هيقدر يبعتلك تاني"
          />
          <div className="px-5 flex flex-col gap-2">
            <OMGButton variant="white" size="sm">إلغاء الحظر</OMGButton>
            <OMGButton variant="ghost" size="sm" style={{ color: 'var(--omg-red)' }}>🚩 بلغ للـ OMG Team</OMGButton>
          </div>
        </PhoneFrame>
      </div>

      {/* 06 Settings */}
      <SectionHeader num="06" title="Settings Screen" />
      <div className="flex gap-8 flex-wrap justify-center">
        <PhoneFrame label="Main Settings"><ScreenSettings /></PhoneFrame>
      </div>

      {/* 07 Modals */}
      <SectionHeader num="07" title="Modals & Bottom Sheets" />
      <div className="flex gap-8 flex-wrap justify-center mb-10">
        <PhoneFrame label="Block Confirmation" height={680}>
          <div className="relative h-full">
            <StatusBar />
            <div className="opacity-25" style={{ filter: 'blur(2px)' }}>
              <div className="p-4 flex flex-col gap-3">
                <OMGChatBubble role="them" content="فاكرتني؟ 😏" avatarEmoji="🦊" />
                <OMGChatBubble role="me" content="مين انت؟ 😅" />
              </div>
            </div>
            <ModalBlock onClose={() => {}} />
          </div>
        </PhoneFrame>

        <PhoneFrame label="Report Message" height={680}>
          <div className="relative h-full">
            <StatusBar />
            <ModalReport onClose={() => {}} />
          </div>
        </PhoneFrame>

        <PhoneFrame label="Delete Account" height={680}>
          <div className="relative h-full">
            <StatusBar />
            <ModalDeleteAccount onClose={() => {}} />
          </div>
        </PhoneFrame>

        <PhoneFrame label="Safety Action ✅" height={680}>
          <div className="relative min-h-full">
            <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,230,68,.38) 0%, transparent 70%)' }} />
            <StatusBar />
            <div className="flex flex-col items-center justify-center min-h-[560px] px-8 text-center relative z-10">
              <div className="text-[70px] mb-5 omg-pop-in">✅</div>
              <OMGSticker variant="yellow" className="mb-4">REPORT SENT!</OMGSticker>
              <div className="font-grotesk text-[24px] font-black text-[var(--omg-ink)] mb-[10px]">تم البلاغ</div>
              <div className="text-[14px] text-[var(--omg-muted)] leading-[1.7] mb-7">البلاغ اتبعت لـ OMG Team وهنراجعه في أقرب وقت 🔒</div>
              <OMGButton variant="white" size="sm" className="w-auto px-6">رجوع للمحادثات</OMGButton>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Interactive modal demo */}
      <div className="omg-card-hero mb-[90px]">
        <div className="text-[9px] font-grotesk font-black text-[var(--omg-muted)] uppercase tracking-[2px] mb-4 pb-2 border-b border-black/10">Interactive Modals Demo</div>
        <div className="flex gap-3 flex-wrap">
          <OMGButton variant="red" half onClick={() => setActiveModal('block')}>🚫 Block Modal</OMGButton>
          <OMGButton variant="white" half onClick={() => setActiveModal('report')}>🚩 Report Modal</OMGButton>
          <OMGButton variant="ghost" half onClick={() => setActiveModal('delete')} style={{ color: 'var(--omg-red)', borderColor: 'var(--omg-red)', boxShadow: '3px 3px 0 var(--omg-red)' }}>🗑️ Delete Account</OMGButton>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-[100px] pt-[44px] border-t-[3px] border-[var(--omg-ink)]">
        <div className="font-grotesk text-[34px] font-black text-[var(--omg-ink)] mb-2">
          <span className="text-[var(--omg-purple)]">OMG!</span> Design System V2
        </div>
        <div className="text-[13px] text-[var(--omg-muted)]">Comic · Poster · Chunky · Bold · Made in Egypt 🇪🇬</div>
        <div className="flex gap-2 justify-center flex-wrap mt-4">
          <OMGSticker variant="yellow">Cream + Grid</OMGSticker>
          <OMGSticker variant="purple">Thick Outlines</OMGSticker>
          <OMGSticker variant="white">Comic Shadows</OMGSticker>
          <OMGSticker variant="yellow" shape="circle" size={38}>RTL</OMGSticker>
        </div>
      </div>

      {/* Fullscreen interactive modals */}
      {activeModal === 'block' && (
        <OMGModal isOpen onClose={() => setActiveModal(null)} title="حظر Anonymous Fox؟">
          <div className="flex items-center gap-4 mb-5">
            <OMGAvatar emoji="🦊" size="lg" variant="purple" square />
            <p className="text-[13px] text-[var(--omg-muted)]">مش هيقدر يبعتلك رسائل تاني</p>
          </div>
          <div className="bg-[#FFF0F0] border-[2.5px] border-[var(--omg-red)] rounded-[14px] p-4 mb-5" style={{ boxShadow: '3px 3px 0 var(--omg-red)' }}>
            <p className="text-[13px] text-[var(--omg-red)] font-bold">⚠️ مش هيعرف إنك حظرته. المحادثة هتتشال.</p>
          </div>
          <OMGButton variant="red" className="mb-2">🚫 حظر المرسل</OMGButton>
          <OMGButton variant="ghost" onClick={() => setActiveModal(null)}>إلغاء</OMGButton>
        </OMGModal>
      )}

      {activeModal === 'report' && (
        <OMGModal isOpen onClose={() => setActiveModal(null)} title="بلغ عن رسالة 🚩" subtitle="ساعدنا نحافظ على الـ OMG! آمن للجميع">
          {[
            { ico: '🤬', label: 'محتوى مسيء أو مزعج' },
            { ico: '😰', label: 'تحرش أو تهديد' },
            { ico: '🔞', label: 'محتوى غير لائق' },
            { ico: '❓', label: 'سبب تاني' },
          ].map((o) => (
            <div key={o.label} className="flex items-center gap-3 p-[13px] bg-[var(--omg-bg)] rounded-[14px] mb-2 cursor-pointer border-[2px] border-[var(--omg-ink)]" style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}>
              <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[19px] bg-[var(--omg-card)] border-[2px] border-[var(--omg-ink)]">{o.ico}</div>
              <span className="flex-1 text-[14px] font-bold">{o.label}</span>
              <span className="font-black">›</span>
            </div>
          ))}
          <OMGButton variant="ghost" onClick={() => setActiveModal(null)} className="mt-3">إلغاء</OMGButton>
        </OMGModal>
      )}

      {activeModal === 'delete' && (
        <OMGModal isOpen onClose={() => setActiveModal(null)}>
          <div className="text-center mb-4">
            <div className="text-[52px] mb-3">⚠️</div>
            <div className="font-grotesk text-[22px] font-black mb-2">حذف الحساب نهائياً؟</div>
            <p className="text-[var(--omg-muted)] text-[14px]">كل بياناتك ورسائلك هتتمسح ومش هيرجعوا</p>
          </div>
          <div className="bg-[#FFF0F0] border-[2.5px] border-[var(--omg-red)] rounded-[14px] p-4 mb-5 text-start" style={{ boxShadow: '3px 3px 0 var(--omg-red)' }}>
            <p className="text-[13px] text-[var(--omg-red)] font-bold leading-[1.7]">🔴 الرسائل مش هترجع<br />🔴 رابطك الـ OMG! هيتعطل<br />🔴 المحادثات هتتمسح</p>
          </div>
          <OMGButton variant="red" className="mb-2">🗑️ نعم، احذف حسابي</OMGButton>
          <OMGButton variant="ghost" onClick={() => setActiveModal(null)}>لأ، ارجع</OMGButton>
        </OMGModal>
      )}
    </div>
  );
}
