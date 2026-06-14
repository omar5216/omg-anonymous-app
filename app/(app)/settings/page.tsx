'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { OMGAvatar } from '@/components/omg/OMGAvatar';
import { OMGButton } from '@/components/omg/OMGButton';
import { OMGBottomNav } from '@/components/omg/OMGBottomNav';
import { OMGModal } from '@/components/omg/OMGModal';

function SettingsRow({ ico, title, subtitle, onClick, danger }: {
  ico: string; title: string; subtitle?: string; onClick?: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="omg-set-row w-full text-right"
    >
      <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-[18px] flex-shrink-0 border-[2px] border-black/10"
        style={{ background: danger ? '#FFF0F0' : 'var(--omg-bg)' }}>
        {ico}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[14px] font-bold truncate ${danger ? 'text-[var(--omg-red)]' : 'text-[var(--omg-ink)]'}`}>{title}</div>
        {subtitle && <div className="text-[12px] text-[var(--omg-muted)] mt-[1px] truncate">{subtitle}</div>}
      </div>
      <span className={`font-black text-[18px] ${danger ? 'text-[var(--omg-red)]' : 'text-[var(--omg-muted)]'}`}>›</span>
    </button>
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <div className="font-grotesk text-[9px] font-black text-[var(--omg-muted)] uppercase tracking-[2px] px-4 pt-4 pb-[6px]">
      {label}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { profile, logout } = useAuthStore();
  const [logoutModal, setLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.replace('/login');
  }

  return (
    <div className="flex flex-col min-h-screen pb-[calc(88px+env(safe-area-inset-bottom,0px))]">
      <div className="px-5 omg-safe-top pb-3">
        <div className="font-grotesk text-[22px] font-black text-[var(--omg-ink)]">الإعدادات ⚙️</div>
      </div>

      {/* Profile card */}
      <div className="mx-5 mb-4">
        <div className="omg-card-hero text-center py-6">
          <OMGAvatar
            emoji={profile?.displayName?.slice(0, 1) ?? '?'}
            size="xl"
            variant="purple"
            className="mx-auto"
          />
          <div className="font-grotesk text-[20px] font-black mt-4 text-[var(--omg-ink)]">
            {profile?.displayName ?? '—'}
          </div>
          {profile?.bio && (
            <div className="text-[13px] text-[var(--omg-muted)] mt-[4px] px-4">{profile.bio}</div>
          )}
        </div>
      </div>

      {/* Account group */}
      <div className="omg-set-group mx-5 mb-3">
        <GroupLabel label="الحساب" />
        <SettingsRow
          ico="✏️"
          title="تعديل الاسم"
          subtitle={profile?.displayName}
        />
      </div>

      {/* Legal group */}
      <div className="omg-set-group mx-5 mb-3">
        <GroupLabel label="القانوني والدعم" />
        <SettingsRow ico="🔒" title="سياسة الخصوصية" onClick={() => router.push('/privacy')} />
        <SettingsRow ico="📄" title="الشروط والأحكام" onClick={() => router.push('/terms')} />
        <SettingsRow ico="💬" title="تواصل مع الدعم" onClick={() => router.push('/support')} />
      </div>

      {/* Danger zone */}
      <div className="mx-5 mb-4">
        <OMGButton
          variant="ghost"
          onClick={() => setLogoutModal(true)}
          className="mb-2 border-[var(--omg-ink)] font-bold"
        >
          🚪 تسجيل خروج
        </OMGButton>
      </div>

      <div className="mx-5 mb-2">
        <div
          className="border-[3px] border-[var(--omg-red)] rounded-[20px] overflow-hidden"
          style={{ boxShadow: '4px 4px 0 var(--omg-red)' }}
        >
          <div className="px-4 pt-4 pb-2">
            <div className="font-grotesk text-[9px] font-black text-[var(--omg-red)] uppercase tracking-[2px] mb-[2px]">منطقة الخطر</div>
            <p className="text-[12px] text-[var(--omg-red)] leading-[1.6]">حذف الحساب نهائي ولا يمكن التراجع عنه.</p>
          </div>
          <SettingsRow
            ico="🗑️"
            title="حذف حسابي نهائياً"
            subtitle="كل بياناتك ورسائلك هتتمسح"
            danger
          />
        </div>
      </div>

      <p className="text-center text-[11px] text-[var(--omg-muted)] mt-4 mb-2">
        OMG! Anonymous Chat · النسخة 1.0
      </p>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="w-full pointer-events-auto" style={{ maxWidth: 430 }}>
          <OMGBottomNav active="settings" />
        </div>
      </div>

      {/* Logout confirmation */}
      <OMGModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="تسجيل خروج؟">
        <p className="text-[14px] text-[var(--omg-muted)] mb-5 leading-[1.7]">
          هتخرج من حسابك. تقدر تدخل تاني في أي وقت.
        </p>
        <OMGButton variant="ghost" disabled={loggingOut} onClick={handleLogout} className="mb-2 border-[var(--omg-ink)]">
          {loggingOut ? '⏳ جاري الخروج...' : '🚪 أيوه، اخرجني'}
        </OMGButton>
        <OMGButton variant="purple" onClick={() => setLogoutModal(false)}>لأ، ابقى فيه</OMGButton>
      </OMGModal>
    </div>
  );
}
