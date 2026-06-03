export {};

declare global {
  interface Navigator {
    deviceMemory: number;
  }

  interface Window {
    __PRELOADED_STATE__: import("@ppb/tbd-store").ApplicationState;
    __TBD_APP_COMMANDS__?: import("@ppb/tbd-store").AppCommands;
    __TBD_PRELOADED_CATALOG__: import("@ppb/tbd-store").CatalogueServiceLayout;
    __APP_CONTEXT__: import("@ppb/tbd-store/clients/catalogue/catalogue-response-types").AppContextQuery;
    __TBD__: {
      TRANSLATIONS: import("../../translations/keys").TranslationKey;
    };
    __TBD_ENVIRONMENT__: import("@ppb/tbd-store").EnvironmentConfig;
    __TBD_CLIENT_CONTEXT__: {
      platform: "ios" | "android" | "web";
      uiVariant: "desktop" | "mobile";
      wrapper: {
        wrapperName: "GamingWrapper" | "DesktopWrapper";
        bridgeAPIVersion?: string;
      } | null;
      webWrappedExperience: boolean;
    };
    MOCKEDENDPOINTS: import("@ppb/tbd-store").EndpointsConfig;
    ga: (key: string, data: Record<string, unknown>) => void;
    dataLayer: import("@ppb/tbd-store/middlewares/Tagging.types").AnalyticsEventType[];
    OneTrust?: {
      ToggleInfoDisplay: () => void;
    };
    __CONTENT_LOADING_PARAMETERS__: import("@ppb/tbd-store").ContentLoadingParameters;
    __POST_LOGIN_SESSION__: boolean;
    newrelic?: {
      setCustomAttribute: (name: string, value: string | number | null, persist?: boolean) => void;
      recordMetric: (name: string, value: number) => void;
      noticeError: (error: Error | string, customAttributes?: Record<string, string | number>) => void;
      addPageAction: (actionName: string, attributes?: Record<string, string | number | boolean>) => void;
    };
    SplunkRum?: {
      setGlobalAttributes: (attributes: { [key: string]: string | number | boolean | undefined }) => void;
      error: <E extends Error, EF>(error: E, info: EF) => void;
    };
    ssc?: {
      modules: {
        login: {
          refreshWallets: () => void;
          updateLoginLogoutReturnUrl: (url: string) => void;
        };
      };
    };
    _aw_?: {
      analyticsPushEvent: (event: import("@ppb/tbd-store/middlewares/Tagging.types").AnalyticsEventType) => void;
    };
    enhancedDataLayer?: import("@ppb/tbd-store/middlewares/Tagging.types").AnalyticsEventType[];
  }

  interface WindowEventMap {
    sgTimeAlert: CustomEvent;
  }
}
