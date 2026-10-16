import type { Block } from "payload";

// Embeds an animated protocol diagram (created in "Protocol diagrams") in a chapter.
export const ProtocolDiagram: Block = {
  slug: "protocolDiagram",
  labels: { singular: "Protocol diagram", plural: "Protocol diagrams" },
  fields: [
    {
      name: "diagram",
      type: "relationship",
      relationTo: "protocols",
      required: true,
      admin: {
        description:
          'Pick a diagram from "Protocol diagrams". Create it there first if it does not exist yet.',
      },
    },
  ],
};
