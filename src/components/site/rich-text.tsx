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
  blocks: {
    Code: ({ node }: { node: { fields: unknown } }) => {
      const { language, code } = node.fields as {
        language?: string;
        code?: string;
      };
      return (
        <CodeSnippet language={language ?? "plaintext"} code={code ?? ""} />
      );
    },
  },
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

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  plaintext: "Résultat",
};

// A code sample: the language as a tab above a block of preformatted text. The code is rendered as text
// (React escapes it), never as markup.
function CodeSnippet({ language, code }: { language: string; code: string }) {
  return (
    <figure className="code-snippet">
      <figcaption>{LANGUAGE_LABELS[language] ?? language}</figcaption>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export function RichTextContent({ data }: { data: RichTextBody }) {
  return (
    <div className="prose-synack">
      <RichText data={data} converters={converters} />
    </div>
  );
}

export { defaultJSXConverters };
