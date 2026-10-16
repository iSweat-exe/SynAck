import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

// Receipt-style ticket of the sign-in, welcome and account pages: the logo on top, dashed rules between
// the sections, an optional small print, a barcode and a torn bottom edge. No header band.
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
    <div className="receipt-wrap">
      <div className="receipt flex flex-col gap-6 px-6 pt-8 sm:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="w-36" />
          <p className="text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
            Programmation &amp; protocoles réseau
          </p>
        </div>

        <hr className="receipt-rule" />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl leading-tight font-bold">{title}</h1>
            <Badge variant="primary">Bêta</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <hr className="receipt-rule" />

        <div className="flex flex-col gap-4">{children}</div>

        <hr className="receipt-rule" />

        <div className="flex flex-col items-center gap-3 text-center">
          {footer ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {footer}
            </p>
          ) : null}
          <div aria-hidden className="barcode w-full max-w-48" />
          <p className="text-[0.7rem] tracking-[0.2em] uppercase">
            Merci de votre visite
          </p>
        </div>
      </div>
    </div>
  );
}
