export type InPlayOrNotInPlayRefreshRate = {
  inPlay: number;
  notInPlay: number;
};

export type RefreshRates = {
  ERO: number;
  SMP: number;
  WAS: number;
  LBR: number;
  SIB: number;
  SER: number;
  BLH: InPlayOrNotInPlayRefreshRate;
  BME: InPlayOrNotInPlayRefreshRate | null;
  SCA: {
    loggedIn: {
      default: InPlayOrNotInPlayRefreshRate;
    };
    loggedOut: {
      default: InPlayOrNotInPlayRefreshRate;
    };
  };
  COS: {
    loggedIn: {
      default: InPlayOrNotInPlayRefreshRate;
      7?: InPlayOrNotInPlayRefreshRate;
    };
    loggedOut: number;
  };
  JACKPOT_ZONE: number;
  MY_BETS: number;
  POPULAR_BETS: number;
  REFRESH_CARDS: number;
  POLLING_DEBOUNCE: number;
};

export type EndpointConfiguration = {
  host?: string;
  path: string;
};

export type Endpoints = {
  USER_ACTIVITY: EndpointConfiguration;
  APPLE_PAY_PROXY: string;
  GENERAL_TERMS_AND_COND?: string;
  BCE: EndpointConfiguration;
  CATALOGUE: EndpointConfiguration;
  CBS: EndpointConfiguration & { channel: string };
  COS_READONLY: EndpointConfiguration;
  COS_TRANSACTIONAL: EndpointConfiguration;
  DEPOSIT: EndpointConfiguration;
  ERO: EndpointConfiguration;
  ETX: EndpointConfiguration;
  EXCHANGE_SITE: EndpointConfiguration;
  FCQ: EndpointConfiguration;
  GAME_LAUNCHER: EndpointConfiguration;
  GAMING_SEARCH: EndpointConfiguration;
  HANDLE_BANNER_ACTION: EndpointConfiguration;
  LBR: EndpointConfiguration;
  SPANISH_DECREE_NOTIFICATION: EndpointConfiguration;
  LIVE_DEALER_EVENT_SOURCE: EndpointConfiguration;
  LIVE_DEALER_WS: EndpointConfiguration;
  KEEP_ALIVE?: EndpointConfiguration;
  LOGOUT: EndpointConfiguration;
  MY_ACCOUNT: string;
  NSS: EndpointConfiguration;
  OSG: EndpointConfiguration;
  PROMOTIONS_CDN: EndpointConfiguration;
  PMA_S3_PROMOTIONS_CDN: EndpointConfiguration;
  PROMOS: string;
  SCA: EndpointConfiguration;
  SCO: EndpointConfiguration;
  SER: EndpointConfiguration;
  SIB: EndpointConfiguration;
  SIB_LITE: EndpointConfiguration;
  SMD: EndpointConfiguration;
  SMP: EndpointConfiguration;
  SPB: EndpointConfiguration;
  SSC: EndpointConfiguration;
  SPEND_BUDGET: EndpointConfiguration;
  USP: EndpointConfiguration;
  WAS: EndpointConfiguration;
  WMS: EndpointConfiguration;
  XTSD: EndpointConfiguration;
  BLH: EndpointConfiguration;
  BME?: EndpointConfiguration;
  REDIRECT_TO_GAMING?: EndpointConfiguration;
  EGA: EndpointConfiguration;
  LPS: EndpointConfiguration;
};

export type EndpointsConfig = {
  [k in keyof Endpoints | "CATALOGUE_LATEST"]: string;
};

export type Catalog = {
  FILLED_CARDS_PER_CARD_GROUP: number;
  FILLED_CARDS_PER_VIEW: number;
  FILLED_CARDS_PER_LAZY_LOAD: number;
};

export type Assets = {
  DC: string;
  HOST: string;
  PATH: string;
  FONTS: Array<string>;
};

export type AssetsConfig = {
  HOST: string;
  BASE_PATH: string;
};

export type AppKeys = {
  IOS: string;
  ANDROID: string;
  WEB: string;
  DESKTOP: string;
  DESKTOP_WRAPPER?: string;
};

export type AppIdentifier = {
  product: string;
  product_id: string;
  app_key: string;
  cbs_channel: string;
};

export type AppIdentifiers = {
  IOS: AppIdentifier;
  ANDROID: AppIdentifier;
  WEB_MOBILE: AppIdentifier;
  WEB_DESKTOP: AppIdentifier;
  WRAPPER_DESKTOP?: AppIdentifier;
};

export enum AppKeyType {
  DESKTOP = "DESKTOP",
  MOBILE = "MOBILE",
}

type DomainExtensions = {
  BRAZIL: string;
  DENMARK: string;
  INTERNATIONAL: string;
  ITALY: string;
  ROMANIA: string;
  SPAIN: string;
};

export type JurisdictionUrlConfig = {
  defaultLocale: string;
  LOCALE_TO_BASE_HREF: Record<string, string>;
  BASE_HREF_TO_LOCALE: Record<string, string>;
};

export type CloudflareWhitelistDomains = string[];

export type RenUserAgents = {
  MOBILE: string;
  DESKTOP: string;
};

export type GTMConfig = {
  ID: string;
  DEBUG_KEYS: string;
};

export type ExternalLink =
  | "NINETY_MINUTE_RULE"
  | "SUPER_SUB"
  | "MAX_PAYOUT"
  | "ACCA_INSURANCE"
  | "MARKET_RULES_DISCOUNT_RATE"
  | "CASHOUT_SUSPENDED_WHY_IS_THIS"
  | "RULE4"
  | "DEAD_HEAT"
  | "OPTA_FOOTBALL_STATISTICS"
  | "SMART_APP_BANNER"
  | "SELF_EXCLUSION_SAFER_GAMBLING"
  | "SELF_EXCLUSION_SUPPORT"
  | "SKY_VEGAS"
  | "SKY_VEGAS_LIVE"
  | "SKY_CASINO"
  | "SKY_CASINO_LIVE"
  | "SKY_SPORTS"
  | "SAFER_GAMBLING_LOGGED_IN"
  | "SAFER_GAMBLING_LOGGED_OUT"
  | "SUPER_6"
  | "ITV7"
  | "SPORTING_LIFE"
  | "SKY_BINGO"
  | "SKY_POKER"
  | "LOYALTY_CLUB"
  | "EXC_FEEDBACK_URL";

type ExternalLinkJurisdictionConfig = Record<string, string | undefined>;

type ExternalLinkConfig = Record<string, ExternalLinkJurisdictionConfig | undefined>;

export type ExternalLinksConfig = {
  [key in ExternalLink]?: ExternalLinkConfig;
};

export type SignalfxInstrumentation = {
  visibility: boolean;
  connectivity: boolean;
};

// RAW CHEF CONFIG
export type EnvironmentJSON = {
  ENV: string;
  PRODUCT_ID?: string;
  APP_KEY?: string;
  PRODUCT_CLUSTER: "SBK" | "EXC";
  NEW_RELIC: boolean;
  SIGNALFX: boolean;
  SIGNALFX_SESSION_RECORDING: boolean;
  SIGNALFX_NAME: string;
  SIGNALFX_REALM: string;
  SIGNALFX_ENVIRONMENT: string;
  SIGNALFX_ACCESS_TOKEN: string;
  SIGNALFX_SAMPLE_RATIO?: number;
  SIGNALFX_INSTRUMENTATION?: SignalfxInstrumentation;
  SIGNALFX_DISABLE_BOTS?: boolean;
  SIGNALFX_DISABLE_AUTOMATION_FRAMEWORKS?: boolean;
  BASE_PATH: string;
  HOST: string;
  ASSETS: Assets;
  HOMEPAGE_PATHS: string | null;
  ENDPOINTS: Endpoints;
  APP_IDENTIFIERS: AppIdentifiers;
  EXPERIMENTATIONS_KEY: string;
  CATALOG: Catalog;
  REN_USER_AGENTS: RenUserAgents;
  SSO_URL: string;
  JOIN_FALLBACK_URL: string;
  DOMAIN_EXTENSIONS: DomainExtensions;
  JURISDICTION_URL_CONFIGS?: Record<string, JurisdictionUrlConfig>;
  CLOUDFLARE_WHITELIST_DOMAINS: CloudflareWhitelistDomains;
  DESKTOP_HEADER_CONFIG: DesktopHeaderConfig;
  BETSLIP_CONFIG?: BetslipConfig;
  LOOP_CLIENT_CONFIG?: LoopClientConfig;
  ADOBE_SDK?: AdobeSdkConfig;
  GTM: GTMConfig;
  EXTERNAL_LINKS?: ExternalLinksConfig;
  GEO_COMPLY_SCRIPT?: string;
  SG_TIME_ALERTS_SCRIPT?: string;
  REFRESH_STALE_TIMEOUTS?: Record<string, number>;
};

export type AuthData = {
  SSO_URL: string;
  JOIN_DATA: RegistrationData;
};

export type RegistrationData = {
  joinNowLabel: string | undefined;
  joinNowLink: string;
};

export type AdobeSdkConfig = {
  ADOBE_MARKETING_SERVER: string;
  ADOBE_TRACKING_SERVER: string;
};

// APP PROCESSED CHEF CONFIG
export type EnvironmentConfig = Pick<
  EnvironmentJSON,
  | "ENV"
  | "BASE_PATH"
  | "PRODUCT_ID"
  | "APP_KEY"
  | "PRODUCT_CLUSTER"
  | "HOST"
  | "HOMEPAGE_PATHS"
  | "ENDPOINTS"
  | "REN_USER_AGENTS"
  | "CLOUDFLARE_WHITELIST_DOMAINS"
  | "DESKTOP_HEADER_CONFIG"
  | "BETSLIP_CONFIG"
  | "LOOP_CLIENT_CONFIG"
  | "ADOBE_SDK"
  | "EXTERNAL_LINKS"
  | "GEO_COMPLY_SCRIPT"
  | "SG_TIME_ALERTS_SCRIPT"
  | "GTM"
  | "REFRESH_STALE_TIMEOUTS"
  | "LOOP_CLIENT_CONFIG"
> & {
  ASSETS: AssetsConfig;
  REFRESH_RATES: RefreshRates | null;
  AUTH_DATA: AuthData;
};

export type DesktopHeaderConfig = {
  authenticationConfiguration: {
    loginEndpoint: string;
    loginRedirectUrl: string;
    loginRedirectMethod: string;
    logoutEndpoint: string;
    logoutRedirectUrl: string;
    logoutRedirectMethod: string;
  };
  productDomain: string;
  clientConfiguration: {
    version: string;
    brand: string;
    product: string;
    channel: string;
    platform: string;
    selectedTab: string;
  };
  contentConfiguration: {
    headerType: string;
  };
};

export type BetslipConfig = {
  collapseStrategy?: string;
};

export type LoopClientConfig = {
  key?: string;
  brand?: string;
};
