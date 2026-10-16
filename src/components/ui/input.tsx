import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// SynAck text field (DESIGN.md §4 style). Mark an invalid field with `aria-invalid` and point to its
// message with `aria-describedby`. The look lives in globals.css (`.input`).
function Input({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("input", className)}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("input", className)}
      {...props}
    />
  );
}

export { Input, Textarea };
