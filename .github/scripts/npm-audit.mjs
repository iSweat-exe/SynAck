// Fails when `npm audit` finds a high or critical advisory in production dependencies,
// except for advisories explicitly accepted in .github/audit-allowlist.json (each with a reason and an
// expiry date, so an accepted risk is re-examined instead of being forgotten).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const allowlist = JSON.parse(
  readFileSync(new URL("../audit-allowlist.json", import.meta.url), "utf8"),
);
const today = new Date().toISOString().slice(0, 10);
const blocking = new Set(["high", "critical"]);

let raw;
try {
  raw = execFileSync("npm", ["audit", "--omit=dev", "--json"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
} catch (error) {
  // npm audit exits non-zero when it finds vulnerabilities; the JSON report is still on stdout.
  raw = error.stdout;
}

const report = JSON.parse(raw);
if (report.error) {
  console.error("npm audit failed:", report.error.summary ?? report.error);
  process.exit(1);
}

const findings = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === "object" && blocking.has(via.severity)) {
      findings.set(via.url.split("/").pop(), via);
    }
  }
}

const accepted = new Map(
  allowlist.filter((entry) => entry.expires >= today).map((e) => [e.ghsa, e]),
);

let failed = false;
for (const [ghsa, via] of findings) {
  const entry = accepted.get(ghsa);
  if (entry) {
    console.log(
      `accepted until ${entry.expires}: ${ghsa} (${via.name}) - ${entry.reason}`,
    );
  } else {
    failed = true;
    console.error(`::error::${ghsa} (${via.name}, ${via.severity}): ${via.title}`);
  }
}

for (const entry of allowlist) {
  if (entry.expires < today) {
    console.warn(
      `::warning::Allowlist entry ${entry.ghsa} expired on ${entry.expires}: re-evaluate it or remove it.`,
    );
  } else if (!findings.has(entry.ghsa)) {
    console.warn(
      `::warning::Allowlist entry ${entry.ghsa} no longer matches any finding: remove it.`,
    );
  }
}

if (failed) process.exit(1);
console.log(
  `npm audit: no unaccepted high/critical advisory in production dependencies (${findings.size} accepted).`,
);
