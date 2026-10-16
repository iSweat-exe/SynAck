import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/site/nav-links";
import { UserMenu } from "@/components/site/user-menu";

// Header of the public site: the logo, the four sections (Parcours, Protocoles, Articles, Cursus) and the
// account corner. On small screens the sections move to a scrollable second row.
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center gap-8 px-6">
        <Link href="/" aria-label="SynAck, accueil" className="shrink-0">
          <Logo className="w-28" />
        </Link>
        <NavLinks className="hidden md:block" />
        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
      <NavLinks className="scrollbar-none overflow-x-auto border-t-2 border-dashed border-border px-6 py-2 md:hidden" />
    </header>
  );
}
