import i18next from "i18next";
import { init } from "@ppb/betslip-core";
import {
  ApplicationState,
  AppCommands,
  createGetThrottleSelector,
  enableExc,
  buildBootInitialState,
  productConfiguration,
} from "@ppb/tbd-store";
import { PayoutsConfig } from "@ppb/tbd-store/create-store";
import { setInternetStatus } from "@ppb/tbd-store/middlewares/http-poller/internet-status";
import { setCookieTheme } from "./config/cookie-theme.web";
import {
  buildEndpoints,
  setEndpointsConfig,
  setDesktopHeaderConfig,
  setProdIdConfig,
  setExternalLinks,
  setBetslipConfig,
  setLoopClientConfig,
} from "./config/endpoints";
import "./config/public-path";
import { getCookie, setCookie } from "./helpers/cookies.web";
import { removeHashMark } from "./helpers/remove-hash-mark.web";
import Storage from "./helpers/storage.web";
import { setNewRelicCustomAttributes } from "./helpers/newrelic.web";
import applyFormatToPartsPolyfill from "./polyfills/format-to-parts";
import { getConfiguredStore } from "./store-init.web";
import { apolloCacheWarmUp } from "./apollo-client/cache-warmup";
import { buildApolloClient } from "./apollo-client/client";
import registerEventProcessors from "./event-processors/registry.web";
import { setPerformanceObserver } from "./helpers/setPerformanceObserver.web";
import { setOtelCustomAttributes } from "./helpers/otel.web";
import { apolloCacheListeners } from "./apollo-client/cache-listeners";

applyFormatToPartsPolyfill();

if (window.__PRELOADED_STATE__.boot.exchangeEnabled) {
  Promise.resolve(enableExc(Storage));
}

/**
 * Builds preloaded state with the data sent by server and additional input from the client.
 *
 * @param initialPreloadedState Default value for preloaded state
 * @return {ApplicationState} returns preloaded state.
 */
function buildInitialState(initialPreloadedState: ApplicationState, appCommands?: AppCommands): ApplicationState {
  const userDetails = initialPreloadedState.entities.userdetails;
  const getThrottle = createGetThrottleSelector();
  const dailyPayoutLimitThrottle = getThrottle(initialPreloadedState.entities.throttles, "DAILY_PAYOUT_LIMIT");
  const limit =
    "currencyCode" in userDetails ? productConfiguration.getPayoutLimit(userDetails.currencyCode) : undefined;
  const coreInitConfig =
    dailyPayoutLimitThrottle?.isActive && limit
      ? { maxPayoutLimits: { warning: limit.softCap, error: limit.hardCap } }
      : {};

  return {
    ...initialPreloadedState,
    betting: {
      ...initialPreloadedState.betting,
      sportsbookBetting: init(coreInitConfig),
    },
    boot: buildBootInitialState(initialPreloadedState.boot, appCommands),
  };
}

function registerNetworkStateListener() {
  window.addEventListener("online", () => {
    setInternetStatus(true);
  });
  window.addEventListener("offline", () => {
    setInternetStatus(false);
  });
}

type InitialClientState = {
  payouts: PayoutsConfig;
};
export async function initClient({ payouts }: InitialClientState): ReturnType<typeof getConfiguredStore> {
  // Build initial preloaded state
  const preloadedState: ApplicationState = buildInitialState(window.__PRELOADED_STATE__, window.__TBD_APP_COMMANDS__);

  const { userdetails } = preloadedState.entities;
  const localeCode = userdetails?.localeCodeBcp47 || "en";

  i18next.init({
    lng: localeCode,
    resources: {
      [localeCode]: {
        translation: window.__TBD__.TRANSLATIONS,
      },
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: { escapeValue: false },
  });

  const {
    PRODUCT_ID,
    APP_KEY,
    BASE_PATH,
    AUTH_DATA,
    ENDPOINTS,
    DESKTOP_HEADER_CONFIG,
    BETSLIP_CONFIG,
    EXTERNAL_LINKS,
    LOOP_CLIENT_CONFIG,
  } = window.__TBD_ENVIRONMENT__;

  if (!PRODUCT_ID || !APP_KEY) {
    throw new Error("Missing APP_KEY or PRODUCT_ID");
  }

  const getReverseProxyDomain = (location: Location): string => `${location.origin}${BASE_PATH}`;

  /**
   * The base path is the url where the application is running.
   */
  const baseURL = getReverseProxyDomain(window.location);

  /**
   * Handles hash mark fragments
   */
  removeHashMark(baseURL, window.location.hash);

  // Setup endpoints based on the environment
  const endpoints = buildEndpoints(ENDPOINTS, baseURL);
  setEndpointsConfig({
    endpoints: {
      ...endpoints,
      // Mocked enpoints when running automated tests
      ...window.MOCKEDENDPOINTS,
    },
    basePath: baseURL,
    applicationKey: APP_KEY,
    authURLs: AUTH_DATA,
    cbsChannel: ENDPOINTS?.CBS?.channel,
    authorizationToken: getCookie("ssoid") ?? undefined,
  });

  setDesktopHeaderConfig(DESKTOP_HEADER_CONFIG);

  setBetslipConfig(BETSLIP_CONFIG);

  setProdIdConfig(PRODUCT_ID);

  setLoopClientConfig(LOOP_CLIENT_CONFIG);

  if (EXTERNAL_LINKS) {
    setExternalLinks(EXTERNAL_LINKS);
  }

  // Set custom attributes for new relic
  setNewRelicCustomAttributes(preloadedState);

  // Set custom attributes for otel
  setOtelCustomAttributes(preloadedState);

  // Set observer to push metrics to new relic
  setPerformanceObserver();

  // Set cookie to tell BTS to serve Rebuild
  setCookie("exp", "bf", "/");

  // Set cookie theme
  setCookieTheme();

  // Sets up TheBridge wrapper
  if (window.__TBD_CLIENT_CONTEXT__?.wrapper) {
    const setupTheBridge = (await import("./the-bridge-wrapper/setup.web")).default;
    setupTheBridge();
  }

  const store = await getConfiguredStore(
    preloadedState,
    window.__TBD_PRELOADED_CATALOG__,
    window.__TBD_ENVIRONMENT__,
    APP_KEY,
    window.__CONTENT_LOADING_PARAMETERS__,
    payouts,
    window.__TBD_APP_COMMANDS__,
  );

  buildApolloClient({
    state: store.getState(),
    batching: !window.MOCKEDENDPOINTS,
    catalogueEndpoint: endpoints.CATALOGUE,
    appKey: APP_KEY,
  });

  // register Event Processors for cross-cutting concerns like Tracking, SEO, Nagitation, etc
  registerEventProcessors();

  registerNetworkStateListener();

  // warm up Apollo Client Cache with any initial state that was calculated in the server-side and is needed in the client
  if (window.__APP_CONTEXT__) {
    apolloCacheWarmUp.loadAppContext(window.__APP_CONTEXT__);
  }

  // warm up also the preload catalogue
  if (window.__TBD_PRELOADED_CATALOG__) {
    apolloCacheWarmUp.loadCatalogue(window.__TBD_PRELOADED_CATALOG__.data);
    apolloCacheListeners.setupListeners(window.__TBD_PRELOADED_CATALOG__.data);
  }

  return store;
}
