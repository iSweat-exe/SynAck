"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ErrorScreen } from "@/components/site/error-screen";
import { Button } from "@/components/ui/button";

// 500: an unexpected error while rendering a page. The user can retry or leave.
export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="500"
      title="Une erreur est survenue"
      description="Quelque chose s'est mal passé de notre côté. Réessayez dans un instant ; si le problème persiste, revenez un peu plus tard."
    >
      <Button size="lg" onClick={() => retry()}>
        Réessayer
      </Button>
      <Button
        variant="secondary"
        render={<Link href="/" />}
        nativeButton={false}
      >
        Retour à l&apos;accueil
      </Button>
    </ErrorScreen>
  );
}
