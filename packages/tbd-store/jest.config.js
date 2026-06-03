// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestCommon = require("../../jest.common.config");

module.exports = Object.assign(jestCommon, {
  moduleFileExtensions: ["ts", "js"],
  setupFiles: ["../../test-setup.js"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.js", "**/*.test.ts"],
  coveragePathIgnorePatterns: ["saga-jest-setup.js", ".graphql", "catalogue-response-types.ts", ".types.ts"],
  transform: {
    "\\.graphql$": "@glen/jest-raw-loader",
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
  testPathIgnorePatterns: ["node_modules/", "dist/"],
  transformIgnorePatterns: [
    "/node_modules(?!\\/@ppb\\/platform-services|\\/@ppb\\/betslip-core|\\/@flutter-global\\/uki-channels-http-clients)/",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  globalSetup: "../../global-setup.js",
  coverageThreshold: {
    global: {
      ...jestCommon.coverageThreshold.global,
      branches: 81,
    },
  },
});
