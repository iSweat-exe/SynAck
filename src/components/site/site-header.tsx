import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/site/user-menu";

// Header of the public site: the logo on the left, the account corner on the right. The links to the
// sections (courses, protocols, articles) come with those sections.
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="SynAck, accueil">
          <Logo className="w-28" />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
