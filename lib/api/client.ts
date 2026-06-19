/**
 * OMG! API client — typed, error-aware, auth-header-injecting.
 *
 * All requests go through `apiFetch`. It:
 *   1. Reads the current access token from the auth store (if available)
 *   2. Attaches Authorization: Bearer <token>
 *   3. On 401 (non-auth endpoint), silently refreshes the token and retries once
 *   4. Parses JSON responses
 *   5. Throws ApiError on non-2xx
 */

import { ApiError, type ApiErrorDto } from './types';
import type {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  OauthDto,
  TokenPairDto,
  ProfileDto,
  UpdateProfileDto,
  PublicLinkDto,
  PublicLinkPublicDto,
  ThreadSummaryDto,
  SentThreadSummaryDto,
  ThreadDetailDto,
  SendAnonymousMessageDto,
  SendResultDto,
  MessageDto,
  SendReplyDto,
  MarkSeenDto,
  ReactDto,
  ReactionSummaryDto,
  OkDto,
  BlockResultDto,
  CreateReportDto,
  ReportResultDto,
  PaginatedDto,
} from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://omg-backend-v2-production.up.railway.app/api/v1';

// ── injected callbacks ────────────────────────────────────────────────────────
// Set once by the auth store at module load to avoid circular dependencies.

let _getAccessToken: (() => string | null) | null = null;
export function setTokenAccessor(fn: () => string | null) {
  _getAccessToken = fn;
}

// Called on 401 to silently refresh. Returns the new access token, or null if
// the refresh token is also invalid (in which case the store has already cleared
// the session).
let _doRefresh: (() => Promise<string | null>) | null = null;
export function setRefreshHandler(fn: () => Promise<string | null>) {
  _doRefresh = fn;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function parseErrorBody(body: unknown, status: number): ApiError {
  const err = (body ?? {}) as Partial<ApiErrorDto>;
  return new ApiError(
    status,
    err.code ?? 'UNKNOWN_ERROR',
    err.message ?? `HTTP ${status}`,
  );
}

// ── core fetch ────────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  _isRetry = false,
): Promise<T> {
  const token = _getAccessToken?.() ?? null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  // ── silent token refresh on 401 ──────────────────────────────────────────
  // Skip auth endpoints to avoid refresh loops, and skip retries.
  if (res.status === 401 && !_isRetry && !path.startsWith('/auth/') && _doRefresh) {
    const newToken = await _doRefresh();
    if (newToken) {
      // Retry once with the fresh token.
      return apiFetch<T>(path, init, true);
    }
    // _doRefresh cleared the session internally — just surface the 401.
    throw new ApiError(401, 'AUTH_SESSION_EXPIRED', 'Session expired. Please log in again.');
  }

  if (res.status === 204) return undefined as unknown as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw parseErrorBody(body, res.status);
  }

  return body as T;
}

// ── auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (dto: RegisterDto) =>
    apiFetch<TokenPairDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  login: (dto: LoginDto) =>
    apiFetch<TokenPairDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  refresh: (dto: RefreshTokenDto) =>
    apiFetch<TokenPairDto>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  oauth: (dto: OauthDto) =>
    apiFetch<TokenPairDto>('/auth/oauth', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  logout: (dto: RefreshTokenDto) =>
    apiFetch<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  deleteAccount: () =>
    apiFetch<void>('/auth/account', { method: 'DELETE' }),

  forgotPassword: (email: string) =>
    apiFetch<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// ── profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  getMe: () => apiFetch<ProfileDto>('/profile/me'),

  update: (dto: UpdateProfileDto) =>
    apiFetch<ProfileDto>('/profile/me', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
};

// ── public links ──────────────────────────────────────────────────────────────
export const linksApi = {
  getMyLink: () => apiFetch<PublicLinkDto>('/links/mine'),

  getPublicProfile: (slug: string) =>
    apiFetch<PublicLinkPublicDto>(`/links/${slug}`),

  sendMessage: (slug: string, dto: SendAnonymousMessageDto) =>
    apiFetch<SendResultDto>(`/links/${slug}/send`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
};

// ── threads ───────────────────────────────────────────────────────────────────
export const threadsApi = {
  list: (cursor?: string) => {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    return apiFetch<PaginatedDto<ThreadSummaryDto>>(`/threads${qs}`);
  },

  listSent: (cursor?: string) => {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    return apiFetch<PaginatedDto<SentThreadSummaryDto>>(`/threads/sent${qs}`);
  },

  get: (threadId: string) =>
    apiFetch<ThreadDetailDto>(`/threads/${threadId}`),

  block: (threadId: string) =>
    apiFetch<BlockResultDto>(`/threads/${threadId}/block`, { method: 'POST' }),

  unblock: (threadId: string) =>
    apiFetch<BlockResultDto>(`/threads/${threadId}/block`, { method: 'DELETE' }),

  report: (threadId: string, dto: CreateReportDto) =>
    apiFetch<ReportResultDto>(`/threads/${threadId}/report`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
};

// ── messages ──────────────────────────────────────────────────────────────────
export const messagesApi = {
  list: (threadId: string, cursor?: string) => {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    return apiFetch<PaginatedDto<MessageDto>>(`/threads/${threadId}/messages${qs}`);
  },

  reply: (threadId: string, dto: SendReplyDto) =>
    apiFetch<SendResultDto>(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  markSeen: (threadId: string, dto: MarkSeenDto) =>
    apiFetch<OkDto>(`/threads/${threadId}/seen`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
};

// ── reactions ─────────────────────────────────────────────────────────────────
export const reactionsApi = {
  react: (messageId: string, dto: ReactDto) =>
    apiFetch<OkDto>(`/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  unreact: (messageId: string) =>
    apiFetch<OkDto>(`/messages/${messageId}/react`, { method: 'DELETE' }),

  list: (messageId: string) =>
    apiFetch<ReactionSummaryDto>(`/messages/${messageId}/reactions`),
};
