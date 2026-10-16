import { describe, expect, it } from "vitest";

import {
  expandSteps,
  statesAfter,
  type Scenario,
} from "@/lib/protocol-diagram";

const scenario: Scenario = {
  id: "demo",
  title: "Demo",
  summary: "",
  actors: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  initialStates: { a: "CLOSED", b: "LISTEN" },
  steps: [
    {
      from: "a",
      to: "b",
      label: "ONE",
      note: "one",
      states: { a: "SENT" },
    },
    {
      from: "b",
      to: "a",
      label: "TWO",
      detail: "ack",
      tone: "primary",
      note: "two",
      states: { b: "DONE" },
      lossy: { lostNote: "lost", waitNote: "wait", retransmitNote: "again" },
    },
  ],
};

describe("expandSteps", () => {
  it("is the scenario as written without loss", () => {
    const steps = expandSteps(scenario, { loss: false });
    expect(steps.map((s) => s.kind)).toEqual(["message", "message"]);
    expect(steps[1]).toMatchObject({
      label: "TWO",
      tone: "primary",
      note: "two",
    });
  });

  it("defaults the tone to secondary", () => {
    expect(expandSteps(scenario, { loss: false })[0]).toMatchObject({
      tone: "secondary",
    });
  });

  it("turns a lossy message into lost, wait and retransmission when loss is on", () => {
    const steps = expandSteps(scenario, { loss: true });
    expect(steps.map((s) => s.kind)).toEqual([
      "message",
      "lost",
      "wait",
      "message",
    ]);
    expect(steps[1]).toMatchObject({
      kind: "lost",
      label: "TWO",
      note: "lost",
    });
    expect(steps[2]).toMatchObject({ kind: "wait", actor: "b", note: "wait" });
    expect(steps[3]).toMatchObject({
      kind: "message",
      label: "TWO",
      retransmission: true,
      note: "again",
    });
  });

  it("leaves messages that cannot be lost alone", () => {
    const steps = expandSteps(scenario, { loss: true });
    expect(steps[0]).toMatchObject({ kind: "message", label: "ONE" });
    expect(steps[0]).not.toHaveProperty("retransmission");
  });
});

describe("statesAfter", () => {
  it("starts from the initial states", () => {
    const steps = expandSteps(scenario, { loss: false });
    expect(statesAfter(scenario, steps, 0)).toEqual({
      a: "CLOSED",
      b: "LISTEN",
    });
  });

  it("applies the states of the steps already played", () => {
    const steps = expandSteps(scenario, { loss: false });
    expect(statesAfter(scenario, steps, 1)).toEqual({ a: "SENT", b: "LISTEN" });
    expect(statesAfter(scenario, steps, 2)).toEqual({ a: "SENT", b: "DONE" });
  });

  it("does not apply the states of a message that was lost", () => {
    const steps = expandSteps(scenario, { loss: true });
    // after ONE, then TWO lost, then the wait: B has not changed yet
    expect(statesAfter(scenario, steps, 3)).toEqual({ a: "SENT", b: "LISTEN" });
    expect(statesAfter(scenario, steps, 4)).toEqual({ a: "SENT", b: "DONE" });
  });
});
