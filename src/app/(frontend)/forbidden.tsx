import Link from "next/link";

import { ErrorScreen } from "@/components/site/error-screen";
import { Button } from "@/components/ui/button";

// 403: signed in, but without the permission for this page (forbidden()).
export default function Forbidden() {
  return (
    <ErrorScreen
      code="403"
      title="Accès refusé"
      description="Votre compte n'a pas les droits nécessaires pour voir cette page. Si vous pensez que c'est une erreur, contactez un administrateur."
    >
      <Button size="lg" render={<Link href="/" />} nativeButton={false}>
        Retour à l&apos;accueil
      </Button>
    </ErrorScreen>
  );
}
