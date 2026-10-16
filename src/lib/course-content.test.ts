import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  chapterFileNames,
  parseChapter,
  parseCourseMeta,
} from "@/lib/course-import";

// Checks the courses written as Markdown in content/courses: that they can be imported, and that every
// chapter follows the structure the course is designed around (an objective, then retrieval practice and
// feedback). It also guards against Markdown the editor cannot represent.
const COURSES_DIR = path.resolve(__dirname, "../../content/courses");

const courses = readdirSync(COURSES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// The welcome chapter and the final project have their own shape: they still need an objective.
const SPECIAL_CHAPTER = /bienvenue|projet/;

describe.each(courses)("course %s", (name) => {
  const folder = path.join(COURSES_DIR, name);
  const meta = parseCourseMeta(
    readFileSync(path.join(folder, "course.md"), "utf8"),
  );
  const files = chapterFileNames(readdirSync(folder));

  it("has valid metadata and at least one chapter", () => {
    expect(meta.slug).toBe(name);
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("chapter %s is well formed", (file) => {
    const source = readFileSync(path.join(folder, file), "utf8").replace(
      /\r\n/g,
      "\n",
    );
    const { title, markdown } = parseChapter(source, file);
    expect(title.length).toBeGreaterThan(0);

    // An objective, stated as what the learner will be able to do.
    expect(source).toMatch(/^> \*\*Objectif/m);

    // Answers with their explanation.
    expect(source).toMatch(/^## Corrigés?$/m);

    if (!SPECIAL_CHAPTER.test(file)) {
      for (const heading of ["Quiz", "Code à corriger", "Exercice"]) {
        expect(source, `${file} needs a "## ${heading}" section`).toMatch(
          new RegExp(`^## ${heading}$`, "m"),
        );
      }
    }

    // Code fences are balanced and every one names a language.
    const fences = source.split("\n").filter((line) => /^```/.test(line));
    expect(fences.length % 2, `${file}: unbalanced code fences`).toBe(0);
    fences.forEach((fence, index) => {
      if (index % 2 === 0)
        expect(fence, `${file}: a code fence has no language`).toMatch(
          /^```\w+$/,
        );
    });

    // The editor has no tables and no raw HTML: they would come out as plain text.
    const outsideCode = markdown.replace(/```[\s\S]*?```/g, "");
    expect(outsideCode, `${file}: tables are not supported`).not.toMatch(
      /^\|/m,
    );
    expect(outsideCode, `${file}: raw HTML is not supported`).not.toMatch(
      /<\/?[a-z][^>]*>/i,
    );
  });

  it("numbers its chapters without gaps", () => {
    files.forEach((file, index) => {
      expect(parseInt(file, 10)).toBe(index + 1);
    });
  });
});
