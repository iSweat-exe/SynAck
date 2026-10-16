import type { Metadata } from "next";
import { ArrowRight, Download, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { AccountMenu } from "@/components/site/user-menu";
import { SwitchDemo } from "@/components/design-system/switch-demo";
import { ThemeScope } from "@/components/design-system/theme-scope";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
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
  { id: "inputs", label: "Inputs" },
  { id: "badges", label: "Badges" },
  { id: "tabs", label: "Tabs" },
  { id: "menus", label: "Menus" },
  { id: "cards", label: "Cards" },
  { id: "alerts", label: "Alerts" },
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
            note="Hover moves the button toward its shadow, pressed sinks it, disabled is flat and gray. Try them for real on any button."
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
          description="Pill-shaped track with a hard shadow and a knob. Gray knob on the left is off, pink knob on the right is on. Toggling only slides the knob from one side to the other."
        >
          <Block
            title="States"
            note="Off and on, enabled and disabled. Hover and pressed are forced on the last row; try them for real on any switch."
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
          id="inputs"
          title="Inputs"
          description="Text fields share the outline and radius of the buttons. An invalid field turns its outline red."
        >
          <Block
            title="States"
            note="Always pair a field with a label. Errors are linked with aria-invalid and aria-describedby."
          >
            <div className="grid gap-8 pr-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-default">Default</Label>
                <Input id="ds-default" placeholder="Placeholder text" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-filled">Filled</Label>
                <Input id="ds-filled" defaultValue="ada@example.test" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-help">With help text</Label>
                <Input
                  id="ds-help"
                  placeholder="Nickname"
                  aria-describedby="ds-help-text"
                />
                <p id="ds-help-text" className="text-xs text-muted-foreground">
                  Shown on the leaderboard if you opt in.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-invalid">Invalid</Label>
                <Input
                  id="ds-invalid"
                  defaultValue="not an email"
                  aria-invalid="true"
                  aria-describedby="ds-invalid-text"
                />
                <p
                  id="ds-invalid-text"
                  className="text-xs font-bold text-[var(--danger-ink)]"
                >
                  Enter a valid email address.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-disabled">Disabled</Label>
                <Input
                  id="ds-disabled"
                  defaultValue="Read only value"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-textarea">Textarea</Label>
                <Textarea id="ds-textarea" placeholder="Write a message" />
              </div>
            </div>
          </Block>
        </Section>

        <Section
          id="badges"
          title="Badges"
          description="A small outlined pill for statuses and tags. The semantic variants use the soft tones, like the alerts."
        >
          <Block title="Variants">
            <div className="flex flex-wrap items-center gap-4">
              <Badge>Neutral</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </Block>
          <Block title="In context">
            <p className="flex flex-wrap items-center gap-3">
              Introduction to Programming
              <Badge variant="primary">Beginner</Badge>
              <Badge variant="success">Published</Badge>
              <Badge variant="warning">Draft</Badge>
            </p>
          </Block>
        </Section>

        <Section
          id="tabs"
          title="Tabs"
          description="Switch between views of the same content. Arrow keys move between tabs. The selected tab is filled with the main color and lifts on a shadow."
        >
          <Block title="Default and disabled tab">
            <Tabs defaultValue="exercise">
              <TabsList>
                <TabsTab value="exercise">Exercise</TabsTab>
                <TabsTab value="hints">Hints</TabsTab>
                <TabsTab value="solution">Solution</TabsTab>
                <TabsTab value="soon" disabled>
                  Soon
                </TabsTab>
              </TabsList>
              <TabsPanel value="exercise">
                Write a function that returns the sum of two numbers.
              </TabsPanel>
              <TabsPanel value="hints">
                Hints unlock one by one, after a few failed attempts.
              </TabsPanel>
              <TabsPanel value="solution">
                The solution is revealed after three failed attempts.
              </TabsPanel>
            </Tabs>
          </Block>
        </Section>

        <Section
          id="menus"
          title="Menus and avatars"
          description="The account menu of the site header: the profile picture (or the initials) as a button, and a dropdown with the profile, the admin panel for accounts with the right permission, and the sign-out. Built on Base UI: arrow keys, Escape and focus handling included."
        >
          <Block
            title="Account menu"
            note="Open it. The first one is an account with back-office access, the second a plain member without a picture."
          >
            <div className="flex flex-wrap items-start gap-12 pb-48">
              <AccountMenu
                user={{
                  name: "ada-lovelace",
                  email: "ada@example.test",
                  canUseCms: true,
                }}
              />
              <AccountMenu user={{ name: "Grace Hopper", canUseCms: false }} />
            </div>
          </Block>
        </Section>

        <Section
          id="cards"
          title="Cards"
          description="An outlined surface with the same hard shadow as the buttons. Used to group content: the welcome and profile pages are built with it."
        >
          <Block
            title="Basic and with actions"
            note="A header (title and description) and a content area. Put the main action in Primary, the other ones in Secondary."
          >
            <div className="grid gap-8 pr-2 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Card title</CardTitle>
                  <CardDescription>
                    A short description of what this card is about.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">With actions</CardTitle>
                  <CardDescription>
                    Buttons stack inside the content area.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Primary action</Button>
                  <Button variant="secondary" className="w-full">
                    Secondary action
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Block>
        </Section>

        <Section
          id="alerts"
          title="Alerts"
          description="A message on a semantic background (tone 100, tone 900 in dark mode) with an icon. Danger and warning are announced to screen readers."
        >
          <Block
            title="Variants"
            note="Info, success, warning and danger, with and without a title."
          >
            <div className="flex flex-col gap-4">
              <Alert variant="info" title="Info">
                A neutral message that gives some context.
              </Alert>
              <Alert variant="success" title="Success">
                The action went through.
              </Alert>
              <Alert variant="warning" title="Warning">
                Something needs attention before you continue.
              </Alert>
              <Alert variant="danger" title="Danger">
                The action failed. Try again.
              </Alert>
              <Alert variant="info">Without a title, on one line.</Alert>
              <Alert variant="danger">
                Une erreur est survenue. Réessayez.
              </Alert>
            </div>
          </Block>
        </Section>

        <Section
          id="next"
          title="To come"
          description="Components to add here, with all their variants, as they are designed (DESIGN.md §9)."
        >
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
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
