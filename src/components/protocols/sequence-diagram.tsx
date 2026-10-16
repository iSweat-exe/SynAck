"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  expandSteps,
  statesAfter,
  type RenderStep,
  type Scenario,
  type Tone,
} from "@/lib/protocol-diagram";

// Geometry of the diagram, in SVG units (the drawing scales with its container).
const WIDTH = 560;
const LEFT = 110;
const RIGHT = 450;
const TOP = 112; // y of the first row
const ROW = 76; // distance between two rows
const SLANT = 16; // the arrows go slightly down: a message takes time
const MOVE_MS = 900; // duration of a message's flight
const STEP_MS = 2600; // time spent on a step when playing

const TONES: Record<Tone, { fill: string; ink: string }> = {
  primary: { fill: "var(--primary-400)", ink: "var(--on-fill)" },
  secondary: {
    fill: "var(--btn-secondary-bg)",
    ink: "var(--btn-secondary-ink)",
  },
  info: { fill: "var(--info-bg)", ink: "var(--info-ink)" },
  success: { fill: "var(--success-bg)", ink: "var(--success-ink)" },
};

function pillWidth(label: string) {
  return label.length * 9.5 + 26;
}

function stateTone(state: string) {
  if (state === "ESTABLISHED")
    return { fill: "var(--success-bg)", ink: "var(--success-ink)" };
  if (state === "CLOSED" || state === "LISTEN")
    return { fill: "var(--muted-bg)", ink: "var(--ink)" };
  return { fill: "var(--btn-secondary-bg)", ink: "var(--btn-secondary-ink)" };
}

type Geometry = { x1: number; y1: number; x2: number; y2: number; row: number };

function geometry(
  scenario: Scenario,
  step: Extract<RenderStep, { kind: "message" | "lost" }>,
  row: number,
): Geometry {
  const xOf = (actor: string) =>
    actor === scenario.actors[0].id ? LEFT : RIGHT;
  const y = TOP + row * ROW;
  return {
    x1: xOf(step.from),
    x2: xOf(step.to),
    y1: y - SLANT,
    y2: y + SLANT,
    row,
  };
}

function Arrow({
  g,
  step,
  animate,
  onSelect,
}: {
  g: Geometry;
  step: Extract<RenderStep, { kind: "message" | "lost" }>;
  animate: boolean;
  onSelect: () => void;
}) {
  const lost = step.kind === "lost";
  const reach = lost ? 0.55 : 1;
  const dx = (g.x2 - g.x1) * reach;
  const dy = (g.y2 - g.y1) * reach;
  const endX = g.x1 + dx;
  const endY = g.y1 + dy;
  const direction = Math.sign(g.x2 - g.x1);
  const tone = TONES[step.tone];
  const midX = (g.x1 + g.x2) / 2;
  const midY = (g.y1 + g.y2) / 2;
  const retransmission = step.kind === "message" && step.retransmission;
  const label = retransmission ? `${step.label} (renvoi)` : step.label;
  const stroke = lost ? "var(--danger-500)" : "var(--ink)";
  const timing = { "--seq-ms": `${MOVE_MS}ms` } as CSSProperties;
  const packetVars = {
    ...timing,
    "--dx": `${dx}px`,
    "--dy": `${dy}px`,
  } as CSSProperties;
  const width = pillWidth(step.label);

  return (
    <g onClick={onSelect} className="cursor-pointer" style={timing}>
      <line
        x1={g.x1}
        y1={g.y1}
        x2={endX}
        y2={endY}
        pathLength={1}
        className={animate ? "seq-draw" : undefined}
        style={{ stroke, strokeWidth: 2.5, strokeDasharray: 1 }}
      />
      {lost ? (
        <g
          className={animate ? "seq-appear" : undefined}
          style={{ transform: `translate(${endX}px, ${endY}px)` }}
        >
          <g
            style={{
              stroke: "var(--danger-500)",
              strokeWidth: 4,
              strokeLinecap: "round",
            }}
          >
            <line x1={-8} y1={-8} x2={8} y2={8} />
            <line x1={-8} y1={8} x2={8} y2={-8} />
          </g>
        </g>
      ) : (
        <polygon
          points={`0,0 ${-12 * direction},-6 ${-12 * direction},6`}
          className={animate ? "seq-appear" : undefined}
          style={{
            fill: stroke,
            transform: `translate(${g.x2}px, ${g.y2}px)`,
          }}
        />
      )}

      {/* The label stays on the arrow once the packet has landed. */}
      <g
        className={animate ? "seq-appear" : undefined}
        style={{ transform: `translate(${midX}px, ${midY - 24}px)` }}
      >
        <text
          textAnchor="middle"
          style={{
            fill: lost ? "var(--danger-ink)" : "var(--ink)",
            fontWeight: 700,
            fontSize: 15,
            paintOrder: "stroke",
            stroke: "var(--bg)",
            strokeWidth: 6,
          }}
        >
          {label}
          {lost ? " ✕ perdu" : ""}
        </text>
        {step.detail ? (
          <text
            y={44}
            textAnchor="middle"
            style={{
              fill: "var(--muted-ink)",
              fontSize: 12,
              paintOrder: "stroke",
              stroke: "var(--bg)",
              strokeWidth: 5,
            }}
          >
            {step.detail}
          </text>
        ) : null}
      </g>

      {/* The packet flying along the arrow: it fades out when it lands. */}
      {animate ? (
        <g
          className={lost ? "seq-packet seq-packet-lost" : "seq-packet"}
          style={packetVars}
        >
          <g style={{ transform: `translate(${g.x1}px, ${g.y1}px)` }}>
            <rect
              x={-width / 2}
              y={-14}
              width={width}
              height={28}
              rx={14}
              style={{
                fill: lost ? "var(--danger-bg)" : tone.fill,
                stroke: "var(--outline)",
                strokeWidth: 2,
              }}
            />
            <text
              y={5}
              textAnchor="middle"
              style={{
                fill: lost ? "var(--danger-ink)" : tone.ink,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {step.label}
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
}

function Wait({
  actor,
  label,
  row,
  animate,
  onSelect,
  scenario,
}: {
  actor: string;
  label: string;
  row: number;
  animate: boolean;
  onSelect: () => void;
  scenario: Scenario;
}) {
  const x = actor === scenario.actors[0].id ? LEFT : RIGHT;
  const y = TOP + row * ROW;
  const width = pillWidth(label) + 20;

  return (
    <g
      onClick={onSelect}
      className={`cursor-pointer ${animate ? "seq-appear" : ""}`}
      style={{ "--seq-ms": "300ms" } as CSSProperties}
    >
      <rect
        x={x - width / 2}
        y={y - 15}
        width={width}
        height={30}
        rx={15}
        style={{
          fill: "var(--warning-bg)",
          stroke: "var(--outline)",
          strokeWidth: 2,
          strokeDasharray: "5 4",
        }}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        style={{ fill: "var(--warning-ink)", fontWeight: 700, fontSize: 13 }}
      >
        ⏱ {label}
      </text>
    </g>
  );
}

// An animated sequence diagram of a protocol exchange between two machines. The user can play it,
// step through it, jump to a step, and switch on a packet loss to see how the protocol recovers.
export function SequenceDiagram({ scenario }: { scenario: Scenario }) {
  const [loss, setLoss] = useState(false);
  const [shown, setShown] = useState(0); // how many steps have been played (the last one is animating)
  const [playing, setPlaying] = useState(false);
  const [settled, setSettled] = useState(true);

  const steps = useMemo(
    () => expandSteps(scenario, { loss }),
    [scenario, loss],
  );
  const total = steps.length;
  const current = shown > 0 ? steps[shown - 1] : null;

  // States are applied once the packet has landed.
  const states = statesAfter(
    scenario,
    steps,
    settled ? shown : Math.max(0, shown - 1),
  );

  useEffect(() => {
    if (shown === 0) return;
    const timer = setTimeout(() => setSettled(true), MOVE_MS);
    return () => clearTimeout(timer);
  }, [shown, loss]);

  // Playing stops by itself on the last step: `running` is false once everything has been played.
  const running = playing && shown < total;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => goTo(shown + 1),
      shown === 0 ? 400 : STEP_MS,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, shown]);

  function goTo(count: number) {
    setSettled(false);
    setShown(Math.max(0, Math.min(total, count)));
  }

  function togglePlay() {
    if (running) {
      setPlaying(false);
      return;
    }
    if (shown >= total) goTo(0);
    setPlaying(true);
  }

  function changeLoss(next: boolean) {
    setLoss(next);
    setPlaying(false);
    setSettled(true);
    setShown(0);
  }

  const height = TOP + total * ROW + 10;
  const [clientActor, serverActor] = scenario.actors;
  const actorEntries = [
    { actor: clientActor, x: LEFT },
    { actor: serverActor, x: RIGHT },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon-sm"
            variant="secondary"
            aria-label="Étape précédente"
            disabled={shown === 0}
            onClick={() => {
              setPlaying(false);
              goTo(shown - 1);
            }}
          >
            <SkipBack aria-hidden />
          </Button>
          <Button size="sm" onClick={togglePlay}>
            {running ? <Pause aria-hidden /> : <Play aria-hidden />}
            {running
              ? "Pause"
              : shown >= total
                ? "Rejouer"
                : shown === 0
                  ? "Lecture"
                  : "Reprendre"}
          </Button>
          <Button
            size="icon-sm"
            variant="secondary"
            aria-label="Étape suivante"
            disabled={shown >= total}
            onClick={() => {
              setPlaying(false);
              goTo(shown + 1);
            }}
          >
            <SkipForward aria-hidden />
          </Button>
          <Button
            size="icon-sm"
            variant="secondary"
            aria-label="Recommencer"
            disabled={shown === 0}
            onClick={() => {
              setPlaying(false);
              goTo(0);
            }}
          >
            <RotateCcw aria-hidden />
          </Button>
        </div>

        <label className="flex items-center gap-3 text-sm font-bold">
          <Switch
            checked={loss}
            onChange={(event) => changeLoss(event.target.checked)}
          />
          Simuler une perte de paquet
        </label>

        <p className="text-sm text-muted-foreground" aria-hidden>
          Étape {shown} sur {total}
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          role="img"
          aria-label={`Diagramme animé : ${scenario.title}. Le détail des étapes est donné dans la liste qui suit.`}
          className="mx-auto block h-auto w-full max-w-2xl min-w-[30rem]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {/* Lifelines and actors */}
          {actorEntries.map(({ actor, x }) => {
            const state = states[actor.id];
            const tone = state ? stateTone(state) : null;
            const stateWidth = state ? pillWidth(state) : 0;
            return (
              <g key={actor.id}>
                <line
                  x1={x}
                  y1={92}
                  x2={x}
                  y2={height}
                  style={{
                    stroke: "var(--outline)",
                    strokeWidth: 2,
                    strokeDasharray: "6 6",
                  }}
                />
                <rect
                  x={x - 78}
                  y={6}
                  width={156}
                  height={50}
                  rx={10}
                  style={{
                    fill: "var(--surface)",
                    stroke: "var(--outline)",
                    strokeWidth: 2,
                  }}
                />
                <text
                  x={x}
                  y={28}
                  textAnchor="middle"
                  style={{ fill: "var(--ink)", fontWeight: 700, fontSize: 16 }}
                >
                  {actor.label}
                </text>
                {actor.sublabel ? (
                  <text
                    x={x}
                    y={46}
                    textAnchor="middle"
                    style={{ fill: "var(--muted-ink)", fontSize: 11 }}
                  >
                    {actor.sublabel}
                  </text>
                ) : null}
                {state && tone ? (
                  <g>
                    <rect
                      x={x - stateWidth / 2}
                      y={62}
                      width={stateWidth}
                      height={24}
                      rx={12}
                      style={{
                        fill: tone.fill,
                        stroke: "var(--outline)",
                        strokeWidth: 2,
                      }}
                    />
                    <text
                      x={x}
                      y={78}
                      textAnchor="middle"
                      style={{ fill: tone.ink, fontWeight: 700, fontSize: 12 }}
                    >
                      {state}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* Steps played so far */}
          {steps.slice(0, shown).map((step, i) => {
            const animate = i === shown - 1;
            const key = `${loss}-${i}-${animate ? shown : "done"}`;
            if (step.kind === "wait") {
              return (
                <Wait
                  key={key}
                  actor={step.actor}
                  label={step.label}
                  row={i}
                  animate={animate}
                  scenario={scenario}
                  onSelect={() => {
                    setPlaying(false);
                    goTo(i + 1);
                  }}
                />
              );
            }
            return (
              <Arrow
                key={key}
                g={geometry(scenario, step, i)}
                step={step}
                animate={animate}
                onSelect={() => {
                  setPlaying(false);
                  goTo(i + 1);
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* What is happening, in words */}
      <div
        aria-live="polite"
        className="flex min-h-28 flex-col gap-2 rounded-lg border-2 border-dashed border-border p-4 text-sm"
      >
        {current ? (
          <>
            <p className="text-xs font-bold text-muted-foreground">
              Étape {shown} sur {total}
            </p>
            <p className="leading-relaxed">{current.note}</p>
          </>
        ) : (
          <p className="leading-relaxed">
            {scenario.summary}{" "}
            <span className="text-muted-foreground">
              Lancez la lecture, ou avancez étape par étape.
            </span>
          </p>
        )}
      </div>

      {/* Jump to a step */}
      <div
        role="group"
        aria-label="Aller à une étape"
        className="flex flex-wrap gap-2"
      >
        {steps.map((step, i) => (
          <button
            key={`${loss}-${i}`}
            type="button"
            className="chip"
            aria-pressed={shown === i + 1}
            aria-label={`Étape ${i + 1}`}
            onClick={() => {
              setPlaying(false);
              goTo(i + 1);
            }}
          >
            {i + 1}.{" "}
            {step.kind === "wait"
              ? "Attente"
              : step.kind === "lost"
                ? `${step.label} perdu`
                : step.label}
          </button>
        ))}
      </div>

      {/* The same steps, for screen readers */}
      <ol className="sr-only">
        {steps.map((step, i) => (
          <li key={i}>{step.note}</li>
        ))}
      </ol>
    </div>
  );
}
