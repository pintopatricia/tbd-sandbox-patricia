const fetch = require("node-fetch");
const fs = require("node:fs");
const path = require("node:path");

function loadJiraFromGeneratedConfig() {
  const cfgPath = path.resolve(__dirname, "../..", "config", "jira.json");
  if (!fs.existsSync(cfgPath)) return;

  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  if (cfg.JIRA_BASE_URL && !process.env.JIRA_BASE_URL) process.env.JIRA_BASE_URL = cfg.JIRA_BASE_URL;
  if (cfg.JIRA_TOKEN && !process.env.JIRA_TOKEN) process.env.JIRA_TOKEN = cfg.JIRA_TOKEN;
}

loadJiraFromGeneratedConfig();

const baseUrl = `${process.env.JIRA_BASE_URL}/rest/api/2`;
const headers = {
  Authorization: `Bearer ${process.env.JIRA_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function requestJson(urlPath, { method = "GET", body } = {}) {
  const res = await fetch(`${baseUrl}${urlPath}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira ${method} ${urlPath} failed: ${res.status} ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

function escapeJqlText(s) {
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

async function jiraSearch(jql, maxResults = 2) {
  return requestJson(`/search`, {
    method: "POST",
    body: { jql, maxResults, fields: ["key", "labels", "summary"] },
  });
}

async function jiraCreateIssue(fields) {
  return requestJson(`/issue`, { method: "POST", body: { fields } });
}

const componentCache = new Map();

function normalizeComponentName(name) {
  return String(name || "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function fetchProjectComponents(projectKeyOrId) {
  const comps = await requestJson(`/project/${encodeURIComponent(projectKeyOrId)}/components`);
  const map = new Map();

  for (const comp of comps || []) {
    const normalized = normalizeComponentName(comp?.name);
    if (normalized) {
      map.set(normalized, comp);
    }
  }

  componentCache.set(projectKeyOrId, map);
  return map;
}

async function jiraEnsureComponent(projectKeyOrId, name) {
  const rawComponentName = String(name || "").trim();
  const normalizedComponentName = normalizeComponentName(name);

  if (!rawComponentName) return null;

  let map = componentCache.get(projectKeyOrId);

  if (!map) {
    map = await fetchProjectComponents(projectKeyOrId);
  }

  const existing = map.get(normalizedComponentName);
  if (existing) {
    return existing;
  }

  try {
    const created = await requestJson(`/component`, {
      method: "POST",
      body: { project: projectKeyOrId, name: rawComponentName },
    });

    map.set(normalizedComponentName, created);
    return created;
  } catch (error) {
    const message = String(error?.message || "");

    if (message.includes("already exists")) {
      const refreshedMap = await fetchProjectComponents(projectKeyOrId);
      return refreshedMap.get(normalizedComponentName) || null;
    }

    throw error;
  }
}

module.exports = {
  jiraSearch,
  jiraCreateIssue,
  jiraEnsureComponent,
  escapeJqlText,
};
