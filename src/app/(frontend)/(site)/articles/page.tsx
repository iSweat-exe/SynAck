import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";
import { ARTICLES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Articles | SynAck",
  description:
    "La veille technique de SynAck : des articles courts sur l'actualité des technologies.",
};

export default function ArticlesPage() {
  return (
    <CatalogPage
      title="Articles"
      description="La veille technique : des articles courts, écrits à la main, sur ce qui bouge dans les technologies."
      items={ARTICLES}
    />
  );
}
