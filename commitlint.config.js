module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": () => [
      2,
      "always",
      ["wdio", "bff", "etx-service", "tbd-lint", "tbd-store", "tbd-router", "web", "native"],
    ],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "experiment", "feat", "fix", "perf", "refactor", "revert", "style", "test"],
    ],
    "user-story-id-pattern": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "user-story-id-pattern": ({ raw }) => {
          /**
           * 1) No user story associated to the commit: #NA
           * 2) A Target Process user story: all numbers. E.g.: #12345
           * 3) A Jira user story: <project key>-<issue number>, where project key must follow all the following rules:
           *    - The first character must be a letter,
           *    - All letters must be from the Modern Roman Alphabet and upper case, and
           *    - Only letters, numbers or the underscore character can be used.
           *  E.g.: #PROJ-12345, #PROJ1-12345, #P_1-12345, #R2D2-12345
           *  Reference: https://confluence.atlassian.com/adminjiraserver/changing-the-project-key-format-938847081.html
           */
          const regex = /#(NA|\d+|([A-Z][A-Z0-9_]*-\d+))/;

          return [
            regex.test(raw),
            `Commit message format must contain the User Story ID, matching the following regex
             "${regex.toString()}" (ex. feat(web): add gtm #PROJ-12345)`,
          ];
        },
      },
    },
  ],
};
