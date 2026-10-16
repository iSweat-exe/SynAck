import { revalidatePath } from "next/cache";
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
import { ICON_OPTIONS } from "@/lib/icon-names";
import { LEVELS } from "@/lib/levels";

// Outside a Next.js request (a script, a migration) there is no cache to refresh: ignore the error.
function refreshPages(slug: unknown) {
  try {
    revalidatePath("/paths");
    if (typeof slug === "string") revalidatePath(`/paths/${slug}`);
  } catch {
    // nothing to refresh
  }
}

export const Courses: CollectionConfig = {
  slug: "courses",
  labels: { singular: "Course", plural: "Courses" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "level", "_status", "updatedAt"],
    description:
      'A course is a list of chapters; each chapter is made of blocks (text, protocol diagram...). Use "Preview" to see it on the site.',
    // Opens the public page, in draft mode for people with back-office access.
    preview: (doc) =>
      typeof doc?.slug === "string" ? `/preview/courses/${doc.slug}` : null,
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
    // The public pages are cached for a minute; refresh them as soon as a course changes.
    afterChange: [
      ({ doc }) => {
        refreshPages(doc?.slug);
      },
    ],
    afterDelete: [
      ({ doc }) => {
        refreshPages(doc?.slug);
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "summary", type: "textarea" },
    {
      type: "row",
      fields: [
        {
          name: "level",
          type: "select",
          options: LEVELS.map((level) => ({ label: level, value: level })),
          admin: { width: "30%" },
        },
        {
          name: "icon",
          type: "select",
          defaultValue: "binary",
          options: ICON_OPTIONS,
          admin: { width: "30%", description: "Logo shown on the card." },
        },
        {
          name: "tags",
          type: "text",
          hasMany: true,
          admin: {
            width: "40%",
            description: "Themes used by the filters, e.g. Python.",
          },
        },
      ],
    },
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
