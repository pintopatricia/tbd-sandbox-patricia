import config, { javascriptRules, wdioRules } from "../../../eslint.config.mjs";
import globals from "globals";

export default [
  ...config,
  javascriptRules({ ...globals.node }),
  wdioRules(["tests/**/*.js"]),
  {
    ignores: [
      "android",
      "assets/",
      "coverage/",
      "ios",
      "types/",
      "__mocks__",
      "scripts/",
      "**/babel.config.js",
      "**/metro.dev.config.js",
      "metro.config.js",
      "**/jest/setup.js",
      "jest.config.js",
      "jest.config-src.js",
      "**/declarations.d.ts",
      "**/react-native.config.js",
      "polyfills.js",
      "react-native.config.js",
      "dist",
      "reports",
    ],
  },
];
