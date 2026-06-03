#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

// read the content of the environment json file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// read the content of the current app config file
const appConfigContent = JSON.parse(fs.readFileSync(appConfigFilePath, "utf8"));

if (process.argv[2] === "iOS") {
  // Obtain the props passed to the script and replace the '-' with spaces on deviceName prop.
  const deviceNameiOS = process.argv[3].replace("-", " ");
  const platformVersioniOS = process.argv[4];
  // update the key value
  appConfigContent.TBDN_IOS_DEVICE_NAME = deviceNameiOS;
  appConfigContent.TBDN_IOS_PLATFORM_VERSION = platformVersioniOS;
} else {
  // it is necessary to have the underscores so then it can be matched to run the tests
  const deviceNameAndroid = process.argv[3];

  // update the value. For Android, we do not need the platform version setting
  appConfigContent.TBDN_ANDROID_DEVICE_NAME = deviceNameAndroid;
}

// update the current app.config file
fs.writeFileSync(appConfigFilePath, JSON.stringify(appConfigContent, undefined, 2));
