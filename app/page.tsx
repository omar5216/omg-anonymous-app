'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function RootPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [accessToken, router]);

  return (
    <div className="omg-grid-bg min-h-screen flex items-center justify-center">
      <div className="font-grotesk font-black text-[56px] text-[var(--omg-purple)] tracking-[-3px]">
        OMG!
      </div>
    </div>
  );
}
