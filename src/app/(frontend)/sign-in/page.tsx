import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginButtons } from "@/components/auth/login-buttons";
import { AuthShell } from "@/components/auth/auth-shell";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <AuthShell>
      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour pratiquer, suivre votre progression et accéder
            au classement. Aucun mot de passe : vous utilisez votre compte
            GitHub ou Discord.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error ? (
            <Alert variant="danger">La connexion a échoué. Réessayez.</Alert>
          ) : null}

          {getSupabaseEnv() ? (
            <LoginButtons next={nextPath} />
          ) : (
            <Alert variant="danger">
              La connexion n&apos;est pas disponible pour le moment.
            </Alert>
          )}
        </CardContent>

        <Alert variant="warning" title="SynAck est en bêta">
          Des bugs sont possibles et les données de progression peuvent être
          réinitialisées. À la première connexion, vous devrez confirmer avoir
          au moins 15 ans.
        </Alert>
      </Card>
    </AuthShell>
  );
}
