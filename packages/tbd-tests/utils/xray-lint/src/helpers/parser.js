const parser = require("@babel/parser");
const t = require("@babel/types");

const VALID_PRPI_KEY_AT_START_RE = /^\[(PRPI-\d+)\]/;
const FIRST_BRACKET_RE = /^\[[^\]]+\]/;

function parseJs(code) {
  return parser.parse(code, {
    sourceType: "unambiguous",
    plugins: ["jsx", "typescript", "classProperties", "dynamicImport"],
  });
}

function getStaticTitle(node) {
  if (!node) return null;
  if (t.isStringLiteral(node)) return node.value;
  return null;
}

function hasValidPrpiKey(title) {
  return VALID_PRPI_KEY_AT_START_RE.test(String(title || ""));
}

function applyKeyToTitle(titleNode, key) {
  if (!t.isStringLiteral(titleNode)) return false;

  const current = String(titleNode.value || "");

  if (hasValidPrpiKey(current)) {
    return false;
  }

  if (FIRST_BRACKET_RE.test(current)) {
    titleNode.value = current.replace(FIRST_BRACKET_RE, `[${key}]`);
    return true;
  }

  titleNode.value = `[${key}]${current}`;
  return true;
}

module.exports = {
  parseJs,
  getStaticTitle,
  hasValidPrpiKey,
  applyKeyToTitle,
};
