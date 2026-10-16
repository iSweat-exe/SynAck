import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mon profil | SynAck",
  robots: { index: false },
};

const PROVIDER_LABELS: Record<string, string> = {
  github: "GitHub",
  discord: "Discord",
};

function text(value: unknown) {
  return typeof value === "string" && value !== "" ? value : undefined;
}

export default async function ProfilePage() {
  if (!getSupabaseEnv()) redirect("/sign-in");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/sign-in?next=/profile");

  // Everything below runs under the user's own session: row level security decides what is visible.
  const { data: profile } = await supabase
    .from("profiles")
    .select("age_declared_at, nickname")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.age_declared_at) redirect("/welcome?next=/profile");

  const { data: canUseCms } = await supabase.rpc("has_permission", {
    p_permission: "cms.access",
  });

  const providers = (user.app_metadata.providers as string[] | undefined) ?? [];
  const meta = user.user_metadata;
  const name =
    text(meta.user_name) ??
    text(meta.full_name) ??
    text(meta.name) ??
    user.email ??
    "Compte SynAck";
  const memberSince = new Date(user.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const rows: [string, string][] = [
    ["Pseudo", profile.nickname ?? "Pas encore défini"],
    ["E-mail", user.email ?? "Non communiqué"],
    [
      "Connexion",
      providers.map((p) => PROVIDER_LABELS[p] ?? p).join(", ") || "Inconnue",
    ],
    ["Membre depuis", memberSince],
  ];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar
          name={name}
          src={text(meta.avatar_url) ?? text(meta.picture)}
          size={104}
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl leading-tight font-bold">{name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {providers.map((p) => (
              <Badge key={p} variant="secondary">
                {PROVIDER_LABELS[p] ?? p}
              </Badge>
            ))}
            {canUseCms ? <Badge variant="primary">Back-office</Badge> : null}
          </div>
        </div>
      </header>

      <div className="grid gap-8 pr-2 md:grid-cols-2">
        <Card>
          <CardTitle className="text-xl">Informations</CardTitle>
          <dl className="flex flex-col gap-4 text-sm">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-b-2 border-dashed border-border pb-4 last:border-b-0 last:pb-0"
              >
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-bold break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="flex flex-col gap-8">
          <Card className="border-dashed shadow-none">
            <CardTitle className="text-xl">Progression</CardTitle>
            <CardDescription>
              Vos cours, vos exercices réussis et vos révisions du jour
              apparaîtront ici.
            </CardDescription>
          </Card>

          <Card>
            <CardTitle className="text-xl">Session</CardTitle>
            {canUseCms ? (
              <Button
                render={<Link href="/admin" prefetch={false} />}
                nativeButton={false}
              >
                Ouvrir le panel admin
              </Button>
            ) : null}
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="danger" className="w-full">
                Se déconnecter
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
