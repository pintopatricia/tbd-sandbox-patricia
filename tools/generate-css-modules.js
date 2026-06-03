/* eslint-disable import/no-extraneous-dependencies, no-console, @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const postcssModules = require("postcss-modules");
const { getHashDigest } = require("loader-utils");

const generateCssModuleName = (filePath, name) => {
  const fileRelative = path.relative(__dirname, path.resolve(__dirname, filePath)).replace("../", "./");
  return `${getHashDigest(fileRelative, "xxhash64", "hex", 16).replace(/^((-?[0-9])|--)/, "_$1")}-${name}`;
};

const processor = postcss([
  postcssModules({
    generateScopedName: (name, filename) => `.${generateCssModuleName(filename, name)}`,
    getJSON: (cssFileName, json) => {
      if (!Object.keys(json).length) {
        return;
      }
      const jsonFilePath = cssFileName.replace(/(\.module)?\.css/, ".modules.json");
      fs.writeFileSync(jsonFilePath, `${JSON.stringify(json, null, 2).replace(" .", ".")}\n`);
    },
  }),
]);

const generateCssModulesMapping = (cssFilePath) => {
  const css = fs.readFileSync(cssFilePath, "utf-8");

  processor.process(css, { from: cssFilePath }).catch((err) => console.error(err));
};

module.exports = { generateCssModuleName, generateCssModulesMapping };
