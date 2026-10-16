import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { Logo } from "@/components/brand/logo";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { safeRedirectPath } from "@/lib/safe-redirect";
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

// "I am at least 15": recorded server-side, only once, then on to where the user was going.
async function confirmAge(formData: FormData) {
  "use server";
  const { supabase } = await requireUser();
  const next = safeRedirectPath(formData.get("next")?.toString());
  const { error } = await supabase.rpc("declare_age");
  if (error) redirect("/welcome?error=1");
  redirect(next);
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
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const nextPath = safeRedirectPath(next);
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("age_declared_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.age_declared_at) redirect(nextPath);

  return (
    <AuthShell>
      <Card className="gap-6 p-6 sm:p-8">
        <Logo className="w-32" />
        <div className="flex flex-col gap-3">
          <CardTitle>Bienvenue sur SynAck</CardTitle>
          <CardDescription className="leading-relaxed">
            SynAck est réservé aux personnes âgées d&apos;au moins 15 ans. Merci
            de confirmer votre âge pour continuer.
          </CardDescription>
        </div>

        {error ? (
          <Alert variant="danger">Une erreur est survenue. Réessayez.</Alert>
        ) : null}

        <form action={confirmAge}>
          <input type="hidden" name="next" value={nextPath} />
          <Button type="submit" size="lg" className="w-full">
            J&apos;ai au moins 15 ans
          </Button>
        </form>

        <form action={refuseAge} className="flex flex-col gap-3">
          <Button type="submit" variant="secondary" className="w-full">
            J&apos;ai moins de 15 ans
          </Button>
          <p className="text-xs text-muted-foreground">
            Votre compte sera supprimé immédiatement.
          </p>
        </form>
      </Card>
    </AuthShell>
  );
}
