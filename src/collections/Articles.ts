import type { CollectionConfig } from "payload";

import { publishedOrSignedIn } from "@/collections/access";
import { slugField } from "@/fields/slug";
import { editor } from "@/lib/editor";

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: { singular: "Article", plural: "Articles" },
  admin: {
    useAsTitle: "title",
    group: "Watch",
    defaultColumns: ["title", "publishedAt", "_status"],
  },
  access: { read: publishedOrSignedIn },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === "create" && !data.author && req.user) {
          data.author = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "excerpt", type: "textarea" },
    { name: "content", type: "richText", editor, required: true },
    { name: "tags", type: "text", hasMany: true },
    { name: "author", type: "relationship", relationTo: "users" },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
