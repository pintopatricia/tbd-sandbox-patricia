import { DeeplinkConfiguration } from "@ppb/tbd-router/native";
import { PayoutLimits } from "@ppb/tbd-store";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { HelpCenterUrlsProps } from "@ppb/the-wall-common/types/TerritoryBlocking.types";

export type EnvKeys = {
  dev: string;
  prod: string;
};

export type PlatformKeys = {
  android: string;
  ios: string;
};

export type LoadingUrl = {
  subdomain: string;
  domain: string;
};

export type PlatformEnvKeys = {
  ios: EnvKeys;
  android: EnvKeys;
};

export type BrandProjectKeys = {
  brand: string;
  project: string;
};

export type AdobeAppKeys = PlatformEnvKeys;

export type AppKeys = PlatformKeys;

export type QMKeys = PlatformKeys;

export type QualtricsKeys = BrandProjectKeys;

export type OneTrustKeys = PlatformEnvKeys;

export type AppConfigJson = {
  APP_KEYS: AppKeys;
  LOADING_URL: LoadingUrl;
  ADOBE_APP_KEYS: AdobeAppKeys;
  QM_KEYS: QMKeys;
  QUALTRICS_KEYS: QualtricsKeys;
  ONE_TRUST_KEYS: OneTrustKeys;
  FEEDBACK_WEBVIEW_URL: string;
  TBDN_DEFAULT_ENVIRONMENT: string;
  TBDN_INITIAL_COOKIES: string;
  TBDN_INITIAL_CUSTOM_ENVIRONMENT: string;
  TBDN_RELEASE_MODE: string;
  TBDN_IOS_DEVICE_NAME: string;
  TBDN_IOS_PLATFORM_VERSION: string;
  TBDN_CATALOGUE_VERSION: string;
};

export type ExternalAppsURLPattern = string;

export type AppConfigurationType = {
  appConfig: AppConfigJson | null;
  appName: string | null;
  appBrand: Brand | null;
  helpCenterUrls: HelpCenterUrlsProps | null;
  maxPayoutLimits: PayoutLimits;
  defaultJurisdiction: string | null;
  deeplinkConfiguration: DeeplinkConfiguration;
  externalAppsURLPattern: ExternalAppsURLPattern | null;
};

export class AppConfiguration {
  appConfig: AppConfigurationType["appConfig"] = null;

  appName: AppConfigurationType["appName"] = null;

  appBrand: AppConfigurationType["appBrand"] = null;

  deeplinkConfiguration: AppConfigurationType["deeplinkConfiguration"] = {
    subdomainPattern: "",
    subdomainWhitelistPattern: "",
    extractViewURLPattern: "",
    gameLaunchURLPattern: "",
    gameCollectionUrnPattern: "",
    cetLoginUrlPattern: "",
    newGameLaunchPattern: "",
  };

  helpCenterUrls: AppConfigurationType["helpCenterUrls"] = null;

  maxPayoutLimits: AppConfigurationType["maxPayoutLimits"] = {
    DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
  };

  defaultJurisdiction: AppConfigurationType["defaultJurisdiction"] = null;

  externalAppsURLPattern: AppConfigurationType["externalAppsURLPattern"] = null;

  setup(setupObject: AppConfigurationType) {
    setupObject.appConfig && this.setAppConfig(setupObject.appConfig);
    setupObject.appName && this.setAppName(setupObject.appName);
    setupObject.appBrand && this.setAppBrand(setupObject.appBrand);
    setupObject.helpCenterUrls && this.setHelpCenterUrls(setupObject.helpCenterUrls);
    setupObject.maxPayoutLimits && this.setMaxPayoutLimits(setupObject.maxPayoutLimits);
    setupObject.defaultJurisdiction && this.setDefaultJurisdiction(setupObject.defaultJurisdiction);
    setupObject.externalAppsURLPattern && this.setExternalAppsURLPattern(setupObject.externalAppsURLPattern);
  }

  setupDeeplinkConfiguration(setupObject: DeeplinkConfiguration) {
    this.deeplinkConfiguration = setupObject;
  }

  setAppConfig(appConfig: AppConfigurationType["appConfig"]) {
    this.appConfig = appConfig;
  }

  setAppName(appName: AppConfigurationType["appName"]) {
    this.appName = appName;
  }

  setAppBrand(appBrand: AppConfigurationType["appBrand"]) {
    this.appBrand = appBrand;
  }

  setHelpCenterUrls(helpCenterUrls: AppConfigurationType["helpCenterUrls"]) {
    this.helpCenterUrls = helpCenterUrls;
  }

  setMaxPayoutLimits(maxPayoutLimits: AppConfigurationType["maxPayoutLimits"]) {
    this.maxPayoutLimits = maxPayoutLimits;
  }

  setDefaultJurisdiction(defaultJurisdiction: AppConfigurationType["defaultJurisdiction"]) {
    this.defaultJurisdiction = defaultJurisdiction;
  }

  setExternalAppsURLPattern(externalAppsURLPattern: AppConfigurationType["externalAppsURLPattern"]) {
    this.externalAppsURLPattern = externalAppsURLPattern;
  }
}

const appConfiguration = new AppConfiguration();

export default appConfiguration;
