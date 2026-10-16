"use client";

import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Provider = "github" | "discord";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "github", label: "Continuer avec GitHub" },
  { id: "discord", label: "Continuer avec Discord" },
];

export function LoginButtons({ next }: { next: string }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    // On success the browser leaves the page; we only get here when the redirect could not start.
    if (error) {
      setError(
        "Impossible de démarrer la connexion. Réessayez dans un instant.",
      );
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map(({ id, label }) => (
        <Button
          key={id}
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={pending !== null}
          onClick={() => signIn(id)}
        >
          {pending === id ? "Redirection…" : label}
        </Button>
      ))}
      {error ? <Alert variant="danger">{error}</Alert> : null}
    </div>
  );
}
