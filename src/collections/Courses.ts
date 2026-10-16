import type { CollectionConfig } from "payload";

import { chapterBlocks } from "@/blocks/RichText";
import { publishedOrSignedIn } from "@/collections/access";
import { slugField } from "@/fields/slug";

export const Courses: CollectionConfig = {
  slug: "courses",
  labels: { singular: "Course", plural: "Courses" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "_status", "updatedAt"],
  },
  access: { read: publishedOrSignedIn },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "summary", type: "textarea" },
    {
      name: "chapters",
      type: "array",
      labels: { singular: "Chapter", plural: "Chapters" },
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "content", type: "blocks", blocks: chapterBlocks },
      ],
    },
  ],
};
