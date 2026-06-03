import type { HeaderService } from "../@types/HeaderService";
import { HttpWebserverQueryParams } from "../@types/http-webserver-types";
import { Log } from "../@types/Log";

function getUserAgent($headers: HeaderService, $log: Log): string | null {
  const userAgent = $headers.getHeader("User-Agent");

  if (!userAgent || typeof userAgent !== "string" || userAgent.length > 600) {
    $log.error(`Invalid user agent: ${userAgent}`);
    return null;
  }

  return userAgent;
}

function isDesktopUiVariant($headers: HeaderService, queryParams: HttpWebserverQueryParams): boolean {
  return $headers.getHeader("X-TBD-DESKTOP")?.toLowerCase() === "true" || queryParams.desktop === "true";
}

type WrapperContext = {
  wrapperName: "GamingWrapper" | "DesktopWrapper";
  bridgeAPIVersion?: string;
};
/**
 * Asserts the UA to make sure it meets the data structure coming from both Gaming  native apps and Spade desktop client.
 * - For Gaming, the UA is expected to contain the "GamingWrapper" substring, and to have "BridgeAPIVersion/" followed by a semantic version such as 1.0.0
 * - For Spage, the UA is expected to contain the "PSBrowserEmbedded" substring
 */
function getWrapperContext(userAgent: string, $log: Log): WrapperContext | null {
  // check if it is a user agent coming from UKI Gaming native apps
  if (userAgent.includes("GamingWrapper")) {
    // and if it specifies the "the-bridge" API version
    const gamingWrapperRegexPattern = /^.*BridgeAPIVersion\/(?<bridgeAPIVersion>\d+\.\d+\.\d+).*$/;
    const match = gamingWrapperRegexPattern.exec(userAgent);

    if (!match) {
      $log.error(`Invalid user agent format for wrapper context: ${userAgent}`);
      return null;
    }

    const { bridgeAPIVersion } = match.groups || {}; // extract only the regex groups we're interested in (by index)
    return {
      wrapperName: "GamingWrapper",
      bridgeAPIVersion,
    };
  }

  if (userAgent.includes("PSBrowserEmbedded")) {
    return {
      wrapperName: "DesktopWrapper",
    };
  }

  return null;
}

type Platform = "ios" | "android" | "web";
type UiVariant = "desktop" | "mobile";

export type ClientContext = { platform: Platform; uiVariant: UiVariant; wrapper: WrapperContext | null };

export function getClientContext(
  $headers: HeaderService,
  $log: Log,
  queryParams: HttpWebserverQueryParams,
): ClientContext {
  const userAgent = getUserAgent($headers, $log);

  // fallback in case we fail to identify the user agent
  if (!userAgent) {
    return {
      platform: "web",
      uiVariant: "mobile",
      wrapper: null,
    };
  }

  let platform: Platform = "web";
  let uiVariant: UiVariant = "desktop";

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    platform = "ios";
    uiVariant = "mobile";
  } else if (/android/i.test(userAgent)) {
    platform = "android";
    uiVariant = "mobile";
  } else {
    uiVariant = isDesktopUiVariant($headers, queryParams) ? "desktop" : "mobile";
  }

  // check if we're running in one of the known wrapper apps (gaming native apps or spade's desktop app)
  const wrapperContext = getWrapperContext(userAgent, $log);

  return { platform, uiVariant, wrapper: wrapperContext };
}
