const { readFileSync } = require("fs");
const { join } = require("path");
const { sync } = require("glob");
const { addAttachment } = require("@wdio/allure-reporter");

function escapeAllChars(searchTerm) {
  return searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").toLowerCase();
}

function saveScreenshotsAllure(test, visualTestsOpts) {
  if (!visualTestsOpts.diff && !visualTestsOpts.baseline)
    throw new Error("visualTestsOpts must have a diff and a baseline path!");

  const optionsDIFF = { cwd: join(process.cwd(), visualTestsOpts.diff) };
  const optionsBASELINE = { cwd: join(process.cwd(), visualTestsOpts.baseline) };

  try {
    // - will make sure we won't mix baselines containing same description
    const filesDIFF = sync(`**/*${escapeAllChars(test.description)}*`, optionsDIFF);
    const filesBASELINE = sync(`**/*${escapeAllChars(test.description)}*`, optionsBASELINE);
    const imageDIFF = readFileSync(`${optionsDIFF.cwd}/${filesDIFF[0]}`);
    const imageBASELINE = readFileSync(`${optionsBASELINE.cwd}/${filesBASELINE[0]}`);
    if (imageDIFF && imageBASELINE) {
      addAttachment(`BASELINE`, imageBASELINE, "image/png");
      addAttachment(`DIFF`, imageDIFF, "image/png");
    } else {
      throw new Error(`Could not get images = require(DIFF: ${imageDIFF} or BASELINE: ${imageBASELINE}`);
    }
  } catch (error) {
    throw new Error(`There was a problem reading files = require(${optionsDIFF.cwd} or ${optionsBASELINE.cwd})`);
  }
}

module.exports = {
  saveScreenshotsAllure,
};
