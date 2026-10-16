import { revalidatePath } from "next/cache";
import type { CollectionConfig, Field } from "payload";

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

// One of the two machines of the diagram (shown as a lifeline).
function machine(
  name: "machineA" | "machineB",
  side: string,
  defaults: { label: string; sublabel: string; state: string },
): Field {
  return {
    name,
    type: "group",
    label: `Machine ${name === "machineA" ? "A" : "B"} (${side})`,
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "label",
            type: "text",
            required: true,
            defaultValue: defaults.label,
            admin: { description: 'Name shown on top, e.g. "Client".' },
          },
          {
            name: "sublabel",
            type: "text",
            defaultValue: defaults.sublabel,
            admin: {
              description: 'Small text under the name, e.g. "your browser".',
            },
          },
          {
            name: "initialState",
            type: "text",
            defaultValue: defaults.state,
            admin: {
              description:
                'State shown before anything happens, e.g. "CLOSED". Leave empty to show none.',
            },
          },
        ],
      },
    ],
  };
}

// Outside a Next.js request (a script, a migration) there is no cache to refresh: ignore the error.
function refreshPages(slug: unknown) {
  try {
    revalidatePath("/protocols");
    if (typeof slug === "string") revalidatePath(`/protocols/${slug}`);
    // Courses can embed the diagram.
    revalidatePath("/paths/[slug]", "page");
  } catch {
    // nothing to refresh
  }
}

const MACHINE_OPTIONS = [
  { label: "Machine A (left)", value: "a" },
  { label: "Machine B (right)", value: "b" },
];

export const Protocols: CollectionConfig = {
  slug: "protocols",
  labels: { singular: "Protocol diagram", plural: "Protocol diagrams" },
  admin: {
    useAsTitle: "title",
    group: "Learning",
    defaultColumns: ["title", "level", "_status", "updatedAt"],
    description:
      'An animated diagram of an exchange between two machines (TCP handshake, an HTTP request, a DNS lookup...). Describe the two machines, then the messages one by one: the site draws and animates it, and readers can play it, step through it, and simulate a lost packet. Use "Preview" to see it on the site.',
    // Opens the public page, in draft mode for people with back-office access.
    preview: (doc) =>
      typeof doc?.slug === "string" ? `/preview/protocols/${doc.slug}` : null,
  },
  access: {
    read: publishedOrEditor,
    readVersions: requirePermission("cms.access"),
    // No dedicated permission in V1: diagrams follow the rules of the courses.
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
    // The public pages are cached for a minute; refresh them as soon as a diagram changes.
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
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: {
        description:
          "One or two sentences shown above the diagram, to say what it explains.",
      },
    },
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
          defaultValue: "network",
          options: ICON_OPTIONS,
          admin: { width: "30%", description: "Logo shown on the card." },
        },
        {
          name: "tags",
          type: "text",
          hasMany: true,
          admin: {
            width: "40%",
            description: "Themes used by the filters, e.g. Transport.",
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
    machine("machineA", "left", {
      label: "Client",
      sublabel: "your browser",
      state: "CLOSED",
    }),
    machine("machineB", "right", {
      label: "Server",
      sublabel: "the website",
      state: "LISTEN",
    }),
    {
      name: "steps",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Message", plural: "Messages" },
      admin: {
        description:
          "The messages, in order from top to bottom. Each one is an arrow between the two machines.",
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "from",
              type: "select",
              required: true,
              defaultValue: "a",
              options: MACHINE_OPTIONS,
              admin: { width: "25%" },
            },
            {
              name: "to",
              type: "select",
              required: true,
              defaultValue: "b",
              options: MACHINE_OPTIONS,
              admin: { width: "25%" },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: unknown },
              ) => {
                const from = (siblingData as { from?: string } | undefined)
                  ?.from;
                return value && value === from
                  ? "A message goes from one machine to the other: pick a different machine."
                  : true;
              },
            },
            {
              name: "label",
              type: "text",
              required: true,
              admin: { width: "25%", description: 'Name, e.g. "SYN".' },
            },
            {
              name: "detail",
              type: "text",
              admin: {
                width: "25%",
                description: 'Under the arrow, e.g. "seq = x".',
              },
            },
          ],
        },
        {
          name: "note",
          type: "textarea",
          required: true,
          admin: {
            description:
              "What happens, in a sentence or two. It is shown while the message is played.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "tone",
              type: "select",
              defaultValue: "secondary",
              options: [
                { label: "Main message (pink)", value: "primary" },
                { label: "Acknowledgement / light", value: "secondary" },
                { label: "Data (blue)", value: "info" },
                { label: "Success (green)", value: "success" },
              ],
              admin: { width: "34%" },
            },
            {
              name: "stateA",
              type: "text",
              label: "State of A afterwards",
              admin: {
                width: "33%",
                description: "Once the message has arrived. Empty = unchanged.",
              },
            },
            {
              name: "stateB",
              type: "text",
              label: "State of B afterwards",
              admin: {
                width: "33%",
                description: "Once the message has arrived. Empty = unchanged.",
              },
            },
          ],
        },
        {
          name: "canBeLost",
          type: "checkbox",
          label: "Readers can make this message get lost",
          admin: {
            description:
              'Adds the "Simulate a packet loss" demo for this message: it is lost, the sender waits, then sends it again.',
          },
        },
        {
          name: "loss",
          type: "group",
          label: "If the message is lost",
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.canBeLost),
          },
          fields: [
            {
              name: "lostNote",
              type: "textarea",
              required: true,
              label: "When it is lost",
              admin: {
                description: "What the reader sees as the packet disappears.",
              },
            },
            {
              name: "waitNote",
              type: "textarea",
              required: true,
              label: "While waiting",
              admin: {
                description: "Why the sender waits and what it concludes.",
              },
            },
            {
              name: "retransmitNote",
              type: "textarea",
              required: true,
              label: "When it is sent again",
              admin: { description: "What happens on the retransmission." },
            },
          ],
        },
      ],
    },
  ],
};
