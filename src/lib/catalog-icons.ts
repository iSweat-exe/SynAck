import {
  Binary,
  Cpu,
  Globe,
  Layers,
  Lock,
  Network,
  Newspaper,
  Route,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  SiDocker,
  SiJavascript,
  SiPython,
  SiReact,
  SiRust,
  SiTypescript,
} from "react-icons/si";

import type { IconName } from "@/lib/icon-names";

// The logos a card can show. Items refer to them by name (a string), so a card can come from the CMS and
// cross the server / client boundary, which components cannot.
export type CatalogIcon = ComponentType<{ className?: string }>;

export const ICONS: Record<IconName, CatalogIcon> = {
  binary: Binary,
  cpu: Cpu,
  globe: Globe,
  layers: Layers,
  lock: Lock,
  network: Network,
  newspaper: Newspaper,
  route: Route,
  server: Server,
  shield: ShieldCheck,
  docker: SiDocker,
  javascript: SiJavascript,
  python: SiPython,
  react: SiReact,
  rust: SiRust,
  typescript: SiTypescript,
};
