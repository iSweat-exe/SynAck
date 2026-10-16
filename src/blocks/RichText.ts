import type { Block } from "payload";

import { ProtocolDiagram } from "@/blocks/ProtocolDiagram";
import { editor } from "@/lib/editor";

export const RichText: Block = {
  slug: "richText",
  labels: { singular: "Text", plural: "Text blocks" },
  fields: [{ name: "body", type: "richText", editor, required: true }],
};

// Blocks available inside a chapter. Exercise and Quiz blocks are added in P2.2 and P2.6.
export const chapterBlocks: Block[] = [RichText, ProtocolDiagram];
