import { Platform } from "react-native";
import CookieManager, { Cookie } from "@react-native-cookies/cookies";
import { getBasePath } from "../config/base-path-utils.native";

/**
 * Extract a cookie from the CookieManager
 *
 * @param name The cookie name
 * @returns The extracted cookie
 */
export const getCookie = async (name: string): Promise<string | null> => {
  const cookies = await CookieManager.get(new URL(getBasePath()).origin);

  return cookies[name]?.value;
};

/**
 * Set a cookie on the CookieManager
 *
 * @param name The cookie name
 * @param path The cookie path; if not passed, will be on current basePath
 * @returns
 */
export const setCookie = async (name: string, value: string, expires?: string): Promise<void> => {
  const cookie: Cookie = {
    name,
    value,
    expires,
  };

  const writeCookie = async (_cookie: Cookie): Promise<void> => {
    // regex for matching local environment hosts. IP address (e.g. 10.0.2.2) or localhost.betfair.com
    const localEnvRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^localhost.betfair.com$/;
    // regex for matching subdomain (*.qa.com.betfair)
    const subDomainRegex = /[^.]*/;
    const basePath = new URL(getBasePath());
    const isLocalEnv = basePath.hostname.match(localEnvRegex);
    const isAndroid = Platform.OS === "android";

    let domain = `.${basePath.hostname}`;
    if (isLocalEnv) {
      domain = isAndroid ? basePath.hostname : basePath.hostname.replace(subDomainRegex, "");
    }

    await CookieManager.set(basePath.origin, {
      ..._cookie,
      secure: !isLocalEnv,
      httpOnly: true,
      domain,
    });
  };

  await writeCookie(cookie);
};

// OneTrust cookies categories
// In this project we find the source of truth for cookie consent related stuff:
// https://gitlab.app.betfair/cookie-consent-management/cookie-consent-js/-/blob/master/src/constants/categories.ts.
export const CATEGORIES = {
  /**
   * Strictly necessary cookies and localStorage
   */
  STRICTLY_NECESSARY: "C0001",

  /**
   * Performance cookies and localStorage
   */
  PERFORMANCE: "C0002",

  /**
   * Functionality cookies and localStorage
   */
  FUNCTIONALITY: "C0003",

  /**
   * Marketing, Targeting and 3rd Party cookies and localStorage
   */
  MARKETING_TARGETING_3RD_PARTY: "C0004",
};
