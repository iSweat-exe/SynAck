import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// POST only (a link or an image cannot sign the user out).
export async function POST(request: NextRequest) {
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  // 303: the browser follows with a GET.
  return NextResponse.redirect(new URL("/", request.nextUrl.origin), 303);
}
