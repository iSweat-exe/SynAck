import type { CollectionConfig } from "payload";

import {
  authorFieldAccess,
  authorIsCreator,
  authorOrPermission,
  publishedOrEditor,
  publishRequires,
  requirePermission,
} from "@/collections/access";
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
  access: {
    read: publishedOrEditor,
    readVersions: requirePermission("cms.access"),
    create: requirePermission("articles.create"),
    update: authorOrPermission("articles.publish", "articles.create"),
    // There is no `articles.delete`: whoever can publish an article can also remove it.
    delete: requirePermission("articles.publish"),
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      authorIsCreator("articles.publish"),
      publishRequires("articles.publish"),
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "excerpt", type: "textarea" },
    { name: "content", type: "richText", editor, required: true },
    { name: "tags", type: "text", hasMany: true },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      access: { update: authorFieldAccess("articles.publish") },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
