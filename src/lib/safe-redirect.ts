// Where to send the user after signing in. Only same-site relative paths are accepted, so the `next`
// query parameter cannot be used as an open redirect to another site.
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = "/compte",
): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  // "//host" and "/\host" are interpreted by browsers as another origin.
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  // Control characters (tab, newline...) are stripped by browsers and can hide a "//".
  if (/[\u0000-\u001f\u007f]/.test(next)) return fallback;
  return next;
}
