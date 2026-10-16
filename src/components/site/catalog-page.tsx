import { CatalogBrowser } from "@/components/site/catalog-browser";
import type { Section } from "@/lib/catalog";

// Shared frame of the section pages (paths, protocols, articles, roadmaps): a title, an intro, and the
// searchable, filterable list of cards.
export function CatalogPage({
  title,
  description,
  section,
}: {
  title: string;
  description: string;
  section: Section;
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-4xl leading-tight font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </header>

      <CatalogBrowser section={section} />
    </main>
  );
}
