import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { validateSafeUrl } from "@/lib/safe-url";

// Content is stored as structured Lexical JSON and rendered by our own components, never as raw HTML.
// The feature list is an explicit allow-list: no HTML converter or raw HTML block (stored XSS), no upload
// until a media storage exists, and links are restricted to safe URL schemes.
export const editor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    InlineCodeFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    LinkFeature({
      enabledCollections: [],
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          "name" in field && field.name === "url"
            ? ({ ...field, validate: validateSafeUrl } as typeof field)
            : field,
        ),
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});
