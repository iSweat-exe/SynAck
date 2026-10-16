import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RichTextContent } from "@/components/site/rich-text";

const text = (value: string) => ({
  type: "text",
  version: 1,
  text: value,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
});

function state(url: string) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: "ltr",
          format: "",
          indent: 0,
          children: [
            {
              type: "link",
              version: 1,
              direction: "ltr",
              format: "",
              indent: 0,
              fields: { linkType: "custom", url, newTab: false },
              children: [text("cliquez")],
            },
          ],
        },
      ],
    },
  } as never;
}

describe("RichTextContent links", () => {
  it("keeps a safe external link and protects it", () => {
    const html = renderToStaticMarkup(
      <RichTextContent data={state("https://example.com/page")} />,
    );
    expect(html).toContain('href="https://example.com/page"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("keeps a relative link", () => {
    const html = renderToStaticMarkup(
      <RichTextContent data={state("/paths/web")} />,
    );
    expect(html).toContain('href="/paths/web"');
    expect(html).not.toContain("_blank");
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "//evil.example",
  ])("shows %s as plain text, without a link", (url) => {
    const html = renderToStaticMarkup(<RichTextContent data={state(url)} />);
    expect(html).not.toContain("<a");
    expect(html).not.toContain("href=");
    expect(html).toContain("cliquez");
  });
});

describe("RichTextContent code samples", () => {
  function codeState(language: string, code: string) {
    return {
      root: {
        type: "root",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        children: [
          {
            type: "block",
            version: 2,
            format: "",
            fields: { id: "c1", blockType: "Code", language, code },
          },
        ],
      },
    } as never;
  }

  it("shows the code as text under its language", () => {
    const html = renderToStaticMarkup(
      <RichTextContent data={codeState("python", 'print("Bonjour")')} />,
    );
    expect(html).toContain("Python");
    expect(html).toContain("print(&quot;Bonjour&quot;)");
  });

  it("never turns the code into markup", () => {
    const html = renderToStaticMarkup(
      <RichTextContent
        data={codeState("javascript", "<script>alert(1)</script>")}
      />,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("labels the plain-text output of a program", () => {
    const html = renderToStaticMarkup(
      <RichTextContent data={codeState("plaintext", "Bonjour !")} />,
    );
    expect(html).toContain("Résultat");
  });
});
