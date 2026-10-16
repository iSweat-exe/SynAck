import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

// Refreshes the Supabase session on every page request so the cookies never expire under the user's feet.
// Server code that needs the user must still call `supabase.auth.getUser()`: the proxy is not a guard.
export async function proxy(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Cache headers that keep a response carrying fresh cookies out of shared caches.
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Validates the token and refreshes it when it is about to expire.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  // Everything except static assets and the health probe.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};
