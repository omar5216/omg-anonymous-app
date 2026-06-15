'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGInput } from '@/components/omg/OMGInput';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { authApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('كلمة السر لازم تكون 8 حروف على الأقل');
      return;
    }
    if (newPassword !== confirm) {
      setError('كلمة السر مش متطابقة');
      return;
    }
    if (!token) {
      setError('الرابط ده مش صح. جرب تطلب رابط جديد.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 400) {
        setError('الرابط ده انتهت صلاحيته أو اتستخدم قبل كده. اطلب رابط جديد.');
      } else {
        setError('في مشكلة في الإنترنت، حاول تاني');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center pt-[140px] relative z-10 px-[22px]">
        <div className="text-[48px] mb-4">😕</div>
        <p className="text-[15px] font-bold text-[var(--omg-red)]">الرابط ده مش صح</p>
        <p className="text-[13px] text-[var(--omg-muted)] mt-2 mb-6">تأكد إنك فتحت الرابط من الإيميل صح.</p>
        <Link href="/forgot-password">
          <OMGButton variant="purple" size="sm">اطلب رابط جديد</OMGButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-[22px] pt-[60px] pb-12">
      <div className="absolute -top-16 -right-16 w-[260px] h-[260px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,110,176,.22) 0%, transparent 70%)' }} />
      <div className="absolute top-[200px] -left-20 w-[200px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,.12) 0%, transparent 70%)' }} />

      <div className="absolute top-[72px] left-4 omg-fl-stk"
        style={{ ['--r-start' as string]: '-13deg', ['--r-end' as string]: '3deg' }}>
        <OMGSticker variant="yellow">🔐 NEW PASS</OMGSticker>
      </div>

      <div className="text-center pt-[100px] relative z-10">
        <div className="font-grotesk font-black text-[72px] text-[var(--omg-purple)] leading-[0.88] tracking-[-3px]">
          OMG!
        </div>
        <div className="text-[14px] text-[var(--omg-muted)] mt-[10px] font-bold">كلمة سر جديدة</div>
      </div>

      <div className="mt-8 relative z-10">
        {done ? (
          <div className="text-center">
            <div className="p-[20px_24px] rounded-[16px] border-[2.5px] border-[var(--omg-green,#22c55e)] mb-6"
              style={{ background: '#F0FFF4', boxShadow: '3px 3px 0 var(--omg-green,#22c55e)' }}>
              <div className="text-[28px] mb-2">🎉</div>
              <p className="text-[15px] font-bold text-[#15803d]">تم تغيير كلمة السر!</p>
              <p className="text-[13px] text-[#15803d] mt-1">دلوقتي تقدر تدخل بكلمة السر الجديدة.</p>
            </div>
            <Link href="/login">
              <OMGButton variant="purple">دخول ✨</OMGButton>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <OMGInput
              label="كلمة السر الجديدة"
              placeholder="••••••••"
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <OMGInput
              label="تأكيد كلمة السر"
              placeholder="••••••••"
              type="password"
              dir="ltr"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="mb-4 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold"
                style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
                ⚠️ {error}
              </div>
            )}

            <OMGButton variant="purple" disabled={loading || !newPassword || !confirm} className="mb-3">
              {loading ? 'جاري الحفظ...' : 'حفظ كلمة السر الجديدة 🔐'}
            </OMGButton>

            <Link href="/forgot-password">
              <OMGButton variant="white" size="sm">اطلب رابط جديد</OMGButton>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-grotesk font-black text-[48px] text-[var(--omg-purple)]">OMG!</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
