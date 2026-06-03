#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");

const { parseArgs } = require("./src/helpers/settings");
const { checkMissingTestKey, mapKeys, reportLabels } = require("./src/scan-testkeys");
const { createJiraIssues } = require("./src/create-jira-issues");
const { patchTestKeysIntoCode } = require("./src/patch-testkeys");

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function uniq(arr) {
  return [...new Set(arr)];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.cmd !== "lint" && args.cmd !== "sync") {
    throw new Error("Command must be 'lint' or 'sync'");
  }

  //
  // STEP 1 — Scan tests
  //
  const { report, friendlyReport } = await checkMissingTestKey(args);

  ensureDirForFile(args.report);
  fs.writeFileSync(args.report, JSON.stringify(friendlyReport, null, 2), "utf8");

  //
  // =====================
  // LINT MODE
  // =====================
  //
  if (args.cmd === "lint") {
    if (report.missingTestKey.length > 0 || report.invalidKey.length > 0) {
      console.error(
        `❌ XRAY LINT FAILED\n` +
          `📊 Report: ${args.report}\n\n` +
          `⚠️ Missing test keys: ${report.missingTestKey.length}\n` +
          `⚠️ Invalid test keys: ${report.invalidKey.length}\n` +
          `⚠️ To be fixed manually: ${report.skippedDynamic.length}\n`,
      );
      process.exit(2);
    }

    console.log(`✅ XRAY LINT OK`);
    console.log(`📊 Report: ${args.report}`);
    console.log(`🛠 Skipped: ${report.skippedDynamic.length}`);

    return;
  }

  //
  // =====================
  // SYNC MODE
  // =====================
  //

  // missing + invalid keys
  const candidates = [...report.missingTestKey, ...report.invalidKey];
  const touchedRepoFiles = uniq(candidates.map((x) => x.repoFile || x.file));

  //
  // STEP 2 — Create / Reuse Jira issues
  //
  const step2 = await createJiraIssues({
    missingStatic: candidates,
    project: args.project,
    dryRun: args.dryRun,
  });

  //
  // STEP 3 — Patch test keys into code
  //
  let step3 = null;

  if (!args.dryRun) {
    step3 = await patchTestKeysIntoCode({
      root: args.root,
      glob: args.glob,
      patches: step2.patches,
      touchedRepoFiles,
    });
  }

  //
  // FINAL REPORT
  //
  const finalReport = {
    ...report,
    mode: "sync" + (args.dryRun ? "-dry" : ""),
    created: step2.created,
    reused: step2.reused,
    patched: step3?.patched ?? [],
    skippedPatchFiles: step3?.skipped ?? [],
  };

  const finalFriendlyReport = {
    ...mapKeys(finalReport, {
      ...reportLabels,
      created: "Created",
      reused: "Reused",
      patched: "Patched",
      skippedPatchFiles: "Skipped",
    }),
  };

  fs.writeFileSync(args.report, JSON.stringify(finalFriendlyReport, null, 2), "utf8");

  console.log(
    `🚀 XRAY SYNC DONE\n` +
      `📊 Report: ${args.report}\n\n` +
      `✅ Created: ${step2.created.length}\n` +
      `✅ Reused: ${step2.reused.length}\n` +
      `✅ Patched: ${finalReport.patched.length}\n` +
      `🛠 Skipped: ${finalReport.skippedPatchFiles.length}`,
  );
}

main().catch((err) => {
  console.error(err?.stack || err);
  process.exit(99);
});
