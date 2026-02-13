import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const packageJsonPath = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const packageName = String(packageJson.name);
const baseVersionMatch = String(packageJson.version).match(
  /^(\d+\.\d+\.\d+)(?:-.+)?$/,
);

if (!baseVersionMatch) {
  throw new Error(
    `Unsupported package.json version format: ${packageJson.version}`,
  );
}

const baseVersion = baseVersionMatch[1];

let publishedVersions = [];
try {
  const stdout = execFileSync(
    "npm",
    ["view", packageName, "versions", "--json"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  ).trim();

  if (stdout) {
    const parsed = JSON.parse(stdout);
    publishedVersions = Array.isArray(parsed) ? parsed : [parsed];
  }
} catch {
  // Package may not exist yet on npm; start prerelease numbering at .0
  publishedVersions = [];
}

const escapedBaseVersion = baseVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const jbPattern = new RegExp(`^${escapedBaseVersion}-jb\\.(\\d+)$`);

let maxJbPatch = -1;
for (const version of publishedVersions) {
  if (typeof version !== "string") {
    continue;
  }
  const match = version.match(jbPattern);
  if (!match) {
    continue;
  }
  const patch = Number.parseInt(match[1], 10);
  if (!Number.isNaN(patch) && patch > maxJbPatch) {
    maxJbPatch = patch;
  }
}

const nextVersion = `${baseVersion}-jb.${maxJbPatch + 1}`;
process.stdout.write(nextVersion);
