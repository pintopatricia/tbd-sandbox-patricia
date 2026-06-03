const { execSync } = require("child_process");
const fs = require("fs");

const patterns = process.argv.slice(2);
const brands = ["bf", "sbg", "ps", "pp"];

const paths = [
  ...brands.flatMap((brand) => [
    `apps/${brand}/native/android/app/src/main/res/`,
    `apps/${brand}/native/ios/Settings/Settings.bundle/`,
    `apps/${brand}/native/generated/translations/`,
    `apps/${brand}/web/generated/translations/`,
  ]),
  "packages/tbd-shared/translations/keys.ts",
  "apps/bf/web/config/bf/translations/generated/",
];

/**
 * Convert glob pattern to regex: escape special chars, replace * with .*
 */
const basicGlobToRegex = (pattern) => {
  const escaped = pattern.replace(/[.+^${}()|[\\\]\\]/g, "\\$&");

  return new RegExp(escaped.replace(/\*/g, ".*"), "i");
};

const lineMatchesPattern = (line, patterns) => patterns.some((p) => basicGlobToRegex(p).test(line));

const isAddedLine = (line) => line.startsWith("+");
const isRemovedLine = (line) => line.startsWith("-");
const isChangedLine = (line) => isAddedLine(line) || isRemovedLine(line);
const isContextLine = (line) => line.startsWith(" ");

/**
 * Parse a hunk header to extract line numbers
 * Format: @@ -oldStart,oldCount +newStart,newCount @@
 */
const parseHunkHeader = (header) => {
  const match = header.match(
    /^@@\s+-(?<oldStart>\d+),?(?<oldCount>\d*)\s+\+(?<newStart>\d+),?(?<newCount>\d*)\s+@@(?<suffix>.*)/,
  );

  return {
    oldStart: parseInt(match.groups.oldStart, 10),
    newStart: parseInt(match.groups.newStart, 10),
    suffix: match.groups.suffix || "",
  };
};

/**
 * Filter a single hunk to keep only lines matching the patterns.
 * Non-matching additions are dropped; non-matching removals are turned into context.
 * Recalculates the hunk header line counts.
 */
const filterHunkLines = (hunkText, patterns) => {
  const [headerLine, ...bodyLines] = hunkText.split("\n");
  const { oldStart, newStart, suffix } = parseHunkHeader(headerLine);

  const filteredBody = bodyLines.reduce((acc, line) => {
    if (isChangedLine(line) && !lineMatchesPattern(line, patterns)) {
      // Non-matching addition: drop entirely
      if (isAddedLine(line)) {
        return acc;
      }

      // Non-matching removal: convert back to context (keep the line as-is in the file)
      return [...acc, ` ${line.slice(1)}`];
    }

    return [...acc, line];
  }, []);

  // Recalculate counts
  const oldCount = filteredBody.filter((l) => isRemovedLine(l) || isContextLine(l)).length;
  const newCount = filteredBody.filter((l) => isAddedLine(l) || isContextLine(l)).length;
  const hasChanges = filteredBody.some(isChangedLine);

  if (!hasChanges) {
    return null;
  }

  const newHeader = `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@${suffix}`;

  return [newHeader, ...filteredBody].join("\n");
};

/**
 * Parse a (possibly multi-file) diff into per-file structures,
 * each with a header block and an array of hunk text sections.
 * Uses string splitting — no mutable state needed.
 */
const parseDiff = (diffText) =>
  diffText
    .split(/(?=^diff --git )/m)
    .filter(Boolean)
    .map((fileSection) => {
      const [header, ...hunkSections] = fileSection.split(/(?=^@@)/m);
      return { header, hunkSections };
    });

/**
 * Filter each hunk line-by-line, keeping only matching changes
 */
const filterMatchingFiles = (files, patterns) =>
  files
    .map((file) => ({
      header: file.header,
      hunkSections: file.hunkSections.map((hunk) => filterHunkLines(hunk, patterns)).filter(Boolean),
    }))
    .filter((file) => file.hunkSections.length > 0);

const buildPatch = (files) => files.map((file) => file.header + file.hunkSections.join("")).join("");

//update maxBuffer from 1MB
const getDiff = (path) => {
  try {
    return execSync(`git diff -- "${path}"`, { maxBuffer: 52428800, encoding: "utf-8" });
  } catch {
    return "";
  }
};

const revertPath = (path) => {
  execSync(`git checkout -- "${path}"`, { stdio: "inherit" });
};

const applyPatch = (patchContent) => {
  const tempFile = `/tmp/filtered-${Date.now()}-${Math.random().toString(36).slice(2)}.patch`;

  fs.writeFileSync(tempFile, patchContent);

  try {
    execSync(`git apply "${tempFile}"`, { stdio: "inherit" });
  } finally {
    fs.unlinkSync(tempFile);
  }
};

/**
 * For a given path:
 * 1. Capture the full diff
 * 2. Filter to keep only hunks matching the patterns
 * 3. Revert all changes in the path
 * 4. Re-apply only the matching hunks
 */
const filterDiffByKeys = (path, patterns) => {
  const diff = getDiff(path);

  if (!diff.trim()) {
    console.log(`No changes for path: ${path}`);

    return;
  }

  const files = parseDiff(diff);
  const filtered = filterMatchingFiles(files, patterns);

  if (filtered.length === 0) {
    console.log(`No matching changes, reverting: ${path}`);

    revertPath(path);

    return;
  }

  revertPath(path);
  applyPatch(buildPatch(filtered));

  console.log(`Filtered: ${path} (kept lines matching: ${patterns.join(", ")})`);
};

paths.forEach((path) => filterDiffByKeys(path, patterns));
