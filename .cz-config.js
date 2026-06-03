module.exports = {
  types: [
    { value: "feat", name: "feat:      New feature" },
    { value: "fix", name: "fix:       Bug fix" },
    { value: "build", name: "build:     Build related changes" },
    { value: "chore", name: "chore:     Chore related changes" },
    { value: "ci", name: "ci:        CI/CD related changes" },
    { value: "docs", name: "docs:      Documentation changes" },
    { value: "revert", name: "revert:    Revert changes" },
    { value: "test", name: "test:      Adding or updating tests" },
    { value: "style", name: "style:     Code style changes" },
    { value: "perf", name: "perf:      Performance improvements" },
    { value: "refactor", name: "refactor:  Code refactoring" },
    { value: "experiment", name: "experiment: Experimentation" },
  ],
  scopes: [
    { name: "web" },
    { name: "native" },
    { name: "bff" },
    { name: "tbd-store" },
    { name: "tbd-user-context" },
    { name: "tbd-router" },
    { name: "tbd-lint" },
    { name: "wdio" },
    { name: "etx-service" },
  ],
  messages: {
    type: "Select the type of change:",
    scope: "Select a scope (optional, select empty to skip):",
    customScope: "Input the scope of this change:",
    ticketNumber: "Enter the ticket number e.g (JIRA-1234):",
    subject: "Write a short, imperative tense description of the change:\n",
    body: "Provide a longer description of the change (optional). Use '|' to break new line:\n",
    breaking: "List any breaking changes (optional):\n",
    footer: "Enter User Story ID in the format PROJ-12345, 12345, or NA:\n",
    confirmCommit: `Are you sure you want to proceed with the commit above? 

    Options:
    (Y) Yes: Proceed with the commit.
    (n) No: Cancel the commit.
    (e) Edit: Edit the commit message.
    (h) Help: Show help with more information.`,
  },

  allowTicketNumber: true,
  isTicketNumberRequired: true,
  ticketNumberPrefix: " #",
  ticketNumberSuffix: "",
  ticketNumberPosition: "last",
  subjectLimit: 100,
  skipQuestions: ["footer"],
  allowCustomScopes: true,
};
