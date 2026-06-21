/**
 * Layout for the /qa/export/card route.
 *
 * Inlines Cairo-Black as a base64 @font-face so Chrome headless has the font
 * immediately — no async loading, no swap delay, no fallback in exported PNGs.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

function loadFontBase64(): string {
  try {
    const buf = readFileSync(join(process.cwd(), 'public', 'fonts', 'Cairo-Black.ttf'));
    return buf.toString('base64');
  } catch {
    return '';
  }
}

const CAIRO_BLACK_B64 = loadFontBase64();

const INLINE_FONT_CSS = CAIRO_BLACK_B64
  ? `@font-face {
  font-family: 'Cairo';
  src: url('data:font/truetype;base64,${CAIRO_BLACK_B64}') format('truetype');
  font-weight: 900;
  font-style: normal;
  font-display: block;
}`
  : '';

export default function ExportCardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {INLINE_FONT_CSS && (
        <style dangerouslySetInnerHTML={{ __html: INLINE_FONT_CSS }} />
      )}
      {children}
    </>
  );
}
