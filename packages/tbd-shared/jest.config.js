const jestCommon = require("../../jest.common.config");

module.exports = Object.assign(jestCommon, {
  testEnvironment: "jsdom",
  testMatch: ["**/!(*.native).test.js?(x)", "**/!(*.native).test.ts?(x)"],
  globalSetup: "../../global-setup.js",
  setupFiles: ["../../test-setup"],
  transform: {
    ".+\\.(css)$": "<rootDir>/../../jest-css-modules-processor.js",
    "\\.graphql$": "@glen/jest-raw-loader",
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
    "^.+\\.mjs$": "@swc/jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(@ppb))"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)(\\?.*)?$": "<rootDir>/__mocks__/svg-mock.js",
    "@ppb/tbd-urn-codecs": "@ppb/tbd-urn-codecs/src/index.ts",
    "@ppb/chart-tools": "@ppb/chart-tools/src/index.ts",
  },
  coverageDirectory: "./reports/web",
  coverageThreshold: {
    global: {
      ...jestCommon.coverageThreshold.global,
      branches: 81,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    ".css",
    ".d.ts",
    ".modules.json",
    ".selectors.js",
    ".mocks.js",
    ".types.ts",
    "store-init.web.ts",
    "components/RootComponentAttachment.web.tsx",
  ],
  // uncomment next line to see the unit tests that are slower
  // reporters: [["jest-slow-test-reporter", { numTests: 8, warnOnSlowerThan: 300, color: true }]],
});
