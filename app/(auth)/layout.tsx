'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace('/home');
    }
  }, [accessToken, router]);

  if (accessToken) return null;

  return (
    <div className="omg-grid-bg min-h-screen flex items-stretch justify-center">
      <div className="w-full" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
