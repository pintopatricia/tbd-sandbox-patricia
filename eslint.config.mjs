import babelParser from "@babel/eslint-parser";
import importPlugin from "eslint-plugin-import";

import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import jasminePlugin from "eslint-plugin-jasmine";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";
import { configs as wdioConfig } from "eslint-plugin-wdio";

export const javascriptRules = (env = { ...globals.browser, ...globals.node }) => ({
  ...js.configs.recommended,
  files: ["**/*.js", "**/*.jsx", "**/*.mjs"],
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    globals: env,
  },
});

const typescriptRules = tseslint.config(js.configs.recommended, {
  files: ["**/*.ts", "**/*.tsx"],
  extends: [tseslint.configs.strict, importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
  rules: {
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/prefer-literal-enum-member": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react-native",
            importNames: ["Text", "TextInput"],
            message: "Import the respective element from @ppb/the-wall-native instead",
            allowTypeImports: true,
          },
        ],
      },
    ],
  },
});

const jsxRules = jsxA11yPlugin.flatConfigs.recommended;

const reactRules = [
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooksPlugin.configs.flat["recommended-latest"],
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/prop-types": "off", // Not needed when using TypeScript
    },
  },
];

const importRules = [
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
    },
  },
];

const jestRules = {
  files: [
    "**/*.test.js?(x)",
    "**/*.test.ts",
    "**/*.spec.js",
    "**/saga-jest-setup.js",
    "test-setup.js",
    "test-setup.native.js",
  ],
  ...jestPlugin.configs["flat/recommended"],
  plugins: {
    jest: jestPlugin,
    jasmine: jasminePlugin,
  },
  languageOptions: {
    globals: {
      ...jestPlugin.environments.globals.globals,
      ...globals.jasmine,
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    "react/no-unknown-property": "off",
    "react-hooks/rules-of-hooks": "off",
    "no-restricted-properties": [
      "error",
      ...["describe", "it", "test"].map((object) => ({
        object,
        property: "only",
        message: "Remove .only to run all tests.",
      })),
    ],
  },
};

export const wdioRules = (files = ["**/*.so.js", "**/*.po.js", "**/*.spec.js"]) => ({
  files,
  ...wdioConfig["flat/recommended"],
  plugins: {
    jasmine: jasminePlugin,
    ...wdioConfig["flat/recommended"].plugins,
  },
  languageOptions: {
    globals: {
      ...globals.jasmine,
      ...wdioConfig["flat/recommended"].languageOptions.globals,
      $: false,
      $$: false,
    },
  },
  rules: {
    "wdio/await-expect": "off",
    "no-unused-vars": "error",
  },
});

export default [
  javascriptRules(),
  ...typescriptRules,
  ...importRules,
  ...reactRules,
  jestRules,
  jsxRules,
  {
    settings: {
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/resolver": {
        typescript: { project: ["./apps/**/tsconfig.json", "./packages/**/tsconfig.json", "./tsconfig.json"] },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "no-unused-vars": "off", // Surpassed by typescript-eslint/no-unused-vars
    },
  },
  wdioRules(),
  {
    ignores: [
      "*.css.d.ts",
      "mocks",
      "__mocks__",
      "**/node_modules/",
      "reports",
      "dist",
      "*.config.js",
      "**/__generated__/",
      "**/fake-timers.js",
      "**/splunk-otel-web.js",
    ],
  },
];
