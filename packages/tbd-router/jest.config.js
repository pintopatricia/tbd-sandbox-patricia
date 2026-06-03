// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestCommon = require("../../jest.common.config");

module.exports = Object.assign(jestCommon, {
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
});
