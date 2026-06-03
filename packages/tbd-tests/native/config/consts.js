const {
  TBDN_ANDROID_DEVICE_NAME: TBDN_ANDROID_DEVICE_NAME_BETFAIR,
  TBDN_IOS_DEVICE_NAME: TBDN_IOS_DEVICE_NAME_BETFAIR,
  TBDN_IOS_PLATFORM_VERSION: TBDN_IOS_PLATFORM_VERSION_BETFAIR,
} = require("../../../../apps/bf/native/app.config.json");
const {
  TBDN_ANDROID_DEVICE_NAME: TBDN_ANDROID_DEVICE_NAME_SBG,
  TBDN_IOS_DEVICE_NAME: TBDN_IOS_DEVICE_NAME_SBG,
  TBDN_IOS_PLATFORM_VERSION: TBDN_IOS_PLATFORM_VERSION_SBG,
} = require("../../../../apps/sbg/native/app.config.json");

const WAIT_FOR_TIMEOUT = 120000; // 2 min
exports.WAIT_FOR_TIMEOUT = WAIT_FOR_TIMEOUT;
exports.JASMINE_TIMEOUT = WAIT_FOR_TIMEOUT * 2;
exports.CONNECTION_RETRY_TIMEOUT = 90000; // 1.5 min

exports.IE2_GRID_CONFIG = {
  hostname: "ie2-tbdalsg01-qa.qa.betfair",
  port: 4444,
  path: "/wd/hub/",
  protocol: "http",
};

exports.IE1_GRID_CONFIG = {
  hostname: "ie1-tbdalsg01-qa.qa.betfair",
  port: 4444,
  path: "/wd/hub/",
  protocol: "http",
};

exports.IE1_IOS_GRID_CONFIG = {
  hostname: "ie1-tbdlsg100-qa.qa.betfair",
  port: 4444,
  path: "/wd/hub/",
  protocol: "http",
};

exports.DEV_TIMEOUT = 3000 * 1000;

exports.BF_AVD = TBDN_ANDROID_DEVICE_NAME_BETFAIR || "Pixel_4_API_30";
exports.SBG_AVD = TBDN_ANDROID_DEVICE_NAME_SBG || "Pixel_4_API_30";

exports.BF_IOS_DEVICE_NAME = TBDN_IOS_DEVICE_NAME_BETFAIR || "iPhone 14";
exports.SBG_IOS_DEVICE_NAME = TBDN_IOS_DEVICE_NAME_SBG || "iPhone 14";

exports.BF_IOS_PLATFORM_VERSION = TBDN_IOS_PLATFORM_VERSION_BETFAIR || "26.2";
exports.SBG_IOS_PLATFORM_VERSION = TBDN_IOS_PLATFORM_VERSION_SBG || "26.2";

exports.REGEX_PORT_HOST = /0.0.0.0:(\d+)/;
