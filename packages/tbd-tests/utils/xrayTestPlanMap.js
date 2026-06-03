const RULES = [
  //Web E2E
  { testType: "e2e", brand: "bf", env: "qa", platform: "web", plan: "PRPI-592" },
  { testType: "e2e", brand: "bf", env: "nxt", platform: "web", plan: "PRPI-800" },
  { testType: "e2e", brand: "bf", env: "drk", platform: "web", plan: "PRPI-801" },
  { testType: "e2e", brand: "bf", env: "prd", platform: "web", plan: "PRPI-802" },

  { testType: "e2e", brand: "sbg", env: "qa", platform: "web", plan: "PRPI-705" },
  { testType: "e2e", brand: "sbg", env: "nxt", platform: "web", plan: "PRPI-803" },
  { testType: "e2e", brand: "sbg", env: "drk", platform: "web", plan: "PRPI-804" },
  { testType: "e2e", brand: "sbg", env: "prd", platform: "web", plan: "PRPI-805" },

  { testType: "e2e", brand: "ps", env: "nxt", platform: "web", plan: "PRPI-706" },
  { testType: "e2e", brand: "ps", env: "drk", platform: "web", plan: "PRPI-806" },
  { testType: "e2e", brand: "ps", env: "prd", platform: "web", plan: "PRPI-807" },

  //Web Regression
  { testType: "regression", brand: "bf", env: "qa", platform: "web", plan: "PRPI-5066" },
  { testType: "regression", brand: "bf", env: "nxt", platform: "web", plan: "PRPI-5067" },
  { testType: "regression", brand: "bf", env: "drk", platform: "web", plan: "PRPI-5068" },
  { testType: "regression", brand: "bf", env: "prd", platform: "web", plan: "PRPI-5069" },

  { testType: "regression", brand: "sbg", env: "qa", platform: "web", plan: "PRPI-5070" },
  { testType: "regression", brand: "sbg", env: "nxt", platform: "web", plan: "PRPI-5071" },
  { testType: "regression", brand: "sbg", env: "drk", platform: "web", plan: "PRPI-5072" },
  { testType: "regression", brand: "sbg", env: "prd", platform: "web", plan: "PRPI-5073" },

  //Web Visual
  { testType: "visual", brand: "bf", env: "qa", platform: "web", plan: "PRPI-1204" },
  { testType: "visual", brand: "bf", env: "nxt", platform: "web", plan: "PRPI-1205" },
  { testType: "visual", brand: "bf", env: "drk", platform: "web", plan: "PRPI-1206" },
  { testType: "visual", brand: "bf", env: "prd", platform: "web", plan: "PRPI-1207" },

  { testType: "visual", brand: "sbg", env: "qa", platform: "web", plan: "PRPI-1208" },
  { testType: "visual", brand: "sbg", env: "nxt", platform: "web", plan: "PRPI-1209" },
  { testType: "visual", brand: "sbg", env: "drk", platform: "web", plan: "PRPI-1210" },
  { testType: "visual", brand: "sbg", env: "prd", platform: "web", plan: "PRPI-1211" },

  // Native E2E android
  { testType: "e2e", brand: "bf", env: "qa", platform: "android", plan: "PRPI-875" },
  { testType: "e2e", brand: "bf", env: "nxt", platform: "android", plan: "PRPI-991" },
  { testType: "e2e", brand: "bf", env: "drk", platform: "android", plan: "PRPI-992" },
  { testType: "e2e", brand: "bf", env: "prd", platform: "android", plan: "PRPI-993" },

  { testType: "e2e", brand: "sbg", env: "qa", platform: "android", plan: "PRPI-994" },
  { testType: "e2e", brand: "sbg", env: "nxt", platform: "android", plan: "PRPI-995" },
  { testType: "e2e", brand: "sbg", env: "drk", platform: "android", plan: "PRPI-996" },
  { testType: "e2e", brand: "sbg", env: "prd", platform: "android", plan: "PRPI-997" },

  // Native Regression android
  { testType: "regression", brand: "bf", env: "mockserver", platform: "android", plan: "PRPI-1676" },

  // Native Visual android
  { testType: "visual", brand: "bf", env: "mockserver", platform: "android", plan: "PRPI-8859" },
  { testType: "visual", brand: "bf", env: "qa", platform: "android", plan: "PRPI-4972" },
  { testType: "visual", brand: "bf", env: "nxt", platform: "android", plan: "PRPI-4973" },
  { testType: "visual", brand: "bf", env: "drk", platform: "android", plan: "PRPI-4974" },
  { testType: "visual", brand: "bf", env: "prd", platform: "android", plan: "PRPI-4975" },

  // Native E2E ios
  { testType: "e2e", brand: "bf", env: "qa", platform: "ios", plan: "PRPI-1061" },
  { testType: "e2e", brand: "bf", env: "nxt", platform: "ios", plan: "PRPI-1062" },
  { testType: "e2e", brand: "bf", env: "drk", platform: "ios", plan: "PRPI-1063" },
  { testType: "e2e", brand: "bf", env: "prd", platform: "ios", plan: "PRPI-1064" },

  { testType: "e2e", brand: "sbg", env: "qa", platform: "ios", plan: "PRPI-1066" },
  { testType: "e2e", brand: "sbg", env: "nxt", platform: "ios", plan: "PRPI-1067" },
  { testType: "e2e", brand: "sbg", env: "drk", platform: "ios", plan: "PRPI-1068" },
  { testType: "e2e", brand: "sbg", env: "prd", platform: "ios", plan: "PRPI-1069" },

  // Native Visual ios
  { testType: "visual", brand: "bf", env: "mockserver", platform: "ios", plan: "PRPI-9992" },
  { testType: "visual", brand: "bf", env: "qa", platform: "ios", plan: "PRPI-4976" },
  { testType: "visual", brand: "bf", env: "nxt", platform: "ios", plan: "PRPI-4977" },
  { testType: "visual", brand: "bf", env: "drk", platform: "ios", plan: "PRPI-4978" },
  { testType: "visual", brand: "bf", env: "prd", platform: "ios", plan: "PRPI-4979" },
];

function normalize(v) {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-tests?$/, "");
}

function matches(rule, testType, brand, env, platform) {
  const t = normalize(testType);
  const b = normalize(brand);
  const e = normalize(env);
  const p = normalize(platform);

  return (
    normalize(rule.testType) === t &&
    normalize(rule.brand) === b &&
    normalize(rule.env) === e &&
    normalize(rule.platform) === p
  );
}

function resolveTestPlan(testType, brand, environment, platform = "web") {
  const p = platform ?? "web";
  const found = RULES.find((r) => matches(r, testType, brand, environment, p));
  return found?.plan ?? null;
}

module.exports = { resolveTestPlan };
