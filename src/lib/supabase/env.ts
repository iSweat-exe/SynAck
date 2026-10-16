// Public Supabase settings (safe to expose to the browser). Returns null when they are not configured, so a
// missing variable disables sign-in instead of breaking every page (the CMS keeps working).
export function getSupabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}
