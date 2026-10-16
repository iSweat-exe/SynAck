import { describe, expect, it } from "vitest";

import type { CatalogItem } from "@/lib/catalog";
import {
  facetsOf,
  filterItems,
  isFiltering,
  NO_FILTERS,
  normalize,
} from "@/lib/catalog-filter";

const icon = () => null;

const ITEMS: CatalogItem[] = [
  {
    id: "js",
    title: "JavaScript de zéro",
    description: "Le langage du web.",
    level: "Débutant",
    tags: ["JavaScript", "Web"],
    icon,
  },
  {
    id: "py",
    title: "Python pour débuter",
    description: "Un langage lisible.",
    level: "Débutant",
    tags: ["Python"],
    icon,
  },
  {
    id: "rust",
    title: "Rust",
    description: "La mémoire sans peur : réseaux et systèmes.",
    level: "Avancé",
    tags: ["Rust", "Systèmes"],
    icon,
  },
  {
    id: "news",
    title: "Veille",
    description: "Un article.",
    tags: ["Veille"],
    icon,
  },
];

const ids = (filters: Partial<typeof NO_FILTERS>) =>
  filterItems(ITEMS, { ...NO_FILTERS, ...filters }).map((item) => item.id);

describe("normalize", () => {
  it("ignores case and accents", () => {
    expect(normalize("RÉSEAUX Été")).toBe("reseaux ete");
  });
});

describe("filterItems", () => {
  it("keeps everything without a filter", () => {
    expect(ids({})).toEqual(["js", "py", "rust", "news"]);
  });

  it("searches the title, description and tags without caring about accents", () => {
    expect(ids({ query: "zero" })).toEqual(["js"]);
    expect(ids({ query: "reseaux" })).toEqual(["rust"]);
    expect(ids({ query: "SYSTEMES" })).toEqual(["rust"]);
  });

  it("requires every word of the query", () => {
    expect(ids({ query: "langage web" })).toEqual(["js"]);
    expect(ids({ query: "langage rust" })).toEqual([]);
  });

  it("filters by level, the choices being alternatives", () => {
    expect(ids({ levels: ["Débutant"] })).toEqual(["js", "py"]);
    expect(ids({ levels: ["Débutant", "Avancé"] })).toEqual([
      "js",
      "py",
      "rust",
    ]);
  });

  it("filters by tag, the choices being alternatives", () => {
    expect(ids({ tags: ["Python", "Rust"] })).toEqual(["py", "rust"]);
  });

  it("combines the criteria", () => {
    expect(ids({ levels: ["Débutant"], tags: ["Web"] })).toEqual(["js"]);
    expect(
      ids({ levels: ["Débutant"], tags: ["Web"], query: "python" }),
    ).toEqual([]);
  });

  it("leaves out an item with no level when a level is selected", () => {
    expect(
      ids({ levels: ["Débutant", "Intermédiaire", "Avancé"] }),
    ).not.toContain("news");
  });
});

describe("isFiltering", () => {
  it("is false for blank filters", () => {
    expect(isFiltering(NO_FILTERS)).toBe(false);
    expect(isFiltering({ ...NO_FILTERS, query: "  " })).toBe(false);
  });

  it("is true as soon as one criterion is set", () => {
    expect(isFiltering({ ...NO_FILTERS, query: "a" })).toBe(true);
    expect(isFiltering({ ...NO_FILTERS, tags: ["Web"] })).toBe(true);
  });
});

describe("facetsOf", () => {
  it("lists the levels in use in their natural order and the tags alphabetically", () => {
    expect(facetsOf(ITEMS)).toEqual({
      levels: ["Débutant", "Avancé"],
      tags: ["JavaScript", "Python", "Rust", "Systèmes", "Veille", "Web"],
    });
  });
});
