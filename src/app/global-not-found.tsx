import { Space_Mono } from "next/font/google";
import Link from "next/link";

import { ErrorScreen } from "@/components/site/error-screen";
import { Button } from "@/components/ui/button";

import "./(frontend)/globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = { title: "Page introuvable | SynAck" };

// 404 for any URL that matches no route (it bypasses the layouts, so it brings its own document).
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}
