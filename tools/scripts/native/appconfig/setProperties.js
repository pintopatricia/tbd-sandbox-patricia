#!/usr/bin/env node
const fs = require("fs");
const lodash = require("lodash");

const setProperties = (appConfigFilePath, overrideContent) => {
  // Open 'app.config.json' file and parse contents
  const appConfigContentJSON = JSON.parse(fs.readFileSync(appConfigFilePath, "utf8"));
  // Parse override content string to JSON
  const overrideContentJSON = JSON.parse(overrideContent);
  // Merge override content properties into existing config
  const updatedAppConfigContent = lodash.merge(appConfigContentJSON, overrideContentJSON);
  // Rewrite the current 'app.config.json' file
  fs.writeFileSync(appConfigFilePath, `${JSON.stringify(updatedAppConfigContent, undefined, 2)}\n`);
};

// Check if script is being called with parameters
if (process.argv.length >= 4) {
  // Load and validate 'app.config.json' file path
  const appConfigFilePath = process.argv[2];
  if (appConfigFilePath === "") {
    console.log("Could not find a path for the 'app.config.json' file to update.");

    console.log("Usage: 'node setProperties.js <path_to_app_config_json_file> <json_string_with_properties_to_set>'");
    process.exit(1);
  }

  // Load and validate json override content
  const overrideContent = process.argv[3];
  if (overrideContent === "") {
    console.log("Could not find string data for the json with the properties to set.");

    console.log("Usage: 'node setProperties.js <path_to_app_config_json_file> <json_string_with_properties_to_set>'");
    process.exit(2);
  }

  // Call function to apply change
  setProperties(appConfigFilePath, overrideContent);
}

module.exports = { setProperties };
