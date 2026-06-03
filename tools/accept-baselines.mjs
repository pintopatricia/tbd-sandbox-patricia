/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from "fs/promises";
import readline from "readline";
import util from "util";
import path from "path";
import { spawn } from "child_process";
import resemble from "resemblejs";
import * as url from "url";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const compare = util.promisify(resemble.compare).bind(resemble);

const getArgument = (arg) => {
  const args = process.argv.slice(2);
  const argIndex = args.indexOf(arg);

  if (argIndex === -1) {
    return {};
  }

  return { arg: args[argIndex], value: args[argIndex + 1] };
};

const appDir = getArgument("--appdir");
const actualsDir = getArgument("--actualsdir");
const baseDir = getArgument("--basedir");
const diffDir = getArgument("--diffdir");

const WORKSPACE_DIR = path.resolve(dirname, appDir.value || "../apps/bf/web");
const ACTUALS_DIR = path.resolve(WORKSPACE_DIR, actualsDir.value || "regression-tests/actual/desktop_chrome");
const BASELINES_DIR =
  baseDir.value && baseDir.value.startsWith("/")
    ? baseDir.value
    : path.resolve(
        WORKSPACE_DIR,
        baseDir.value || "regression-tests/tbd-visual-tests-baseline/testBaseline/desktop_chrome"
      );
const DIFFS_DIR = path.resolve(WORKSPACE_DIR, diffDir.value || "regression-tests/diff/desktop_chrome");

const allDiffFiles = await fs.readdir(DIFFS_DIR);

const updateBaseline = async (diffFile, output = false) => {
  try {
    await fs.copyFile(`${ACTUALS_DIR}/${diffFile}`, `${BASELINES_DIR}/${diffFile}`);

    if (output) {
      process.stdout.write(`${diffFile} updated\n`);
    }
  } catch (error) {
    process.stderr.write(`${diffFile} was unable to update\n`);
    process.stderr.write(`${error}\n`);
  }
};

const updateBaselineStdout = (diffFile) => updateBaseline(diffFile, true);

const getComparison = async (diffFile) => {
  const actualPath = `${ACTUALS_DIR}/${diffFile}`;
  const baselinePath = `${BASELINES_DIR}/${diffFile}`;
  const diffPath = `${DIFFS_DIR}/${diffFile}`;

  const [actualFile, baselineFile] = await Promise.all([
    fs.readFile(actualPath),
    fs.readFile(baselinePath).catch(() => fs.readFile(actualPath)),
  ]);

  return {
    file: diffFile,
    paths: { diff: diffPath, actual: actualPath, baseline: baselinePath },
    result: await compare(actualFile, baselineFile),
  };
};

const universalUpdate = () => Promise.all(allDiffFiles.map(async (diffFile) => updateBaselineStdout(diffFile)));

const interactiveUpdate = async () => {
  const standardInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = util.promisify(standardInterface.question).bind(standardInterface);
  const allComparisons = await Promise.all(allDiffFiles.map(async (diffFile) => getComparison(diffFile)));

  for await (const comparison of allComparisons) {
    const { paths, file, result } = comparison;
    const { diff, baseline, actual } = paths;

    spawn("open", ["-Fn", actual, baseline, diff], { detached: true });

    const input = await question(`Accept ${file} at ${result.misMatchPercentage}% ? (y/n/exit) `);

    spawn("pkill", ["Preview"]);

    if (input === "y") {
      updateBaseline(file);
    }

    if (input === "exit") {
      process.exit(0);
    }
  }

  standardInterface.close();
};

if (process.argv.find((argument) => argument === "--all")) {
  await universalUpdate();
} else {
  await interactiveUpdate();
}
