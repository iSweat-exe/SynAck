import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AuthStrategy, Payload } from "payload";

import { can, parsePermissions } from "@/lib/cms-permissions";
import { getSupabaseEnv } from "@/lib/supabase/env";

const STRATEGY_NAME = "supabase";

// Payload requires an e-mail address and it must be unique. Some providers give none (GitHub with a
// private address), and a legacy account may already use the same one: fall back to a unique placeholder.
function placeholderEmail(supabaseId: string) {
  return `${supabaseId}@sso.synack.invalid`;
}

async function findBySupabaseId(payload: Payload, supabaseId: string) {
  const { docs } = await payload.find({
    collection: "users",
    where: { supabaseId: { equals: supabaseId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return docs[0] ?? null;
}

async function emailTaken(payload: Payload, email: string) {
  const { totalDocs } = await payload.count({
    collection: "users",
    where: { email: { equals: email } },
    overrideAccess: true,
  });
  return totalDocs > 0;
}

// Creates the Payload user on the first sign-in of an account that holds `cms.access`.
async function getOrCreatePayloadUser(
  payload: Payload,
  supabaseUser: { id: string; email?: string; name?: string },
) {
  const existing = await findBySupabaseId(payload, supabaseUser.id);
  if (existing) return existing;

  const email =
    supabaseUser.email && !(await emailTaken(payload, supabaseUser.email))
      ? supabaseUser.email
      : placeholderEmail(supabaseUser.id);

  try {
    return await payload.create({
      collection: "users",
      data: { supabaseId: supabaseUser.id, email, name: supabaseUser.name },
      depth: 0,
      overrideAccess: true,
    });
  } catch (error) {
    // Two requests can race on the very first sign-in: the other one has created the user.
    const created = await findBySupabaseId(payload, supabaseUser.id);
    if (created) return created;
    throw error;
  }
}

// The back office has no password of its own: it trusts the Supabase session (GitHub / Discord) and the
// permissions stored in Postgres. This runs on every request, so a revoked permission or a signed-out
// user loses access immediately.
export const supabaseStrategy: AuthStrategy = {
  name: STRATEGY_NAME,
  authenticate: async ({ headers, payload }) => {
    const env = getSupabaseEnv();
    if (!env) return { user: null };

    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll: () =>
          parseCookieHeader(headers.get("cookie") ?? "").map(
            ({ name, value }) => ({ name, value: value ?? "" }),
          ),
        // Read-only here: the proxy is the one that refreshes the session cookies.
        setAll: () => {},
      },
    });

    // getUser() validates the token with Supabase; the cookie alone is never trusted.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { user: null };

    const { data: rawPermissions, error: rpcError } =
      await supabase.rpc("my_permissions");
    if (rpcError) return { user: null };

    const permissions = parsePermissions(rawPermissions);
    if (!can({ permissions }, "cms.access")) return { user: null };

    const metadata = data.user.user_metadata as Record<string, unknown>;
    const name =
      [metadata.full_name, metadata.name, metadata.user_name].find(
        (value): value is string => typeof value === "string" && value !== "",
      ) ?? undefined;

    const user = await getOrCreatePayloadUser(payload, {
      id: data.user.id,
      email: data.user.email ?? undefined,
      name,
    });

    return {
      user: {
        ...user,
        permissions,
        collection: "users",
        _strategy: STRATEGY_NAME,
      },
    };
  },
};
