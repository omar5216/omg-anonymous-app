/**
 * Reads NEXT_PUBLIC_APP_HOST and normalises it to a bare hostname (no protocol, no trailing slash).
 * Handles both forms safely:
 *   "omgksa.com"          → "omgksa.com"
 *   "https://omgksa.com"  → "omgksa.com"
 *   "https://omgksa.com/" → "omgksa.com"
 */
export function getAppOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_HOST || 'omgksa.com';
  return raw
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

/**
 * Builds an absolute HTTPS URL for a given path.
 * Path may or may not start with '/'.
 *
 * buildPublicUrl('/s/abc123') → "https://omgksa.com/s/abc123"
 */
export function buildPublicUrl(path: string): string {
  const origin = getAppOrigin();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://${origin}${cleanPath}`;
}
