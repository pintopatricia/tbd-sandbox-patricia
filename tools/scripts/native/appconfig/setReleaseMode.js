#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { setProperties } = require("./setProperties");

/*
  The Release Mode is used to distinguish different types of releases.
  Release Mode = internal   -> Debug and InHouse
  Release Mode = production -> Staging and Release
*/
const validReleaseModes = ["internal", "production"];

// Get value passed to the script
const releaseModeValue = process.argv[2];

// Validate parameter
if (!validReleaseModes.includes(releaseModeValue)) {
  throw new Error(`\n => Unknown release mode specified [${releaseModeValue}]\n`);
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create json with releaseMode string passed to the script
const releaseMode = {
  TBDN_RELEASE_MODE: releaseModeValue,
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(releaseMode));
