import { execSync } from "node:child_process";
import { HttpWebserverQueryParams } from "../@types/http-webserver-types";

const PRODUCT_REG_EX = /[?&]product=([^&#]*)/i;
const LOGIN_STATUS_REG_EX = /[?&]loginStatus=([^&#]*)/i;
const ENABLE_EXC_REG_EX = /[?&]exc=(true|false)/i;
const DESKTOP_REG_EX = /[?&]desktop=(true|false)/i;
const THROTTLES_ON_REGEX = /[?&]throttlesOn=([^&#]*)/i;
const THROTTLES_OFF_REGEX = /[?&]throttlesOff=([^&#]*)/i;
const DRK_REGEX = /[?&]drk=([^&#]*)/i;
const DEVTOOLS_REGEX = /[?&]devTools=([^&#]*)/i;
const CUSTOM_TOKENS_REGEX = /[?&]tokens=([^&#]*)/i;
const CUSTOM_BRAND_REGEX = /[?&]brand=([^&#]*)/i;
const CUSTOM_THEME_REGEX = /[?&]theme=([^&#]*)/i;

/**
 * Parse query parameters for product values
 */
export const getQueryParamsFromRequest = (requestUri: string): HttpWebserverQueryParams => {
  const [, product = ""] = PRODUCT_REG_EX.exec(requestUri) || [];
  const [, loginStatus = ""] = LOGIN_STATUS_REG_EX.exec(requestUri) || [];
  const [, exchangeEnabled = ""] = ENABLE_EXC_REG_EX.exec(requestUri) || [];
  const [, desktop = ""] = DESKTOP_REG_EX.exec(requestUri) || [];
  const [, throttlesOn = ""] = THROTTLES_ON_REGEX.exec(requestUri) || [];
  const [, throttlesOff = ""] = THROTTLES_OFF_REGEX.exec(requestUri) || [];
  const [, drk = ""] = DRK_REGEX.exec(requestUri) || [];
  const [, devTools = ""] = DEVTOOLS_REGEX.exec(requestUri) || [];
  let [, customTokens = ""] = CUSTOM_TOKENS_REGEX.exec(requestUri) || [];
  const [, customBrand = ""] = CUSTOM_BRAND_REGEX.exec(requestUri) || [];
  const [, customTheme = ""] = CUSTOM_THEME_REGEX.exec(requestUri) || [];

  if (customTokens === "latest") {
    // get the latest version of the tokens package from npm
    customTokens = execSync(
      "npm view @ppb/the-wall-design-tokens version --registry=http://artifactory-prd.prd.betfair/artifactory/api/npm/npm",
      { encoding: "utf-8" },
    ).trim();
  }

  return {
    product,
    loginStatus,
    exchangeEnabled,
    desktop,
    throttlesOn,
    throttlesOff,
    drk,
    devTools,
    customTokens,
    customBrand,
    customTheme,
  };
};
