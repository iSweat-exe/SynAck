import type { ReactNode } from "react";

import { DashBackground } from "@/components/ui/dash-background";

// Frame of the sign-in, welcome and account pages: a card centered on the dashed background. Clicks on the
// empty background make the dashes ripple; the card itself stays clickable.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DashBackground />
      <main className="pointer-events-none relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center p-6">
        <div className="pointer-events-auto w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
