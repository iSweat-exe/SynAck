// Links entered in the CMS may only use these schemes (or be relative): this blocks `javascript:` and
// `data:` URLs, which would turn a rich-text link into a stored XSS vector.
const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];

export function isSafeUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const url = value.trim();
  if (url === "") return false;

  // Relative links ("/courses/intro", "#section"); "//host" is protocol-relative, so it is rejected.
  if ((url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#")) {
    return true;
  }

  try {
    return ALLOWED_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function validateSafeUrl(value: unknown): true | string {
  return (
    isSafeUrl(value) || "Only http(s), mailto and relative links are allowed."
  );
}
