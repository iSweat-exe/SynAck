"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/paths", label: "Parcours" },
  { href: "/protocols", label: "Protocoles" },
  { href: "/articles", label: "Articles" },
  { href: "/roadmaps", label: "Cursus" },
] as const;

// The four sections of the site, as header links. The current section is marked (aria-current).
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections du site" className={className}>
      <ul className="flex items-center gap-2">
        {NAV_ITEMS.map(({ href, label }) => {
          const current = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={cn("nav-link", current && "nav-link-current")}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
