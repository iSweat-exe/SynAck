import config from "@payload-config";
import { getPayload } from "payload";

import { protocolToScenario } from "@/lib/protocol-cms";
import type { Scenario } from "@/lib/protocol-diagram";
import { tcpHandshake } from "@/lib/scenarios/tcp-handshake";
import type { Protocol } from "@/payload-types";

// Diagrams that ship with the site; the CMS can override them by using the same slug.
const BUILT_IN: Record<string, Scenario> = { tcp: tcpHandshake };

export function builtInScenario(slug: string) {
  return BUILT_IN[slug] ?? null;
}

export function builtInSlugs() {
  return Object.keys(BUILT_IN);
}

// The CMS is optional at read time: if the database cannot be reached (a build without a database, a
// hiccup), the site falls back to what it has instead of failing.
export async function getPublishedProtocols(): Promise<Protocol[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "protocols",
      where: { _status: { equals: "published" } },
      limit: 100,
      depth: 0,
      sort: "title",
    });
    return docs;
  } catch {
    return [];
  }
}

export async function getProtocolBySlug(
  slug: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<Protocol | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "protocols",
      where: draft
        ? { slug: { equals: slug } }
        : { slug: { equals: slug }, _status: { equals: "published" } },
      draft,
      limit: 1,
      depth: 0,
    });
    return docs[0] ?? null;
  } catch {
    return null;
  }
}

export type ProtocolView = { scenario: Scenario; badges: string[] };

// A diagram by slug, ready to display: the CMS first (the draft too when asked), then the built-in one.
export async function getProtocolView(
  slug: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<ProtocolView | null> {
  const doc = await getProtocolBySlug(slug, { draft });
  if (doc) {
    return {
      scenario: protocolToScenario(doc),
      badges: [doc.level, ...(doc.tags ?? [])].filter(
        (badge): badge is string => Boolean(badge),
      ),
    };
  }
  const scenario = builtInScenario(slug);
  return scenario ? { scenario, badges: ["Transport", "Animé"] } : null;
}
