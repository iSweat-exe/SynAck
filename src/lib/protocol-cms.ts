import type { Protocol } from "@/payload-types";
import type { Scenario, ScenarioStep, Tone } from "@/lib/protocol-diagram";
import type { CatalogItem } from "@/lib/catalog";
import { isIconName } from "@/lib/icon-names";

// Turns what an editor entered in the CMS ("Protocol diagrams") into a scenario for the diagram engine.
// It is forgiving: a half-filled message is cleaned up or skipped rather than breaking the page.

const TONES: Tone[] = ["primary", "secondary", "info", "success"];

function clean(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : undefined;
}

function toScenarioStep(
  step: NonNullable<Protocol["steps"]>[number],
): ScenarioStep | null {
  const label = clean(step.label);
  const note = clean(step.note);
  if (!label || !note || step.from === step.to) return null;

  const states: Record<string, string> = {};
  const stateA = clean(step.stateA);
  const stateB = clean(step.stateB);
  if (stateA) states.a = stateA;
  if (stateB) states.b = stateB;

  const lostNote = clean(step.loss?.lostNote);
  const waitNote = clean(step.loss?.waitNote);
  const retransmitNote = clean(step.loss?.retransmitNote);
  const lossy =
    step.canBeLost && lostNote && waitNote && retransmitNote
      ? { lostNote, waitNote, retransmitNote }
      : undefined;

  return {
    from: step.from === "b" ? "b" : "a",
    to: step.to === "a" ? "a" : "b",
    label,
    detail: clean(step.detail),
    tone: TONES.find((tone) => tone === step.tone) ?? "secondary",
    note,
    states: Object.keys(states).length > 0 ? states : undefined,
    lossy,
  };
}

export function protocolToScenario(doc: Protocol): Scenario {
  const initialStates: Record<string, string> = {};
  const stateA = clean(doc.machineA?.initialState);
  const stateB = clean(doc.machineB?.initialState);
  if (stateA) initialStates.a = stateA;
  if (stateB) initialStates.b = stateB;

  return {
    id: doc.slug,
    title: doc.title,
    summary: doc.summary,
    actors: [
      {
        id: "a",
        label: clean(doc.machineA?.label) ?? "A",
        sublabel: clean(doc.machineA?.sublabel),
      },
      {
        id: "b",
        label: clean(doc.machineB?.label) ?? "B",
        sublabel: clean(doc.machineB?.sublabel),
      },
    ],
    initialStates,
    steps: (doc.steps ?? [])
      .map(toScenarioStep)
      .filter((step): step is ScenarioStep => step !== null),
  };
}

// The card of a diagram in the list of protocols.
export function protocolToCatalogItem(doc: Protocol): CatalogItem {
  return {
    id: doc.slug,
    title: doc.title,
    description: doc.summary,
    level: doc.level ?? undefined,
    tags: doc.tags ?? [],
    icon: isIconName(doc.icon) ? doc.icon : "network",
    href: `/protocols/${doc.slug}`,
  };
}
