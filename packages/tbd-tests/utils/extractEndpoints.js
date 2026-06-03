const { extractJsonData } = require("./extractJsonData");

const environment = {
  ps: {
    prod: "specs/e2e/ps/config/prod/endpoints.json",
    nxt: "specs/e2e/ps/config/nxt/endpoints.json",
    drk: "specs/e2e/ps/config/prod/endpoints.json",
  },
  sbg: {
    prod: "specs/e2e/sbg/config/prod/endpoints.json",
    nxt: "specs/e2e/sbg/config/nxt/endpoints.json",
    qa: "specs/e2e/sbg/config/prod/endpoints.json",
    drk: "specs/e2e/sbg/config/prod/endpoints.json",
  },
  bf: {
    prod: "specs/e2e/bf/config/prod/endpoints.json",
    nxt: "specs/e2e/bf/config/nxt/endpoints.json",
    qa: "specs/e2e/bf/config/prod/endpoints.json",
    drk: "specs/e2e/bf/config/prod/endpoints.json",
  },
};

const extractEndpoints = () => extractJsonData(environment[process.env.BRAND][process.env.ENVIRONMENT]);

module.exports = {
  extractEndpoints,
  environment,
};
