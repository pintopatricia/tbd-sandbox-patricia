const { RUNNING_IN_CI } = process.env;

const configs = {
  coverageReporters: ["lcov", "cobertura", "text", "html", "json"],
  coveragePathIgnorePatterns: [".po.js"],
  coverageDirectory: "reports/",
  resolver: "jest-source-resolver",
  preset: "ts-jest/presets/js-with-ts",
  coverageThreshold: {
    global: {
      branches: 83,
      functions: 83,
      lines: 83,
    },
  },
  slowTestThreshold: 12,
  maxWorkers: "50%",
};

// Only show failling tests and coverage summary when running in CI
if (RUNNING_IN_CI) {
  configs.reporters = [["jest-silent-reporter", { showPaths: true }]];
  configs.coverageReporters = ["lcov", "cobertura", "text-summary", "html", "json"];
}

module.exports = configs;
