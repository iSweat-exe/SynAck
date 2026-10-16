import { describe, expect, it } from "vitest";

import { expandSteps } from "@/lib/protocol-diagram";
import { protocolToCatalogItem, protocolToScenario } from "@/lib/protocol-cms";
import type { Protocol } from "@/payload-types";

function doc(overrides: Partial<Protocol> = {}): Protocol {
  return {
    id: 1,
    title: "TCP",
    slug: "tcp",
    summary: "Le handshake.",
    machineA: {
      label: "Client",
      sublabel: "navigateur",
      initialState: "CLOSED",
    },
    machineB: { label: "Serveur", sublabel: "", initialState: "LISTEN" },
    steps: [
      {
        id: "1",
        from: "a",
        to: "b",
        label: " SYN ",
        detail: "seq = x",
        tone: "primary",
        note: "Le client ouvre.",
        stateA: "SYN_SENT",
        stateB: "",
      },
      {
        id: "2",
        from: "b",
        to: "a",
        label: "SYN-ACK",
        note: "Le serveur répond.",
        canBeLost: true,
        loss: {
          lostNote: "perdu",
          waitNote: "attente",
          retransmitNote: "renvoi",
        },
      },
    ],
    updatedAt: "",
    createdAt: "",
    ...overrides,
  } as Protocol;
}

describe("protocolToScenario", () => {
  it("maps the machines and their initial states", () => {
    const scenario = protocolToScenario(doc());
    expect(scenario.actors).toEqual([
      { id: "a", label: "Client", sublabel: "navigateur" },
      { id: "b", label: "Serveur", sublabel: undefined },
    ]);
    expect(scenario.initialStates).toEqual({ a: "CLOSED", b: "LISTEN" });
  });

  it("maps the steps, trimming text and dropping empty states", () => {
    const [first] = protocolToScenario(doc()).steps;
    expect(first).toMatchObject({
      from: "a",
      to: "b",
      label: "SYN",
      detail: "seq = x",
      tone: "primary",
      states: { a: "SYN_SENT" },
    });
    expect(first.lossy).toBeUndefined();
  });

  it("builds the loss variant only when every explanation is filled in", () => {
    const [, second] = protocolToScenario(doc()).steps;
    expect(second.lossy).toEqual({
      lostNote: "perdu",
      waitNote: "attente",
      retransmitNote: "renvoi",
    });

    const incomplete = protocolToScenario(
      doc({
        steps: [
          {
            id: "x",
            from: "a",
            to: "b",
            label: "X",
            note: "n",
            canBeLost: true,
            loss: { lostNote: "perdu", waitNote: "", retransmitNote: "renvoi" },
          },
        ],
      }),
    );
    expect(incomplete.steps[0].lossy).toBeUndefined();
  });

  it("skips a message that is incomplete or goes from a machine to itself", () => {
    const scenario = protocolToScenario(
      doc({
        steps: [
          { id: "1", from: "a", to: "a", label: "LOOP", note: "n" },
          { id: "2", from: "a", to: "b", label: "", note: "n" },
          { id: "3", from: "a", to: "b", label: "OK", note: "" },
          { id: "4", from: "a", to: "b", label: "OK", note: "fine" },
        ],
      }),
    );
    expect(scenario.steps.map((s) => s.label)).toEqual(["OK"]);
  });

  it("falls back to the secondary tone and yields a playable scenario", () => {
    const scenario = protocolToScenario(
      doc({
        steps: [
          { id: "1", from: "a", to: "b", label: "X", note: "n", tone: null },
        ],
      }),
    );
    expect(scenario.steps[0].tone).toBe("secondary");
    expect(expandSteps(scenario, { loss: false })).toHaveLength(1);
  });
});

describe("protocolToCatalogItem", () => {
  it("builds a linked card", () => {
    expect(
      protocolToCatalogItem(
        doc({ level: "Débutant", tags: ["Transport"], icon: "globe" }),
      ),
    ).toMatchObject({
      id: "tcp",
      title: "TCP",
      description: "Le handshake.",
      level: "Débutant",
      tags: ["Transport"],
      icon: "globe",
      href: "/protocols/tcp",
    });
  });

  it("defaults the icon and the tags", () => {
    expect(
      protocolToCatalogItem(doc({ icon: null, tags: null })),
    ).toMatchObject({ icon: "network", tags: [] });
  });
});
