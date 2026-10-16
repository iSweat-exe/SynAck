import type { CollectionConfig } from "payload";

import { chapterBlocks } from "@/blocks/RichText";
import {
  authorFieldAccess,
  authorIsCreator,
  authorOrPermission,
  publishedOrEditor,
  publishRequires,
  requirePermission,
} from "@/collections/access";
import { slugField } from "@/fields/slug";

export const Courses: CollectionConfig = {
  slug: "courses",
  labels: { singular: "Course", plural: "Courses" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "_status", "updatedAt"],
  },
  access: {
    read: publishedOrEditor,
    readVersions: requirePermission("cms.access"),
    create: requirePermission("courses.create"),
    update: authorOrPermission("courses.edit", "courses.edit_own"),
    delete: requirePermission("courses.delete"),
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      authorIsCreator("courses.edit"),
      publishRequires("courses.publish"),
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "summary", type: "textarea" },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      access: { update: authorFieldAccess("courses.edit") },
    },
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
