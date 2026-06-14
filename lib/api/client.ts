/**
 * OMG! API client — typed, error-aware, auth-header-injecting.
 *
 * All requests go through `apiFetch`. It:
 *   1. Reads the current access token from the auth store (if available)
 *   2. Attaches Authorization: Bearer <token>
 *   3. Parses JSON responses
 *   4. Throws ApiError on non-2xx, using the backend's standard error shape
 *
 * Token refresh is handled in the auth store — the client itself does not
 * silently retry here to keep the control flow explicit.
 */

import { ApiError, type ApiErrorDto } from './types';
import type {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
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

// ── token accessor ────────────────────────────────────────────────────────────
// Injected lazily to avoid circular dependency with the Zustand store.
// Set once by AuthProvider on mount.
let _getAccessToken: (() => string | null) | null = null;
export function setTokenAccessor(fn: () => string | null) {
  _getAccessToken = fn;
}

// ── core fetch ────────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
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

  if (res.status === 204) return undefined as unknown as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = body as Partial<ApiErrorDto>;
    throw new ApiError(
      res.status,
      err.code ?? 'UNKNOWN_ERROR',
      err.message ?? `HTTP ${res.status}`,
    );
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

  logout: (dto: RefreshTokenDto) =>
    apiFetch<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  deleteAccount: () =>
    apiFetch<void>('/auth/account', { method: 'DELETE' }),
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
  // backend path is /links/mine (not /links/me)
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

  // backend uses DELETE /threads/:id/block for unblock
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

  // reply returns SendResultDto {sent: boolean}, not MessageDto
  reply: (threadId: string, dto: SendReplyDto) =>
    apiFetch<SendResultDto>(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  // backend uses PATCH /threads/:id/seen, returns {ok: true}
  markSeen: (threadId: string, dto: MarkSeenDto) =>
    apiFetch<OkDto>(`/threads/${threadId}/seen`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
};

// ── reactions ─────────────────────────────────────────────────────────────────
// React endpoint is /messages/:messageId/react (not nested under threads)
export const reactionsApi = {
  // react returns {ok: true}
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
