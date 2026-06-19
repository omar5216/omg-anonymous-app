'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isReady = useAuthStore((s) => s.isReady);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // Wait for AuthProvider to finish its session check before deciding.
    if (!isReady) return;
    if (!accessToken) {
      router.replace('/login');
    }
  }, [isReady, accessToken, router]);

  // Show loading screen while AuthProvider is restoring the session.
  if (!isReady) {
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

  // Don't render protected content while redirecting to login.
  if (!accessToken) return null;

  return (
    <div className="omg-grid-bg min-h-screen flex justify-center">
      <div className="w-full flex flex-col" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
