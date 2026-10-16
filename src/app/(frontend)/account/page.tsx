import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mon compte | SynAck",
  robots: { index: false },
};

const PROVIDER_LABELS: Record<string, string> = {
  github: "GitHub",
  discord: "Discord",
};

export default async function AccountPage() {
  if (!getSupabaseEnv()) redirect("/sign-in");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/sign-in?next=/account");

  // Everything below runs under the user's own session: row level security decides what is visible.
  const { data: profile } = await supabase
    .from("profiles")
    .select("age_declared_at, nickname")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.age_declared_at) redirect("/welcome");

  const { data: canUseCms } = await supabase.rpc("has_permission", {
    p_permission: "cms.access",
  });

  const providers = (user.app_metadata.providers as string[] | undefined) ?? [];
  const name =
    (user.user_metadata.user_name as string | undefined) ??
    (user.user_metadata.full_name as string | undefined) ??
    user.email ??
    "Compte SynAck";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon compte</CardTitle>
          <CardDescription>
            Connecté en tant que <strong>{name}</strong>
            {providers.length > 0
              ? ` via ${providers.map((p) => PROVIDER_LABELS[p] ?? p).join(", ")}`
              : ""}
            .
          </CardDescription>
        </CardHeader>

        <CardContent>
          {canUseCms ? (
            <p className="text-sm">
              <Link className="link" href="/admin" prefetch={false}>
                Accéder à l&apos;espace de gestion du contenu
              </Link>
            </p>
          ) : null}

          <form action="/auth/signout" method="post">
            <Button type="submit" variant="secondary" className="w-full">
              Se déconnecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
