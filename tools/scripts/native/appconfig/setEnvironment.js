#!/usr/bin/env node
const path = require("path");
const { setProperties } = require("./setProperties");

/*
  The Environment is used to distinguish different application environments.
  drk        -> International Dark environment
  drkES      -> Force Spanish Dark environment
  drkIT      -> Force Italian Dark environment
  localhost  -> Use localhost as environment
  mockserver -> Use mockserver as environment
  nxt        -> International NXT environment
  nxtES      -> Force Spanish NXT environment
  nxtIT      -> Force Italian NXT environment
  prf        -> PRF environment
  prd        -> Production environment
  qa         -> International QA environment
  qaBRANCH   -> Branch specific environment
  qaCMS      -> QA environment with dev CMS
  qaES       -> Force Spanish QA environment
  qaIT       -> Force Italian QA environment
*/
const validEnvironments = [
  "drk",
  "drkES",
  "drkIT",
  "localhost",
  "mockserver",
  "nxt",
  "nxtES",
  "nxtIT",
  "prf",
  "prd",
  "qa",
  "qaBRANCH",
  "qaCMS",
  "qaES",
  "qaIT",
];

// Get value passed to the script
const environmentValue = process.argv[2];

// Validate parameter
if (!validEnvironments.includes(environmentValue)) {
  throw new Error(`\n => Unknown environment specified [${environmentValue}]\n`);
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create json with environment string passed to the script
const environment = {
  TBDN_DEFAULT_ENVIRONMENT: environmentValue,
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(environment));
