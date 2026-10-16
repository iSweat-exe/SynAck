"use client";

import { Space_Mono } from "next/font/google";

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

// The last safety net: an error in the root layout itself. It replaces the layout, so it brings its own
// document, styles and font.
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="fr" className={`${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ErrorScreen
          code="500"
          title="Une erreur est survenue"
          description="Le site a rencontré un problème inattendu. Réessayez dans un instant."
        >
          <Button size="lg" onClick={() => retry()}>
            Réessayer
          </Button>
        </ErrorScreen>
      </body>
    </html>
  );
}
