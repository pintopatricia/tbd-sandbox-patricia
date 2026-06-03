// TODO: remove this file once WDIO is bumped to a new version
const fs = require("fs");
const path = require("path");

function extractTestKeyFromName(fullTestName) {
  if (!fullTestName) return null;

  const bracket = fullTestName.match(/\[([A-Z]+-\d+)\]/);
  if (bracket) return bracket[1];

  const legacy = fullTestName.match(/\b([A-Z]+)[-\s](\d+)\b/);
  if (legacy) return `${legacy[1]}-${legacy[2]}`;

  return null;
}

// Check testcase name with hook patterns
function isHookTestcaseName(name) {
  if (!name) return false;

  const normalized = name.trim().toLowerCase();
  const hookPatterns = [
    /^before\s*all\b/,
    /^after\s*all\b/,
    /^before\s*each\b/,
    /^after\s*each\b/,
    /^beforeall\b/,
    /^afterall\b/,
    /^beforeeach\b/,
    /^aftereach\b/,
    /^before\b/,
    /^after\b/,
  ];

  return hookPatterns.some((re) => re.test(normalized));
}

function removeHookTestcases(xml) {
  return xml.replace(/<testcase\b[\s\S]*?<\/testcase>/gi, (testcaseXml) => {
    const nameAttr = testcaseXml.match(/\bname=["']([^"']+)["']/i);
    const fullName = nameAttr ? nameAttr[1] : "";
    return isHookTestcaseName(fullName) ? "" : testcaseXml;
  });
}

// Insert properties block
function upsertPropertyBlock(propsXml, key, value) {
  const propRegex = new RegExp(`<property\\s+name=["']${key}["']\\s+value=["'][^"']*["']\\s*\\/?>`, "i");

  const newProp = `<property name="${key}" value="${value}"/>`;

  if (propRegex.test(propsXml)) {
    return propsXml.replace(propRegex, newProp);
  }
  return propsXml.replace(/<\/properties>/i, `  ${newProp}\n</properties>`);
}

function ensureTestcaseHasProperties(testcaseXml) {
  if (/<properties\b/i.test(testcaseXml)) return testcaseXml;
  return testcaseXml.replace(/<\/testcase>/i, `\n      <properties>\n      </properties>\n    </testcase>`);
}

function removeSuiteLevelTestProps(xml) {
  return xml.replace(/(<testsuite[\s\S]*?<properties>)([\s\S]*?)(<\/properties>)/gi, (full, open, body, close) => {
    const cleaned = body
      .replace(/^\s*<property\s+name=["']test(Key|id)["'][\s\S]*?\/>\s*$/gim, "")
      .replace(/^\s*<property\s+name=["']test(Key|id)["'][\s\S]*?>\s*<\/property>\s*$/gim, "");
    return `${open}${cleaned}${close}`;
  });
}

function isUnknownTestcaseName(name) {
  if (!name) return false;
  const normalized = name.trim().toLowerCase();
  return normalized === "unknown test" || normalized.startsWith("unknown test");
}

function removeUnknownTestcases(xml) {
  return xml.replace(/<testcase\b[\s\S]*?<\/testcase>/gi, (testcaseXml) => {
    const nameAttr = testcaseXml.match(/\bname=["']([^"']+)["']/i);
    const fullName = nameAttr ? nameAttr[1] : "";
    return isUnknownTestcaseName(fullName) ? "" : testcaseXml;
  });
}

function isSkippedTestcase(testcaseXml) {
  return /<skipped\b/i.test(testcaseXml);
}

function removeSkippedTestcases(xml) {
  return xml.replace(/<testcase\b[\s\S]*?<\/testcase>/gi, (testcaseXml) => {
    return isSkippedTestcase(testcaseXml) ? "" : testcaseXml;
  });
}

function patchFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");

  let xml = removeSuiteLevelTestProps(original);
  xml = removeHookTestcases(xml);
  xml = removeUnknownTestcases(xml);
  xml = removeSkippedTestcases(xml);

  xml = xml.replace(/<testcase\b[\s\S]*?<\/testcase>/gi, (testcaseXml) => {
    const nameAttr = testcaseXml.match(/\bname=["']([^"']+)["']/i);
    const fullName = nameAttr ? nameAttr[1] : "";

    if (isUnknownTestcaseName(fullName)) return "";

    const testKey = extractTestKeyFromName(fullName);
    if (!testKey) return testcaseXml;

    let patched = ensureTestcaseHasProperties(testcaseXml);

    patched = patched.replace(/<properties>[\s\S]*?<\/properties>/i, (propsFull) => {
      let propsXml = propsFull;

      propsXml = upsertPropertyBlock(propsXml, "testKey", testKey);
      propsXml = upsertPropertyBlock(propsXml, "test_id", testKey);
      propsXml = upsertPropertyBlock(propsXml, "test_key", testKey);

      return propsXml;
    });

    return patched;
  });

  if (xml !== original) {
    fs.writeFileSync(filePath, xml, "utf8");
    console.log(`[xray] OK: ${path.basename(filePath)} -> removed hooks + injected test_key/test_id in <testcase>`);
  } else {
    console.log(`[xray] SKIP: ${path.basename(filePath)} (no changes)`);
  }
}

function main() {
  const reportsDirArg = process.argv[2];
  const reportsDir = reportsDirArg
    ? path.resolve(process.cwd(), reportsDirArg)
    : path.resolve(process.cwd(), "reports/junit");

  const pattern = /^junit-.*\.xml$/i;

  if (!fs.existsSync(reportsDir)) {
    console.log(`[xray] Reports dir not found: ${reportsDir}`);
    process.exit(0);
  }

  const files = fs.readdirSync(reportsDir).filter((f) => pattern.test(f));
  if (!files.length) {
    console.log(`[xray] No junit files found in: ${reportsDir}`);
    process.exit(0);
  }

  console.log(`[xray] Found ${files.length} junit file(s) in: ${reportsDir}`);
  files.forEach((f) => patchFile(path.join(reportsDir, f)));
}

main();
