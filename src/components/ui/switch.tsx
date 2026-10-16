"use client";

import { useState, type ChangeEvent, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<ComponentProps<"input">, "type" | "role">;

// SynAck switch (DESIGN.md §4): a native checkbox with role="switch", so forms, labels and the keyboard
// (Space) work for free. The look lives in globals.css (`.switch`). Always give it an accessible name:
// wrap it in a <label> or pass `aria-label`.
//
// Toggling plays one smooth slide with a small bounce at each end: the knob squashes to a round shape
// halfway and stretches back (the kit's middle knob). The slide itself is a CSS transition; `data-motion`
// only lives for the duration of the squash animation. The resting look comes from `:checked`.
function Switch({
  className,
  onChange,
  onAnimationEnd,
  ...props
}: SwitchProps) {
  const [motion, setMotion] = useState<"on" | "off" | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setMotion(event.target.checked ? "on" : "off");
    onChange?.(event);
  }

  return (
    <input
      type="checkbox"
      role="switch"
      data-slot="switch"
      data-motion={motion ?? undefined}
      className={cn("switch", className)}
      onChange={handleChange}
      onAnimationEnd={(event) => {
        setMotion(null);
        onAnimationEnd?.(event);
      }}
      {...props}
    />
  );
}

export { Switch };
