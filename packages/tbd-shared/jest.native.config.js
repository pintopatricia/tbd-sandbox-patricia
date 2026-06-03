module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  testMatch: ["**/*.native.test.js?(x)"],
  globalSetup: "../../global-setup.js",
  setupFilesAfterEnv: ["./test-setup.native.js", "jest-extended/all"],
  transform: {
    "\\.js?(x)$": ["babel-jest", { configFile: "./babel.config.js" }],
    "^.+\\.mjs$": "@swc/jest",
    "\\.graphql$": "@glen/jest-raw-loader", // For parsing GraphQL files due to INCGNT-467 changes
  },
  transformIgnorePatterns: ["node_modules/(!.*)"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/svg-mock.js",
  },
  coverageDirectory: "./reports/native",
  coveragePathIgnorePatterns: ["/node_modules/", ".styles.ts", ".selectors.js", ".mocks.js"],
};
