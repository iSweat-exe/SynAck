"use client";

import { Button } from "@payloadcms/ui";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Provider = "github" | "discord";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "github", label: "Continue with GitHub" },
  { id: "discord", label: "Continue with Discord" },
];

// Sign-in buttons of the back-office login page. Same Supabase accounts as the app; only accounts that
// hold the `cms.access` permission get in.
export function SsoButtons() {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(null);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/admin")}`;
      const { error } = await createClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch {
      // On success the browser leaves the page; we only get here when the redirect could not start.
      setError("Could not start the sign-in. Try again in a moment.");
      setPending(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {PROVIDERS.map(({ id, label }) => (
        <Button
          key={id}
          buttonStyle="primary"
          size="large"
          disabled={pending !== null}
          onClick={() => signIn(id)}
          type="button"
        >
          {pending === id ? "Redirecting…" : label}
        </Button>
      ))}
      {error ? <p role="alert">{error}</p> : null}
      <p>
        Access is limited to accounts with back-office rights. If you are signed
        in and still land here, ask an administrator for access.
      </p>
    </div>
  );
}
