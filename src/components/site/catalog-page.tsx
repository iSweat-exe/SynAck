import { ContentCard } from "@/components/site/content-card";
import type { CatalogItem } from "@/lib/catalog";

// Shared frame of the section pages (paths, protocols, articles, roadmaps): a title, an intro and the
// grid of cards.
export function CatalogPage({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: CatalogItem[];
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-4xl leading-tight font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </header>

      <ul className="grid gap-8 pr-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(
          ({ id, title: itemTitle, description: itemText, tags, icon }) => (
            <li key={id} className="flex">
              <ContentCard
                title={itemTitle}
                description={itemText}
                tags={tags}
                icon={icon}
                seed={id}
                className="w-full"
              />
            </li>
          ),
        )}
      </ul>
    </main>
  );
}
