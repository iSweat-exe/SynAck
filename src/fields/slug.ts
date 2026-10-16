import type { TextField } from "payload";

import { slugify } from "@/lib/slugify";

// Unique URL slug, generated from the title when left empty. Editors can still type their own.
export function slugField(): TextField {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        "Used in the page URL. Generated from the title when left empty.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.trim() !== "") {
            return slugify(value);
          }
          return typeof data?.title === "string" ? slugify(data.title) : value;
        },
      ],
    },
  };
}
