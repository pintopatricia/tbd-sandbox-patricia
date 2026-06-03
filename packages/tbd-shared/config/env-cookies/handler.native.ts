import { jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { Platform } from "react-native";
import { writer as androidEnvCookieWriter } from "./writer.android.native";
import { writer as iosEnvCookieWriter } from "./writer.ios.native";
import { CookieWriterFactory } from "./env-cookies.types";

/*
 * Returns a cookie writer by platform
 * Supports Android & iOS writers.
 */
const getCookieHandlerFactory = (platform: Platform["OS"]): CookieWriterFactory | null => {
  if (platform === "ios") {
    return iosEnvCookieWriter;
  }

  if (platform === "android") {
    return androidEnvCookieWriter;
  }

  return null;
};

/*
 * Used to set cookies based on the environment on the correct domains
 * This tool should be used only for development purposes (as it is at the date of this comment)
 * Since it sets cookies for all our domains for all jurisdictions
 * This can be used in production context only if this is refactored to accept correct configured domains for a brand
 */
export const getEnvironmentCookieHandler = (env: string): ReturnType<CookieWriterFactory> => {
  const getDomainsCookieHandler = getCookieHandlerFactory(Platform.OS);

  if (!getDomainsCookieHandler) {
    return {
      set: async () => false,
      clear: async () => false,
    };
  }

  switch (env) {
    case "localhost": {
      return getDomainsCookieHandler(["localhost.betfair.com", "localhost.skybet.com", "10.0.2.2"]);
    }
    case "prf":
    case "nxt":
    case "drk":
    case "qa":
    case "qabranch":
    case "qacms": {
      return getDomainsCookieHandler([".com.skybet", ".com.betfair", ".ppbdev.com"]);
    }
    case "prd": {
      const jurisdictionalDomains = Object.values(jurisdictionToTopLevelDomainMap);
      const topLevelDomains = Array.from(new Set([...jurisdictionalDomains, "net"]));
      const allBetfairDomains = topLevelDomains.map((tld) => `.betfair.${tld}`);
      const allSkyBetDomains = topLevelDomains.map((tld) => `.skybet.${tld}`);

      return getDomainsCookieHandler(allBetfairDomains.concat(allSkyBetDomains));
    }
    default: {
      return {
        set: async () => {
          console.warn("No cookie handler defined for", env);
          return false;
        },
        clear: getDomainsCookieHandler([]).clear, // For clearing we do not specify domains, we clear all
      };
    }
  }
};
