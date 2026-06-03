#!/usr/bin/env node
const path = require("path");
const { setProperties } = require("./setProperties");

// Get cookie string passed to the script
const cookieString = process.argv[2];

if (cookieString === undefined) {
  throw new Error(
    '\n => No cookie string provided. Usage: yarn cookies "cookie1=value; cookie2=value" (or "" to clear)\n',
  );
}

// Path of current app.config file
const appConfigFilePath = path.join(process.cwd(), "app.config.json");

// Create object with cookie string
const configUpdate = {
  TBDN_INITIAL_COOKIES: cookieString,
};

// Call shared script to set property
setProperties(appConfigFilePath, JSON.stringify(configUpdate));
