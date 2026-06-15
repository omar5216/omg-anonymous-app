'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGInput } from '@/components/omg/OMGInput';
import { OMGSticker } from '@/components/omg/OMGSticker';
import { authApi } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch {
      setError('في مشكلة في الإنترنت، حاول تاني');
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
        <OMGSticker variant="yellow">🔑 FORGOT?</OMGSticker>
      </div>

      <div className="text-center pt-[100px] relative z-10">
        <div className="font-grotesk font-black text-[72px] text-[var(--omg-purple)] leading-[0.88] tracking-[-3px]">
          OMG!
        </div>
        <div className="text-[14px] text-[var(--omg-muted)] mt-[10px] font-bold">نسيت كلمة السر؟</div>
      </div>

      <div className="mt-8 relative z-10">
        {sent ? (
          <div className="text-center">
            <div className="p-[20px_24px] rounded-[16px] border-[2.5px] border-[var(--omg-green,#22c55e)] mb-6"
              style={{ background: '#F0FFF4', boxShadow: '3px 3px 0 var(--omg-green,#22c55e)' }}>
              <div className="text-[28px] mb-2">📬</div>
              <p className="text-[15px] font-bold text-[#15803d]">تم الإرسال!</p>
              <p className="text-[13px] text-[#15803d] mt-1 leading-[1.6]">
                لو الإيميل ده موجود عندنا، هيوصلك رابط إعادة التعيين دلوقتي.
                <br />افتح إيميلك وافحص مجلد الـ spam لو مش لاقيه.
              </p>
            </div>
            <Link href="/login">
              <OMGButton variant="white" size="sm">رجوع لتسجيل الدخول</OMGButton>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-[14px] text-[var(--omg-muted)] mb-6 leading-[1.7] text-center">
              اكتب إيميلك وهنبعتلك رابط عشان تعمل كلمة سر جديدة.
            </p>

            <OMGInput
              label="الإيميل"
              placeholder="ايميلك هنا..."
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {error && (
              <div className="mb-4 p-[12px_16px] rounded-[14px] border-[2.5px] border-[var(--omg-red)] text-[13px] text-[var(--omg-red)] font-bold"
                style={{ background: '#FFF0F0', boxShadow: '3px 3px 0 var(--omg-red)' }}>
                ⚠️ {error}
              </div>
            )}

            <OMGButton variant="purple" disabled={loading || !email} className="mb-3">
              {loading ? 'جاري الإرسال...' : 'ابعتلي الرابط ✉️'}
            </OMGButton>

            <Link href="/login">
              <OMGButton variant="white" size="sm">رجوع لتسجيل الدخول</OMGButton>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
