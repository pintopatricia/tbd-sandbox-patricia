import { NativeModules, Platform } from "react-native";
import { ApiSession } from "@flutter-global/react-native-cet-framework";
import { CountryCode, countryCodeToTopLevelDomainMap, TopLevelDomain } from "@ppb/tbd-store/config/Jurisdiction";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { Brand } from "@ppb/tbd-store/config/Brand";
import config from "./app-configuration.native";

const { LaunchArgumentsModule } = NativeModules;

// remove this type as soon as CET exposes supported environments correctly
type ApiSessionCetEnvironment = NonNullable<ApiSession["environment"]>;

export enum Environment {
  mockserver = "mockserver",
  localhost = "localhost",
  nxt = "nxt",
  qaBRANCH = "qabranch",
  qaCMS = "qacms",
  qa = "qa",
  prf = "prf",
  prd = "prd",
  drk = "drk",
}

export const environments = Object.values(Environment);

export type EnvironmentConfig = {
  baseEnv: Environment;
  path: string;
};

export type EnvironmentsConfig = {
  [env: string]: EnvironmentConfig;
};

export const jurisdictions = Object.values(Jurisdiction);

const countryCodes = {
  BRAZIL: CountryCode.BRAZIL,
  ITALY: CountryCode.ITALY,
  ROMANIA: CountryCode.ROMANIA,
  SPAIN: CountryCode.SPAIN,
};

export async function getMockserverURL(): Promise<string> {
  const launchArgs: {
    MOCKHOST?: string;
    MOCKHOSTPORT?: string;
  } = await LaunchArgumentsModule.getLaunchArguments();

  const { MOCKHOST, MOCKHOSTPORT } = launchArgs;

  if (MOCKHOST === undefined || MOCKHOSTPORT === undefined) {
    return "http://localhost:1084/";
  }

  return `http://${MOCKHOST}:${MOCKHOSTPORT}/`;
}

const buildURLDomain = (environment: Environment, topLevelDomain?: TopLevelDomain): string | undefined => {
  // TODO refactor this to use loading url domain and become agnostic of brand
  if (config.appBrand === Brand.Skybet) {
    return "skybet.com";
  }

  // This is needed because most dev environment don't have the .net domain
  if (environment !== Environment.nxt && environment !== Environment.prd) {
    return `${config.appBrand}.${topLevelDomain}`;
  }

  return config.appConfig?.LOADING_URL.domain;
};

const buildEnvironmentURL = (environment: Environment, countryCode?: CountryCode): string => {
  const topLevelDomain = countryCode ? countryCodeToTopLevelDomainMap[countryCode] : TopLevelDomain.COM;

  if (environment === Environment.localhost) {
    // android emulator has its own localhost, and has set 10.0.2.2 to refer to the host machine localhost, by definition,
    // which is why this validation is needed. More information on this can be found here: https://developer.android.com/studio/run/emulator-networking.html
    return `https://${Platform.OS === "android" ? "10.0.2.2" : `localhost.betfair.${topLevelDomain}`}/`;
  }

  const domain = buildURLDomain(environment, topLevelDomain);
  const subdomain = config.appConfig?.LOADING_URL.subdomain;

  if (environment === Environment.prd) {
    return `https://${subdomain}.${domain}/`;
  }

  // While qaCMS does not have the ppbdev extension, we need to have this validation to avoid breaking the app on qaCMS
  if (environment === Environment.qaCMS) {
    return `https://${subdomain}.${environment}.${topLevelDomain}.${config.appBrand}/`;
  }

  return `https://${subdomain}.${domain}.${environment}.ppbdev.com/`;
};

export const resolveCETEnvironment = (env: Environment): ApiSessionCetEnvironment => {
  switch (env) {
    case Environment.mockserver:
      return Environment.localhost;
    case Environment.localhost:
      return Environment.nxt;
    default:
      return env;
  }
};

export async function createEnvironments(): Promise<EnvironmentsConfig> {
  const mockserver = await getMockserverURL();
  const environmentsConfig: EnvironmentsConfig = {};

  environments.forEach((environment) => {
    if (environment === Environment.mockserver) {
      environmentsConfig.mockserver = {
        baseEnv: environment,
        path: mockserver,
      };
      return;
    }

    if (environment === Environment.prd) {
      environmentsConfig.prd = {
        baseEnv: environment,
        path: buildEnvironmentURL(environment),
      };
      return;
    }

    // For International
    environmentsConfig[environment] = {
      baseEnv: environment,
      path: buildEnvironmentURL(environment),
    };

    Object.values(countryCodes).forEach((countryCode) => {
      environmentsConfig[`${environment}${countryCode}`] = {
        baseEnv: environment,
        path: buildEnvironmentURL(environment, countryCode),
      };
    });
  });

  return environmentsConfig;
}

export default createEnvironments;
