'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, tryRestoreSession } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      if (accessToken) {
        setChecking(false);
        return;
      }
      // No access token in memory — try to restore via refresh token
      const ok = await tryRestoreSession();
      if (!ok) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (checking) {
    // Minimal loading state — same background, no flash
    return (
      <div className="omg-grid-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="font-grotesk font-black text-[42px] text-[var(--omg-purple)] tracking-[-2px]">
            OMG!
          </div>
          <div className="omg-shimmer w-[120px] h-[14px] rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full flex flex-col" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
