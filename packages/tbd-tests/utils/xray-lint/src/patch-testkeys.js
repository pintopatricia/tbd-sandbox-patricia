const fs = require("node:fs");
const path = require("node:path");
const fg = require("fast-glob");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const { normalizeTitle, normalizePath } = require("./helpers/jira-fields.js");
const { parseJs, getStaticTitle, applyKeyToTitle } = require("./helpers/parser");
const { repoRoot } = require("./helpers/settings");

const ANY_KEY_RE = /^\[([^\]]+)\]/;
const ANY_BRACKET_RE = /\[[^\]]+\]/;

const VISUAL_COMMANDS = new Set(["waitUntilImageEquals", "checkScreen", "compareScreen"]);

function cleanChain(chain) {
  return (chain || []).filter(Boolean).map(normalizeTitle).filter(Boolean);
}

function patchKey(file, describeChain, title) {
  const chain = cleanChain(describeChain).join(" > ");
  return `${normalizePath(file)} :: ${chain} :: ${normalizeTitle(title)}`;
}

function replaceBracketKeyInString(value, jiraKey) {
  const current = String(value || "");
  if (ANY_BRACKET_RE.test(current)) {
    return current.replace(ANY_BRACKET_RE, `[${jiraKey}]`);
  }
  return current;
}

function isVisualSnapshotCall(callNode) {
  const callee = callNode?.callee;
  if (!callee || callee.type !== "MemberExpression") return false;
  if (callee.property?.type !== "Identifier") return false;

  return VISUAL_COMMANDS.has(callee.property.name);
}

function patchVisualSnapshotArg(argNode, jiraKey) {
  if (!argNode) return false;

  if (argNode.type === "StringLiteral") {
    const next = replaceBracketKeyInString(argNode.value, jiraKey);
    if (next !== argNode.value) {
      argNode.value = next;
      return true;
    }
    return false;
  }

  if (argNode.type === "TemplateLiteral") {
    let changed = false;

    for (const quasi of argNode.quasis || []) {
      const cooked = quasi.value?.cooked;
      if (typeof cooked !== "string") continue;

      const next = replaceBracketKeyInString(cooked, jiraKey);
      if (next !== cooked) {
        quasi.value.cooked = next;
        quasi.value.raw = next;
        changed = true;
      }
    }

    return changed;
  }

  return false;
}

function patchVisualCallsInScope(scopePath, jiraKey) {
  let changed = false;

  scopePath.traverse({
    CallExpression(innerPath) {
      if (!isVisualSnapshotCall(innerPath.node)) return;

      const argNode = innerPath.node.arguments?.[0];
      if (patchVisualSnapshotArg(argNode, jiraKey)) {
        changed = true;
      }
    },
  });

  return changed;
}

/**
 * Step 4: patch code with new TestKeys
 */
async function patchTestKeysIntoCode({ root = ".", glob = "**/*.spec.js", patches = [], touchedRepoFiles }) {
  const patchMap = new Map();

  for (const p of patches) {
    const t = p.cleanTitle ?? p.title;
    const file = p.repoFile ?? p.file;
    patchMap.set(patchKey(file, p.describeChain, t), p.key);
  }

  const absRoot = path.resolve(repoRoot, root);
  const absFiles =
    Array.isArray(touchedRepoFiles) && touchedRepoFiles.length
      ? touchedRepoFiles.map((repoRel) => path.resolve(repoRoot, repoRel))
      : await fg([glob], { cwd: absRoot, absolute: true, onlyFiles: true, dot: false });

  const patched = [];
  const skipped = [];

  for (const absFile of absFiles) {
    if (!fs.existsSync(absFile)) continue;

    const repoRelFile = normalizePath(path.relative(repoRoot, absFile));

    let hasAnyForFile = false;
    for (const k of patchMap.keys()) {
      if (k.startsWith(`${repoRelFile} ::`)) {
        hasAnyForFile = true;
        break;
      }
    }

    if (!hasAnyForFile) {
      skipped.push(repoRelFile);
      continue;
    }

    const code = fs.readFileSync(absFile, "utf8");
    const ast = parseJs(code);

    const describeStack = [];
    const patchedDescribeScopes = new WeakSet();
    let changed = false;

    traverse(ast, {
      CallExpression: {
        enter(p) {
          const callee = p.node.callee;
          if (!callee || callee.type !== "Identifier") return;

          if (callee.name === "describe") {
            const raw = getStaticTitle(p.node.arguments?.[0]);
            describeStack.push(raw ? normalizeTitle(raw) : null);
            return;
          }

          if (callee.name !== "it") return;

          const titleNode = p.node.arguments?.[0];
          const rawTitle = getStaticTitle(titleNode);
          if (!rawTitle) return;

          const title = normalizeTitle(rawTitle);
          const cleanTitle = title.replace(ANY_KEY_RE, "");

          const k = patchKey(repoRelFile, describeStack, cleanTitle);
          const jiraKey = patchMap.get(k);
          if (!jiraKey) return;

          const before = titleNode.value;
          const updated = applyKeyToTitle(titleNode, jiraKey);

          if (updated && titleNode.value !== before) {
            changed = true;
          }

          // patch inside the it() body
          const testBodyFn = p.get("arguments.1");
          if (testBodyFn?.node && patchVisualCallsInScope(testBodyFn, jiraKey)) {
            changed = true;
          }

          // patch describe block
          const describeBodyPath = p.findParent(
            (parentPath) =>
              parentPath.isCallExpression() &&
              parentPath.node.callee?.type === "Identifier" &&
              parentPath.node.callee.name === "describe",
          );

          if (describeBodyPath && !patchedDescribeScopes.has(describeBodyPath.node)) {
            const describeFnPath = describeBodyPath.get("arguments.1");
            if (describeFnPath?.node && patchVisualCallsInScope(describeFnPath, jiraKey)) {
              changed = true;
            }
            patchedDescribeScopes.add(describeBodyPath.node);
          }

          patchMap.delete(k);
        },

        exit(p) {
          const callee = p.node.callee;
          if (callee?.type === "Identifier" && callee.name === "describe") {
            describeStack.pop();
          }
        },
      },
    });

    if (!changed) {
      skipped.push(repoRelFile);
      continue;
    }

    const out = generate(ast, { retainLines: true, comments: true }).code;
    fs.writeFileSync(absFile, out, "utf8");
    patched.push(repoRelFile);
  }

  return { patched, skipped };
}

module.exports = { patchTestKeysIntoCode };
