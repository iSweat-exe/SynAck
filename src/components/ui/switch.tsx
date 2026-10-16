import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<ComponentProps<"input">, "type" | "role">;

// SynAck switch (DESIGN.md §4): a native checkbox with role="switch", so forms, labels and the keyboard
// (Space) work for free. The look lives in globals.css (`.switch`). Always give it an accessible name:
// wrap it in a <label> or pass `aria-label`.
function Switch({ className, ...props }: SwitchProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      data-slot="switch"
      className={cn("switch", className)}
      {...props}
    />
  );
}

export { Switch };
