import type { ReactNode } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

// The card of an error screen: the status code in a pink block (like the "Ack" of the logo), a title, an
// explanation and the way out. Used by the error pages and previewed on /design-system.
export function ErrorCard({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Card className="gap-6 p-6 sm:p-8">
      <span className="error-code" aria-hidden>
        {code}
      </span>
      <div className="flex flex-col gap-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
      </div>
      {children ? <div className="flex flex-col gap-3">{children}</div> : null}
    </Card>
  );
}

// A full error page: the card centered on the dashed background (click it, it ripples).
export function ErrorScreen(props: Parameters<typeof ErrorCard>[0]) {
  return (
    <AuthShell>
      <ErrorCard {...props} />
    </AuthShell>
  );
}
