import config from "../../eslint.config.mjs";

export default [
  ...config,
  {
    files: ["**/*.{js,ts,tsx,jsx}"],
    ignores: ["**/*.web.{js,ts,tsx,jsx}", "**/*.web.test.{js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.name='window']:not(ChainExpression MemberExpression):not(MemberExpression[object.type='MemberExpression'][object.name='window'] > MemberExpression[object.name='window'])",
          message:
            "Use optional chaining (?.) when accessing properties on 'window' to " +
            "handle environments where they may not exist (e.g., window?.location?.href).",
        },
      ],
    },
  },
];
