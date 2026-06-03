import { EnvironmentConfig, EnvironmentJSON, RefreshRates, RegistrationData } from "../state";
import { Jurisdiction as JurisdictionValues } from "../state/constants";
import { Jurisdiction } from "../config/Jurisdiction";

export function isValidJurisdiction(jurisdiction: string): jurisdiction is Jurisdiction {
  return Object.values(JurisdictionValues).toString().includes(jurisdiction);
}

export function replaceDomainPlaceholders(environment: string, domainExtension: string, domain: string): string {
  return environment.replace(/{domain_extension}/g, domainExtension).replace(/{domain}/g, domain);
}

export function buildEnvironmentForJurisdiction(
  environment: EnvironmentJSON,
  jurisdictionStr: string,
  domain = "",
): EnvironmentJSON {
  const domainExtension = isValidJurisdiction(jurisdictionStr)
    ? environment.DOMAIN_EXTENSIONS[jurisdictionStr]
    : environment.DOMAIN_EXTENSIONS.INTERNATIONAL;

  return JSON.parse(replaceDomainPlaceholders(JSON.stringify(environment), domainExtension, domain));
}

export function buildAppConfigEnvironment(
  environment: EnvironmentJSON,
  registrationData: RegistrationData | null,
  refreshRates: RefreshRates | null,
): EnvironmentConfig {
  const {
    ENV,
    BASE_PATH,
    ASSETS,
    ENDPOINTS,
    ADOBE_SDK,
    SSO_URL,
    JOIN_FALLBACK_URL,
    CLOUDFLARE_WHITELIST_DOMAINS,
    REN_USER_AGENTS,
    DESKTOP_HEADER_CONFIG,
    BETSLIP_CONFIG,
    LOOP_CLIENT_CONFIG,
    HOST,
    HOMEPAGE_PATHS,
    EXTERNAL_LINKS,
    GEO_COMPLY_SCRIPT,
    SG_TIME_ALERTS_SCRIPT,
    GTM,
    REFRESH_STALE_TIMEOUTS,
    PRODUCT_CLUSTER,
  } = environment;

  return {
    ENV,
    BASE_PATH,
    HOST,
    HOMEPAGE_PATHS,
    PRODUCT_CLUSTER,
    ASSETS: {
      HOST: ASSETS.HOST,
      BASE_PATH: ASSETS.PATH,
    },
    CLOUDFLARE_WHITELIST_DOMAINS,
    ENDPOINTS,
    ADOBE_SDK,
    REFRESH_RATES: refreshRates,
    AUTH_DATA: {
      SSO_URL,
      JOIN_DATA: registrationData || { joinNowLabel: undefined, joinNowLink: JOIN_FALLBACK_URL },
    },
    REN_USER_AGENTS,
    DESKTOP_HEADER_CONFIG,
    BETSLIP_CONFIG,
    LOOP_CLIENT_CONFIG,
    EXTERNAL_LINKS,
    GEO_COMPLY_SCRIPT,
    SG_TIME_ALERTS_SCRIPT,
    GTM,
    REFRESH_STALE_TIMEOUTS,
  };
}

export async function getAppEnvironment(endpoint: string, buildNumber = "default"): Promise<EnvironmentJSON> {
  const url = new URL(endpoint);
  url.searchParams.set("version", buildNumber);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`App Environment responded with an error\nStatus: ${response.status}`);
  }
  return response.json();
}
