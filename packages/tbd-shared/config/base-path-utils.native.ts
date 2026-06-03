import { NativeModules } from "react-native";
import { jurisdictionToCountryCodeMap } from "@ppb/tbd-store/config/Jurisdiction";
import { SETTINGS_BUNDLE_KEYS } from "../helpers/storage.native";
import { createEnvironments, Environment, EnvironmentConfig } from "./environments.native";
import { initSettings, settingsConfig as settings } from "./settings-utils.native";
import appConfiguration, { AppConfigJson } from "./app-configuration.native";
import { setGeneratedHeaders } from "./headers.native";
import { createCookieParser } from "../helpers/parsers";
import { getAppContextFromBFF } from "@ppb/tbd-store/services/app-context-service";
import { buildAppContext } from "@ppb/tbd-store/clients/catalogue/app-context-builder";
import { buildEnvironmentForJurisdiction, getAppEnvironment } from "@ppb/tbd-store/helpers";
import { getEnvironmentCookieHandler } from "./env-cookies/handler.native";

const { LaunchArgumentsModule } = NativeModules;
const parseCookies = createCookieParser();

const DEFAULT_ENV_KEY = "Choose one";

/**
 * This method returns an object to the current environment with his respective baseEnv and path.
 *
 * @return object
 */
const getEnvironment = async (): Promise<EnvironmentConfig> => {
  const environments = await createEnvironments();

  const { TBDN_RELEASE_MODE, TBDN_DEFAULT_ENVIRONMENT } = appConfiguration.appConfig as AppConfigJson;

  // If it is production environment settings are not available
  if (TBDN_RELEASE_MODE === "production") {
    return environments.prd;
  }

  const [launchArgs] = await Promise.all([LaunchArgumentsModule.getLaunchArguments(), initSettings()]);

  if (launchArgs.custom_cookies) {
    settings[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES] = launchArgs.custom_cookies;
  }

  if (launchArgs.custom_environment) {
    settings[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT] = launchArgs.custom_environment;
    return {
      baseEnv: launchArgs.custom_environment as Environment,
      path: launchArgs.custom_environment,
    };
  }

  // arguments defined environment for e2e + mock tests
  if (launchArgs.environment && environments[launchArgs.environment]) {
    return environments[launchArgs.environment];
  }

  // Values defined by user on app settings
  const customAppEnv = settings[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT];

  // Validate customAppEnvironment is defined
  if (customAppEnv) {
    return {
      baseEnv: customAppEnv as Environment,
      path: customAppEnv,
    };
  }

  const appEnv = settings[SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT];
  // When the environment is the default which means the user did not select any environment in settings
  // Default Values - Android: Empty String, iOS: DEFAULT_ENV_KEY

  if (appEnv === "" || appEnv === DEFAULT_ENV_KEY) {
    return environments[TBDN_DEFAULT_ENVIRONMENT];
  }

  const appJurisdiction = settings[SETTINGS_BUNDLE_KEYS.APP_JURISDICTION];

  await setGeneratedHeaders(appEnv as Environment, appJurisdiction);

  if (appJurisdiction) {
    const countryCode = appJurisdiction === "INTERNATIONAL" ? "" : jurisdictionToCountryCodeMap[appJurisdiction];

    if (environments[`${appEnv}${countryCode}`]) {
      return environments[`${appEnv}${countryCode}`];
    }
  }

  // Return the selected environment
  return environments[appEnv];
};

let environment: EnvironmentConfig;

const BASE_CATALOGUE = "api/tbd/bff-gql/";

export const CATALOGUE_LATEST_PATH = `${BASE_CATALOGUE}latest/`;
export const APP_ENVIRONMENT_DEFAULT_PATH = "betting/env.json";

// This needs to be called so we initialise base path before using it on functions like "getBasePath()"
export const initEnvironment = async (): Promise<void> => {
  environment = await getEnvironment();

  if (settings[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]) {
    const cookies = parseCookies(settings[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]);
    const handler = getEnvironmentCookieHandler(settings[SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]);

    await handler.set(cookies);
  }
};

export const initAppContext = async () => {
  const basePath = getBasePath();
  const defaultBffEndpoint = `${basePath}${getCatalogueDefaultPath()}`;
  const defaultAppEnv = `${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`;

  const [response, appEnvironment] = await Promise.all([
    getAppContextFromBFF(defaultBffEndpoint),
    getAppEnvironment(defaultAppEnv),
  ]);

  const treatedEnvironment = buildEnvironmentForJurisdiction(
    appEnvironment,
    response.AppContext.userdetails.jurisdiction.jurisdiction,
  );

  return buildAppContext({ appContextResponse: response, environment: treatedEnvironment });
};

export const getBasePath = (): string => {
  if (!environment?.path) {
    throw new Error("initEnvironment() must be called first");
  }

  return environment.path;
};

export const getCatalogueDefaultPath = (): string =>
  `${BASE_CATALOGUE}${appConfiguration.appConfig?.TBDN_CATALOGUE_VERSION}/`;

export const getCurrentEnv = (): Environment => {
  if (!environment?.baseEnv) {
    throw new Error("initEnvironment() must be called first");
  }

  return environment.baseEnv;
};

export const getSafariSsoUrl = (url: string, token: string, environmentProduct: string, gamesNativePath: string) => {
  const returnUrl = url;

  // Encode the token
  const encodedToken = encodeURIComponent(token);

  if (encodedToken) {
    // Create URL object
    const basePath = returnUrl.includes("nxt") ? `${environmentProduct}.nxt.ppbdev.com` : environmentProduct;
    const urlComponents = new URL(`https://assets.${basePath}/${gamesNativePath}/sso/`);

    // Add query parameters
    urlComponents.searchParams.append("return", returnUrl);

    // Append the token as a fragment identifier
    const finalUrlString = `${urlComponents.toString()}#${encodedToken}`;

    try {
      // Create and return a new URL object
      return finalUrlString;
    } catch {
      return url; // Fallback to the original URL
    }
  }

  // Fallback to the original URL
  return url;
};

export const isCurrentEnv = (env: Environment): boolean => getCurrentEnv() === env;
