'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGInput } from '@/components/omg/OMGInput';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { authApi, profileApi } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth';
import { ApiError } from '@/lib/api/types';
import { SocialLoginButtons } from '@/components/omg/SocialLoginButtons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/home';
  const { setTokens, setProfile } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const pair = await authApi.login({ email: email.trim(), password });
      setTokens(pair.accessToken, pair.refreshToken);
      try {
        const profile = await profileApi.getMe();
        setProfile(profile);
      } catch { /* non-fatal */ }
      router.replace(returnTo);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 401 ? 'الإيميل أو كلمة السر غلط' : err.message);
      } else {
        setError('في مشكلة في الإنترنت، حاول تاني');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen px-[22px] pt-[60px] pb-12">
      <div className="absolute -top-16 -right-16 w-[260px] h-[260px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,110,176,.22) 0%, transparent 70%)' }} />
      <div className="absolute top-[200px] -left-20 w-[200px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,.12) 0%, transparent 70%)' }} />

      <div className="absolute top-[72px] left-4 omg-fl-stk"
        style={{ ['--r-start' as string]: '-13deg', ['--r-end' as string]: '3deg' }}>
        <OMGSticker variant="yellow">BOOM! 💥</OMGSticker>
      </div>
      <div className="absolute top-[104px] right-[18px] omg-fl-stk" style={{ animationDelay: '0.8s' }}>
        <OMGSticker variant="yellow" shape="circle" size={46}>NEW</OMGSticker>
      </div>

      <div className="text-center pt-[100px] relative z-10">
        <div className="font-grotesk font-black text-[72px] text-[var(--omg-purple)] leading-[0.88] tracking-[-3px]">
          OMG!
        </div>
        <div className="text-[14px] text-[var(--omg-muted)] mt-[10px] font-bold">اعرف اللي الناس عايزين يقولوه</div>
        <div className="mt-3 flex justify-center">
          <OMGSticker variant="yellow">● ANONYMOUS CHAT</OMGSticker>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 relative z-10" noValidate>
        <OMGInput label="الإيميل" placeholder="ايميلك هنا..." type="email" dir="ltr"
          value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <OMGInput label="كلمة السر" placeholder="••••••••" type="password" dir="ltr"
          value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />

        <div className="flex justify-end mb-2">
          <Link href="/forgot-password"
            className="text-[13px] font-bold text-[var(--omg-purple)] hover:underline">
            نسيت كلمة السر؟
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold"
            style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
            ⚠️ {error}
          </div>
        )}

        <OMGButton variant="purple" disabled={loading} className="mb-3">
          {loading ? 'جاري الدخول...' : 'دخول ✨'}
        </OMGButton>
      </form>

      <SocialLoginButtons returnTo={returnTo} />

      <div className="relative z-10 mt-4">
        <Link href={`/register${returnTo !== '/home' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}>
          <OMGButton variant="white" size="sm">مفيش حساب؟ سجّل الآن</OMGButton>
        </Link>
        <p className="text-[11px] text-[var(--omg-muted)] text-center mt-[18px] leading-[1.6]">
          بالدخول بتوافق على{' '}
          <span className="text-[var(--omg-purple)] font-bold">الخصوصية</span> و
          <span className="text-[var(--omg-purple)] font-bold">الشروط</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-grotesk font-black text-[48px] text-[var(--omg-purple)]">OMG!</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
