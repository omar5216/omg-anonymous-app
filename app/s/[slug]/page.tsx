'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { linksApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { PublicLinkPublicDto } from '@/lib/api/types';
import { OMGAvatar } from '@/components/omg/OMGAvatar';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { OMGTextarea } from '@/components/omg/OMGInput';
import { OMGCard } from '@/components/omg/OMGCard';

const MAX_CHARS = 300;

type Screen = 'loading' | 'not-found' | 'auth-gate' | 'compose' | 'sending' | 'success' | 'error';

export default function PublicSendPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [profile, setProfile] = useState<PublicLinkPublicDto | null>(null);
  const [screen, setScreen] = useState<Screen>('loading');
  const [content, setContent] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);

  // Load the public profile (no auth required)
  useEffect(() => {
    if (!slug) return;
    linksApi.getPublicProfile(slug)
      .then((p) => {
        setProfile(p);
        setScreen(accessToken ? 'compose' : 'auth-gate');
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 404) {
          setScreen('not-found');
        } else {
          setScreen('error');
        }
      });
  }, [slug, accessToken]);

  async function handleSend() {
    if (!content.trim() || !slug) return;
    setScreen('sending');
    setSendError(null);
    try {
      await linksApi.sendMessage(slug, { content: content.trim() });
      setScreen('success');
    } catch (err) {
      let msg = 'في مشكلة، حاول تاني 😬';
      if (err instanceof ApiError) {
        if (err.statusCode === 429) msg = 'بعتِ كتير! ريّح شوية وحاول تاني 🙏';
        else if (err.statusCode === 404) msg = 'الرابط ده مش موجود أو اتعطّل';
        else if (err.statusCode === 401) {
          router.replace(`/login?returnTo=/s/${slug}`);
          return;
        }
      }
      setSendError(msg);
      setScreen('compose');
    }
  }

  const returnTo = encodeURIComponent(`/s/${slug}`);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (screen === 'loading') {
    return (
      <PageShell>
        <div className="flex flex-col gap-4 px-5 mt-[60px]">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="omg-shimmer w-[80px] h-[80px] rounded-full" />
            <div className="omg-shimmer w-[140px] h-[22px] rounded-full" />
            <div className="omg-shimmer w-[90px] h-[14px] rounded-full" />
          </div>
          <div className="omg-shimmer h-[120px] rounded-[20px]" />
          <div className="omg-shimmer h-[52px] rounded-full" />
        </div>
      </PageShell>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (screen === 'not-found') {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
          <div className="text-[64px] mb-4">🔍</div>
          <OMGSticker variant="red" className="mb-4">NOT FOUND</OMGSticker>
          <div className="font-grotesk text-[24px] font-black text-[var(--omg-ink)] mb-3">مش لاقيينه!</div>
          <p className="text-[14px] text-[var(--omg-muted)] leading-[1.7]">
            الرابط ده مش موجود أو اتعطّل من صاحبه
          </p>
        </div>
      </PageShell>
    );
  }

  // ── Network error ─────────────────────────────────────────────────────────
  if (screen === 'error') {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
          <div className="text-[64px] mb-4">💥</div>
          <OMGSticker variant="red" className="mb-4">ERROR!</OMGSticker>
          <div className="font-grotesk text-[24px] font-black text-[var(--omg-ink)] mb-3">حصل مشكلة!</div>
          <p className="text-[14px] text-[var(--omg-muted)] leading-[1.7] mb-6">تحقق من الإنترنت وحاول تاني</p>
          <OMGButton variant="white" size="sm" onClick={() => window.location.reload()}>
            حاول تاني 🔄
          </OMGButton>
        </div>
      </PageShell>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (screen === 'success') {
    return (
      <PageShell>
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,230,68,.38) 0%, transparent 70%)' }}
          />
          <div className="text-[80px] mb-5 omg-pop-in relative z-10">🎯</div>
          <OMGSticker variant="purple" className="mb-4 relative z-10">RECEIVED!</OMGSticker>
          <div className="font-grotesk text-[30px] font-black text-[var(--omg-ink)] mb-3 relative z-10">وصلت! 💙</div>
          <p className="text-[15px] text-[var(--omg-muted)] leading-[1.7] mb-6 relative z-10">
            رسالتك اتبعتت بنجاح<br />هويتك محمية تماماً ✓
          </p>
          <div className="flex gap-2 flex-wrap justify-center mb-8 relative z-10">
            <OMGSticker variant="yellow">✓ مجهول</OMGSticker>
            <OMGSticker variant="white">✓ آمن</OMGSticker>
          </div>
          <div className="flex flex-col gap-3 w-full relative z-10">
            <OMGButton variant="purple" onClick={() => { setContent(''); setScreen('compose'); }}>
              ابعت رسالة تانية 🔥
            </OMGButton>
            {accessToken ? (
              <>
                <OMGButton variant="yellow" onClick={() => router.push('/inbox')}>
                  شوف محادثاتي المرسلة 📨
                </OMGButton>
                <OMGButton variant="white" onClick={() => router.push('/home')}>
                  🏠 الرئيسية
                </OMGButton>
              </>
            ) : (
              <Link href={`/register?returnTo=/s/${slug}`}>
                <OMGButton variant="yellow">عمل حساب وشارك OMG! 👀</OMGButton>
              </Link>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Profile header (shared between auth-gate and compose) ─────────────────
  const ProfileHeader = () => (
    <div className="text-center pt-[60px] pb-4 px-5 relative z-10">
      <OMGAvatar
        emoji={profile?.displayName?.slice(0, 1) ?? '?'}
        size="xl"
        variant="purple"
        className="mx-auto"
      />
      <div className="font-grotesk text-[22px] font-black mt-[14px] text-[var(--omg-ink)]">
        {profile?.displayName ?? '—'} ✨
      </div>
      <div className="text-[13px] text-[var(--omg-muted)] mt-[2px]" dir="ltr">@{slug}</div>
      {profile?.bio && (
        <p className="text-[13px] text-[var(--omg-text)] mt-2 leading-[1.6]">{profile.bio}</p>
      )}
      <div className="mt-[10px] flex justify-center">
        <OMGSticker variant="purple">🔒 ANONYMOUS MODE</OMGSticker>
      </div>
    </div>
  );

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (screen === 'auth-gate') {
    return (
      <PageShell>
        <div className="relative">
          <div
            className="absolute -top-10 -right-10 w-[220px] h-[220px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(123,47,255,.16) 0%, transparent 70%)' }}
          />
          <ProfileHeader />

          <div className="px-5 mt-4 relative z-10">
            {/* Blurred composer behind the gate */}
            <div style={{ filter: 'blur(3px)', pointerEvents: 'none', opacity: 0.3 }}>
              <OMGCard className="mb-3">
                <textarea
                  className="omg-inp omg-inp-area w-full shadow-none border-[var(--omg-dim)] bg-[var(--omg-bg)]"
                  placeholder="قول ما في قلبك... 👀"
                  disabled
                />
              </OMGCard>
            </div>

            {/* Auth gate overlay */}
            <div className="-mt-[120px] mb-6">
              <div
                className="bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[28px] p-6 text-center"
                style={{ boxShadow: '6px 6px 0 var(--omg-ink)' }}
              >
                <div className="text-[40px] mb-3">👀</div>
                <div className="font-grotesk text-[20px] font-black text-[var(--omg-ink)] mb-2">حابب تبعت؟</div>
                <p className="text-[13px] text-[var(--omg-muted)] mb-5 leading-[1.7]">
                  اعمل حساب الأول — هويتك هتفضل مجهولة للطرف التاني تماماً ✓
                </p>
                <div className="flex flex-col gap-2">
                  <Link href={`/register?returnTo=${returnTo}`}>
                    <OMGButton variant="purple" size="sm">اعمل حساب مجاني</OMGButton>
                  </Link>
                  <Link href={`/login?returnTo=${returnTo}`}>
                    <OMGButton variant="white" size="sm">عندي حساب — ادخل</OMGButton>
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[var(--omg-muted)] text-center mt-2 leading-[1.6] pb-8">
              هويتك محمية تماماً — {profile?.displayName} مش هيعرف مين أنت إطلاقاً ✓
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Compose (logged in) ───────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="relative">
        <div
          className="absolute -top-10 -right-10 w-[220px] h-[220px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,110,176,.18) 0%, transparent 70%)' }}
        />
        <ProfileHeader />

        <div className="px-5 mt-4 pb-10 relative z-10">
          <OMGCard className="mb-4">
            <div className="text-[10px] font-grotesk font-black text-[var(--omg-muted)] mb-3 uppercase tracking-[1px]">
              رسالتك
            </div>
            <OMGTextarea
              placeholder="قول ما في قلبك... 👀"
              maxChars={MAX_CHARS}
              charCount={content.length}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-[var(--omg-bg)] min-h-[110px] shadow-none border-[var(--omg-dim)]"
              disabled={screen === 'sending'}
            />
            <div className="flex justify-between items-center mt-2">
              <OMGSticker variant="yellow" className="text-[9px]">هوية مجهولة 🔒</OMGSticker>
            </div>
          </OMGCard>

          {sendError && (
            <div
              className="mb-4 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold"
              style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}
            >
              ⚠️ {sendError}
            </div>
          )}

          <OMGButton
            variant="purple"
            disabled={screen === 'sending' || !content.trim() || content.length > MAX_CHARS}
            onClick={handleSend}
            className="mb-3"
          >
            {screen === 'sending' ? 'جاري الإرسال...' : 'ابعت OMG! 🎯'}
          </OMGButton>

          <p className="text-[11px] text-[var(--omg-muted)] text-center leading-[1.6]">
            {profile?.displayName} مش هيعرف مين أنت إطلاقاً ✓
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
