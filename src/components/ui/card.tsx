import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// SynAck card (DESIGN.md §4 style): outlined surface with a hard shadow. The look lives in globals.css.
function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cn("card", className)} {...props} />;
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="card-title"
      className={cn("text-2xl leading-tight font-bold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
