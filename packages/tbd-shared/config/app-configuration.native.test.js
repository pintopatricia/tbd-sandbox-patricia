import appConfiguration from "./app-configuration.native";

describe("AppConfiguration", () => {
  it("should setup AppConfiguration with initial values", () => {
    appConfiguration.setup({});

    expect(appConfiguration).toEqual({
      appConfig: null,
      appName: null,
      appBrand: null,
      helpCenterUrls: null,
      maxPayoutLimits: {
        DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
      },
      defaultJurisdiction: null,
      deeplinkConfiguration: {
        subdomainPattern: "",
        subdomainWhitelistPattern: "",
        extractViewURLPattern: "",
        gameLaunchURLPattern: "",
        gameCollectionUrnPattern: "",
        cetLoginUrlPattern: "",
        newGameLaunchPattern: "",
      },
      externalAppsURLPattern: null,
    });
  });

  it("should setup AppConfiguration with appConfig", () => {
    const appConfig = {
      appConfig: {
        APP_KEYS: {
          android: "android-key",
          ios: "ios-key",
        },
        ADOBE_APP_KEYS: {
          ios: {
            dev: "adobe-ios-dev-key",
            prod: "adobe-ios-prod-key",
          },
          android: {
            dev: "adobe-android-dev-key",
            prod: "adobe-android-prod-key",
          },
        },
        QM_KEYS: {
          android: "qm-android-key",
          ios: "qm-ios-key",
        },
        QUALTRICS_KEYS: {
          brand: "qualtrics-brand",
          project: "qualtrics-project",
        },
        NEW_RELIC_TOKENS: {
          android: "new-relic-android-token",
          ios: "new-relic-ios-token",
        },
        NEW_RELIC_CONFIGURATION: {
          analyticsEventEnabled: true,
          crashReportingEnabled: true,
          nativeCrashReportingEnabled: false,
          interactionTracingEnabled: false,
          networkRequestEnabled: true,
          networkErrorRequestEnabled: true,
          httpRequestBodyCaptureEnabled: true,
          loggingEnabled: true,
          webViewInstrumentation: true,
        },
        ONE_TRUST_KEYS: {
          ios: {
            dev: "ot-ios-dev-key",
            prod: "ot-ios-prod-key",
          },
          android: {
            dev: "ot-android-dev-key",
            prod: "ot-android-prod-key",
          },
        },
        FEEDBACK_WEBVIEW_URL: "https://tbdassets.betfair.net",
        TBDN_DEFAULT_ENVIRONMENT: "qa",
        TBDN_RELEASE_MODE: "internal",
        TBDN_IOS_DEVICE_NAME: "iPhone 14",
        TBDN_IOS_PLATFORM_VERSION: "26.2",
        TBDN_CATALOGUE_VERSION: "v10",
      },
    };
    appConfiguration.setup({ appConfig });

    expect(appConfiguration.appConfig).toEqual(appConfig);
  });

  it("should setup AppConfiguration with appName", () => {
    const appName = "app-name";

    appConfiguration.setup({ appName });

    expect(appConfiguration.appName).toEqual(appName);
  });

  it("should setup AppConfiguration with appBrand", () => {
    const appBrand = "brand";

    appConfiguration.setup({ appBrand });

    expect(appConfiguration.appBrand).toEqual(appBrand);
  });

  it("should setup AppConfiguration with deeplinkConfiguration", () => {
    const deeplinkConfiguration = {
      subdomainPattern: "subdomainPattern",
      subdomainWhitelistPattern: "subdomainWhitelistPattern",
      extractViewURLPattern: "extractViewURLPattern",
      gameLaunchURLPattern: "gameLaunchURLPattern",
      cetLoginUrlPattern: "cetLoginUrlPattern",
      newGameLaunchPattern: "newGameLaunchPattern",
    };

    appConfiguration.setupDeeplinkConfiguration(deeplinkConfiguration);

    expect(appConfiguration.deeplinkConfiguration).toEqual(deeplinkConfiguration);
  });

  it("should setup AppConfiguration with helpCenterUrls", () => {
    const helpCenterUrls = {
      pt: "https://support.betfair.com/pt/app/home",
    };

    appConfiguration.setup({ helpCenterUrls });

    expect(appConfiguration.helpCenterUrls).toEqual(helpCenterUrls);
  });

  it("should setup AppConfiguration with maxPayoutLimits", () => {
    const maxPayoutLimits = {
      GBP: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.GBP500000" },
    };

    appConfiguration.setup({ maxPayoutLimits });

    expect(appConfiguration.maxPayoutLimits).toEqual(maxPayoutLimits);
  });

  it("should setup AppConfiguration with defaultJurisdiction", () => {
    const defaultJurisdiction = "default_jurisdiction";

    appConfiguration.setup({ defaultJurisdiction });

    expect(appConfiguration.defaultJurisdiction).toEqual(defaultJurisdiction);
  });

  it("should setup AppConfiguration with externalAppsURLPattern", () => {
    const externalAppsURLPattern = "/brand/gi";

    appConfiguration.setup({ externalAppsURLPattern });

    expect(appConfiguration.externalAppsURLPattern).toEqual(externalAppsURLPattern);
  });
});
