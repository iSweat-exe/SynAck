import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// SynAck alert (semantic colors, DESIGN.md §3). The look lives in globals.css (`.alert`). Danger and
// warning are announced to assistive technologies (role="alert"), the others are plain status messages.
const alertVariants = cva("alert", {
  variants: {
    variant: {
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
      danger: "alert-danger",
    },
  },
  defaultVariants: { variant: "info" },
});

const ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
} as const;

function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & { title?: string }) {
  const Icon = ICONS[variant ?? "info"];
  const urgent = variant === "danger" || variant === "warning";

  return (
    <div
      data-slot="alert"
      role={urgent ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden />
      <div className="flex flex-col gap-0.5">
        {title ? <p className="font-bold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export { Alert, alertVariants };
