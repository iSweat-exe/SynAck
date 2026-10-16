import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Card of the sign-in, welcome and account pages: a header band with the logo and the beta badge, the
// title and the actions, and an optional small print under a dashed line.
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b-2 border-border bg-secondary px-6 py-4 sm:px-8">
        <Logo />
        <Badge variant="primary">Bêta</Badge>
      </div>

      <div className="flex flex-col gap-7 p-6 sm:p-8">
        <CardHeader className="gap-3">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-5">{children}</CardContent>
      </div>

      {footer ? (
        <div className="border-t-2 border-dashed border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground sm:px-8">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
