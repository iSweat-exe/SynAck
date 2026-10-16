"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";

const OPTIONS = ["Hints", "Streak reminders", "Public leaderboard"] as const;

// Live examples: a plain controlled switch, and a parent switch that shows the indeterminate state when
// only some of its children are on.
export function SwitchDemo() {
  const [single, setSingle] = useState(true);
  const [children, setChildren] = useState<Record<string, boolean>>({
    Hints: true,
    "Streak reminders": false,
    "Public leaderboard": false,
  });

  const values = OPTIONS.map((name) => children[name]);
  const all = values.every(Boolean);
  const some = values.some(Boolean);

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <label className="flex items-center gap-4">
        <Switch
          checked={single}
          onChange={(event) => setSingle(event.target.checked)}
        />
        <span>Email me about new articles: {single ? "yes" : "no"}</span>
      </label>

      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">Notification options</legend>
        <label className="flex items-center gap-4 font-bold">
          <Switch
            checked={all}
            indeterminate={some && !all}
            onChange={(event) =>
              setChildren(
                Object.fromEntries(
                  OPTIONS.map((name) => [name, event.target.checked]),
                ),
              )
            }
          />
          <span>All options</span>
        </label>
        {OPTIONS.map((name) => (
          <label key={name} className="flex items-center gap-4 pl-6">
            <Switch
              checked={children[name]}
              onChange={(event) =>
                setChildren((current) => ({
                  ...current,
                  [name]: event.target.checked,
                }))
              }
            />
            <span>{name}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
