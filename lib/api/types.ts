/**
 * API types — mirrors the Swagger DTOs from omg-backend-v2.
 * Source of truth: https://omg-backend-v2-production.up.railway.app/docs-json
 * Do not add fields that are not returned by the API.
 */

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface TokenPairDto {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface ProfileDto {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  linksEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  linksEnabled?: boolean;
}

// ─── Public Links ────────────────────────────────────────────────────────────

/** Returned to the owner — includes openedCount and userId */
export interface PublicLinkDto {
  id: string;
  userId: string;
  slug: string;
  isActive: boolean;
  openedCount: number;
  createdAt: string;
}

/** Returned to the public — no owner identity */
export interface PublicLinkPublicDto {
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

// ─── Threads ─────────────────────────────────────────────────────────────────

export interface ThreadSummaryDto {
  id: string;
  aliasName: string;
  lastMessageAt: string;
  messageCount: number;
  isArchived: boolean;
  createdAt: string;
  lastMessagePreview: string | null;
}

export interface SentThreadSummaryDto {
  threadId: string;
  recipientName: string;
  lastMessageAt: string | null;
  messageCount: number;
  createdAt: string;
  lastMessagePreview: string | null;
}

export interface ThreadDetailDto {
  id: string;
  aliasName: string;
  lastMessageAt: string;
  isArchived: boolean;
  isBlocked: boolean;
  createdAt: string;
  /** 'recipient' = link owner viewing their inbox; 'sender' = anonymous sender viewing their sent thread */
  viewerRole: 'recipient' | 'sender';
}

export interface SendAnonymousMessageDto {
  content: string;
  contentType?: 'text';
}

export interface SendResultDto {
  sent: boolean;
}

// ─── Messages ────────────────────────────────────────────────────────────────

/** 'anonymous' = the anonymous sender, 'recipient' = the link owner replying */
export type MessageAuthorRole = 'anonymous' | 'recipient';

export interface MessageDto {
  id: string;
  authorRole: MessageAuthorRole;
  /** The alias name for the sender role, or display name for the recipient */
  displayName: string;
  /** True if this message was authored by the requesting user */
  isMine: boolean;
  content: string;
  contentType: 'text';
  sentAt: string;
  seenAt: string | null;
  isFlagged: boolean;
  /** emoji → count map */
  reactions: Record<string, number>;
}

export interface SendReplyDto {
  content: string;
  contentType?: 'text';
}

export interface MarkSeenDto {
  upToTimestamp: string;
}

// ─── Reactions ───────────────────────────────────────────────────────────────

export interface ReactDto {
  emoji: string;
}

export interface ReactionSummaryDto {
  messageId: string;
  reactions: Record<string, number>;
}

/** Returned by mark-seen and react endpoints */
export interface OkDto {
  ok: boolean;
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

export interface BlockResultDto {
  blocked: boolean;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export type ReportReason = 'harassment' | 'spam' | 'inappropriate' | 'other';

export interface CreateReportDto {
  reason: ReportReason;
  description?: string;
  messageId?: string;
}

export interface ReportResultDto {
  id: string;
  reason: string;
  status: string;
  severity: string;
  createdAt: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedDto<T> {
  items: T[];
  nextCursor: string | null;
}

// ─── API Errors ──────────────────────────────────────────────────────────────

export interface ApiErrorDto {
  statusCode: number;
  error: string;
  message: string;
  code: string;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
