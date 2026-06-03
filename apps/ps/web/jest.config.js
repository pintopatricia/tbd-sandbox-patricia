// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestWebCommon = require("../../../jest.web.config");

module.exports = Object.assign(jestWebCommon, {
  rootDir: "../../../",
  coverageDirectory: "<rootDir>/apps/ps/web/reports",
  // jest bug which is not resolved yet @see https://github.com/facebook/jest/issues/3053
  roots: ["<rootDir>/apps/ps/web"],
  coveragePathIgnorePatterns: ["client.tsx"],
  // uncomment next line to see the unit tests that are slower
  // reporters: [["jest-slow-test-reporter", { numTests: 8, warnOnSlowerThan: 300, color: true }]],
});
