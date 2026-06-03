#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { setProperties } = require("./setProperties");

/*
  The loading url subdomain used for the initial requests
  apitbdn-store  -> Betfair International PlayStore
  apitbdn        -> All other destinations
*/
const validSubdomains = ["apitbdn", "apitbdn-store"];

// Get value passed to the script
const subdomainValue = process.argv[2];

// Validate parameter
if (!validSubdomains.includes(subdomainValue)) {
  throw new Error(`\n => Unknown loading subdomain specified [${subdomainValue}]\n`);
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create json with the loading url subdomain string passed to the script
const environment = {
  LOADING_URL: {
    subdomain: subdomainValue,
  },
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(environment));
