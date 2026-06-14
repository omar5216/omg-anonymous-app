import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full px-5 pt-[60px] pb-12" style={{ maxWidth: 430 }}>
        <Link href="/settings" className="font-grotesk font-black text-[var(--omg-purple)] text-[14px] mb-6 block">← رجوع</Link>
        <div className="font-grotesk text-[26px] font-black text-[var(--omg-ink)] mb-2">الشروط والأحكام 📄</div>
        <p className="text-[13px] text-[var(--omg-muted)] mb-6 leading-[1.7]">آخر تحديث: يونيو 2026</p>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">الاستخدام المسموح</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            OMG! بتسمح بالتواصل المجهول بشكل احترامي. ممنوع التحرش أو التهديد أو المحتوى المسيء.
          </p>
        </div>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">المسؤولية</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            أنت مسؤول عن المحتوى اللي بتبعته. انتهاك الشروط ممكن يؤدي لحذف الحساب.
          </p>
        </div>
        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-2 text-[var(--omg-ink)]">التعديلات</div>
          <p className="text-[13px] text-[var(--omg-muted)] leading-[1.8]">
            ممكن نعدّل الشروط دي في أي وقت. هنبلّغك بأي تغييرات مهمة.
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
