"use client";

import { Moon, Sun } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Scopes the dark theme to the design-system page, so components can be checked in both modes. The real
// light/dark choice for the whole site (user preference) comes later (checklist P1.5).
export function ThemeScope({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground transition-colors",
        dark && "dark",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl justify-end px-6 pt-6">
        <Button
          variant="secondary"
          size="sm"
          aria-pressed={dark}
          onClick={() => setDark((value) => !value)}
        >
          {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          {dark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      {children}
    </div>
  );
}
