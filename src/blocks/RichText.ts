import type { Block } from "payload";

import { editor } from "@/lib/editor";

export const RichText: Block = {
  slug: "richText",
  labels: { singular: "Text", plural: "Text blocks" },
  fields: [{ name: "body", type: "richText", editor, required: true }],
};

// Blocks available inside a chapter. Exercise, Quiz and Protocol animation blocks are added in P2.2, P2.6 and P3.1.
export const chapterBlocks: Block[] = [RichText];
