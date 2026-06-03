module.exports = {
  versionGroups: [
    {
      label: "Ensure all local packages are used with the same local version or with the workspace protocol",
      dependencies: ["$LOCAL"],
      policy: "sameRange",
      specifierTypes: ["exact", "workspace-protocol"],
    },
  ],
};
