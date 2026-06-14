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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/home';
  const { setTokens, setProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('كلمة السر لازم تكون 8 حروف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const pair = await authApi.register({ displayName: displayName.trim(), email: email.trim(), password });
      setTokens(pair.accessToken, pair.refreshToken);
      try {
        const profile = await profileApi.getMe();
        setProfile(profile);
      } catch { /* non-fatal */ }
      router.replace(returnTo);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409 || err.code === 'USER_ALREADY_EXISTS') {
          setError('الإيميل ده مسجّل بالفعل، ادخل أو استخدم إيميل تاني');
        } else if (err.statusCode === 400) {
          setError('تأكد إن البيانات صح: الإيميل صالح وكلمة السر 8 حروف على الأقل');
        } else {
          setError(err.message);
        }
      } else {
        setError('في مشكلة في الإنترنت، حاول تاني');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen px-[22px] pt-[60px] pb-12">
      <div className="absolute -top-16 -left-16 w-[240px] h-[240px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,.18) 0%, transparent 70%)' }} />

      <div className="absolute top-[88px] right-4 omg-fl-stk" style={{ animationDelay: '0.4s' }}>
        <OMGSticker variant="purple">🔒 ANONYMOUS</OMGSticker>
      </div>
      <div className="absolute top-[128px] left-3 omg-fl-stk"
        style={{ ['--r-start' as string]: '8deg', ['--r-end' as string]: '-4deg', animationDelay: '1.1s' }}>
        <OMGSticker variant="yellow" shape="circle" size={44}>FREE</OMGSticker>
      </div>

      <div className="text-center pt-[96px] relative z-10">
        <div className="font-grotesk font-black text-[46px] text-[var(--omg-ink)] leading-[0.95] tracking-[-2px]">
          سجّل في <span className="text-[var(--omg-purple)]">OMG!</span>
        </div>
        <div className="text-[14px] text-[var(--omg-muted)] mt-[10px] font-bold">هويتك هتفضل مجهولة تماماً</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 relative z-10" noValidate>
        <OMGInput label="اسمك" placeholder="اكتب اسمك..."
          value={displayName} onChange={(e) => setDisplayName(e.target.value)} required autoComplete="name" />
        <OMGInput label="الإيميل" placeholder="ايميلك هنا..." type="email" dir="ltr"
          value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <OMGInput label="كلمة السر" placeholder="8 حروف على الأقل..." type="password" dir="ltr"
          value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />

        {error && (
          <div className="mb-4 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold"
            style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
            ⚠️ {error}
          </div>
        )}

        <OMGButton variant="purple" disabled={loading} className="mb-3">
          {loading ? 'جاري التسجيل...' : 'سجّل وابدأ 🎯'}
        </OMGButton>
      </form>

      <div className="relative z-10">
        <Link href={`/login${returnTo !== '/home' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}>
          <OMGButton variant="white" size="sm">عندي حساب — ادخل</OMGButton>
        </Link>
        <p className="text-[11px] text-[var(--omg-muted)] text-center mt-[18px] leading-[1.6]">
          بالتسجيل بتوافق على{' '}
          <Link href="/privacy" className="text-[var(--omg-purple)] font-bold">الخصوصية</Link> و
          <Link href="/terms" className="text-[var(--omg-purple)] font-bold">الشروط</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-grotesk font-black text-[48px] text-[var(--omg-purple)]">OMG!</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
