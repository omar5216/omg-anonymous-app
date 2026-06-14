'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { profileApi, linksApi } from '@/lib/api/client';
import { OMGAvatar } from '@/components/omg/OMGAvatar';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { OMGShareCard } from '@/components/omg/OMGShareCard';
import { OMGBottomNav } from '@/components/omg/OMGBottomNav';
import { OMGEmptyState } from '@/components/omg/OMGEmptyState';
import type { ProfileDto, PublicLinkDto } from '@/lib/api/types';
import { ApiError } from '@/lib/api/types';

// TODO: backend does not return total message count on the home screen endpoint.
// openedCount (link views) is available and shown. Add message count when backend exposes it.

const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST ?? 'omg.app';

function Ticker() {
  const items = ['OMG!', 'ANONYMOUS', 'BOOM 💥', 'MYSTERY SENDER', 'WOW 🔥', 'مجهول تماماً'];
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

export default function HomePage() {
  const router = useRouter();
  const { profile: cachedProfile, setProfile, logout } = useAuthStore();

  const [profile, setLocalProfile] = useState<ProfileDto | null>(cachedProfile);
  const [link, setLink] = useState<PublicLinkDto | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = link ? `https://${APP_HOST}/s/${link.slug}` : null;

  const fetchData = useCallback(async () => {
    setError(null);
    setLoadingData(true);
    try {
      const [profileData, linkData] = await Promise.all([
        profileApi.getMe(),
        linksApi.getMyLink(),
      ]);
      setLocalProfile(profileData);
      setProfile(profileData);
      setLink(linkData);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setError('مش قادرين نحمّل بياناتك — تحقق من الإنترنت وحاول تاني');
    } finally {
      setLoadingData(false);
    }
  }, [setProfile, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard not available — fallback: select the text
    }
  }

  async function handleShare() {
    if (!shareUrl) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'OMG! — ابعتلي رسالة مجهولة',
          text: `ابعتلي رسالة مجهولة على OMG! 👀\n${shareUrl}`,
          url: shareUrl,
        });
        return;
      } catch {
        // share cancelled or not supported
      }
    }
    // Fallback: copy
    await handleCopy();
  }

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  const firstName = profile?.displayName?.split(' ')[0] ?? '';

  return (
    <div className="flex flex-col min-h-screen pb-[calc(88px+env(safe-area-inset-bottom,0px))]">
      {/* Top bar */}
      <div className="flex justify-between items-center px-5 omg-safe-top pb-3 flex-shrink-0">
        <span className="font-grotesk font-black text-[28px] text-[var(--omg-ink)] tracking-[-1px]">
          <span className="text-[var(--omg-purple)]">OMG!</span>
        </span>
        <div className="flex gap-2 items-center">
          <button className="icon-btn" onClick={handleLogout} aria-label="تسجيل خروج" title="تسجيل خروج">🚪</button>
          <OMGAvatar
            emoji={profile?.displayName?.slice(0, 1) ?? '?'}
            size="md"
            variant="pink"
          />
        </div>
      </div>

      <Ticker />

      {/* Loading skeleton */}
      {loadingData && (
        <div className="flex flex-col gap-4 px-5 mt-5">
          <div className="omg-card-hero">
            <div className="flex flex-col gap-3">
              <div className="omg-shimmer h-[14px] w-[55%] rounded-full" />
              <div className="omg-shimmer h-[26px] w-[75%] rounded-full" />
              <div className="omg-shimmer h-[44px] w-full rounded-full" />
              <div className="flex gap-2">
                <div className="omg-shimmer flex-1 h-[44px] rounded-full" />
                <div className="omg-shimmer flex-1 h-[44px] rounded-full" />
              </div>
            </div>
          </div>
          <div className="omg-shimmer h-[52px] rounded-full" />
          <div className="omg-shimmer h-[52px] rounded-full" />
        </div>
      )}

      {/* Error */}
      {!loadingData && error && (
        <div className="px-5 mt-5">
          <OMGEmptyState
            emoji="💥"
            badge="مشكلة!"
            title="مش قادرين نحمّل"
            subtitle={error}
            actionLabel="حاول تاني 🔄"
            onAction={fetchData}
          />
        </div>
      )}

      {/* Content */}
      {!loadingData && !error && link && profile && (
        <>
          {/* Greeting */}
          {firstName && (
            <div className="px-5 mt-4 mb-1">
              <span className="text-[13px] text-[var(--omg-muted)] font-bold">
                أهلاً، <span className="text-[var(--omg-ink)]">{firstName}</span> 👋
              </span>
            </div>
          )}

          {/* Share card */}
          <div className="px-5 mt-2">
            <OMGShareCard
              displayName={profile.displayName}
              slug={link.slug}
              baseUrl={`${APP_HOST}/s`}
              onCopy={handleCopy}
              onShare={handleShare}
            />

            {/* Copy confirmation */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: copied ? '40px' : '0px', opacity: copied ? 1 : 0 }}
            >
              <div className="flex justify-center mt-2">
                <OMGSticker variant="yellow">✓ اتنسخ الرابط!</OMGSticker>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 px-5 mt-4 flex-wrap">
            <div
              className="flex items-center gap-2 px-4 py-[10px] rounded-[100px] border-[3px] border-[var(--omg-ink)] bg-[var(--omg-card)]"
              style={{ boxShadow: '3px 3px 0 var(--omg-ink)' }}
            >
              <span className="font-grotesk font-black text-[20px] text-[var(--omg-purple)]">{link.openedCount}</span>
              <span className="text-[11px] font-bold text-[var(--omg-muted)]">مشاهدة للرابط</span>
            </div>
            {/* TODO: show message count when backend exposes it on this endpoint */}
          </div>

          {/* Actions */}
          <div className="px-5 mt-4 flex flex-col gap-3">
            <OMGButton variant="purple" onClick={() => router.push('/inbox')}>📬 افتح صندوق الرسائل</OMGButton>
            <OMGButton variant="yellow" onClick={handleShare}>🔗 شارك رابطك</OMGButton>
          </div>

          {/* Tip */}
          <div className="mx-5 mt-4">
            <div className="bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[20px] p-5"
              style={{ boxShadow: '4px 4px 0 var(--omg-ink)' }}>
              <div className="font-grotesk text-[10px] font-black text-[var(--omg-muted)] uppercase tracking-[1.5px] mb-2">نصيحة ✨</div>
              <p className="text-[14px] text-[var(--omg-text)] leading-[1.7]">
                شارك رابطك على السوشيال ميديا وانتظر الرسائل المجهولة 👀<br />
                الناس مش هتعرف مين أنت — الكل مجهول!
              </p>
            </div>
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-full pointer-events-auto" style={{ maxWidth: 430 }}>
          <OMGBottomNav active="home" />
        </div>
      </div>
    </div>
  );
}
