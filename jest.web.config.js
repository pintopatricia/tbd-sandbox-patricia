// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestCommon = require("./jest.common.config");

module.exports = Object.assign(jestCommon, {
  testMatch: ["**/!(*.native).test.js?(x)"],
  transform: {
    ".+\\.css$": "<rootDir>/jest-css-modules-processor.js",
    "\\.graphql$": "@glen/jest-raw-loader",
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["node_modules(?!\\/@ppb\\/betslip-core)/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/packages/tbd-shared/__mocks__/svg-mock.js",
  },
  // jest bug which is not resolved yet @see https://github.com/facebook/jest/issues/3053
  globalSetup: "./global-setup.js",
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.css", "!**/*native*", "!**/*.d.ts"],
  setupFiles: ["<rootDir>/test-setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/packages", "<rootDir>/bff", "<rootDir>/native"],
});
