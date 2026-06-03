const jestCommon = require("../../jest.common.config");

module.exports = Object.assign(jestCommon, {
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
});
