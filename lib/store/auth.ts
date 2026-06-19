'use client';

/**
 * OMG! Auth store — Zustand + localStorage.
 *
 * TODO: Move refresh token to httpOnly cookie before production/mobile release.
 *       Currently storing both tokens in localStorage for web MVP convenience.
 *       Risk: XSS can read localStorage. Mitigation for production: store
 *       refreshToken in Set-Cookie from the server, send accessToken in memory.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, setTokenAccessor, setRefreshHandler } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import type { ProfileDto } from '@/lib/api/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  profile: ProfileDto | null;
  /** True once AuthProvider has completed its initial session check. */
  isReady: boolean;

  // actions
  setTokens: (access: string, refresh: string) => void;
  setProfile: (profile: ProfileDto) => void;
  setReady: (v: boolean) => void;
  logout: () => Promise<void>;
  /**
   * Attempts to exchange the persisted refresh token for a fresh token pair.
   *
   * - Returns true on success.
   * - Returns false (without clearing the session) on network/server errors —
   *   keeps the user logged in so a temporary outage never forces a logout.
   * - Clears the session and returns false ONLY when the backend explicitly
   *   rejects the refresh token (401 / 403 / 404).
   * - De-duplicates concurrent calls so single-use rotation is never double-fired.
   */
  tryRestoreSession: () => Promise<boolean>;
}

// In-flight dedup — prevents two concurrent callers (AuthProvider + AppLayout)
// from both firing the refresh endpoint, which would invalidate the first
// rotation's refresh token and cause the second call to fail with 401.
let _restoreInFlight: Promise<boolean> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,
      isReady: false,

      setTokens(access, refresh) {
        set({ accessToken: access, refreshToken: refresh });
      },

      setProfile(profile) {
        set({ profile });
      },

      setReady(v) {
        set({ isReady: v });
      },

      async logout() {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await authApi.logout({ refreshToken });
          } catch {
            // best-effort — token may already be expired
          }
        }
        if (process.env.NODE_ENV === 'development') {
          console.info('[OMG auth] Session cleared: explicit logout');
        }
        set({ accessToken: null, refreshToken: null, profile: null });
      },

      tryRestoreSession() {
        if (_restoreInFlight) return _restoreInFlight;

        _restoreInFlight = (async () => {
          const { refreshToken } = get();
          if (!refreshToken) return false;

          try {
            const pair = await authApi.refresh({ refreshToken });
            set({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
            return true;
          } catch (e) {
            const isAuthError =
              e instanceof ApiError &&
              (e.statusCode === 401 || e.statusCode === 403 || e.statusCode === 404);

            if (isAuthError) {
              // Refresh token is truly invalid/revoked — safe to clear.
              if (process.env.NODE_ENV === 'development') {
                console.warn('[OMG auth] Session cleared: refresh token rejected by server', e);
              }
              set({ accessToken: null, refreshToken: null, profile: null });
            } else {
              // Network error, 5xx, timeout, etc. — keep session intact.
              if (process.env.NODE_ENV === 'development') {
                console.warn('[OMG auth] Refresh failed with non-auth error — keeping session', e);
              }
            }
            return false;
          } finally {
            _restoreInFlight = null;
          }
        })();

        return _restoreInFlight;
      },
    }),
    {
      name: 'omg-auth',
      // Persist tokens only; profile is re-fetched on restore.
      // isReady is intentionally excluded — it resets to false on every page load
      // so AuthProvider always runs its init check.
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

// Wire up the token accessor so apiFetch can read the current access token.
setTokenAccessor(() => useAuthStore.getState().accessToken);

// Wire up the refresh handler so apiFetch can silently refresh on 401.
setRefreshHandler(async () => {
  const ok = await useAuthStore.getState().tryRestoreSession();
  return ok ? useAuthStore.getState().accessToken : null;
});
