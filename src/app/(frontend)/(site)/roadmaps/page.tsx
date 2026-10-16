import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";

export const metadata: Metadata = {
  title: "Cursus | SynAck",
  description:
    "Des feuilles de route pour devenir développeur fullstack, software, ou spécialiste réseaux et sécurité.",
};

export default function RoadmapsPage() {
  return (
    <CatalogPage
      title="Cursus"
      description="Des feuilles de route pour savoir quoi apprendre, dans quel ordre, pour viser un métier : développeur fullstack, software, réseaux, sécurité…"
      section="roadmaps"
    />
  );
}
