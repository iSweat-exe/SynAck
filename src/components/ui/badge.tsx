import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// SynAck badge: a small outlined pill for statuses and tags. The look lives in globals.css (`.badge`).
const badgeVariants = cva("badge", {
  variants: {
    variant: {
      neutral: "",
      secondary: "badge-secondary",
      primary: "badge-primary",
      success: "badge-success",
      warning: "badge-warning",
      danger: "badge-danger",
      info: "badge-info",
    },
  },
  defaultVariants: { variant: "neutral" },
});

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
