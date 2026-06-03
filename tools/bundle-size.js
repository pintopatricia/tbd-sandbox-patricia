/* eslint-disable */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp");
const gzip = require("gzip-size");

/**
 * Create report for a given set of JS file paths.
 * Report sizes of minified and gziped files.
 *
 * @param {array} files - List of file paths.
 * @returns {object}
 */
function createReport(files) {
  return files.map((file) => {
    const size = gzip.fileSync(file);
    const name = path.basename(file);

    return { name, size };
  });
}

/**
 * Write CSV report file.
 *
 * @param {object} report - Report object.
 * @param {string} target - Target path to write the CSV report.
 */
function writeCSVReport(report, target) {
  const targetDir = path.dirname(target);
  mkdirp.sync(targetDir);
  const stream = fs.createWriteStream(target);
  const csvHeader = report
    .map((fileReport) => {
      // Remove tags.
      const filename = fileReport.name.split(".");
      const extension = filename[1];
      return `${filename[0].replace(/-[0-9a-z]*$/, "")}.${extension}`;
    })
    .join(",")
    .concat("\n");
  const csvValues = report
    .map((fileReport) => fileReport.size)
    .join(",")
    .concat("\n");
  stream.write(csvHeader);
  stream.end(csvValues);
}

const SOURCE_FOLDER = "dist/";
const TARGET_FILE = "reports/performance/bundle-size.csv";

/** Write bundle report */
(function main(dir, target) {
  const REGEX = "/*.{css,js}";
  const files = glob.sync(path.join(dir, REGEX));
  const report = createReport(files);
  writeCSVReport(report, target);
})(SOURCE_FOLDER, TARGET_FILE);
