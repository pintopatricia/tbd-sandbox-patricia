const path = require("path");
const propertyGroups = require("stylelint-config-recess-order/groups");

/** @type {import("stylelint").Config} */
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: [
    "stylelint-no-unused-selectors",
    "stylelint-color-no-non-variables",
    "stylelint-value-no-unknown-custom-properties",
    "stylelint-declaration-strict-value",
  ],
  rules: {
    "order/properties-order": propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: "always",
      noEmptyLineBetween: true,
    })),
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [
          path.resolve(__dirname, "../../node_modules/@ppb/the-wall-common/base-theme.css"),
          path.resolve(
            __dirname,
            "../../node_modules/@ppb/the-wall-design-tokens/generated/betfair/core/web/sports.dark.css",
          ),
          path.resolve(
            __dirname,
            "../../node_modules/@ppb/the-wall-design-tokens/generated/betfair/core/web/sports.light.css",
          ),
          path.resolve(
            __dirname,
            "../../node_modules/@ppb/the-wall-design-tokens/generated/betfair/semantic/web/sports.light.css",
          ),
          path.resolve(
            __dirname,
            "../../node_modules/@ppb/the-wall-design-tokens/generated/betfair/semantic/web/sports.dark.css",
          ),
          path.resolve(
            __dirname,
            "../../node_modules/@ppb/the-wall-design-tokens/generated/betfair/core/web/fonts.css",
          ),
          path.resolve(__dirname, "../../apps/bf/web/assets/css/global.css"),
        ],
      },
    ],
    "declaration-property-value-allowed-list": {
      opacity: ["/^var\\(--.+\\)$/", "0", "1"],
    },
    "declaration-empty-line-before": null,
    "scale-unlimited/declaration-strict-value": [
      [
        "background-color",
        "color",
        "fill",
        "font",
        "font-size",
        "letter-spacing",
        "line-height",
        "margin",
        "margin-left",
        "margin-right",
        "margin-top",
        "margin-bottom",
        "text-decoration-line",
      ],
      {
        ignoreValues: ["0", "transparent", "auto", "inherit"],
        disableFix: true,
      },
    ],
    "color-named": "never",
    "plugin/no-unused-selectors": true,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["export", "import", "global", "local", "external"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["/value/"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes", "compose-with"],
      },
    ],
    "property-disallowed-list": ["font-size", "font-weight", "line-height"],
    "dczajkowski/color-no-non-variables": true,
    "declaration-block-no-duplicate-properties": true,
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "keyframes-name-pattern": "^[a-z][a-zA-Z0-9]+$",
    "alpha-value-notation": "number",
    "value-no-vendor-prefix": [
      true,
      {
        ignoreValues: ["box"],
      },
    ],
    "media-feature-range-notation": ["prefix"],
  },
};
