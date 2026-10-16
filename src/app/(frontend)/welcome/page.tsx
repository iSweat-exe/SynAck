import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bienvenue | SynAck",
  robots: { index: false },
};

async function requireUser() {
  if (!getSupabaseEnv()) redirect("/sign-in");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/sign-in?next=/welcome");
  return { supabase, user: data.user };
}

// "I am at least 15": recorded server-side, only once.
async function confirmAge() {
  "use server";
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("declare_age");
  if (error) redirect("/welcome?error=1");
  redirect("/account");
}

// "I am under 15": the account is deleted right away.
async function refuseAge() {
  "use server";
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) redirect("/welcome?error=1");
  await supabase.auth.signOut();
  redirect("/?account=deleted");
}

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("age_declared_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.age_declared_at) redirect("/account");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Bienvenue sur SynAck</h1>
        <p className="text-sm text-muted-foreground">
          SynAck est réservé aux personnes âgées d&apos;au moins 15 ans. Merci
          de confirmer votre âge pour continuer.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          Une erreur est survenue. Réessayez.
        </p>
      ) : null}

      <form action={confirmAge}>
        <Button type="submit" size="lg" className="w-full">
          J&apos;ai au moins 15 ans
        </Button>
      </form>

      <form action={refuseAge} className="flex flex-col gap-2">
        <Button type="submit" variant="secondary" className="w-full">
          J&apos;ai moins de 15 ans
        </Button>
        <p className="text-xs text-muted-foreground">
          Votre compte sera supprimé immédiatement.
        </p>
      </form>
    </main>
  );
}
