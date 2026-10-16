import { ICON_NAMES, type IconName } from "@/lib/icon-names";
import { LEVELS, type Level } from "@/lib/levels";

// Courses can be written as Markdown files and loaded into the CMS with `npm run content:import`, which is
// far more pleasant than typing a whole course into the editor. A course is a folder:
//
//   content/courses/<name>/course.md        front matter only: title, slug, summary, level, icon, tags
//   content/courses/<name>/01-<topic>.md    one file per chapter: a `# Title` line, then the lesson
//
// This module is the pure part (no file, no database): it reads that format.

export type CourseMeta = {
  title: string;
  slug: string;
  summary: string;
  level?: Level;
  icon?: IconName;
  tags: string[];
};

export type ChapterSource = { title: string; markdown: string };

export class CourseSourceError extends Error {}

function unquote(value: string) {
  const text = value.trim();
  const quoted =
    text.length >= 2 &&
    ((text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'")));
  return quoted ? text.slice(1, -1) : text;
}

// `---` front matter made of `key: value` lines (a value may contain colons); the rest is the body.
export function parseFrontmatter(source: string): {
  data: Record<string, string>;
  body: string;
} {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index === -1) {
      throw new CourseSourceError(
        `Front matter: "${line}" is not "key: value".`,
      );
    }
    data[line.slice(0, index).trim()] = unquote(line.slice(index + 1));
  }
  return { data, body: match[2] };
}

export function parseCourseMeta(source: string): CourseMeta {
  const { data } = parseFrontmatter(source);

  for (const key of ["title", "slug", "summary"]) {
    if (!data[key]) {
      throw new CourseSourceError(
        `course.md: "${key}" is missing in the front matter.`,
      );
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new CourseSourceError(
      `course.md: slug "${data.slug}" must be lowercase letters, digits and dashes.`,
    );
  }
  if (data.level && !(LEVELS as readonly string[]).includes(data.level)) {
    throw new CourseSourceError(
      `course.md: level "${data.level}" must be one of ${LEVELS.join(", ")}.`,
    );
  }
  if (data.icon && !(ICON_NAMES as readonly string[]).includes(data.icon)) {
    throw new CourseSourceError(
      `course.md: icon "${data.icon}" must be one of ${ICON_NAMES.join(", ")}.`,
    );
  }

  const tags = (data.tags ?? "")
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => unquote(tag))
    .filter(Boolean);

  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    level: (data.level as Level | undefined) || undefined,
    icon: (data.icon as IconName | undefined) || undefined,
    tags,
  };
}

// The chapter files of a folder, in order: `01-something.md`, `02-other.md`...
export function chapterFileNames(names: string[]) {
  return names
    .filter((name) => /^\d+-.+\.md$/.test(name))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b));
}

// The headings of a lesson are written one level higher than they appear (`##` becomes a third-level heading,
// as the chapter title itself is the second level of the page). Headings inside code samples are left alone,
// and the deepest level the editor offers is the fourth.
export function shiftHeadings(markdown: string, by = 1) {
  let inCode = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inCode = !inCode;
      if (inCode) return line;
      const match = line.match(/^(#{1,6})(\s+.*)$/);
      if (!match) return line;
      return `${"#".repeat(Math.min(match[1].length + by, 4))}${match[2]}`;
    })
    .join("\n");
}

export function parseChapter(source: string, fileName: string): ChapterSource {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n").trim();
  const match = text.match(/^#\s+(.+?)(?:\n([\s\S]*))?$/);
  if (!match) {
    throw new CourseSourceError(
      `${fileName}: the file must start with a "# Chapter title" line.`,
    );
  }
  const markdown = shiftHeadings((match[2] ?? "").trim());
  if (markdown === "") {
    throw new CourseSourceError(`${fileName}: the chapter has no content.`);
  }
  return { title: match[1].trim(), markdown };
}
