import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full px-5 pt-[60px] pb-12" style={{ maxWidth: 430 }}>
        <Link href="/settings" className="font-grotesk font-black text-[var(--omg-purple)] text-[14px] mb-6 block">← رجوع</Link>
        <div className="font-grotesk text-[26px] font-black text-[var(--omg-ink)] mb-3">الدعم والمساعدة 💬</div>
        <p className="text-[13px] text-[var(--omg-muted)] mb-6 leading-[1.7]">في مشكلة؟ احنا هنا!</p>

        <a
          href="mailto:support@omg.app"
          className="omg-card flex items-center gap-4 mb-4 no-underline active:translate-x-[2px] active:translate-y-[2px] transition-transform block"
        >
          <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-[22px] bg-[var(--omg-yellow)] border-[2.5px] border-[var(--omg-ink)] flex-shrink-0">
            📧
          </div>
          <div>
            <div className="font-grotesk font-black text-[14px] text-[var(--omg-ink)]">ابعت إيميل</div>
            <div className="text-[12px] text-[var(--omg-purple)] font-bold">support@omg.app</div>
          </div>
        </a>

        <div className="omg-card mb-4">
          <div className="font-grotesk font-black text-[15px] mb-3 text-[var(--omg-ink)]">أسئلة شائعة</div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[13px] font-black text-[var(--omg-ink)]">إزاي أبعت رسالة مجهولة؟</div>
              <div className="text-[12px] text-[var(--omg-muted)] mt-1 leading-[1.7]">شارك رابطك على السوشيال ميديا — أي حد عنده حساب يقدر يبعتلك برسالة مجهولة.</div>
            </div>
            <div>
              <div className="text-[13px] font-black text-[var(--omg-ink)]">هل هويتي محمية فعلاً؟</div>
              <div className="text-[12px] text-[var(--omg-muted)] mt-1 leading-[1.7]">أيوه — المستقبل مش بيشوف اسمك أو إيميلك إطلاقاً. بيشوف اسم مستعار تلقائي بس.</div>
            </div>
            <div>
              <div className="text-[13px] font-black text-[var(--omg-ink)]">لو حد بعتلي محتوى مسيء؟</div>
              <div className="text-[12px] text-[var(--omg-muted)] mt-1 leading-[1.7]">استخدم زرار البلاغ في المحادثة — فريقنا هيراجع ويتصرف.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
