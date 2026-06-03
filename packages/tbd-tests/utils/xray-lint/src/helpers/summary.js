const { normalizeTitle } = require("./jira-fields.js");

function cleanChain(describeChain) {
  return (describeChain || []).map(normalizeTitle).filter(Boolean);
}

function firstDescribe(describeChain) {
  return cleanChain(describeChain)[0] || null;
}

function buildJiraSummary({ describeChain, itTitle }) {
  const chain = cleanChain(describeChain);
  const title = normalizeTitle(itTitle);

  if (!chain.length) return title;

  const first = chain[0];
  const rest = chain.slice(1);

  const summary = `[${first}] ${rest.length ? rest.join(" - ") + " - " : ""}${title}`;
  return summary.length > 240 ? summary.slice(0, 240) : summary;
}

module.exports = { firstDescribe, buildJiraSummary };
