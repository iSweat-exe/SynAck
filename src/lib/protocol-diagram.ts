// Data model of an animated protocol diagram (a sequence diagram between two machines).
//
// A scenario is plain, serializable data: the actors, the messages they exchange, a sentence explaining
// each one, and the state of each actor once it is done. Nothing in it is code, so the same format can
// be stored in the CMS later (the "Protocol animation" block) and edited without touching the site.

export type Tone = "primary" | "secondary" | "info" | "success";

export type Actor = { id: string; label: string; sublabel?: string };

export type ScenarioStep = {
  from: string;
  to: string;
  // Name of the message ("SYN") and its details ("seq = x").
  label: string;
  detail?: string;
  tone?: Tone;
  // What happens, in a sentence, shown while the message is played.
  note: string;
  // State of the actors once the message has arrived.
  states?: Record<string, string>;
  // When present, the user can make this message get lost: it is then followed by a wait and a
  // retransmission, with these explanations.
  lossy?: { lostNote: string; waitNote: string; retransmitNote: string };
};

export type Scenario = {
  id: string;
  title: string;
  summary: string;
  actors: [Actor, Actor];
  initialStates: Record<string, string>;
  steps: ScenarioStep[];
};

// What the diagram actually draws, once the user's choices (packet loss) are applied.
export type RenderStep =
  | {
      kind: "message";
      from: string;
      to: string;
      label: string;
      detail?: string;
      tone: Tone;
      note: string;
      states?: Record<string, string>;
      retransmission?: boolean;
    }
  | {
      kind: "lost";
      from: string;
      to: string;
      label: string;
      detail?: string;
      tone: Tone;
      note: string;
    }
  | { kind: "wait"; actor: string; label: string; note: string };

export type Options = { loss: boolean };

// Turns a scenario into the list of steps to draw. Without loss it is the scenario as written; with
// loss, every `lossy` message becomes: the message lost on the way, a wait on the sender's side, and the
// message sent again.
export function expandSteps(
  scenario: Scenario,
  { loss }: Options,
): RenderStep[] {
  return scenario.steps.flatMap((step): RenderStep[] => {
    const tone = step.tone ?? "secondary";
    const message: RenderStep = {
      kind: "message",
      from: step.from,
      to: step.to,
      label: step.label,
      detail: step.detail,
      tone,
      note: step.note,
      states: step.states,
    };
    if (!loss || !step.lossy) return [message];

    return [
      {
        kind: "lost",
        from: step.from,
        to: step.to,
        label: step.label,
        detail: step.detail,
        tone,
        note: step.lossy.lostNote,
      },
      {
        kind: "wait",
        actor: step.from,
        label: "Délai écoulé",
        note: step.lossy.waitNote,
      },
      { ...message, retransmission: true, note: step.lossy.retransmitNote },
    ];
  });
}

// The state of every actor after the first `count` steps.
export function statesAfter(
  scenario: Scenario,
  steps: RenderStep[],
  count: number,
): Record<string, string> {
  const states = { ...scenario.initialStates };
  for (const step of steps.slice(0, count)) {
    if (step.kind === "message" && step.states)
      Object.assign(states, step.states);
  }
  return states;
}
