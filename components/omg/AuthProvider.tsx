'use client';

/**
 * AuthProvider — runs once on mount, restores the session, then signals
 * isReady so layout guards don't redirect before the check completes.
 *
 * Restore logic:
 *   1. If there's a valid access token in memory, try GET /profile/me.
 *      - Success → session is live; set profile and mark ready.
 *      - 401     → access token is expired; fall through to refresh.
 *      - Other   → network error; keep session, mark ready (don't log out).
 *   2. If the access token was absent or expired, try refresh.
 *      - Success → new tokens issued; fetch profile; mark ready.
 *      - Auth failure → store already cleared session; mark ready (logged out).
 *      - Network error → session kept; mark ready.
 *   3. If there's no refresh token → user is logged out; mark ready immediately.
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { profileApi } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const { accessToken, refreshToken, tryRestoreSession, setProfile, setReady } =
      useAuthStore.getState();

    (async () => {
      try {
        // No tokens at all — definitely logged out.
        if (!accessToken && !refreshToken) {
          return;
        }

        // Try an optimistic profile fetch if we have an access token.
        if (accessToken) {
          try {
            const profile = await profileApi.getMe();
            setProfile(profile);
            return; // session is healthy
          } catch (e) {
            if (!(e instanceof ApiError) || e.statusCode !== 401) {
              // Network error / 5xx — keep existing session, proceed.
              return;
            }
            // 401 — access token expired; fall through to refresh below.
          }
        }

        // Refresh (handles both "no access token" and "expired access token").
        const ok = await tryRestoreSession();
        if (ok) {
          try {
            const profile = await profileApi.getMe();
            setProfile(profile);
          } catch {
            // Profile fetch after refresh failed (network?) — not fatal.
          }
        }
      } finally {
        setReady(true);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
