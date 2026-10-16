// Runs the code samples of a Markdown course (the ```javascript and ```python blocks) and reports what each
// one prints or which error it raises, so an author can check that the examples do what the text says.
//
//   node scripts/check-course-code.mjs content/courses/introduction-a-la-programmation
//
// Fragments that cannot run on their own (they use a variable defined elsewhere) and exercises that contain
// a bug on purpose will show an error or a timeout: read the report, it is not a pass/fail test.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const folder = process.argv[2];
if (!folder) {
  console.error("Usage: node scripts/check-course-code.mjs <course folder>");
  process.exit(1);
}

const RUNNERS = {
  javascript: { command: "node", extension: "js" },
  python: {
    command: process.platform === "win32" ? "python" : "python3",
    extension: "py",
  },
};

const work = mkdtempSync(path.join(tmpdir(), "course-check-"));
let blocks = 0;
let failures = 0;

for (const file of readdirSync(folder)
  .filter((name) => /^\d+-.+\.md$/.test(name))
  .sort()) {
  const lines = readFileSync(path.join(folder, file), "utf8")
    .replace(/\r\n/g, "\n")
    .split("\n");
  let section = "";
  let current = null;

  lines.forEach((line, index) => {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading && !current) section = heading[1];

    const fence = line.match(/^```(\w+)?\s*$/);
    if (!fence) {
      if (current) current.code.push(line);
      return;
    }
    if (!current) {
      current = {
        language: fence[1] ?? "",
        code: [],
        line: index + 1,
        section,
      };
      return;
    }

    const { language, code, line: startLine, section: where } = current;
    current = null;
    const runner = RUNNERS[language];
    if (!runner) return;

    blocks += 1;
    const target = path.join(work, `block.${runner.extension}`);
    writeFileSync(target, code.join("\n"));
    const result = spawnSync(runner.command, [target], {
      encoding: "utf8",
      timeout: 3000,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    const timedOut = result.error?.code === "ETIMEDOUT";
    const failed = timedOut || result.status !== 0;
    if (failed) failures += 1;
    const detail = timedOut
      ? "TIMEOUT (infinite loop?)"
      : failed
        ? (result.stderr.trim().split("\n").at(-1) ?? "error")
        : result.stdout.trim().split("\n").join(" | ").slice(0, 110);
    console.log(
      `${failed ? "!!" : "ok"} ${file}:${startLine} [${language}] (${where}) ${detail}`,
    );
  });
}

console.log(
  `\n${blocks} code samples run, ${failures} raised an error or timed out.`,
);
