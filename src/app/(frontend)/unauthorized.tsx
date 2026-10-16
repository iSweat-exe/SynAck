import Link from "next/link";

import { ErrorScreen } from "@/components/site/error-screen";
import { Button } from "@/components/ui/button";

// 401: not signed in (unauthorized()).
export default function Unauthorized() {
  return (
    <ErrorScreen
      code="401"
      title="Connexion requise"
      description="Connectez-vous avec GitHub ou Discord pour accéder à cette page."
    >
      <Button size="lg" render={<Link href="/sign-in" />} nativeButton={false}>
        Se connecter
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
