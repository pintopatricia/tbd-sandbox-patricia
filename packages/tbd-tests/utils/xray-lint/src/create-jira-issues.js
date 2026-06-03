const { jiraSearch, jiraCreateIssue, jiraEnsureComponent, escapeJqlText } = require("./helpers/jira-requests");
const { deriveJiraFieldsFromPath } = require("./helpers/jira-fields.js");
const { buildJiraSummary, firstDescribe } = require("./helpers/summary");

const ANY_KEY_RE = /^\[([^\]]+)\]/;
const stripAnyKeyPrefix = (s) => String(s || "").replace(ANY_KEY_RE, "");

function jiraBrowseLink(key) {
  const base = process.env.JIRA_BASE_URL;
  if (!base) return null;
  return `${String(base).replace(/\/$/, "")}/browse/${key}`;
}

async function createJiraIssues({ missingStatic, project = "PRPI", dryRun = false }) {
  const created = [];
  const reused = [];
  const patches = [];

  for (const item of missingStatic) {
    const title = stripAnyKeyPrefix(item.title);
    const summary = buildJiraSummary({ describeChain: item.describeChain, itTitle: title });
    const componentName = firstDescribe(item.describeChain);
    const jiraFields = deriveJiraFieldsFromPath(item.file);

    const jql = `project = ${project} AND issuetype = Test AND summary ~ "\\"${escapeJqlText(summary)}\\""`;
    const existingKey = (await jiraSearch(jql, 2)).issues?.[0]?.key;

    const record = {
      file: item.file,
      title,
      cleanTitle: title,
      summary,
      component: componentName,
      labels: jiraFields.labels,
      fixVersions: jiraFields.fixVersions,
      environment: jiraFields.environment,
      epic: jiraFields.customfield_10103,
    };

    let key = existingKey;

    if (key) {
      reused.push({ key, link: jiraBrowseLink(key), ...record });
    } else if (dryRun) {
      key = `${project}-DRY`;
      created.push({ key, link: jiraBrowseLink(key), ...record, dryRun: true });
    } else {
      let jiraComponent = null;

      if (componentName) {
        jiraComponent = await jiraEnsureComponent(project, componentName);
      }

      const fields = {
        project: { key: project },
        issuetype: { name: "Test" },
        summary,
        ...jiraFields,
        ...(jiraComponent?.id ? { components: [{ id: jiraComponent.id }] } : {}),
      };

      key = (await jiraCreateIssue(fields)).key;

      created.push({ key, link: jiraBrowseLink(key), ...record });
    }

    patches.push({
      file: item.file,
      describeChain: item.describeChain,
      title: item.title,
      cleanTitle: title,
      key,
      link: jiraBrowseLink(key),
    });
  }

  return { patches, created, reused };
}

module.exports = { createJiraIssues };
