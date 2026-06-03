/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.resolve("package.json"));

const { generateCssModuleName } = require("./tools/generate-css-modules");

const renderModule = (tokens) => `
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = ${JSON.stringify(tokens)};
  module.exports = exports.default;
`;

module.exports = {
  process(code, filePath) {
    const config = packageJson.jestCSSProcessor || {};

    const { rootDir: context = process.cwd() } = config;

    const classRegex = /\.([\w-]+)/g;

    const tokens = {};

    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = classRegex.exec(code)) !== null) {
      tokens[match[1]] = `${generateCssModuleName(filePath, match[1], context)}`;
    }

    return { code: renderModule(tokens) };
  },
};
