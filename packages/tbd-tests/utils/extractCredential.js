const { extractJsonData } = require("./extractJsonData");

const credentialsFromVault = {
  ps: {
    prod: "specs/e2e/ps/config/prod/login-local.json",
    drk: "specs/e2e/ps/config/prod/login-local.json",
    nxt: "specs/e2e/ps/config/nxt/login-local.json",
  },
  sbg: {
    prod: "specs/e2e/sbg/config/prod/login-local.json",
    drk: "specs/e2e/sbg/config/prod/login-local.json",
    qa: "specs/e2e/sbg/config/prod/login-local.json",
    nxt: "specs/e2e/sbg/config/nxt/login-local.json",
  },
  bf: {
    prod: "specs/e2e/bf/config/prod/login-local.json",
    drk: "specs/e2e/bf/config/prod/login-local.json",
    qa: "specs/e2e/bf/config/prod/login-local.json",
    nxt: "specs/e2e/bf/config/nxt/login-local.json",
  },
};

function getDataFromEnvVariable(variable) {
  try {
    return JSON.parse(process.env[variable]);
  } catch (exception) {
    return null;
  }
}

const getLoginConfigFilePath = () => {
  const environment = process.env.ENVIRONMENT;
  const brand = process.env.BRAND;
  if (!environment) {
    throw new Error("ENVIRONMENT is not set.");
  }

  if (!credentialsFromVault[brand]) {
    throw new Error(`Unknown brand: ${brand}`);
  }

  if (!credentialsFromVault[brand][environment]) {
    throw new Error(`Unknown environment: ${environment} for brand: ${brand}`);
  }

  // Return the correct login file path
  return credentialsFromVault[brand][environment];
};

function extractUserAndPassword(key) {
  // Parse the JSON string into an object
  // TODO AC: single login data variable
  const data =
    getDataFromEnvVariable("WEB_TESTS_LOGIN_DATA") ||
    getDataFromEnvVariable("NATIVE_REGRESSION_TESTS_LOGIN_DATA") ||
    extractJsonData(getLoginConfigFilePath());
  // Check if the key exists in the data
  if (!data[key]) {
    throw new Error(`No data found for the key "${key}"`);
  }

  // Extract user and password for the specified key
  const { user, password } = data[key];

  // Return them separately
  if (!user || !password) {
    throw new Error(`User or password missing for "${key}"`);
  }

  return { user, password };
}

module.exports = {
  credentialsFromVault,
  extractUserAndPassword,
  getLoginConfigFilePath,
};
