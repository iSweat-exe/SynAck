import type { CollectionConfig } from "payload";

import { publishedOrSignedIn } from "@/collections/access";
import { slugField } from "@/fields/slug";

export const Paths: CollectionConfig = {
  slug: "paths",
  labels: { singular: "Path", plural: "Paths" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "level", "_status"],
  },
  access: { read: publishedOrSignedIn },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "summary", type: "textarea" },
    {
      name: "level",
      type: "select",
      required: true,
      defaultValue: "beginner",
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    {
      name: "courses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
      admin: { description: "Ordered sequence of courses." },
    },
  ],
};
