const fs = require("fs");
const path = require("path");

const RELATIVE_PATH_TO_LOCAL_LOGIN_DATA = "./login-local.json";
const ENV_VARIABLE_WITH_LOGIN_DATA = "WEB_REGRESSION_TESTS_LOGIN_DATA";

function getDataFromLocalConfigFile() {
  const localFilePath = path.resolve(__dirname, RELATIVE_PATH_TO_LOCAL_LOGIN_DATA);

  if (!fs.existsSync(localFilePath)) {
    return null;
  }

  const fileData = fs.readFileSync(localFilePath);

  try {
    return JSON.parse(fileData);
  } catch (exception) {
    return null;
  }
}

function getDataFromEnvVariable() {
  try {
    return JSON.parse(process.env[ENV_VARIABLE_WITH_LOGIN_DATA]);
  } catch (exception) {
    return null;
  }
}

module.exports = {
  getLoginData: (key) => {
    const data = getDataFromLocalConfigFile() || getDataFromEnvVariable();

    if (data === null) {
      throw new Error(
        "Unable to retrieve login data for regression tests. In local env you make sure you have generated the config files ('yarn generate-config-files' at root level). If you running in a jenkins job, vault failed to set the env variable or, the value in the vault is not an valid JSON object.",
      );
    }

    const { user, password } = data[key];

    if (!user || !password) {
      throw new Error(
        `It's seems that we cant't find an entry for "${key}" with username and password. Maybe missing yarn run generate-config-files at root level (for local env) or to update the VAULT path with the credentials?`,
      );
    }

    return { user, password };
  },
};
