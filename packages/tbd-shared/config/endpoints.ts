import {
  Endpoints,
  EndpointConfiguration,
  EndpointsConfig,
  AuthData,
  AdobeSdkConfig,
  DesktopHeaderConfig,
  ExternalLinksConfig,
  BetslipConfig,
  LoopClientConfig,
} from "@ppb/tbd-store/state/initial-state/Environment.types";
import { setHTTPClientsConfig, setCBSChannelConfig } from "@ppb/tbd-store/services/client-factory";

let ENDPOINTS: EndpointsConfig;
let BASE_PATH: string;
let AUTH_DATA: AuthData | undefined;
let ADOBE_SDK: AdobeSdkConfig | undefined;
let DESKTOP_HEADER_CONFIG: DesktopHeaderConfig;
let BETSLIP_CONFIG: BetslipConfig | undefined;
let PRODUCT_ID: string;
let LOOP_CLIENT_CONFIG: LoopClientConfig | undefined;
let ENV: string;
let EXTERNAL_LINKS: ExternalLinksConfig;
let HOST: string;
let HOMEPAGE_PATHS: string | null;

export function setEndpoints(newEndpoints: EndpointsConfig): void {
  ENDPOINTS = newEndpoints;
}

export function getEndpoint(tla: keyof EndpointsConfig): string {
  if (!ENDPOINTS || !ENDPOINTS[tla]) {
    throw new Error(`No endpoint configuration available for ${tla}`);
  }

  return ENDPOINTS[tla];
}

function setBasePath(newBasePath: string): void {
  BASE_PATH = newBasePath;
}

export function getBasePath(): string {
  if (!BASE_PATH) {
    throw new Error("No base path available");
  }

  return BASE_PATH;
}

/**
 * Set the Auth Data needed for both login and registration
 *
 * @param authDataConfig
 */
export function setAuthData(authDataConfig: AuthData): void {
  AUTH_DATA = authDataConfig;
}

/**
 * Retrieves the Auth Data needed for both login and registration
 *
 * @returns The AuthData
 */
export function getAuthData(): AuthData | undefined {
  return AUTH_DATA;
}

function buildEndpointURL(endpointConfig: EndpointConfiguration, basePath: string): string {
  const host = endpointConfig.host || basePath;
  return new URL(endpointConfig.path, host).toString();
}

/**
 * Transform the endpoint config into an key/value object with
 * all endpoints. Also adds versioning to CATALOGUE endpoint
 *
 * @param endpoints The base endpoint config
 * @param basePath The base path to contruct valid URLs
 * @param catalogueVersion The catalogue version that we are building against
 *
 * @returns A valid endpoint configuration to be stored
 */
export function buildEndpoints(endpoints: Endpoints, basePath: string, catalogueVersion?: string): EndpointsConfig {
  const result = Object.entries(endpoints).reduce<EndpointsConfig>(
    (acc, [endpointTLA, endpointPath]) => ({
      ...acc,
      [endpointTLA]:
        typeof endpointPath === "string"
          ? endpointPath
          : buildEndpointURL(endpointPath as EndpointConfiguration, basePath),
    }),
    {} as EndpointsConfig,
  );

  // Add latest CATALOGUE api/tbd/bff-gql/latest/
  result.CATALOGUE_LATEST = `${result.CATALOGUE}latest/`;

  // Add versioning to CATALOGUE endpoint (e.g. api/tbd/bff-gql/v2/)
  if (catalogueVersion) {
    result.CATALOGUE = `${result.CATALOGUE}${catalogueVersion}/`;
  }

  return result;
}

export function setAdobeSdkConfig(adobeSdkConfig?: AdobeSdkConfig): void {
  ADOBE_SDK = adobeSdkConfig;
}

export function getAdobeSdkConfig(): AdobeSdkConfig | undefined {
  return ADOBE_SDK;
}

export function setDesktopHeaderConfig(desktopHeaderConfig: DesktopHeaderConfig): void {
  DESKTOP_HEADER_CONFIG = desktopHeaderConfig;
}

export function getDesktopHeaderConfig(): DesktopHeaderConfig {
  return DESKTOP_HEADER_CONFIG;
}

export function setBetslipConfig(betslipConfig: BetslipConfig | undefined): void {
  BETSLIP_CONFIG = betslipConfig;
}

export function getBetslipConfig(): BetslipConfig | undefined {
  return BETSLIP_CONFIG;
}

export function setExternalLinks(externalLinks: ExternalLinksConfig): void {
  EXTERNAL_LINKS = externalLinks;
}

export function getExternalLinks(): ExternalLinksConfig | undefined {
  return EXTERNAL_LINKS;
}

export function setProdIdConfig(prodId: string): void {
  PRODUCT_ID = prodId;
}

export function getProdIdConfig(): string {
  return PRODUCT_ID;
}

export function setLoopClientConfig(config: LoopClientConfig | undefined): void {
  LOOP_CLIENT_CONFIG = config;
}

export function getLoopClientConfig(): LoopClientConfig | undefined {
  return LOOP_CLIENT_CONFIG;
}

export function setEnv(env: string): void {
  ENV = env;
}

export function getEnv(): string {
  return ENV;
}

export function setHost(host: string): void {
  HOST = host;
}

export function getHost(): string {
  return HOST;
}

export function setHomepagePaths(homepagePaths: string | null): void {
  HOMEPAGE_PATHS = homepagePaths;
}

export function getHomepagePaths(): string | null {
  return HOMEPAGE_PATHS;
}

export function setEndpointsConfig({
  endpoints,
  basePath,
  applicationKey,
  authURLs,
  overrideUserAgent,
  overrideReferer,
  cbsChannel,
  authorizationToken,
}: {
  endpoints: EndpointsConfig;
  basePath: string;
  applicationKey: string;
  authURLs: AuthData;
  overrideUserAgent?: string;
  overrideReferer?: string;
  cbsChannel?: string;
  authorizationToken?: string;
}): void {
  setEndpoints(endpoints);
  setAuthData(authURLs);
  setBasePath(basePath);
  setHTTPClientsConfig(endpoints, applicationKey, overrideUserAgent, overrideReferer, authorizationToken);
  setCBSChannelConfig(cbsChannel);
}
