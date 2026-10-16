import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginButtons } from "@/components/auth/login-buttons";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Connexion | SynAck",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = safeRedirectPath(next);

  if (getSupabaseEnv()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(nextPath);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Connectez-vous pour pratiquer, suivre votre progression et accéder au
          classement. Aucun mot de passe : vous utilisez votre compte GitHub ou
          Discord.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          La connexion a échoué. Réessayez.
        </p>
      ) : null}

      {getSupabaseEnv() ? (
        <LoginButtons next={nextPath} />
      ) : (
        <p role="alert" className="text-sm text-destructive">
          La connexion n&apos;est pas disponible pour le moment.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        SynAck est en bêta : des bugs sont possibles et les données de
        progression peuvent être réinitialisées. À la première connexion, vous
        devrez confirmer avoir au moins 15 ans.
      </p>
    </main>
  );
}
