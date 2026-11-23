/**
 * Third-party brand marks, and the neutral glyphs that sit beside them.
 *
 * Rules for anything added here:
 *
 * 1. Use the official mark, unaltered. Do not redraw it, restyle it, add effects
 *    to it, or squash its proportions.
 * 2. Use the official colour on light surfaces, and the sanctioned single-colour
 *    version on dark ones. Most brand guidelines allow solid white; almost none
 *    allow recolouring to your own accent.
 * 3. Descriptive use only — showing which channels we work in. Never place a
 *    third-party mark where it could read as partnership, endorsement or
 *    certification, and never next to our own wordmark as though it were a
 *    badge.
 *
 * Where no third party owns the concept (email, replies), use a neutral glyph
 * rather than borrowing a provider's logo. Our clients send from their own
 * addresses, so a Gmail or Outlook mark would be actively misleading.
 */

const LINKEDIN_BLUE = "#0A66C2";

export function LinkedInMark({ size = 18, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={onDark ? "#FFFFFF" : LINKEDIN_BLUE}
      role="img"
      aria-label="LinkedIn"
    >
      <title>LinkedIn</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/** Neutral, because the client sends from their own address — not a provider's. */
export function EmailMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.4" y="4.8" width="19.2" height="14.4" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="m3.6 7.2 7.2 5.4a2 2 0 0 0 2.4 0l7.2-5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReplyMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-2.7-.4L4 21l1.4-4a8.2 8.2 0 0 1-1.4-4.6A8.4 8.4 0 0 1 12.6 3 8.4 8.4 0 0 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
