const { setupTestsModulePath } = require("@ppb/bff-mocking-server-common");

module.exports = {
  coverageReporters: ["cobertura", "text", "html", "json"],
  coveragePathIgnorePatterns: [".po.js"],
  coverageDirectory: "reports/",
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 83,
      functions: 83,
      lines: 83,
    },
  },
  slowTestThreshold: 12,
  globals: {},
  testTimeout: 20000,
  moduleFileExtensions: ["js"],
  testMatch: ["**/*.spec.js"],
  testPathIgnorePatterns: ["dist"],
  globalSetup: setupTestsModulePath,
  maxWorkers: 1,
};
