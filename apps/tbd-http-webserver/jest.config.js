const { RUNNING_IN_CI } = process.env;

const configs = {
  roots: ["<rootDir>/lib"],
  testRegex: "\\.test.js$",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
  globalSetup: "./global-setup.js",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "@ppb/tbd-urn-codecs": "@ppb/tbd-urn-codecs/src/index.ts",
  },
  transformIgnorePatterns: ["node_modules/(!@ppb/tbd-urn-codecs)"],
  testEnvironment: "node",
  preset: "ts-jest/presets/js-with-ts",
  // reporters: [["jest-slow-test-reporter", { numTests: 8, warnOnSlowerThan: 300, color: true }]],
};

// Only show failling tests and coverage summary when running in CI
if (RUNNING_IN_CI) {
  configs.reporters = [["jest-silent-reporter", { showPaths: true }]];
  configs.coverageReporters = ["cobertura", "text-summary", "html", "json"];
}

module.exports = configs;
