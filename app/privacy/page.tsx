import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full px-5 pt-[60px] pb-12" style={{ maxWidth: 430 }}>
        <Link href="/settings" className="font-grotesk font-black text-[var(--omg-purple)] text-[14px] mb-6 block">← رجوع</Link>
        <div className="font-grotesk text-[26px] font-black text-[var(--omg-ink)] mb-2">سياسة الخصوصية 🔒</div>
        <p className="text-[13px] text-[var(--omg-muted)] mb-6 leading-[1.7]">آخر تحديث: يونيو 2026</p>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">البيانات اللي بنجمعها</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            بنجمع إيميلك واسم العرض بس عشان تشتغل الخدمة. مش بنبيع بياناتك لأي حد.
          </p>
        </div>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">الهوية المجهولة</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            المرسل بيفضل مجهول للمستقبل تماماً. النظام يعرف المرسل لأغراض الأمان والبلاغات فقط.
          </p>
        </div>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">الحذف</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            لو حذفت حسابك هيتمسح كل بياناتك ورسائلك نهائياً.
          </p>
        </div>
        <p className="text-[12px] text-[var(--omg-muted)] text-center mt-8">
          أي أسئلة؟{' '}
          <a href="mailto:support@omg.app" className="text-[var(--omg-purple)] font-bold">support@omg.app</a>
        </p>
      </div>
    </div>
  );
}
