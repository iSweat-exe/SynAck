import {
  defaultJSXConverters,
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import type { RichTextBody } from "@/lib/course-cms";
import { isSafeUrl } from "@/lib/safe-url";

// Renders the rich text of the CMS with our own markup (no raw HTML is ever stored or injected). Links are
// checked again here, on top of the check when the editor saves them: a link whose URL is not safe is shown
// as plain text, and external links open with `rel="noopener noreferrer"`.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const url: unknown = node.fields?.url;
    if (typeof url !== "string" || !isSafeUrl(url)) return <>{children}</>;
    const external = /^(https?:)?\/\//.test(url) || url.startsWith("mailto:");
    return (
      <a
        href={url}
        {...(external || node.fields?.newTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
});

export function RichTextContent({ data }: { data: RichTextBody }) {
  return (
    <div className="prose-synack">
      <RichText data={data} converters={converters} />
    </div>
  );
}

export { defaultJSXConverters };
