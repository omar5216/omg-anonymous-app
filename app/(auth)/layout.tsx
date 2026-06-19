'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isReady = useAuthStore((s) => s.isReady);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (isReady && accessToken) {
      router.replace('/home');
    }
  }, [isReady, accessToken, router]);

  // While the session check is in flight, render nothing to avoid a flash
  // of the login screen for a user who is actually still logged in.
  if (!isReady) return null;

  if (accessToken) return null;

  return (
    <div className="omg-grid-bg min-h-screen flex items-stretch justify-center">
      <div className="w-full" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
