import Link from "next/link";

import { SequenceDiagram } from "@/components/protocols/sequence-diagram";
import { Badge } from "@/components/ui/badge";
import type { Scenario } from "@/lib/protocol-diagram";

// A protocol page: a slim title row, then the diagram taking all the screen that is left (the whole
// drawing is visible without scrolling, with the controls and the explanation beside it).
export function ProtocolPage({
  scenario,
  badges,
  draft = false,
}: {
  scenario: Scenario;
  badges: string[];
  draft?: boolean;
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-6 py-5 lg:h-[calc(100dvh-4.625rem)] lg:flex-none">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href="/protocols" className="link text-sm">
          ← Protocoles
        </Link>
        <h1 className="text-2xl leading-tight font-bold tracking-tight">
          {scenario.title}
        </h1>
        {badges.map((badge) => (
          <Badge key={badge} variant="secondary">
            {badge}
          </Badge>
        ))}
        {draft ? <Badge variant="warning">Brouillon</Badge> : null}
      </header>

      <div className="min-h-0 flex-1">
        <SequenceDiagram scenario={scenario} variant="stage" />
      </div>
    </main>
  );
}
