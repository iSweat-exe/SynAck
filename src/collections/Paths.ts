import type { CollectionConfig } from "payload";

import {
  publishedOrEditor,
  publishRequires,
  requirePermission,
} from "@/collections/access";
import { slugField } from "@/fields/slug";

export const Paths: CollectionConfig = {
  slug: "paths",
  labels: { singular: "Path", plural: "Paths" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "level", "_status"],
  },
  access: {
    read: publishedOrEditor,
    readVersions: requirePermission("cms.access"),
    create: requirePermission("paths.manage"),
    update: requirePermission("paths.manage"),
    delete: requirePermission("paths.manage"),
  },
  versions: { drafts: true },
  hooks: { beforeChange: [publishRequires("paths.manage")] },
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
