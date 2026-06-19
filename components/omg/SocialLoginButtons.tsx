'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi, profileApi } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth';
import { ApiError, type ProfileDto } from '@/lib/api/types';

// ── env ───────────────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '';
// Apple SDK requires a pre-registered redirect URI (even in popup mode).
// Set this to your app origin, e.g. https://omgksa.com
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? '';

// ── Apple SDK types ───────────────────────────────────────────────────────────
interface AppleSignInResponse {
  authorization: { id_token: string; code: string };
  user?: { name?: { firstName?: string; lastName?: string }; email?: string };
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init(config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }): void;
        signIn(): Promise<AppleSignInResponse>;
      };
    };
  }
}

// ── shared post-OAuth flow ────────────────────────────────────────────────────
interface Props {
  returnTo?: string;
}

async function handleOAuthTokens(
  setTokens: (a: string, r: string) => void,
  setProfile: (p: ProfileDto) => void,
  pair: { accessToken: string; refreshToken: string },
  router: ReturnType<typeof useRouter>,
  returnTo: string,
) {
  setTokens(pair.accessToken, pair.refreshToken);
  try {
    const profile = await profileApi.getMe();
    setProfile(profile);
  } catch { /* non-fatal */ }
  router.replace(returnTo);
}

// ── Google button ─────────────────────────────────────────────────────────────
function GoogleButton({ returnTo = '/home' }: Props) {
  const router = useRouter();
  const { setTokens, setProfile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) { setError('في مشكلة مع Google، حاول تاني'); return; }
    setError(null);
    try {
      const pair = await authApi.oauth({ provider: 'google', idToken });
      await handleOAuthTokens(setTokens, setProfile, pair, router, returnTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'في مشكلة في الإنترنت، حاول تاني');
    }
  }

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div dir="ltr">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('فشل تسجيل الدخول بـ Google')}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="360"
        />
      </div>
      {error && <p className="mt-2 text-[12px] font-bold text-[var(--omg-red)] text-center">{error}</p>}
    </div>
  );
}

// ── Apple button ──────────────────────────────────────────────────────────────
function AppleButton({ returnTo = '/home' }: Props) {
  const router = useRouter();
  const { setTokens, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAppleSignIn() {
    if (!window.AppleID) {
      setError('Apple Sign In غير جاهز، حاول تاني بعد شوية');
      return;
    }

    const redirectURI = APPLE_REDIRECT_URI || window.location.origin;

    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI,
        usePopup: true,
      });

      setLoading(true);
      setError(null);
      const response = await window.AppleID.auth.signIn();
      const idToken = response.authorization.id_token;

      const pair = await authApi.oauth({ provider: 'apple', idToken });
      await handleOAuthTokens(setTokens, setProfile, pair, router, returnTo);
    } catch (err) {
      // User closed the popup — err.error === 'popup_closed_by_user'
      if (err && typeof err === 'object' && 'error' in err) {
        const appleErr = err as { error: string };
        if (appleErr.error === 'popup_closed_by_user') {
          // Silent — user cancelled intentionally
          return;
        }
      }
      setError(err instanceof ApiError ? err.message : 'في مشكلة مع Apple Sign In، حاول تاني');
    } finally {
      setLoading(false);
    }
  }

  if (!APPLE_CLIENT_ID) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleAppleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-[14px] px-4 rounded-[16px] border-[2.5px] border-[var(--omg-ink)] bg-[var(--omg-ink)] font-bold text-[15px] text-white transition-transform active:scale-[0.98]"
        style={{ boxShadow: '3px 3px 0 #333', opacity: loading ? 0.7 : 1 }}
      >
        <AppleIcon />
        {loading ? 'جاري الدخول...' : 'متابعة مع Apple'}
      </button>
      {error && <p className="mt-2 text-[12px] font-bold text-[var(--omg-red)] text-center">{error}</p>}
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 814 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.9C46 424.8 58.8 229.3 138.3 138.4c51.4-57.4 127.4-93.1 199.2-93.1 78.3 0 131.5 40.8 199.2 40.8 65.4 0 105.5-40.8 199.2-40.8 66.9 0 143.1 31.5 195.4 87.3zm-180.2-102c-31.1-37.5-75.4-64.9-124.1-64.9-60.5 0-105 37.5-135.2 91.7-17.1 30.3-34.1 81.8-28.4 131.3 54.4 4.2 109.4-25 142.6-62.2 33.1-37.1 56.6-88.7 45.1-95.9z"/>
    </svg>
  );
}

// ── exported component ────────────────────────────────────────────────────────
export function SocialLoginButtons({ returnTo = '/home' }: Props) {
  const hasGoogle = Boolean(GOOGLE_CLIENT_ID);
  const hasApple = Boolean(APPLE_CLIENT_ID);

  if (!hasGoogle && !hasApple) return null;

  return (
    <div className="relative z-10 mt-4">
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-[1.5px] bg-[var(--omg-border)]" />
        <span className="text-[12px] font-bold text-[var(--omg-muted)]">أو</span>
        <div className="flex-1 h-[1.5px] bg-[var(--omg-border)]" />
      </div>
      <div className="flex flex-col gap-3">
        <GoogleButton returnTo={returnTo} />
        <AppleButton returnTo={returnTo} />
      </div>
    </div>
  );
}
