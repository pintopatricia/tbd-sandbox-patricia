// eslint-disable-next-line @typescript-eslint/no-require-imports
const jestCommon = require("../../../jest.common.config");

module.exports = Object.assign(jestCommon, {
  preset: "react-native",
  testEnvironment: "node",
  testMatch: ["**/*.test.js?(x)"],
  globalSetup: "../../../global-setup.js",
  setupFilesAfterEnv: ["@ppb/tbd-shared/test-setup.native.js", "jest-extended/all"],
  transform: {
    "\\.js$": ["babel-jest", { configFile: "./babel.config.js" }],
  },
  transformIgnorePatterns: ["node_modules/(!.*)"],
  coverageDirectory: "./reports/",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    ".styles.ts",
    ".d.ts",
    ".selectors.js",
    "/navigation/navigators/",
    "/navigation/screens/",
  ],
});
