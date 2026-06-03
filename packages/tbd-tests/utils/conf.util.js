const availableConfigs = {
  sbg: ["prod", "drk", "qa", "nxt", "local"],
  bf: ["prod", "drk", "qa", "nxt", "local"],
  ps: ["prod", "drk", "nxt", "local"],
};

function getBrandEnv(env) {
  if (!env) {
    throw new Error("ENV_BRAND is not set.");
  }
  // Split the env variable into brand and environment (e.g., "bf" and "prod")
  const [environment, brand] = env.split(".");
  if (!availableConfigs[brand]) {
    throw new Error(`Unknown brand: ${brand}`);
  }

  if (!availableConfigs[brand].includes(environment)) {
    throw new Error(`Unknown environment: ${environment} for brand: ${brand}`);
  }
  return { brand, environment };
}

module.exports = {
  availableConfigs,
  getBrandEnv,
};
