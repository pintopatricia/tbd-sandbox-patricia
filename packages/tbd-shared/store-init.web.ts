import { composeWithDevTools } from "redux-devtools-extension";
import { compose } from "redux";
import { TheBridgeSBKApi } from "@flutter-global/the-bridge";
import {
  AppCommands,
  ApplicationState,
  ContentLoadingParameters,
  EnvironmentConfig,
  PayoutLimits,
  StorageModule,
  StorageState,
  createGetThrottleSelector,
  getModuleLoader,
  loadStorageData,
  setupRefreshIntervals,
} from "@ppb/tbd-store";
import createStore, { CreateStoreOptions } from "@ppb/tbd-store/create-store";
import { setApolloCacheFeeder } from "@ppb/tbd-store/config/apollo-cache-feeder";
import { setApolloCacheObserver } from "@ppb/tbd-store/config/apollo-cache-observer";
import {
  authenticationFailureMiddleware,
  catalogueFailureMiddleware,
  bootstrapApp,
  cleanLayoutMiddleware,
  createHistoryListenerSaga,
  createSeoCommonMiddleware,
  keepAliveMiddleware,
  movableInkMiddleware,
  preferencesMiddleware,
  storageMiddleware,
  urlMiddleware,
} from "@ppb/tbd-store/middlewares/index.web";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getCriticalTaggingModule } from "@ppb/tbd-store/modules/critical-tagging-module";
import { TransformedLayout } from "@ppb/tbd-store/services/catalogue/catalogue-types";
import identitySSOService from "@ppb/tbd-store/services/identity-sso-service";
import history from "@ppb/tbd-router/web/history";

import { injectGeoComplyScript } from "./helpers/geo-comply.web";
import { injectSGTimeAlertsScript } from "./helpers/sg-time-alerts.web";
import Storage from "./helpers/storage.web";
import { getAsyncCookie } from "./helpers/cookies.web";
import { sendEvent } from "./gtm/tagging-collector.web";
import { MESSAGE_CONFIG_MAP } from "./config/messaging";
import { apolloCacheWarmUp } from "./apollo-client/cache-warmup";
import { apolloCacheListeners } from "./apollo-client/cache-listeners";

function handleAuthenticationFailure(): void {
  setTimeout(() => window.location.reload(), 5000);
}

export const getConfiguredStore = (
  preloadedState: ApplicationState,
  preloadedCatalog: TransformedLayout,
  ENV: EnvironmentConfig,
  APP_KEY: string,
  CONTENT_LOADING_PARAMETERS: ContentLoadingParameters,
  payouts: { limits: PayoutLimits },
  appCommands?: AppCommands,
): Promise<ReturnType<typeof createStore>> => {
  const { ASSETS, REFRESH_RATES, GEO_COMPLY_SCRIPT, SG_TIME_ALERTS_SCRIPT } = ENV;
  const middlewares: CreateStoreOptions<StorageModule<StorageState>, StorageState>["middlewares"] = [
    urlMiddleware(history),
    movableInkMiddleware,
    createSeoCommonMiddleware,
    storageMiddleware(Storage),
    authenticationFailureMiddleware(handleAuthenticationFailure),
    catalogueFailureMiddleware,
    cleanLayoutMiddleware,
    preferencesMiddleware,
    keepAliveMiddleware(identitySSOService.keepAlive),
  ];

  const sagas: CreateStoreOptions<StorageModule<StorageState>, StorageState>["sagas"] = [
    createHistoryListenerSaga(history, preloadedState),
  ];

  const getThrottle = createGetThrottleSelector();

  const isDevelopment = process.env.NODE_ENV === "development" || !!preloadedState.boot.devTools;

  injectGeoComplyScript(preloadedState, GEO_COMPLY_SCRIPT);
  injectSGTimeAlertsScript(preloadedState, SG_TIME_ALERTS_SCRIPT);

  if (isDevelopment) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { crashReporter } = require("@ppb/tbd-store/middlewares/logging/crash-reporter.web");
    middlewares.push(crashReporter);
  }

  let STORE_OPTIONS: CreateStoreOptions<StorageModule<StorageState>, StorageState> = {
    compose: isDevelopment ? composeWithDevTools({}) : compose,
    middlewares,
    sagas,
    messaging: MESSAGE_CONFIG_MAP,
    payouts,
    gtm: {
      collectorFn: sendEvent,
      getCookie: getAsyncCookie,
      platformType: PlatformType.Web,
      theme: window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
    },
    seoLoad: CONTENT_LOADING_PARAMETERS.catalog,
    storage: Storage,
  };

  return loadStorageData(Storage).then((persistedState) => {
    STORE_OPTIONS = {
      ...STORE_OPTIONS,
      preloadedState: {
        ...preloadedState,
        ...persistedState,
        boot: {
          ...preloadedState.boot,
          ...persistedState.boot,
        },
      },
    };

    // Setup intervals
    if (REFRESH_RATES) {
      setupRefreshIntervals(REFRESH_RATES);
    }

    // Setup apollo cache feeder
    setApolloCacheFeeder(apolloCacheWarmUp.loadCatalogue);
    // Setup apollo cache observer
    setApolloCacheObserver(apolloCacheListeners.setupListeners);

    // Create Redux store with initial state
    const store = createStore(ASSETS, APP_KEY, STORE_OPTIONS);

    if (STORE_OPTIONS?.gtm) {
      store.addModule(getCriticalTaggingModule(STORE_OPTIONS.gtm));
    }

    const isGA4Active = getThrottle(preloadedState.entities.throttles, "ENABLE_GA4");
    const isUADisabled = getThrottle(preloadedState.entities.throttles, "DISABLE_UA");
    const isFavouriteGamesEnabled = getThrottle(preloadedState.entities.throttles, "USER_FAVOURITE_GAMES");

    // If TheBridge wrapper layer was initialized, don't configure Wallet module.
    // When using TheBridge wrapper, the Host apps are responsible to feed the Wallet values to TBD.
    if (!TheBridgeSBKApi.getInstance()) {
      import(/* webpackChunkName: "wallet-module" */ "@ppb/tbd-store/modules/wallet-module").then(
        ({ getWalletModule }) => {
          store.addModule(getWalletModule());
        },
      );
    }

    import(
      /* webpackChunkName: "web-messages-request-module" */ "@ppb/tbd-store/modules/web-messages-request-module"
    ).then(({ getWebMessagesRequestModule }) => {
      store.addModule(getWebMessagesRequestModule());
    });

    if (isGA4Active?.isActive) {
      import(/* webpackChunkName: "tagging-middleware" */ "@ppb/tbd-store/modules/tagging-module").then(
        ({ getTaggingModule }) => {
          if (STORE_OPTIONS?.gtm) {
            store.addModule(getTaggingModule(STORE_OPTIONS.gtm));
          }
        },
      );
    }

    if (!isUADisabled?.isActive) {
      import(/* webpackChunkName: "legacy-tagging-middleware" */ "@ppb/tbd-store/modules/legacy-tagging-module").then(
        ({ getLegacyTaggingModule }) => {
          if (STORE_OPTIONS?.gtm) {
            store.addModule(getLegacyTaggingModule(STORE_OPTIONS.gtm));
          }
        },
      );
    }

    if (isFavouriteGamesEnabled?.isActive) {
      import(
        /* webpackChunkName: "user-favourite-games-module" */ "@ppb/tbd-store/modules/user-favourite-games-module"
      ).then(({ getUserFavouriteGamesModule }) => {
        store.addModule(getUserFavouriteGamesModule());
      });
    }

    store.addModule(getModuleLoader(store, Storage, appCommands));

    if (appCommands) {
      import(/* webpackChunkName: "commands-module" */ "@ppb/tbd-store/modules/commands-module").then(
        ({ getCommandsModule }) => {
          store.addModule(getCommandsModule(appCommands));
        },
      );
    }

    // Bootstrap app (preloaded data or request catalog)
    bootstrapApp(store.dispatch, preloadedState.router, preloadedCatalog);

    return store;
  });
};
