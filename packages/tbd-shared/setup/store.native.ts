/* global __DEV__ */
import { Middleware } from "redux";
import { IModuleStore } from "redux-dynamic-modules";
import { Appearance, DeviceEventEmitter, Linking, Platform } from "react-native";
import { cetMainConfiguration } from "@flutter-global/react-native-cet-framework";

import { NativeEntityTypes, navigateMaintenanceScreen, popLastFromStack } from "@ppb/tbd-router/native";
import { ApplicationState, AssetsConfig, StorageData } from "@ppb/tbd-store";
import { NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE } from "@ppb/tbd-store/actions/app-context";
import { setApolloCacheFeeder } from "@ppb/tbd-store/config/apollo-cache-feeder";
import { getAssets } from "@ppb/tbd-store/config/assets-config";
import createStore, { CreateStoreOptions } from "@ppb/tbd-store/create-store";
import { loadStorageData } from "@ppb/tbd-store/helpers/storage";
import {
  catalogueFailureMiddleware,
  authenticationFailureMiddleware,
  keepAliveMiddleware,
  preferencesMiddleware,
  rateMyAppMiddleware,
  storageMiddleware,
} from "@ppb/tbd-store/middlewares/index.native";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getEventPushHandlerModule, StorageModule } from "@ppb/tbd-store/modules";
import {
  getCampaignMeasurementModule,
  CampaignMeasurementConfig,
} from "@ppb/tbd-store/modules/campaign-measurement-module";
import { getPushNotificationsModule } from "@ppb/tbd-store/modules/push-notifications-load-module";
import { GtmConfig } from "@ppb/tbd-store/modules/critical-tagging-module";
import { INITIAL_STATE as routerInitialState } from "@ppb/tbd-store/state/router/router-slice";
import { createMaintenanceStatusMiddleware } from "@ppb/tbd-store/middlewares/maintenance-status";

import { Brand } from "@ppb/tbd-store/config/Brand";
import { MESSAGE_CONFIG_MAP } from "../config/messaging";
import { apolloCacheWarmUp } from "../apollo-client/cache-warmup";
import { getThrottlesSettings } from "../config/settings-utils.native";
import Storage, { NativeStorageState } from "../helpers/storage.native";
import { getCustomUserAgent } from "../helpers/user-agent.native";
import { sendEvent } from "../gtm/tagging-collector.native";
import Rating from "../helpers/rating.native";
import { createUrnMiddleware } from "../helpers/urn-middleware.native";
import { createErrorHandlingMiddleware } from "../helpers/error-handling-middleware";
import { quantumMetricMiddleware } from "../helpers/quantum-metric-middleware.native";
import { qualtricsMiddleware } from "../helpers/qualtrics-middleware.native";
import appConfiguration, { AppConfigJson } from "../config/app-configuration.native";
import { getAppContextModule } from "../helpers/app-context/app-context-module.native";
import { setApplicationKey } from "@ppb/tbd-store/services/client-factory";
import { CetFrameworkSetup } from "../helpers/app-context/app-context-middleware.native";
import { setCustomHeaders } from "../helpers/custom-headers.native";
import loginKeychain from "@flutter-global/react-native-cet-framework/lib/commonjs/authentication/common/services/login-keychain";
import { setApolloCacheObserver } from "@ppb/tbd-store/config/apollo-cache-observer";
import { apolloCacheListeners } from "../apollo-client/cache-listeners";

let STORE_OPTIONS: CreateStoreOptions<StorageModule<NativeStorageState>, NativeStorageState> | undefined;

const campaignMeasurementConfig: CampaignMeasurementConfig = {
  collectorFn: sendEvent,
  platformType: PlatformType.Native,
  initialUrlFn: Linking.getInitialURL,
};

export const handleAuthenticationFailure = (): void => {
  DeviceEventEmitter.emit(NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE);
};

export const gtmConfig: GtmConfig = {
  collectorFn: sendEvent,
  getCookie: () =>
    new Promise((resolve) => {
      resolve("");
    }), // TODO Review if needed to start the store.
  platformType: PlatformType.Native,
  theme: Appearance.getColorScheme() === "light" ? "light" : "dark",
};

export function getStoreOptions(): typeof STORE_OPTIONS {
  return STORE_OPTIONS;
}

export const initStore = async (
  initialCetFrameworkSetup: CetFrameworkSetup,
): Promise<IModuleStore<ApplicationState>> => {
  const { APP_KEYS } = appConfiguration.appConfig as AppConfigJson;
  const OS = Platform.OS as "android" | "ios";
  const APP_KEY = APP_KEYS[OS];

  setApplicationKey(APP_KEY);

  const safeSetCustomHeaders = setCustomHeaders(Storage).catch((error) => {
    console.error("Failed to set custom headers", error);
  });

  const [persistedState, initialUrl, keychainData] = await Promise.all([
    loadStorageData(Storage),
    Linking.getInitialURL(),
    loginKeychain.loadAuthData(),
    safeSetCustomHeaders,
  ]);

  const authToken = keychainData.ssoid || null;

  const preloadedState = buildPreloadedState(persistedState, initialUrl);

  const userAgent = getCustomUserAgent();

  const NATIVE_ASSETS = getAssets() as AssetsConfig;

  const STORE_MIDDLEWARES: Middleware[] = [
    createErrorHandlingMiddleware,
    storageMiddleware(Storage),
    rateMyAppMiddleware(Rating),
    createMaintenanceStatusMiddleware(navigateMaintenanceScreen),
    // Urn Middleware
    createUrnMiddleware(popLastFromStack),
    authenticationFailureMiddleware(handleAuthenticationFailure),
    catalogueFailureMiddleware,
    preferencesMiddleware,
    quantumMetricMiddleware,
    keepAliveMiddleware(cetMainConfiguration.keepAlive),
  ];

  if (appConfiguration.appBrand === Brand.Skybet) {
    STORE_MIDDLEWARES.push(qualtricsMiddleware());
  }

  if (__DEV__ || appConfiguration.appConfig?.TBDN_RELEASE_MODE === "internal") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { crashReporter } = require("@ppb/tbd-store/middlewares/logging/crash-reporter.native");
    STORE_MIDDLEWARES.push(crashReporter);
  }

  STORE_OPTIONS = {
    middlewares: STORE_MIDDLEWARES,
    gtm: gtmConfig,
    messaging: MESSAGE_CONFIG_MAP,
    overrideUserAgent: userAgent,
    storage: Storage,
    payouts: { limits: appConfiguration.maxPayoutLimits },
  };

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Reactotron = require("./dev/Reactotron.native.config").default;

    STORE_OPTIONS = {
      ...STORE_OPTIONS,
      enhancers: [Reactotron.createEnhancer()],
    };
  }

  // Setup apollo cache feeder
  setApolloCacheFeeder(apolloCacheWarmUp.loadCatalogue);

  // Setup apollo cache observer
  setApolloCacheObserver(apolloCacheListeners.setupListeners);

  // Initialize the application store
  const store = createStore(NATIVE_ASSETS, APP_KEY, {
    ...STORE_OPTIONS,
    preloadedState,
  });

  // Is exchange enabled?
  let excEnabled = false;

  if (
    initialUrl?.match(/^bfe:\/\/exc=(true|false)/) ||
    initialUrl?.match(/^http(?:s)?:\/\/(?:www\.)?betfair\.com\/betting\/?\?exc=(true|false)/)
  ) {
    excEnabled = initialUrl.replace(/(.*)=/, "") === "true";
  }

  let resolveStore: (value: IModuleStore<ApplicationState>) => void;

  const result = new Promise<IModuleStore<ApplicationState>>((resolve) => {
    resolveStore = resolve;
  });

  store.addModule(getPushNotificationsModule());
  store.addModule(getEventPushHandlerModule());
  store.addModule(getCampaignMeasurementModule(campaignMeasurementConfig));
  store.addModule(
    getAppContextModule(store, APP_KEY, userAgent, initialCetFrameworkSetup, authToken, excEnabled, () =>
      resolveStore(store),
    ),
  );

  return result;
};

export const buildPreloadedState = (persistedState: StorageData, url: string | null) => {
  const throttles = getThrottlesSettings();

  let exchangeEnabled = persistedState.boot?.exchangeEnabled;
  // check if the deeplink match with exchange enable feature
  if (url && url.match(/^bfe:\/\/exc=(true|false)/)) {
    const urlExcExperience = url.replace(/(.*)=/, "");

    if (urlExcExperience === "true") {
      Storage.setItem("enableExc", true);
      exchangeEnabled = true;
    } else {
      Storage.setItem("enableExc", false);
      exchangeEnabled = false;
    }
  }

  return {
    entities: {
      throttles: {
        ...throttles,
      },
    },
    router: {
      ...routerInitialState,
      // Since native apps don't have SSR support like web does, we are unable to set a window.__PRELOADED_STATE__
      // containing "currentUrn":"ppb:tbd:view:generic:home" as the home page is served. For this reason, the
      // router `currentUrn` on native apps will be preloaded with the home URN as initial state. This approach
      // is also in line with the following conditions:
      // 1. App launches and deep-links have as common entry point the home screen;
      // 2. The App Context middleware on app launch, only needs to dispatch a REFRESH action to fetch a fresh
      // layout to the BFF, and does not have to manage the router state via the PUSH action anymore to set the
      // home URN.
      currentUrn: NativeEntityTypes.Home,
    },
    ...persistedState,
    boot: {
      ...persistedState.boot,
      exchangeEnabled,
      allowLoadFromStorage: true,
    },
  };
};
