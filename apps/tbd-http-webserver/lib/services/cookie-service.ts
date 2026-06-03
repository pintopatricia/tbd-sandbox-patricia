import { URL } from "url";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import { FabricParams } from "../@types/FabricParams";
import { Cookie, CookieService } from "../@types/CookieService";
import { CookieCorrections } from "../helpers/phoenix-routing";
import { HeaderService } from "../@types/HeaderService";
import { UserContext } from "../@types/UserContext";
import marketingCookiesHelper from "../marketing-cookies-helper";
import sharedData from "../betfair-shared-data-cookie-helper";
import calculateRefererPartnerId from "./calculate-referer";

type EnvironmentCookieKey = "drk"; // possible environments, for now only drk is available

const ROOT_PATH = "/";

enum CookieNames {
  PHOENIX_ENABLED = "phoenixEnabled",
  TDB_DP = "tbd_dp",
  TBD_LVP = "tbd_lvp",
}

/**
 * Extract the domain from the host
 * Examples:
 *   - www-cms.betfair.com.qa.ppbdev.com -> .betfair.com.qa.ppbdev.com
 *   - www.betfair.com -> betfair.com
 *   - localhost.betfair.com:80 -> .betfair.com
 *   - www.nxt.com.betfair -> nxt.com.betfair
 *   - betfair.com -> betfair.com
 *   - http://www-cms.betfair.com.qa.ppbdev.com -> .betfair.com.qa.ppbdev.com
 *   - http://www.betfair.com -> betfair.com
 *   - http://betfair.com -> betfair.com
 *   - http://sports.pokerstars.com -> pokerstars.com
 *
 * @param requestHost the host
 */
const getDomain = (requestHost: string): string => {
  const domainMatches = requestHost.match(/(?:.*\/\/)?(?:www-cms|www|localhost|sports)?([a-zA-Z0-9-.]+)/);

  if (!domainMatches || !domainMatches[1]) {
    throw new Error("Invalid request host");
  }

  return domainMatches[1];
};

export function setEnvironmentCookie(
  $cookies: CookieService,
  $params: FabricParams,
  env: EnvironmentCookieKey,
  hash: string,
): void {
  const domain = getDomain($params.requestHost);

  $cookies.setCookie(env, hash, { domain, path: ROOT_PATH });
}

export function setPhoenixEnabledCookie($cookies: CookieService, $params: FabricParams, value: boolean): void {
  const domain = getDomain($params.requestHost);
  $cookies.setCookie(CookieNames.PHOENIX_ENABLED, String(value), { domain, path: ROOT_PATH });
}

export async function getCookiesToSet(
  $headers: HeaderService,
  $cookies: CookieService,
  $params: FabricParams,
  $userContext: UserContext,
  localeCode: string,
  router: RouterState,
): Promise<Cookie[]> {
  const domain = getDomain($params.requestHost);
  const refererHeader = $headers.getHeader("Referer");
  const refererRFRValue = calculateRefererPartnerId(refererHeader, router);
  const url = new URL(router.currentUrl || "", "https://www.betfair.com");
  const cookies: Cookie[] = [];

  // TBD uses locale for content; cookie consent uses language
  cookies.push({ name: "locale", value: localeCode, options: { domain, path: ROOT_PATH } });
  cookies.push({ name: "language", value: localeCode, options: { domain, path: ROOT_PATH } });

  const cookiesToSet = marketingCookiesHelper(url, domain, refererRFRValue);
  cookiesToSet.forEach((cookie) => {
    const { name, value, options } = cookie;

    options.encode = String;

    cookies.push({ name, value, options });
  });

  const currentBfsdCookie = $cookies.getCookie("bfsd");
  const { value, expires, changed: cookieValueChanged } = sharedData($userContext.loggedIn, currentBfsdCookie);

  if (cookieValueChanged && value) {
    cookies.push({
      name: "bfsd",
      value,
      options: {
        domain,
        encode: String,
        expires,
        path: ROOT_PATH,
      },
    });
  }

  return cookies;
}

export function setCookies($cookies: CookieService, cookies: Cookie[]): void {
  cookies.forEach(({ name, value, options }) => $cookies.setCookie(name, value, options));
}

export function buildProductPreferenceCookies($params: FabricParams, corrections: CookieCorrections | null): Cookie[] {
  if (!corrections) {
    return [];
  }

  const domain = getDomain($params.requestHost);
  const cookies: Cookie[] = [];

  if (corrections.tbd_dp) {
    cookies.push({ name: CookieNames.TDB_DP, value: corrections.tbd_dp, options: { domain, path: ROOT_PATH } });
  }
  if (corrections.tbd_lvp) {
    cookies.push({ name: CookieNames.TBD_LVP, value: corrections.tbd_lvp, options: { domain, path: ROOT_PATH } });
  }

  return cookies;
}
