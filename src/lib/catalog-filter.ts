import { LEVELS, type CatalogItem, type Level } from "@/lib/catalog";

export type Filters = {
  query: string;
  levels: Level[];
  tags: string[];
};

export const NO_FILTERS: Filters = { query: "", levels: [], tags: [] };

// Lowercase, no accents: "Réseaux" matches "reseaux".
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function isFiltering({ query, levels, tags }: Filters) {
  return query.trim() !== "" || levels.length > 0 || tags.length > 0;
}

// An item shows up when it passes every criterion:
// - the search: every word of the query appears in its title, description, level or tags;
// - the levels: it has one of the selected levels (the choices of a group are alternatives);
// - the tags: it has one of the selected tags.
// Different criteria combine (AND), the choices inside one group are alternatives (OR).
export function filterItems(items: CatalogItem[], filters: Filters) {
  const words = normalize(filters.query).split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    if (words.length > 0) {
      const haystack = normalize(
        [item.title, item.description, item.level ?? "", ...item.tags].join(
          " ",
        ),
      );
      if (!words.every((word) => haystack.includes(word))) return false;
    }
    if (
      filters.levels.length > 0 &&
      !(item.level && filters.levels.includes(item.level))
    ) {
      return false;
    }
    if (
      filters.tags.length > 0 &&
      !item.tags.some((tag) => filters.tags.includes(tag))
    ) {
      return false;
    }
    return true;
  });
}

// The filter choices available for a list of items: the levels in use (in their natural order) and the
// tags (alphabetical).
export function facetsOf(items: CatalogItem[]) {
  const levels = LEVELS.filter((level) =>
    items.some((item) => item.level === level),
  );
  const tags = [...new Set(items.flatMap((item) => item.tags))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  return { levels, tags };
}
