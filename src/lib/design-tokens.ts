// Palette of the design system (.dev/Organisation/DESIGN.md §3). The values live in globals.css; this list
// only describes them for the /design-system page, and a test checks that both agree.
export type Swatch = {
  name: string;
  token: string;
  hex: string;
  note?: string;
};

const tones = [
  "950",
  "900",
  "800",
  "700",
  "600",
  "500",
  "400",
  "300",
  "200",
  "100",
  "50",
];

function scale(
  family: "primary" | "neutral",
  hexes: string[],
  notes: Record<string, string> = {},
  extra: Swatch[] = [],
): Swatch[] {
  return [
    ...tones.map((tone, i) => ({
      name: `${family}-${tone}`,
      token: `--${family}-${tone}`,
      hex: hexes[i],
      note: notes[tone],
    })),
    ...extra,
  ];
}

export const PRIMARY: Swatch[] = scale(
  "primary",
  [
    "#2b0519",
    "#470a2b",
    "#770d46",
    "#a71161",
    "#d11a7b",
    "#f656ab",
    "#fb84c3",
    "#fda3d2",
    "#fec2e1",
    "#ffe0f0",
    "#fff0f8",
  ],
  {
    "500": "Primary button bevel",
    "400": "Main color",
    "200": "Light switch knob",
    "50": "Secondary button background",
  },
);

export const NEUTRAL: Swatch[] = scale(
  "neutral",
  [
    "#121011",
    "#1e1b1d",
    "#2e292c",
    "#453e42",
    "#5f565b",
    "#7f757b",
    "#a9a0a5",
    "#d1cace",
    "#e6e1e4",
    "#f3f0f2",
    "#faf8f9",
  ],
  {
    "950": "Text and outlines",
    "400": "Gray switch knob",
    "300": "Secondary button bevel",
    "100": "Page background (light)",
  },
  [{ name: "neutral-0", token: "--neutral-0", hex: "#ffffff" }],
);

export const SEMANTIC: { role: string; swatches: Swatch[] }[] = [
  ["success", "#dcf7e8", "#1fa463", "#0f6b3f"],
  ["warning", "#fff1cc", "#f5a524", "#8a5a00"],
  ["danger", "#ffe0e0", "#e5484d", "#a4202a"],
  ["info", "#ddebff", "#3b82f6", "#1e4fb0"],
].map(([role, ...hexes]) => ({
  role,
  swatches: (["100", "500", "900"] as const).map((tone, i) => ({
    name: `${role}-${tone}`,
    token: `--${role}-${tone}`,
    hex: hexes[i],
  })),
}));

export const ALL_SWATCHES: Swatch[] = [
  ...PRIMARY,
  ...NEUTRAL,
  ...SEMANTIC.flatMap(({ swatches }) => swatches),
];
