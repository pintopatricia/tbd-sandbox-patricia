const { tickFakeClock, flushFakeClockTimers } = require("./commands/fake-timers-commands");
const addLogsToAllure = require("./commands/add-logs-to-allure");
const containsClass = require("./commands/contains-class");
const getViewportSize = require("./commands/get-viewport-size");
const waitUntilAttributeContains = require("./commands/wait-until-attribute-contains");
const waitUntilBrowserUrlContains = require("./commands/wait-until-browser-url-contains");
const waitUntilBrowserUrlNotContains = require("./commands/wait-until-browser-url-not-contains");
const waitUntilContainsClass = require("./commands/wait-until-contains-class");
const waitUntilDisplayed = require("./commands/wait-until-displayed");
const waitUntilEquals = require("./commands/wait-until-equals");
const waitUntilIframeReady = require("./commands/wait-until-iframe-ready");
const waitUntilInViewport = require("./commands/wait-until-in-viewport");
const waitUntilNotContainsClass = require("./commands/wait-until-not-contains-class");
const waitUntilNotDisplayed = require("./commands/wait-until-not-displayed");
const waitUntilNotInDOM = require("./commands/wait-until-not-in-dom");
const waitUntilNotInViewport = require("./commands/wait-until-not-in-viewport");
const waitUntilStopsMoving = require("./commands/wait-until-stops-moving");
const waitUntilImageEquals = require("./commands/wait-until-image-equals");
const waitUntilClickableNative = require("./commands/wait-until-clickable-native");
const waitUntilArrayLength = require("./commands/wait-until-array-length");
const waitUntilNotEmpty = require("./commands/wait-until-not-empty");
const waitUntilContainsText = require("./commands/wait-until-contains-text");
const waitUntilCookieEquals = require("./commands/wait-until-cookie-equals");
const waitUntilResult = require("./commands/wait-until-result");

module.exports = {
  addLogsToAllure,
  containsClass,
  getViewportSize,
  tickFakeClock,
  flushFakeClockTimers,
  waitUntilAttributeContains,
  waitUntilBrowserUrlContains,
  waitUntilBrowserUrlNotContains,
  waitUntilContainsClass,
  waitUntilDisplayed,
  waitUntilEquals,
  waitUntilIframeReady,
  waitUntilInViewport,
  waitUntilNotContainsClass,
  waitUntilNotDisplayed,
  waitUntilNotInDOM,
  waitUntilNotInViewport,
  waitUntilStopsMoving,
  waitUntilImageEquals,
  waitUntilClickableNative,
  waitUntilArrayLength,
  waitUntilNotEmpty,
  waitUntilContainsText,
  waitUntilCookieEquals,
  waitUntilResult,
};
