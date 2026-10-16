"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";

// Live examples: controlled switches that play the on / off transition.
export function SwitchDemo() {
  const [email, setEmail] = useState(true);
  const [hints, setHints] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <label className="flex items-center gap-4">
        <Switch
          checked={email}
          onChange={(event) => setEmail(event.target.checked)}
        />
        <span>Email me about new articles: {email ? "yes" : "no"}</span>
      </label>
      <label className="flex items-center gap-4">
        <Switch
          checked={hints}
          onChange={(event) => setHints(event.target.checked)}
        />
        <span>Show hints right away: {hints ? "yes" : "no"}</span>
      </label>
    </div>
  );
}
