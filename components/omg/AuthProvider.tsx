'use client';

/**
 * AuthProvider — runs on mount, attempts to restore a valid session
 * using the persisted refresh token. Must wrap the entire app.
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { profileApi } from '@/lib/api/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, tryRestoreSession, setProfile } = useAuthStore();
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    (async () => {
      let hasAccess = !!accessToken;

      if (!hasAccess) {
        hasAccess = await tryRestoreSession();
      }

      if (hasAccess) {
        try {
          const profile = await profileApi.getMe();
          setProfile(profile);
        } catch {
          // profile fetch failed — not fatal, proceed without it
        }
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
