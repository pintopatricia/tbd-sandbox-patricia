#!/usr/bin/env node
/**
 * Updates the http-webserver build number in all .spec files that declare the webserver requirement.
 * Discovers files dynamically under apps/* so new brands are included automatically.
 * Usage:
 *   WEBSERVER_BUILD_NUMBER=<n> node tools/update-webserver-build.js
 * Exit: 0 = updated, 2 = no change (build already at requested number), 1 = error. Does not commit.
 */

const fs = require("fs");
const path = require("path");

const WEBSERVER_REQUIRE_REGEX = /^(Requires: bf-tbd-http-webserver-\S+ = \S+-)(\d+)(\s*)$/m;

function getRepoRoot() {
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "package.json")) && fs.existsSync(path.join(dir, "apps"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function discoverSpecFiles(root) {
  const appsDir = path.join(root, "apps");
  if (!fs.existsSync(appsDir)) return [];
  const specFiles = [];
  for (const brand of fs.readdirSync(appsDir)) {
    const brandPath = path.join(appsDir, brand);
    if (!fs.statSync(brandPath).isDirectory()) continue;
    for (const file of fs.readdirSync(brandPath)) {
      if (!file.endsWith(".spec")) continue;
      const specPath = path.join(brandPath, file);
      const content = fs.readFileSync(specPath, "utf8");
      if (WEBSERVER_REQUIRE_REGEX.test(content)) {
        specFiles.push(path.relative(root, specPath));
      }
    }
  }
  return specFiles.sort();
}

function readCurrentBuild(root, specFiles) {
  if (specFiles.length === 0) throw new Error("No .spec files found with bf-tbd-http-webserver-v1.");
  const content = fs.readFileSync(path.join(root, specFiles[0]), "utf8");
  const m = content.match(WEBSERVER_REQUIRE_REGEX);
  if (!m) throw new Error(`No webserver Requires line in ${specFiles[0]}`);
  return m[2];
}

function updateSpecFile(root, specPath, newBuild) {
  const fullPath = path.join(root, specPath);
  const content = fs.readFileSync(fullPath, "utf8");
  const newContent = content.replace(
    WEBSERVER_REQUIRE_REGEX,
    (_, prefix, _old, suffix) => `${prefix}${newBuild}${suffix}`,
  );
  if (newContent === content) return false;
  fs.writeFileSync(fullPath, newContent, "utf8");
  return true;
}

async function main() {
  const buildNum = (process.env.WEBSERVER_BUILD_NUMBER || "").trim();

  if (!buildNum || !/^\d+$/.test(buildNum)) {
    console.error("WEBSERVER_BUILD_NUMBER is not set or is not a valid integer.");
    process.exit(1);
  }

  const root = getRepoRoot();
  const specFiles = discoverSpecFiles(root);

  if (specFiles.length === 0) {
    console.error("No .spec files under apps/ contain the webserver Requires line.");
    process.exit(1);
  }

  let currentBuild;
  try {
    currentBuild = readCurrentBuild(root, specFiles);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  if (currentBuild === buildNum) {
    console.log(`Current: ${currentBuild}, requested: ${buildNum}. No change needed.`);
    process.exit(2);
  }

  const isDowngrade = parseInt(buildNum, 10) < parseInt(currentBuild, 10);
  const force = (process.env.FORCE_BUILD_NUMBER || "").toLowerCase() === "true";

  if (isDowngrade && !force) {
    console.error(
      `[ALERT] Incoming build ${buildNum} is lower than current ${currentBuild}. Skipping to avoid downgrade. To force it, use "Build with Parameters" and set FORCE_BUILD_NUMBER=true.`,
    );
    process.exit(1);
  }

  if (isDowngrade && force) {
    console.warn(
      `[WARNING] Forcing downgrade from build ${currentBuild} to ${buildNum} via FORCE_BUILD_NUMBER override.`,
    );
  }

  const changed = [];
  for (const specPath of specFiles) {
    if (updateSpecFile(root, specPath, buildNum)) changed.push(specPath);
  }
  if (changed.length === 0) {
    console.error("Internal error: no files updated.");
    process.exit(1);
  }

  console.log(`Current: ${currentBuild}, new: ${buildNum}. Updated: ${changed.join(", ")}`);
  console.log(`build_number=${buildNum}`);
}

main();
