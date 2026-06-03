const path = require("node:path");
const { execSync } = require("node:child_process");

function getRepoRoot() {
  return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
}
const repoRoot = getRepoRoot();

function parseArgs(argv) {
  const [cmd, ...rest] = argv;

  const args = {
    cmd,
    root: ".",
    glob: "**/*.spec.js",
    project: "PRPI",
    report: path.resolve(repoRoot, "xray-report.json"),
    dryRun: false,
    files: [],
  };

  const isFlag = (s) => typeof s === "string" && s.startsWith("--");

  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];

    if (a === "--") continue;

    if (a === "--root") {
      args.root = rest[++i];
      continue;
    }

    if (a === "--report") {
      args.report = path.resolve(repoRoot, rest[++i]);
      continue;
    }

    if (a === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (a === "--files") {
      while (i + 1 < rest.length && rest[i + 1] !== "--" && !isFlag(rest[i + 1])) {
        args.files.push(rest[++i]);
      }
      continue;
    }

    if (!isFlag(a)) {
      args.files.push(a);
      continue;
    }

    throw new Error(`Unknown arg: ${a}`);
  }

  return args;
}

module.exports = { parseArgs, repoRoot, getRepoRoot };
