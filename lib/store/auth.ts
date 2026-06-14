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
import { authApi, setTokenAccessor } from '@/lib/api/client';
import type { ProfileDto } from '@/lib/api/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  profile: ProfileDto | null;

  // actions
  setTokens: (access: string, refresh: string) => void;
  setProfile: (profile: ProfileDto) => void;
  logout: () => Promise<void>;
  tryRestoreSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,

      setTokens(access, refresh) {
        set({ accessToken: access, refreshToken: refresh });
      },

      setProfile(profile) {
        set({ profile });
      },

      async logout() {
        const { refreshToken } = get();
        // best-effort — ignore errors (token may already be expired)
        if (refreshToken) {
          try {
            await authApi.logout({ refreshToken });
          } catch {
            // swallow
          }
        }
        set({ accessToken: null, refreshToken: null, profile: null });
      },

      async tryRestoreSession() {
        const { refreshToken } = get();
        if (!refreshToken) return false;
        try {
          const pair = await authApi.refresh({ refreshToken });
          set({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
          return true;
        } catch {
          // refresh token expired or revoked — clear everything
          set({ accessToken: null, refreshToken: null, profile: null });
          return false;
        }
      },
    }),
    {
      name: 'omg-auth',
      // only persist tokens, not profile (re-fetch on restore)
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

// Wire up the token accessor so `lib/api/client.ts` can read the current token
// without importing Zustand directly (avoids circular deps).
// Called once at module load — safe because Zustand store is a singleton.
setTokenAccessor(() => useAuthStore.getState().accessToken);
