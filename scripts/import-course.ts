import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import config from "@payload-config";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import { getPayload } from "payload";

import {
  chapterFileNames,
  CourseSourceError,
  parseChapter,
  parseCourseMeta,
} from "../src/lib/course-import";
import { editor } from "../src/lib/editor";

// Loads a course written as Markdown into the CMS.
//
//   npm run content:import -- content/courses/introduction-a-la-programmation [--publish] [--dry-run]
//
// - The course is created, or updated when a course with the same slug exists: the Markdown is the source of
//   truth, the chapters are replaced.
// - It is saved as a draft for review unless --publish is given.
// - --dry-run reads and converts everything but does not touch the database.
// It acts as the operator (whoever can run it has access to the database), so it is not stopped by the
// editorial permissions; it never touches anything but the course.

async function main() {
  const args = process.argv.slice(2);
  const folder = args.find((arg) => !arg.startsWith("--"));
  const publish = args.includes("--publish");
  const dryRun = args.includes("--dry-run");

  if (!folder) {
    console.error(
      "Usage: npm run content:import -- <course folder> [--publish] [--dry-run]",
    );
    process.exit(1);
  }

  const root = path.resolve(folder);
  const meta = parseCourseMeta(
    await readFile(path.join(root, "course.md"), "utf8"),
  );
  const files = chapterFileNames(await readdir(root));
  if (files.length === 0) {
    throw new CourseSourceError(
      `${folder}: no chapter file (01-something.md).`,
    );
  }

  const sanitized = await config;
  const editorConfig = await editorConfigFactory.fromEditor({
    config: sanitized,
    editor,
  });

  const chapters = [];
  for (const file of files) {
    const { title, markdown } = parseChapter(
      await readFile(path.join(root, file), "utf8"),
      file,
    );
    const body = convertMarkdownToLexical({ editorConfig, markdown });
    const blocks = body.root.children.filter(
      (node) => (node as { type: string }).type === "block",
    ).length;
    console.log(
      `  ${file}: "${title}" (${markdown.split(/\s+/).length} words, ${blocks} code samples)`,
    );
    chapters.push({
      title,
      content: [{ blockType: "richText" as const, body }],
    });
  }

  console.log(
    `${meta.title} [${meta.slug}]: ${chapters.length} chapters, ${publish ? "to publish" : "as a draft"}`,
  );
  if (dryRun) {
    console.log("Dry run: nothing was written.");
    return;
  }

  const payload = await getPayload({ config });
  const data = {
    title: meta.title,
    slug: meta.slug,
    summary: meta.summary,
    level: meta.level,
    icon: meta.icon,
    tags: meta.tags,
    chapters,
    _status: publish ? ("published" as const) : ("draft" as const),
  };
  // `context.trustedImport` tells the editorial hooks that this is a server-side tool, not a client request.
  const context = { trustedImport: true };

  const { docs } = await payload.find({
    collection: "courses",
    where: { slug: { equals: meta.slug } },
    draft: true,
    limit: 1,
    depth: 0,
    context,
  });

  if (docs[0]) {
    await payload.update({
      collection: "courses",
      id: docs[0].id,
      data,
      draft: !publish,
      context,
    });
    console.log(`Updated course ${docs[0].id}.`);
  } else {
    const created = await payload.create({
      collection: "courses",
      data,
      draft: !publish,
      context,
    });
    console.log(`Created course ${created.id}.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof CourseSourceError ? error.message : error);
    process.exit(1);
  });
