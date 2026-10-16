import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site/site-header";

// The pages of the site itself (home, profile...), with the header. The sign-in and welcome pages have
// their own frame, and /design-system is a standalone tool.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
