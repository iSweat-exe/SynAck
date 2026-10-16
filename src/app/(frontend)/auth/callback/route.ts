import { NextResponse, type NextRequest } from "next/server";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// OAuth return URL: exchanges the one-time code for a session cookie, then sends the user on.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code && getSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // The age declaration comes first: a new account goes through /welcome, then on to where it was going.
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("age_declared_at")
          .eq("user_id", data.user.id)
          .maybeSingle();
        if (!profile?.age_declared_at) {
          const welcome = new URL("/welcome", origin);
          welcome.searchParams.set("next", next);
          return NextResponse.redirect(welcome);
        }
      }
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/sign-in?error=auth", origin));
}
