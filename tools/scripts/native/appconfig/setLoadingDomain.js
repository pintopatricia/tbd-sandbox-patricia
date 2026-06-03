#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { setProperties } = require("./setProperties");

/*
  The loading url domain used for the initial requests
  betfair.net     -> International Betfair
  betfair.bet.br  -> Brazil-specific Betfair
  skybet.com      -> UKI Skybet
*/
const validDomains = ["betfair.net", "betfair.bet.br", "skybet.com"];

// Get value passed to the script
const domainValue = process.argv[2];

// Validate parameter
if (!validDomains.includes(domainValue)) {
  throw new Error(`\n => Unknown loading domain specified [${domainValue}]\n`);
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create json with the loading url domain string passed to the script
const environment = {
  LOADING_URL: {
    domain: domainValue,
  },
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(environment));
