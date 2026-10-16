import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";

export const metadata: Metadata = {
  title: "Parcours | SynAck",
  description:
    "Des parcours guidés pour apprendre la programmation, avec des exercices dans le navigateur.",
};

export default function PathsPage() {
  return (
    <CatalogPage
      title="Parcours"
      description="Des cours courts, des exercices dans le navigateur et des quiz : apprenez un langage ou une technologie pas à pas."
      section="paths"
    />
  );
}
