import { describe, expect, it } from "vitest";

import { courseChapters, courseToCatalogItem } from "@/lib/course-cms";
import type { Course, Protocol } from "@/payload-types";

const body = { root: { type: "root", children: [], version: 1 } } as never;

function protocol(overrides: Partial<Protocol> = {}): Protocol {
  return {
    id: 7,
    title: "HTTP",
    slug: "http",
    summary: "Une requête.",
    _status: "published",
    machineA: { label: "A" },
    machineB: { label: "B" },
    steps: [{ id: "s", from: "a", to: "b", label: "GET", note: "Il demande." }],
    updatedAt: "",
    createdAt: "",
    ...overrides,
  } as Protocol;
}

function course(content: unknown[]): Course {
  return {
    id: 1,
    title: "Web",
    slug: "web",
    chapters: [{ id: "c1", title: "Un", content }],
    updatedAt: "",
    createdAt: "",
  } as Course;
}

describe("courseChapters", () => {
  it("numbers the chapters and keeps their text blocks", () => {
    const [chapter] = courseChapters(
      course([{ id: "b1", blockType: "richText", body }]),
    );
    expect(chapter).toMatchObject({ number: 1, title: "Un" });
    expect(chapter.blocks).toEqual([{ kind: "text", id: "b1", body }]);
  });

  it("turns a published diagram into a scenario", () => {
    const [chapter] = courseChapters(
      course([{ id: "b2", blockType: "protocolDiagram", diagram: protocol() }]),
    );
    expect(chapter.blocks).toHaveLength(1);
    expect(chapter.blocks[0]).toMatchObject({ kind: "diagram", slug: "http" });
  });

  it("leaves out a diagram that is not published, unless drafts are allowed", () => {
    const draft = protocol({ _status: "draft" });
    const blocks = [{ id: "b", blockType: "protocolDiagram", diagram: draft }];
    expect(courseChapters(course(blocks))[0].blocks).toEqual([]);
    expect(
      courseChapters(course(blocks), { allowDraftDiagrams: true })[0].blocks,
    ).toHaveLength(1);
  });

  it("leaves out a diagram that could not be loaded or has no usable message", () => {
    const blocks = [
      { id: "a", blockType: "protocolDiagram", diagram: 7 },
      { id: "b", blockType: "protocolDiagram", diagram: null },
      {
        id: "c",
        blockType: "protocolDiagram",
        diagram: protocol({ steps: [] }),
      },
      { id: "d", blockType: "richText", body: null },
    ];
    expect(courseChapters(course(blocks))[0].blocks).toEqual([]);
  });
});

describe("courseToCatalogItem", () => {
  it("builds a linked card with sensible defaults", () => {
    expect(
      courseToCatalogItem({
        id: 1,
        title: "Web",
        slug: "web",
        updatedAt: "",
        createdAt: "",
      } as Course),
    ).toMatchObject({
      id: "web",
      title: "Web",
      description: "",
      tags: [],
      icon: "binary",
      href: "/paths/web",
    });
  });

  it("keeps the level, the tags and the icon", () => {
    expect(
      courseToCatalogItem({
        id: 1,
        title: "Web",
        slug: "web",
        summary: "S",
        level: "Avancé",
        tags: ["Web"],
        icon: "python",
        updatedAt: "",
        createdAt: "",
      } as Course),
    ).toMatchObject({
      description: "S",
      level: "Avancé",
      tags: ["Web"],
      icon: "python",
    });
  });
});
