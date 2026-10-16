import { describe, expect, it } from "vitest";

import {
  chapterFileNames,
  CourseSourceError,
  parseChapter,
  parseCourseMeta,
  parseFrontmatter,
  shiftHeadings,
} from "@/lib/course-import";

const META = `---
title: "Introduction : les bases"
slug: intro-bases
summary: Un cours, sur les bases : variables et boucles.
level: Débutant
icon: binary
tags: [JavaScript, Python, "Bases"]
---
`;

describe("parseFrontmatter", () => {
  it("reads key: value lines, keeping the colons of a value", () => {
    const { data, body } = parseFrontmatter("---\na: 1\nb: x: y\n---\nrest");
    expect(data).toEqual({ a: "1", b: "x: y" });
    expect(body).toBe("rest");
  });

  it("accepts Windows line endings and returns the text when there is none", () => {
    expect(parseFrontmatter("---\r\na: 1\r\n---\r\nhi").data).toEqual({
      a: "1",
    });
    expect(parseFrontmatter("no front matter").data).toEqual({});
  });

  it("refuses a line that is not key: value", () => {
    expect(() => parseFrontmatter("---\noops\n---\n")).toThrow(
      CourseSourceError,
    );
  });
});

describe("parseCourseMeta", () => {
  it("reads the metadata", () => {
    expect(parseCourseMeta(META)).toEqual({
      title: "Introduction : les bases",
      slug: "intro-bases",
      summary: "Un cours, sur les bases : variables et boucles.",
      level: "Débutant",
      icon: "binary",
      tags: ["JavaScript", "Python", "Bases"],
    });
  });

  it("requires a title, a slug and a summary", () => {
    expect(() => parseCourseMeta("---\ntitle: T\nslug: s\n---\n")).toThrow(
      /summary/,
    );
    expect(() => parseCourseMeta("---\nslug: s\nsummary: x\n---\n")).toThrow(
      /title/,
    );
  });

  it("checks the slug, the level and the icon", () => {
    const base = "title: T\nsummary: S\n";
    expect(() => parseCourseMeta(`---\n${base}slug: Bad Slug\n---\n`)).toThrow(
      /slug/,
    );
    expect(() =>
      parseCourseMeta(`---\n${base}slug: ok\nlevel: Expert\n---\n`),
    ).toThrow(/level/);
    expect(() =>
      parseCourseMeta(`---\n${base}slug: ok\nicon: nope\n---\n`),
    ).toThrow(/icon/);
  });

  it("defaults the optional fields", () => {
    expect(
      parseCourseMeta("---\ntitle: T\nslug: t\nsummary: S\n---\n"),
    ).toEqual({
      title: "T",
      slug: "t",
      summary: "S",
      level: undefined,
      icon: undefined,
      tags: [],
    });
  });
});

describe("chapterFileNames", () => {
  it("keeps the numbered chapter files, in numeric order", () => {
    expect(
      chapterFileNames([
        "10-b.md",
        "course.md",
        "02-a.md",
        "notes.txt",
        "1-first.md",
      ]),
    ).toEqual(["1-first.md", "02-a.md", "10-b.md"]);
  });
});

describe("shiftHeadings", () => {
  it("lowers every heading one level, up to the fourth", () => {
    expect(shiftHeadings("## A\n### B\n#### C\n##### D")).toBe(
      "### A\n#### B\n#### C\n#### D",
    );
  });

  it("leaves the lines of code samples alone", () => {
    const md =
      "## Title\n```python\n# a comment\n## not a heading\n```\n## After";
    expect(shiftHeadings(md)).toBe(
      "### Title\n```python\n# a comment\n## not a heading\n```\n### After",
    );
  });
});

describe("parseChapter", () => {
  it("takes the title from the first line and shifts the headings", () => {
    expect(parseChapter("# Variables\n\n## Idea\n\nText.\n", "02.md")).toEqual({
      title: "Variables",
      markdown: "### Idea\n\nText.",
    });
  });

  it("refuses a file with no title or no content", () => {
    expect(() => parseChapter("No title\n", "x.md")).toThrow(/x\.md/);
    expect(() => parseChapter("# Only a title\n", "y.md")).toThrow(
      /no content/,
    );
  });
});
