const path = require("node:path");
const fs = require("node:fs");
const fg = require("fast-glob");
const traverse = require("@babel/traverse").default;

const { normalizeTitle } = require("./helpers/jira-fields.js");
const { parseJs, getStaticTitle } = require("./helpers/parser");
const { repoRoot } = require("./helpers/settings");

const ANY_KEY_RE = /^\[([^\]]+)\]/;

/**
 * Step 1: Scan test files and find missing TestKey,
 * and also report invalid keys (with wrong project or format).
 */

function makeProjectKeyRegex(projectKey) {
  const escaped = String(projectKey).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\[(${escaped}-\\d+)\\]`);
}

function stripAnyKeyPrefix(title) {
  return String(title).replace(ANY_KEY_RE, "").trim();
}

const reportLabels = {
  mode: "Mode",
  projectKey: "Project Key",
  root: "Path",
  glob: "Glob",
  scannedFiles: "Scanned Files",
  missingTestKey: "Missing Test Key",
  invalidKey: "Invalid Key",
  skippedDynamic: "Fix manually",
  hasKey: "Lint OK",
};

const summaryLabels = {
  mode: "Mode",
  projectKey: "Project Key",
  scannedFiles: "Scanned Files",
  missingTestKeyCount: "Missing Test Key",
  invalidKeyCount: "Invalid Key",
  skippedDynamicCount: "Skipped",
  hasKeyCount: "Valid Test Keys",
};

function mapKeys(obj, labels) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [labels[key] || key, value]));
}

async function checkMissingTestKey({ root = ".", glob = "**/*.spec.js", project = "PRPI", files = [] }) {
  const absRoot = path.resolve(repoRoot, root);

  let absFiles = [];
  if (Array.isArray(files) && files.length > 0) {
    absFiles = files.filter((f) => String(f).endsWith(".spec.js")).map((f) => path.resolve(repoRoot, f));
  } else {
    absFiles = await fg([glob], {
      cwd: absRoot,
      absolute: true,
      onlyFiles: true,
      dot: false,
    });
  }

  const projectKeyRe = makeProjectKeyRegex(project);

  const report = {
    mode: "lint",
    projectKey: project,
    root: absRoot,
    glob,
    scannedFiles: absFiles.length,
    missingTestKey: [],
    invalidKey: [],
    skippedDynamic: [],
    hasKey: [],
  };

  for (const absFile of absFiles) {
    if (!fs.existsSync(absFile)) {
      console.warn(`Skipping missing file: ${absFile}`);
      continue;
    }

    const relFromRoot = path.relative(absRoot, absFile).replaceAll("\\", "/");
    const relFromRepo = path.relative(repoRoot, absFile).replaceAll("\\", "/");

    const code = fs.readFileSync(absFile, "utf8");
    const parse = parseJs(code);

    const describeStack = [];

    traverse(parse, {
      CallExpression: {
        enter(p) {
          const callee = p.node.callee;
          if (!callee || callee.type !== "Identifier") return;

          if (callee.name === "describe") {
            const title = getStaticTitle(p.node.arguments?.[0]);
            describeStack.push(title ? normalizeTitle(title) : "<dynamic-describe>");
            return;
          }

          if (callee.name === "it") {
            const rawTitle = getStaticTitle(p.node.arguments?.[0]);

            if (!rawTitle) {
              report.skippedDynamic.push({
                file: relFromRepo,
                relFromRoot,
                describeChain: [...describeStack],
                reason: "it() title is dynamic",
              });
              return;
            }

            const title = normalizeTitle(rawTitle);
            const any = title.match(ANY_KEY_RE);

            if (any && !projectKeyRe.test(title)) {
              report.invalidKey.push({
                file: relFromRepo,
                relFromRoot,
                describeChain: [...describeStack],
                title,
                cleanTitle: stripAnyKeyPrefix(title),
                foundKey: any[1],
                expectedProject: project,
              });
              return;
            }

            if (projectKeyRe.test(title)) {
              report.hasKey.push({
                file: relFromRepo,
                relFromRoot,
                describeChain: [...describeStack],
                title,
              });
              return;
            }

            report.missingTestKey.push({
              file: relFromRepo,
              relFromRoot,
              describeChain: [...describeStack],
              title,
              cleanTitle: stripAnyKeyPrefix(title),
            });
          }
        },

        exit(p) {
          const callee = p.node.callee;
          if (callee?.type === "Identifier" && callee.name === "describe") {
            describeStack.pop();
          }
        },
      },
    });
  }

  const summary = {
    mode: report.mode,
    projectKey: report.projectKey,
    scannedFiles: report.scannedFiles,
    missingTestKeyCount: report.missingTestKey.length,
    invalidKeyCount: report.invalidKey.length,
    skippedDynamicCount: report.skippedDynamic.length,
    hasKeyCount: report.hasKey.length,
  };

  const friendlyReport = mapKeys(report, reportLabels);
  const friendlySummary = mapKeys(summary, summaryLabels);

  return {
    report,
    summary,
    friendlyReport,
    friendlySummary,
  };
}

module.exports = { checkMissingTestKey, mapKeys, reportLabels };
