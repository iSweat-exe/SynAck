import type { Metadata } from "next";
import { ArrowRight, Download, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { SwitchDemo } from "@/components/design-system/switch-demo";
import { ThemeScope } from "@/components/design-system/theme-scope";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { NEUTRAL, PRIMARY, SEMANTIC, type Swatch } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Design system | SynAck",
  description: "Typography, colors and components of the SynAck interface.",
  // A working tool for the team, not a page to rank.
  robots: { index: false },
};

const SECTIONS = [
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "switches", label: "Switches" },
  { id: "next", label: "To come" },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-6">
      <header className="flex flex-col gap-2 border-b-2 border-border pb-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description ? (
          <p className="max-w-prose text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold">{title}</h3>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {swatches.map((swatch) => (
        <li key={swatch.token} className="flex flex-col gap-2">
          <div
            className="h-16 rounded-lg border-2 border-border"
            style={{ backgroundColor: `var(${swatch.token})` }}
          />
          <div className="flex flex-col text-xs">
            <span className="font-bold">{swatch.name}</span>
            <span className="text-muted-foreground uppercase">
              {swatch.hex}
            </span>
            {swatch.note ? (
              <span className="text-muted-foreground">{swatch.note}</span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Buttons shown in a forced interaction state (data-force) so every state is visible at once.
const FORCED_STATES = [
  { label: "Default", force: undefined },
  { label: "Hover", force: "hover" },
  { label: "Pressed", force: "active" },
  { label: "Focus", force: "focus" },
  { label: "Disabled", force: "disabled" },
] as const;

export default function DesignSystemPage() {
  return (
    <ThemeScope>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-6 pb-24">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Design system</h1>
          <p className="max-w-prose text-muted-foreground">
            Every component of the SynAck interface, with all its variants and
            states, in one place. The reference is{" "}
            <code>.dev/Organisation/DESIGN.md</code>. Use the toggle to check
            dark mode.
          </p>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a className="link" href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Section
          id="typography"
          title="Typography"
          description="A single family, Space Mono, in its four real variants. No synthesized weights or italics, no other font in the interface."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Block title="Regular 400" note="Body text, code">
              <p className="text-lg font-normal">
                Apprendre en pratiquant, pas en lisant.
              </p>
            </Block>
            <Block title="Bold 700" note="Headings, buttons, UI elements">
              <p className="text-lg font-bold">
                Apprendre en pratiquant, pas en lisant.
              </p>
            </Block>
            <Block title="Italic 400" note="Quotes, newly introduced terms">
              <p className="text-lg font-normal italic">
                Apprendre en pratiquant, pas en lisant.
              </p>
            </Block>
            <Block title="Bold italic 700" note="Strong emphasis">
              <p className="text-lg font-bold italic">
                Apprendre en pratiquant, pas en lisant.
              </p>
            </Block>
          </div>

          <Block
            title="Accents and code symbols"
            note="French characters must render in all four variants."
          >
            <div className="flex flex-col gap-2 text-lg">
              <p className="font-normal">
                À â ç é è ê ë î ï ô ö ù û ü ÿ œ æ — « guillemets » ’ …
              </p>
              <p className="font-bold">
                À â ç é è ê ë î ï ô ö ù û ü ÿ œ æ — « guillemets » ’ …
              </p>
              <p className="font-normal italic">
                À â ç é è ê ë î ï ô ö ù û ü ÿ œ æ — « guillemets » ’ …
              </p>
              <p className="font-bold italic">
                À â ç é è ê ë î ï ô ö ù û ü ÿ œ æ — « guillemets » ’ …
              </p>
              <p className="font-normal">
                {"{ } [ ] ( ) => === !== && || ?? ~ ^ | \\ / # $ % @ _"}
              </p>
            </div>
          </Block>

          <Block
            title="Scale"
            note="Body text 16 px, line height 1.6, about 65 characters per line for courses and articles."
          >
            <div className="flex flex-col gap-3">
              <p className="text-4xl font-bold tracking-tight">Heading 1</p>
              <p className="text-2xl font-bold">Heading 2</p>
              <p className="text-xl font-bold">Heading 3</p>
              <p className="max-w-[65ch]">
                Body text. Un paquet TCP porte un numéro de séquence, un numéro
                d&apos;acquittement et des drapeaux : SYN pour ouvrir la
                connexion, ACK pour confirmer la réception.
              </p>
              <p className="text-sm text-muted-foreground">
                Small text, for captions and hints.
              </p>
            </div>
          </Block>
        </Section>

        <Section
          id="colors"
          title="Colors"
          description="The supplied palette. The main color is primary-400. On a colored fill, text is always neutral-950."
        >
          <Block title="Primary (pink)">
            <SwatchGrid swatches={PRIMARY} />
          </Block>
          <Block title="Neutral">
            <SwatchGrid swatches={NEUTRAL} />
          </Block>
          <Block
            title="Semantic"
            note="100 is the message background, 500 the accent or fill, 900 the text on the 100 background."
          >
            <div className="flex flex-col gap-6">
              {SEMANTIC.map(({ role, swatches }) => (
                <div key={role} className="flex flex-col gap-3">
                  <SwatchGrid swatches={swatches} />
                </div>
              ))}
            </div>
          </Block>
        </Section>

        <Section
          id="buttons"
          title="Buttons"
          description="Thick near-black outline, hard offset shadow with no blur, darker bevel on the bottom and right edges, rounded corners. Text is Space Mono Bold."
        >
          <Block
            title="Variants and sizes"
            note="Primary is the main action of a screen, Secondary the other ones. Three sizes: sm, md (default), lg."
          >
            <div className="flex flex-col gap-8">
              {(["primary", "secondary"] as const).map((variant) => (
                <div
                  key={variant}
                  className="flex flex-wrap items-center gap-x-8 gap-y-6"
                >
                  <Button variant={variant} size="sm">
                    {variant === "primary" ? "Primary" : "Secondary"} sm
                  </Button>
                  <Button variant={variant} size="md">
                    {variant === "primary" ? "Primary" : "Secondary"} md
                  </Button>
                  <Button variant={variant} size="lg">
                    {variant === "primary" ? "Primary" : "Secondary"} lg
                  </Button>
                </div>
              ))}
            </div>
          </Block>

          <Block
            title="States"
            note="Hover moves the button toward its shadow, pressed sinks it, focus adds a ring that does not depend on hover, disabled is flat and gray. Try them for real on any button."
          >
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {(["primary", "secondary"] as const).flatMap((variant) =>
                FORCED_STATES.map(({ label, force }) => (
                  <div
                    key={`${variant}-${label}`}
                    className="flex flex-col items-start gap-4"
                  >
                    <span className="text-xs text-muted-foreground">
                      {variant} / {label.toLowerCase()}
                    </span>
                    <Button
                      variant={variant}
                      disabled={force === "disabled"}
                      data-force={force === "disabled" ? undefined : force}
                    >
                      {label}
                    </Button>
                  </div>
                )),
              )}
            </div>
          </Block>

          <Block
            title="With an icon"
            note="Icons follow the text size and the text color."
          >
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              <Button>
                <Plus aria-hidden />
                Create
              </Button>
              <Button variant="secondary">
                <Download aria-hidden />
                Download
              </Button>
              <Button size="lg">
                Continue
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </Block>

          <Block
            title="Icon only"
            note="Square buttons. Always give them an accessible name."
          >
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              <Button size="icon-sm" aria-label="Add">
                <Plus aria-hidden />
              </Button>
              <Button size="icon" aria-label="Add">
                <Plus aria-hidden />
              </Button>
              <Button size="icon-lg" aria-label="Add">
                <Plus aria-hidden />
              </Button>
              <Button variant="secondary" size="icon" aria-label="Download">
                <Download aria-hidden />
              </Button>
              <Button size="icon" aria-label="Add (disabled)" disabled>
                <Plus aria-hidden />
              </Button>
            </div>
          </Block>

          <Block
            title="Full width"
            note="For forms and narrow screens: add w-full."
          >
            <div className="flex max-w-sm flex-col gap-6 pr-2">
              <Button className="w-full" size="lg">
                Primary
              </Button>
              <Button className="w-full" size="lg" variant="secondary">
                Secondary
              </Button>
            </div>
          </Block>

          <Block
            title="As a link"
            note="A button that navigates renders an anchor (render prop). Inline links use the link variant, primary-700 on light backgrounds."
          >
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              <Button
                render={<a href="#buttons" />}
                nativeButton={false}
                variant="secondary"
              >
                Anchor styled as a button
              </Button>
              <p>
                Some text with an{" "}
                <Button
                  render={<a href="#buttons" />}
                  nativeButton={false}
                  variant="link"
                >
                  inline link
                </Button>{" "}
                in the middle of a sentence.
              </p>
            </div>
          </Block>
        </Section>

        <Section
          id="switches"
          title="Switches"
          description="Pill-shaped track with a hard shadow and a sliding knob. Gray knob on the left is off, pink knob on the right is on."
        >
          <Block
            title="Transition"
            note="Toggling slides the knob while it shrinks to a small round knob in the middle, then it grows back. These are the three frames of the UI kit: off, the middle of the transition, on. Toggle the live one to see it play."
          >
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <Switch aria-label="Off" checked={false} readOnly />
              <Switch
                aria-label="Middle of the transition"
                data-force="mid"
                readOnly
                checked={false}
              />
              <Switch aria-label="On" checked readOnly />
              <span className="text-xs text-muted-foreground">
                off / middle frame / on
              </span>
            </div>
            <label className="flex items-center gap-4">
              <Switch defaultChecked />
              <span>Live: click me</span>
            </label>
          </Block>

          <Block
            title="States"
            note="Off and on, enabled and disabled. Hover, pressed and focus are forced on the last row; try them for real on any switch."
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {(
                [
                  ["Off", {}],
                  ["On", { defaultChecked: true }],
                  ["Off, disabled", { disabled: true }],
                  ["On, disabled", { disabled: true, defaultChecked: true }],
                  ["Hover", { "data-force": "hover" }],
                  ["Pressed", { "data-force": "active" }],
                  ["Focus", { "data-force": "focus", defaultChecked: true }],
                ] as const
              ).map(([label, props]) => (
                <div key={label} className="flex flex-col items-start gap-4">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <Switch aria-label={label} {...props} />
                </div>
              ))}
            </div>
          </Block>

          <Block
            title="In use"
            note="A switch is a native checkbox with role=switch: it works in forms, with a label and with the Space key."
          >
            <SwitchDemo />
          </Block>
        </Section>

        <Section
          id="next"
          title="To come"
          description="Components to add here, with all their variants, as they are designed (DESIGN.md §9)."
        >
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              "Input fields",
              "Cards",
              "Tabs",
              "Badges",
              "Alert messages",
              "Beta warning banner",
              "Code editor",
              "Protocol animations",
              "Logo (variants)",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border-2 border-dashed border-border px-4 py-3 text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </ThemeScope>
  );
}
