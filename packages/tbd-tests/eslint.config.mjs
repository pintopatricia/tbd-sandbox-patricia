import config, { wdioRules } from "../../eslint.config.mjs";

import { configs as wdioConfig } from "eslint-plugin-wdio";

export default [
  ...config,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...wdioConfig["flat/recommended"].languageOptions.globals,
      },
    },
  },
  wdioRules(["**/*.po.js", "**/*.spec.js", "**/*.so.js"]),
];