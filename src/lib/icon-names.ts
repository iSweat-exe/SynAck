// Names of the logos a card can show (the components live in catalog-icons.ts). Kept apart so the CMS
// configuration can list them without loading the icon libraries.
export const ICON_NAMES = [
  "binary",
  "cpu",
  "globe",
  "layers",
  "lock",
  "network",
  "newspaper",
  "route",
  "server",
  "shield",
  "docker",
  "javascript",
  "python",
  "react",
  "rust",
  "typescript",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const ICON_OPTIONS = ICON_NAMES.map((name) => ({
  label: name[0].toUpperCase() + name.slice(1),
  value: name,
}));

export function isIconName(value: unknown): value is IconName {
  return (ICON_NAMES as readonly string[]).includes(value as string);
}
