import type { CatalogItem } from "@/lib/catalog";
import { isIconName } from "@/lib/icon-names";
import { protocolToScenario } from "@/lib/protocol-cms";
import type { Scenario } from "@/lib/protocol-diagram";
import type { Course, Protocol } from "@/payload-types";

// The card of a course in the list of paths.
export function courseToCatalogItem(doc: Course): CatalogItem {
  return {
    id: doc.slug,
    title: doc.title,
    description: doc.summary ?? "",
    level: doc.level ?? undefined,
    tags: doc.tags ?? [],
    icon: isIconName(doc.icon) ? doc.icon : "binary",
    href: `/paths/${doc.slug}`,
  };
}

// What a chapter shows, block by block, ready to render. Blocks that are empty or point to something that
// is not available (a diagram that is not published, a deleted one) are left out.
type AnyBlock = NonNullable<
  NonNullable<Course["chapters"]>[number]["content"]
>[number];

// The rich text of a text block, as stored by the CMS (Lexical state).
export type RichTextBody = Extract<AnyBlock, { blockType: "richText" }>["body"];

export type ChapterBlock =
  | { kind: "text"; id: string; body: RichTextBody }
  | { kind: "diagram"; id: string; scenario: Scenario; slug: string };

export type ChapterView = {
  id: string;
  number: number;
  title: string;
  blocks: ChapterBlock[];
};

export function courseChapters(
  course: Course,
  { allowDraftDiagrams = false }: { allowDraftDiagrams?: boolean } = {},
): ChapterView[] {
  return (course.chapters ?? []).map((chapter, index) => {
    const blocks: ChapterBlock[] = [];

    for (const [position, block] of (chapter.content ?? []).entries()) {
      const id = block.id ?? `${index}-${position}`;

      if (block.blockType === "richText") {
        if (block.body) blocks.push({ kind: "text", id, body: block.body });
        continue;
      }

      if (block.blockType === "protocolDiagram") {
        const diagram = block.diagram;
        // An id or null means the diagram could not be loaded.
        if (!diagram || typeof diagram !== "object") continue;
        const protocol = diagram as Protocol;
        if (!allowDraftDiagrams && protocol._status !== "published") continue;
        const scenario = protocolToScenario(protocol);
        if (scenario.steps.length === 0) continue;
        blocks.push({ kind: "diagram", id, scenario, slug: protocol.slug });
      }
    }

    return {
      id: chapter.id ?? `chapter-${index}`,
      number: index + 1,
      title: chapter.title,
      blocks,
    };
  });
}
