import { Endpoints } from "../state";

type EndpointsConfig = {
  [k in
    | keyof Omit<Endpoints, "APPLE_PAY_PROXY" | "GENERAL_TERMS_AND_COND" | "MY_ACCOUNT" | "PROMOS">
    | "CATALOGUE_LATEST"]: string;
};

type CustomHeaders = Record<string, string>;

type GenericClientOptions = {
  applicationKey: string;
  authorizationToken?: string;
  overrideUserAgent?: string;
  overrideCustomHeaders?: CustomHeaders;
};
type GenericClient = (endpoint: string, options: GenericClientOptions, overrideReferer?: string) => any;

let ENDPOINTS: EndpointsConfig;
let APP_KEY: string;
let APP_USER_AGENT: string | undefined;
let APP_REFERER: string | undefined;
let APP_CUSTOM_HEADERS: CustomHeaders;
let CBS_CHANNEL: string | undefined;
let AUTHORIZATION_TOKEN: string | undefined;

/**
 * Configure global HTTP client settings used by this module.
 *
 * This function updates module-level variables that are used when creating or performing HTTP
 * requests. It should typically be called once at application startup (or before any clients that
 * depend on these values are created).
 *
 * @param endpoints - Configuration object describing service endpoints (base URLs and/or route mappings).
 * @param applicationKey - Application key used to identify the client application.
 * @param overrideUserAgent - Optional string to override the default User-Agent header sent by HTTP clients.
 * @param overrideReferer - Optional string to override the Referer header sent by HTTP clients.
 * @param authorizationToken - Optional authorization token (e.g. ssoid cookie) that may be attached to requests.
 *
 * @example
 * // Typical usage at application startup:
 * setHTTPClientsConfig({ api: "https://api.example.com" }, "my-app-key", "MyApp/1.0", "example.com", "abc123");
 */
export function setHTTPClientsConfig(
  endpoints: EndpointsConfig,
  applicationKey: string,
  overrideUserAgent?: string,
  overrideReferer?: string,
  authorizationToken?: string,
): void {
  ENDPOINTS = endpoints;
  APP_KEY = applicationKey;
  APP_USER_AGENT = overrideUserAgent;
  APP_REFERER = overrideReferer;
  AUTHORIZATION_TOKEN = authorizationToken;
}

export function setUserAgentClientsConfig(overrideUserAgent: string): void {
  APP_USER_AGENT = overrideUserAgent;
}

export function setAppCustomHeaders(overrideCustomHeaders: CustomHeaders): void {
  APP_CUSTOM_HEADERS = overrideCustomHeaders;
  // eslint-disable-next-line no-console
  console.log("Headers being applied:", APP_CUSTOM_HEADERS);
}

type HttpClientsConfig = {
  ENDPOINTS: typeof ENDPOINTS;
  APP_KEY: typeof APP_KEY;
  APP_USER_AGENT: typeof APP_USER_AGENT;
};

export function getHttpClientsConfig(): HttpClientsConfig {
  return {
    ENDPOINTS,
    APP_KEY,
    APP_USER_AGENT,
  };
}

export function setApplicationKey(applicationKey: string): void {
  APP_KEY = applicationKey;
}

export function setCBSChannelConfig(cbsChannel?: string): void {
  if (cbsChannel) {
    CBS_CHANNEL = cbsChannel;
  }
}

export function getCBSChannelConfig(): string | undefined {
  return CBS_CHANNEL;
}

export function createClientFactory<T extends GenericClient>(
  client: T,
  defaultBasePath?: string,
): (tla: keyof EndpointsConfig) => ReturnType<T> {
  let singleton: ReturnType<T>;

  return (tla) => {
    const endpoint = ENDPOINTS?.[tla];
    const applicationKey = APP_KEY;
    const authorizationToken = AUTHORIZATION_TOKEN;
    const overrideUserAgent = APP_USER_AGENT;
    const overrideReferer = APP_REFERER;
    const overrideCustomHeaders = APP_CUSTOM_HEADERS;

    if (!singleton) {
      singleton = client(
        `${endpoint?.toString() || defaultBasePath}`,
        {
          applicationKey,
          authorizationToken,
          overrideUserAgent,
          overrideCustomHeaders,
        },
        overrideReferer,
      );
    }

    return singleton;
  };
}
