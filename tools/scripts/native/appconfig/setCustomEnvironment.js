#!/usr/bin/env node
const path = require("path");
const { setProperties } = require("./setProperties");

// Get custom environment URL passed to the script
const customEnvUrl = process.argv[2];

if (customEnvUrl === undefined) {
  throw new Error(
    '\n => No custom environment URL provided. Usage: yarn customEnv "https://my-env.ppbdev.com" (or "" to clear)\n',
  );
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create object with custom environment property
const configUpdate = {
  TBDN_INITIAL_CUSTOM_ENVIRONMENT: customEnvUrl,
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(configUpdate));
