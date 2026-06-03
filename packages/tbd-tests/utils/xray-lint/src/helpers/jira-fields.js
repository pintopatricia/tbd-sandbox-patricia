function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function normalizePath(filePath) {
  return String(filePath).replaceAll("\\", "/");
}

function normalizeTitle(title) {
  return String(title).replace(/\s+/g, " ").trim();
}

function deriveEnvironmentFromPath(path) {
  if (path.includes("/web/")) return "web";
  if (path.endsWith(".android.spec.js")) return "android";
  if (path.endsWith(".ios.spec.js")) return "ios";
  if (path.endsWith(".all.spec.js")) return "android, ios";
  return null;
}

function deriveBaseJiraFieldsFromPath(filePath) {
  const p = normalizePath(filePath);
  const parts = p.split("/").filter(Boolean);

  const specsIdx = parts.indexOf("specs");
  const testType = specsIdx >= 0 ? parts[specsIdx + 1] : null;
  const brand = specsIdx >= 0 ? parts[specsIdx + 2] : null;
  const environment = deriveEnvironmentFromPath(p);

  return {
    labels: uniq([testType]),
    fixVersions: uniq([brand]).map((name) => ({ name })),
    ...(environment ? { environment } : {}),
    customfield_10103: "PRPI-519",
  };
}

function deriveJiraFieldsFromPath(filePath) {
  return deriveBaseJiraFieldsFromPath(filePath);
}

function deriveJiraExecutionFieldsFromPath(filePath, testEnvironment) {
  return {
    ...deriveBaseJiraFieldsFromPath(filePath),
    ...(testEnvironment ? { customfield_30827: [testEnvironment] } : {}),
  };
}

module.exports = {
  deriveJiraFieldsFromPath,
  deriveJiraExecutionFieldsFromPath,
  normalizePath,
  normalizeTitle,
  deriveEnvironmentFromPath,
};
