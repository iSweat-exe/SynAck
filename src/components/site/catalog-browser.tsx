"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ContentCard } from "@/components/site/content-card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATALOG, type Level, type Section } from "@/lib/catalog";
import {
  facetsOf,
  filterItems,
  isFiltering,
  NO_FILTERS,
  type Filters,
} from "@/lib/catalog-filter";

function toggle<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((entry) => entry !== value)
    : [...list, value];
}

function Chips<T extends string>({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  if (values.length === 0) return null;
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 text-xs font-bold text-muted-foreground">
        {label}
      </span>
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={selected.includes(value)}
          className="chip"
          onClick={() => onToggle(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

// The list of a section with an instant search and filters. Everything happens in the browser as the
// user types or clicks: the search looks at every word (title, description, level, tags), the filters
// combine, and several choices in the same group are alternatives.
export function CatalogBrowser({ section }: { section: Section }) {
  const items = CATALOG[section];
  const facets = useMemo(() => facetsOf(items), [items]);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const shown = useMemo(() => filterItems(items, filters), [items, filters]);
  const filtering = isFiltering(filters);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="relative max-w-xl">
          <label htmlFor={`search-${section}`} className="sr-only">
            Rechercher
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={`search-${section}`}
            type="search"
            placeholder="Rechercher un titre, un langage, un thème…"
            autoComplete="off"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            className="pl-12"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Chips<Level>
            label="Niveau"
            values={facets.levels}
            selected={filters.levels}
            onToggle={(level) =>
              setFilters((current) => ({
                ...current,
                levels: toggle(current.levels, level),
              }))
            }
          />
          <Chips
            label="Thème"
            values={facets.tags}
            selected={filters.tags}
            onToggle={(tag) =>
              setFilters((current) => ({
                ...current,
                tags: toggle(current.tags, tag),
              }))
            }
          />
        </div>

        <div className="flex min-h-9 items-center gap-4 text-sm">
          <p aria-live="polite" className="font-bold">
            {shown.length} résultat{shown.length > 1 ? "s" : ""}
            {filtering ? ` sur ${items.length}` : ""}
          </p>
          {filtering ? (
            <Button
              variant="link"
              onClick={() => setFilters(NO_FILTERS)}
              className="inline-flex items-center gap-1"
            >
              <X aria-hidden className="size-4" />
              Réinitialiser
            </Button>
          ) : null}
        </div>
      </div>

      {shown.length > 0 ? (
        <ul className="grid gap-8 pr-2 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li key={item.id} className="flex">
              <ContentCard
                title={item.title}
                description={item.description}
                tags={[item.level, ...item.tags].filter((tag): tag is string =>
                  Boolean(tag),
                )}
                icon={item.icon}
                seed={item.id}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      ) : (
        <Alert variant="info" title="Aucun résultat">
          Aucun élément ne correspond à ces critères. Essayez d&apos;autres mots
          ou retirez un filtre.
        </Alert>
      )}
    </div>
  );
}
