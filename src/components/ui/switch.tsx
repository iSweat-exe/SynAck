"use client";

import { useEffect, useRef, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<ComponentProps<"input">, "type" | "role"> & {
  // A third state between off and on (for example a parent whose children are only partly on).
  // It wins over `checked` for the look; the checked value is left to the caller.
  indeterminate?: boolean;
};

// SynAck switch (DESIGN.md §4): a native checkbox with role="switch", so forms, labels and the keyboard
// (Space) work for free. The look lives in globals.css (`.switch`). Always give it an accessible name:
// wrap it in a <label> or pass `aria-label`.
function Switch({ className, indeterminate = false, ...props }: SwitchProps) {
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` is a DOM property, not an attribute.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      data-slot="switch"
      data-indeterminate={indeterminate ? "" : undefined}
      className={cn("switch", className)}
      {...props}
    />
  );
}

export { Switch };
