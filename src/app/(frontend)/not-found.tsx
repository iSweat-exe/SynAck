import Link from "next/link";

import { ErrorScreen } from "@/components/site/error-screen";
import { Button } from "@/components/ui/button";

// 404 inside the site (a notFound() call). Unmatched URLs use src/app/global-not-found.tsx.
export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Page introuvable"
      description="Cette page n'existe pas, ou elle a été déplacée. Vérifiez l'adresse, ou repartez de l'accueil."
    >
      <Button size="lg" render={<Link href="/" />} nativeButton={false}>
        Retour à l&apos;accueil
      </Button>
      <Button
        variant="secondary"
        render={<Link href="/paths" />}
        nativeButton={false}
      >
        Voir les parcours
      </Button>
    </ErrorScreen>
  );
}
