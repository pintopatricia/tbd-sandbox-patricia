import "jest-extended";
import { DeviceEventEmitter } from "react-native";
import {
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
} from "@ppb/tbd-store/actions/app-context";
import { setupAssets } from "@ppb/tbd-store/config/assets-config";
import { setupRefreshIntervals } from "@ppb/tbd-store/config/intervals";
import { getSportsbookBettingModule } from "@ppb/tbd-store/modules/sbk-betting-module";
import { getExchangeBettingModule } from "@ppb/tbd-store/modules/exc-betting-module";
import { getWebMessagesRequestModule } from "@ppb/tbd-store/modules/web-messages-request-module";
import { getWalletModule } from "@ppb/tbd-store/modules/wallet-module";
import { REFRESH } from "@ppb/tbd-store/actions/router";
import { BETTING__OBB_CLEAR_ACTION, BETTING__SBK_CLEAR_ACTION } from "@ppb/tbd-store/actions/betting";
import { NETWORK__FETCH_APP_VERSION_SUCCESS } from "@ppb/tbd-store/actions/app-version";
import { NETWORK__PLACE_SBK_BET_SUCCESS } from "@ppb/tbd-store/actions/betslip";
import { setHapticsEnabled } from "@ppb/the-wall-native/api/haptics";
import { appsFlyerTacker } from "@flutter-global/react-native-cet-framework";
import { apolloCacheWarmUp } from "../../apollo-client/cache-warmup";
import {
  buildEndpoints,
  setAdobeSdkConfig,
  setBetslipConfig,
  setLoopClientConfig,
  setEndpointsConfig,
  setEnv,
  setExternalLinks,
  setHomepagePaths,
  setHost,
  setProdIdConfig,
} from "../../config/endpoints";
import { getBasePath } from "../../config/base-path-utils.native";
import Storage from "../storage.native";
import { buildApolloClient, resetApolloCacheWithAppContext } from "../../apollo-client/client";
import { AppUpdate } from "../app-update/suggest-and-force-update.native";
import { initOneTrust } from "../../cookie-consent/cookie-consent.native";

import { checkAndDownloadOtaUpdate } from "../ota-updates/ota-updates.native";
import { createAppContextMiddleware } from "./app-context-middleware.native";

const androidStoreLink = "androidStoreLink";
const androidDownloadLink = "androidDownloadLink";

const mockResetStore = jest.fn();

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  appsFlyerTacker: { logEvent: jest.fn() },
  useAnalyticsTracking: jest.fn(),
}));

jest.mock("../app-update/suggest-and-force-update.native", () => ({
  AppUpdate: {
    checkAppUpdate: jest.fn(),
    displaySuggestOrForceUpdate: jest.fn(),
  },
}));

jest.mock("../../config/endpoints", () => ({
  buildEndpoints: jest.fn(),
  setEndpointsConfig: jest.fn(),
  setAdobeSdkConfig: jest.fn(),
  setBetslipConfig: jest.fn(),
  setLoopClientConfig: jest.fn(),
  setProdIdConfig: jest.fn(),
  setEnv: jest.fn(),
  setExternalLinks: jest.fn(),
  setHost: jest.fn(),
  setHomepagePaths: jest.fn(),
}));
jest.mock("../../apollo-client/client", () => ({
  getApolloClient: jest.fn(() => ({
    resetStore: mockResetStore,
  })),
  buildApolloClient: jest.fn(),
  resetApolloCacheWithAppContext: jest.fn(),
}));
jest.mock("../../gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
}));
jest.mock("../../event-processors/registry.native", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@splunk/otel-react-native", () => ({
  SplunkRum: { instance: { globalAttributes: { setAll: jest.fn() } } },
}));

jest.mock("../otel.native", () => ({
  getOtelCustomAttributes: jest.fn(() => ({})),
  getOtelNetworkAttributes: jest.fn(() => Promise.resolve({})),
}));

jest.mock("react-native-device-info", () => ({
  getBuildNumber: () => 5,
  getSystemVersion: () => "11.0",
  getApplicationName: () => "TestApp",
  getVersion: () => "1.0.0",
  getUserAgent: () => Promise.resolve("TestUserAgent"),
  getUserAgentSync: () => "TestUserAgent",
  getTotalMemorySync: () => 4000000000,
}));

jest.mock("@ppb/tbd-store/config/assets-config", () => ({
  setupAssets: jest.fn(),
}));

jest.mock("@ppb/tbd-store/config/intervals", () => ({
  setupRefreshIntervals: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/wallet-module", () => ({
  getWalletModule: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/sbk-betting-module", () => ({
  getSportsbookBettingModule: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/exc-betting-module", () => ({
  getExchangeBettingModule: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/web-messages-request-module", () => ({
  getWebMessagesRequestModule: jest.fn(),
}));

jest.mock("../../cookie-consent/cookie-consent.native", () => ({
  reinitOneTrust: jest.fn(),
  initOneTrust: jest.fn().mockResolvedValueOnce({}),
}));

jest.mock("../../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(),
  getCatalogueDefaultPath: jest.fn(() => "/bff-gql/v11"),
  getCurrentEnv: jest.fn(() => "QA"),
}));

jest.mock("../storage.native", () => ({
  setItem: jest.fn(),
}));

jest.mock("../../setup/store.native", () => ({
  gtmConfig: {
    getCookie: jest.fn((cookie) => `${cookie}-cookie`),
  },
}));

jest.mock("../../config/app-configuration.native", () => ({
  appConfig: {
    TBDN_CATALOGUE_VERSION: "v420",
  },
}));

jest.mock("@ppb/the-wall-native/api/haptics", () => ({
  setHapticsEnabled: jest.fn(),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  NativeEntityTypes: {
    Home: "ppb:tbd:view:generic:home",
  },
}));

jest.mock("../app-update/update-helper.native", () => ({
  AppUpdateStatus: {
    Hidden: 0,
    Force: 2,
    Unsupported: 3,
  },
}));

jest.mock("../../apollo-client/cache-warmup", () => ({
  apolloCacheWarmUp: {
    loadCatalogue: jest.fn(),
    loadAppContext: jest.fn(),
  },
}));

jest.mock("../cookies.native", () => ({
  getCookie: jest.fn().mockImplementation((cookie) => Promise.resolve(`${cookie}-cookie`)),
}));

jest.mock("../ota-updates/ota-updates.native", () => ({
  checkAndDownloadOtaUpdate: jest.fn(),
}));

function setupCreateFn() {
  return {
    store: { addModule: jest.fn(), getState: jest.fn() },
    appKey: "app-key",
    userAgent: "user-agent",
    initialCetFrameworkSetup: jest.fn(),
    onReady: jest.fn(),
  };
}

function setupStoreFn(dispatchSpy = jest.fn(), store) {
  return {
    dispatch: dispatchSpy,
    getState:
      store?.getState ||
      jest.fn(() => ({
        router: { currentUrn: undefined },
        entities: { userdetails: { loggedIn: false, jurisdiction: undefined } },
      })),
  };
}

describe("App Context Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action is not an APP_CONTEXT related", () => {
    it("should next the action", async () => {
      const nextSpy = jest.fn();
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(nextSpy)({
        type: "unknown action",
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith({ type: "unknown action" });
    });
  });

  describe("when action is 'NETWORK__FETCH_APP_VERSION_SUCCESS'", () => {
    beforeEach(() => {
      getBasePath.mockReturnValue("base-path");
      buildEndpoints.mockReturnValue("built endpoints");
    });

    describe("when force update", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              storeUrl: androidStoreLink,
              downloadUrl: androidDownloadLink,
              versionCode: 7,
              minVersionCode: 6,
              minOSVersion: "10.0",
              blackList: [],
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when suggest update", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: "INTERNATIONAL" },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              storeUrl: androidStoreLink,
              downloadUrl: androidDownloadLink,
              versionCode: 7,
              minVersionCode: 3,
              minOSVersion: "10.0",
              blackList: [],
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when unsupported device", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: "INTERNATIONAL" },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              storeUrl: androidStoreLink,
              downloadUrl: androidDownloadLink,
              versionCode: 5,
              minVersionCode: 3,
              minOSVersion: "11.1",
              blackList: [],
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });
  });

  describe("when action is 'NETWORK__FETCH_APP_CONTEXT_SUCCESS'", () => {
    beforeEach(() => {
      getBasePath.mockReturnValue("base-path");
      buildEndpoints.mockReturnValue({
        CATALOGUE: "catalogue-url",
      });
      AppUpdate.appUpdateStatus = 0; // Hidden
    });

    it("should setup application configuration", async () => {
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            ENV: "env",
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: { MOCKED: "endpoints const", CBS: { channel: "test-channel" } },
            ADOBE_SDK: "adobe-sdk config",
            BETSLIP_CONFIG: "betslip config",
            LOOP_CLIENT_CONFIG: "loop client config",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
            HOST: "host/",
            HOMEPAGE_PATHS: "homepage-paths",
            PRODUCT_ID: "PRODUCT_ID",
          },
          initialState: {
            entities: {
              appversion: {},
              userdetails: {
                jurisdiction: {
                  jurisdiction: "INTERNATIONAL",
                },
              },
              productId: "PRODUCT_ID",
            },
          },
        },
      });

      expect(buildEndpoints).toHaveBeenCalledTimes(1);
      expect(buildEndpoints).toHaveBeenCalledWith(
        { CBS: { channel: "test-channel" }, MOCKED: "endpoints const" },
        "base-path",
        "v420",
      );

      expect(setEndpointsConfig).toHaveBeenCalledTimes(1);
      expect(setEndpointsConfig).toHaveBeenCalledWith({
        endpoints: { CATALOGUE: "catalogue-url" },
        basePath: "base-path",
        applicationKey: "app-key",
        authURLs: "auth-data",
        overrideUserAgent: "user-agent",
        overrideReferer: "https://host/base-path",
        cbsChannel: "test-channel",
        authorizationToken: "ssoid-cookie",
      });

      expect(setProdIdConfig).toHaveBeenCalledTimes(1);
      expect(setProdIdConfig).toHaveBeenCalledWith("PRODUCT_ID");

      expect(setEnv).toHaveBeenCalledTimes(1);
      expect(setEnv).toHaveBeenCalledWith("env");

      expect(setHost).toHaveBeenCalledTimes(1);
      expect(setHost).toHaveBeenCalledWith("host/");

      expect(setHomepagePaths).toHaveBeenCalledTimes(1);
      expect(setHomepagePaths).toHaveBeenCalledWith("homepage-paths");

      expect(setExternalLinks).not.toHaveBeenCalled();

      expect(buildApolloClient).toHaveBeenCalledTimes(1);
      expect(buildApolloClient).toHaveBeenCalledWith({
        state: store.getState(),
        batching: true,
        appKey: "app-key",
        catalogueEndpoint: "catalogue-url",
      });

      expect(setAdobeSdkConfig).toHaveBeenCalledTimes(1);
      expect(setAdobeSdkConfig).toHaveBeenCalledWith("adobe-sdk config");

      expect(setBetslipConfig).toHaveBeenCalledTimes(1);
      expect(setBetslipConfig).toHaveBeenCalledWith("betslip config");

      expect(setLoopClientConfig).toHaveBeenCalledTimes(1);
      expect(setLoopClientConfig).toHaveBeenCalledWith("loop client config");

      expect(setupAssets).toHaveBeenCalledTimes(1);
      expect(setupAssets).toHaveBeenCalledWith("assets", "https://host/base-path");

      expect(setupRefreshIntervals).toHaveBeenCalledTimes(1);
      expect(setupRefreshIntervals).toHaveBeenCalledWith("refresh-rates");
    });

    it("should setup application configuration with EXTERNAL_LINKS when they exist", async () => {
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            ENV: "env",
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ADOBE_SDK: "adobe-sdk config",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
            HOST: "host/",
            PRODUCT_ID: "PRODUCT_ID",
            EXTERNAL_LINKS: "EXTERNAL_LINKS",
          },
          initialState: {
            entities: {
              appversion: {},
              userdetails: {
                jurisdiction: {
                  jurisdiction: "INTERNATIONAL",
                },
              },
              productId: "PRODUCT_ID",
            },
          },
        },
      });

      expect(setExternalLinks).toHaveBeenCalledTimes(1);
      expect(setExternalLinks).toHaveBeenCalledWith("EXTERNAL_LINKS");
    });

    it("should init cet framework with action payload jurisdiction and country code", async () => {
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "ES" }, countryCode: "SP" },
              productId: "PRODUCT_ID",
            },
          },
        },
      });

      expect(initialCetFrameworkSetup).toHaveBeenCalledTimes(1);
      expect(initialCetFrameworkSetup).toHaveBeenCalledWith("es", "SP", "auth-data");
    });

    it("should init one trust", async () => {
      initOneTrust.mockReset();

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", localeCode: "es-ES" },
              productId: "PRODUCT_ID",
            },
          },
        },
      });

      expect(initOneTrust).not.toHaveBeenCalled();
    });

    it("should init o11y attributes", async () => {
      initOneTrust.mockReset();

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      const entities = {
        userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", localeCode: "es-ES" },
        productId: "PRODUCT_ID",
      };
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities,
          },
        },
      });

      const { SplunkRum } = require("@splunk/otel-react-native");
      // Called twice: once for app context attributes, once for network attributes
      expect(SplunkRum.instance.globalAttributes.setAll).toHaveBeenCalledTimes(2);
    });

    it("should add offline context when user is not logged in", async () => {
      const nextSpy = jest.fn();
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getExchangeBettingModule.mockReturnValueOnce("getExchangeBettingModule");
      getWebMessagesRequestModule.mockReturnValueOnce("getWebMessagesRequestModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
              productId: "PRODUCT_ID",
            },
          },
        },
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(store.addModule).toHaveBeenCalledTimes(3);
      expect(getSportsbookBettingModule).toHaveBeenCalledTimes(1);
      expect(getExchangeBettingModule).toHaveBeenCalledTimes(1);
      expect(getSportsbookBettingModule).toHaveBeenCalledWith(Storage);
      expect(getExchangeBettingModule).toHaveBeenCalledWith();
      expect(store.addModule).toHaveBeenNthCalledWith(1, "getSportsbookBettingModule");
      expect(store.addModule).toHaveBeenNthCalledWith(2, "getExchangeBettingModule");
      expect(store.addModule).toHaveBeenNthCalledWith(3, "getWebMessagesRequestModule");

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith(actionMock);
      expect(nextSpy).toHaveBeenCalledBefore(store.addModule);
    });

    it("should add online context store dynamic modules when user is logged in", async () => {
      const nextSpy = jest.fn();
      getWalletModule.mockReturnValueOnce("getWalletModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: true },
              productId: "PRODUCT_ID",
            },
          },
        },
      };

      const removeSpy = jest.fn();
      store.addModule.mockReturnValue({ remove: removeSpy });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(nextSpy)(actionMock);
      expect(removeSpy).not.toHaveBeenCalled();
      expect(store.addModule).toHaveBeenCalledTimes(4);
      expect(store.addModule).toHaveBeenNthCalledWith(4, "getWalletModule");
    });

    it("should remove wallet if already initialised", async () => {
      const nextSpy = jest.fn();
      getWalletModule.mockReturnValueOnce("getWalletModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: true },
              productId: "PRODUCT_ID",
            },
          },
        },
      };

      const removeSpy = jest.fn();
      store.addModule
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({ remove: removeSpy });
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

      expect(removeSpy).not.toHaveBeenCalled();
      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith();
    });

    it("should not dispatch catalogue fetch action when urn is not available in the router state", async () => {
      const nextSpy = jest.fn();
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getExchangeBettingModule.mockReturnValueOnce("getExchangeBettingModule");
      getWebMessagesRequestModule.mockReturnValueOnce("getWebMessagesRequestModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
              productId: "PRODUCT_ID",
            },
          },
        },
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(storeMock.dispatch).not.toHaveBeenCalledWith({
        type: REFRESH,
        payload: {
          urn: "fake-urn",
          shouldRefreshBottomBar: true,
        },
      });
    });

    it("should dispatch catalogue refresh action and reset apollo cache with app context when urn is available in the router state", async () => {
      const nextSpy = jest.fn();
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getExchangeBettingModule.mockReturnValueOnce("getExchangeBettingModule");
      getWebMessagesRequestModule.mockReturnValueOnce("getWebMessagesRequestModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
              productId: "PRODUCT_ID",
            },
          },
        },
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledWith({
        type: REFRESH,
        payload: {
          urn: "fake-urn",
          shouldRefreshBottomBar: true,
        },
      });

      expect(resetApolloCacheWithAppContext).toHaveBeenCalledTimes(1);
    });

    it("should load app context into apollo cache", async () => {
      const nextSpy = jest.fn();
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getSportsbookBettingModule.mockReturnValueOnce("getSportsbookBettingModule");
      getExchangeBettingModule.mockReturnValueOnce("getExchangeBettingModule");
      getWebMessagesRequestModule.mockReturnValueOnce("getWebMessagesRequestModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: {
          userdetails: { jurisdiction: undefined },
        },
      });
      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          queryResponse: {
            AppContext: {
              __typename: "AppContextDetails",
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
            },
          },
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
              productId: "PRODUCT_ID",
            },
          },
        },
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(apolloCacheWarmUp.loadAppContext).toHaveBeenCalledTimes(1);
      expect(apolloCacheWarmUp.loadAppContext).toHaveBeenCalledWith({
        AppContext: {
          __typename: "AppContextDetails",
          userdetails: { countryCode: "SP", jurisdiction: { jurisdiction: "es" }, loggedIn: false },
        },
      });
    });

    describe("when logging out", () => {
      it("should dispatch BETTING__SBK_CLEAR_ACTION and BETTING__OBB_CLEAR_ACTION", async () => {
        AppUpdate.isAndroid = true;
        const nextSpy = jest.fn();
        const dispatchSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: "", loggedIn: true },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                appversion: {},
                userdetails: { countryCode: "IE", loggedIn: false, jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(dispatchSpy, store))(nextSpy)(actionMock);

        expect(dispatchSpy).toHaveBeenCalledWith({ type: BETTING__SBK_CLEAR_ACTION });
        expect(dispatchSpy).toHaveBeenCalledWith({ type: BETTING__OBB_CLEAR_ACTION });
      });
    });

    describe("when force update", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        AppUpdate.checkAppUpdate.mockImplementation(() => {
          AppUpdate.appUpdateStatus = 2;
        }); // Force
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                appversion: {
                  android: {
                    storeUrl: androidStoreLink,
                    downloadUrl: androidDownloadLink,
                    versionCode: 7,
                    minVersionCode: 6,
                    minOSVersion: "10.0",
                    blackList: [],
                  },
                },
                userdetails: { countryCode: "IE", jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when suggest update", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        AppUpdate.checkAppUpdate.mockImplementation(() => {
          AppUpdate.appUpdateStatus = 1;
        }); // Suggest
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: "INTERNATIONAL" },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                appversion: {
                  android: {
                    storeUrl: androidStoreLink,
                    downloadUrl: androidDownloadLink,
                    versionCode: 7,
                    minVersionCode: 3,
                    minOSVersion: "10.0",
                    blackList: [],
                  },
                },
                userdetails: { countryCode: "IE" },
                productId: "PRODUCT_ID",
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when unsupported device", () => {
      it("should call displaySuggestOrForceUpdate", async () => {
        AppUpdate.isAndroid = true;
        AppUpdate.checkAppUpdate.mockImplementation(() => {
          AppUpdate.appUpdateStatus = 3;
        }); // Unsupported
        const nextSpy = jest.fn();
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: "INTERNATIONAL" },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                appversion: {
                  android: {
                    storeUrl: androidStoreLink,
                    downloadUrl: androidDownloadLink,
                    versionCode: 5,
                    minVersionCode: 3,
                    minOSVersion: "11.1",
                    blackList: [],
                  },
                },
                userdetails: { countryCode: "IE", jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(nextSpy)(actionMock);

        expect(AppUpdate.displaySuggestOrForceUpdate).toHaveBeenCalled();
      });
    });

    describe("when a jurisdiction is already available", () => {
      beforeEach(() => {
        AppUpdate.appUpdateStatus = 0;
        AppUpdate.checkAppUpdate.mockReset();
      });

      it("should not init cet framework", async () => {
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: { jurisdiction: "ES" } },
          },
        });
        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "ES" }, countryCode: "SP" },
                productId: "PRODUCT_ID",
              },
            },
          },
        });

        expect(initialCetFrameworkSetup).not.toHaveBeenCalled();
      });

      it("should not init one trust", async () => {
        initOneTrust.mockReset();

        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: { jurisdiction: "es" } },
          },
        });
        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP" },
                productId: "PRODUCT_ID",
              },
            },
          },
        });

        expect(initOneTrust).not.toHaveBeenCalled();
      });

      it("should add online context when user is logged in", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const nextSpy = jest.fn();
        getWalletModule.mockReturnValueOnce("getWalletModule");
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: { jurisdiction: "es" } },
          },
        });
        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
              HOST: "host/",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: true },
                productId: "PRODUCT_ID",
              },
            },
          },
        };
        const storeMock = setupStoreFn(undefined, store);
        const removeSpy = jest.fn();

        store.addModule.mockReturnValueOnce({ remove: removeSpy });

        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);
        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledWith(actionMock);
        expect(store.addModule).toHaveBeenCalledWith("getWalletModule");

        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);

        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(store.addModule).toHaveBeenCalledTimes(2);
        expect(store.addModule).toHaveBeenCalledWith("getWalletModule");

        expect(nextSpy).toHaveBeenCalledTimes(2);
      });

      it("should not add online context when user is logged out", async () => {
        const nextSpy = jest.fn();
        getWalletModule.mockReturnValueOnce("getWalletModule");

        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: { jurisdiction: "es" } },
          },
        });

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP", loggedIn: false },
                productId: "PRODUCT_ID",
              },
            },
          },
        };
        const storeMock = setupStoreFn(undefined, store);
        const removeSpy = jest.fn();
        store.addModule.mockReturnValueOnce({ remove: removeSpy });

        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);
        expect(removeSpy).not.toHaveBeenCalled();

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledWith(actionMock);
        expect(nextSpy).toHaveBeenCalledBefore(store.addModule);
        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);

        expect(removeSpy).not.toHaveBeenCalled();
        expect(store.addModule).not.toHaveBeenCalled();
      });
    });

    describe("when there's no product ID defined", () => {
      it("should throw an error", async () => {
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

        store.getState.mockReturnValue({
          router: { currentUrn: "fake-urn" },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });

        const next = jest.fn();
        const mockStore = setupStoreFn(undefined, store);
        const middleware = createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(mockStore)(next);

        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              ENV: "env",
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: { MOCKED: "endpoints const", CBS: { channel: "test-channel" } },
              ADOBE_SDK: "adobe-sdk config",
              BETSLIP_CONFIG: "betslip config",
              LOOP_CLIENT_CONFIG: "loop client config",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
              HOST: "host/",
              HOMEPAGE_PATHS: "homepage-paths",
              // PRODUCT_ID intentionally missing
            },
            initialState: {
              entities: {
                appversion: {},
                userdetails: {
                  jurisdiction: {
                    jurisdiction: "INTERNATIONAL",
                  },
                },
              },
            },
          },
        };

        await expect(middleware(action)).rejects.toThrow(
          "Missing PRODUCT_ID in NETWORK__FETCH_APP_CONTEXT_SUCCESS payload",
        );
      });
    });

    describe("haptic feedback", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        AppUpdate.appUpdateStatus = 0;
      });

      it("should enable haptics when HAPTIC_FEEDBACK throttle is active", async () => {
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP" },
                productId: "PRODUCT_ID",
                throttles: {
                  HAPTIC_FEEDBACK: { isActive: true },
                },
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())(actionMock);

        expect(setHapticsEnabled).toHaveBeenCalledWith(true);
      });

      it("should disable haptics when HAPTIC_FEEDBACK throttle is inactive", async () => {
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP" },
                productId: "PRODUCT_ID",
                throttles: {
                  HAPTIC_FEEDBACK: { isActive: false },
                },
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())(actionMock);

        expect(setHapticsEnabled).toHaveBeenCalledWith(false);
      });

      it("should not call setHapticsEnabled when HAPTIC_FEEDBACK throttle is not present", async () => {
        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
        store.getState.mockReturnValue({
          router: { currentUrn: undefined },
          entities: {
            userdetails: { jurisdiction: undefined },
          },
        });

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
            },
            initialState: {
              entities: {
                userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP" },
                productId: "PRODUCT_ID",
              },
            },
          },
        };

        await createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())(actionMock);

        expect(setHapticsEnabled).not.toHaveBeenCalled();
      });
    });
  });

  describe("OTA update check", () => {
    it("should call checkAndDownloadOtaUpdate with the store throttles", async () => {
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      const throttles = { ENABLE_OTA_UPDATES: { isActive: true } };
      store.getState.mockReturnValue({
        router: { currentUrn: undefined },
        entities: {
          userdetails: { jurisdiction: undefined },
          throttles,
        },
      });

      await createAppContextMiddleware(
        store,
        appKey,
        userAgent,
        initialCetFrameworkSetup,
        onReady,
      )(setupStoreFn(undefined, store))(jest.fn())({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          environment: {
            REFRESH_RATES: "refresh-rates",
            ENDPOINTS: "endpoints const",
            ASSETS: "assets",
            AUTH_DATA: "auth-data",
            BASE_PATH: "base-path",
          },
          initialState: {
            entities: {
              userdetails: { jurisdiction: { jurisdiction: "es" }, countryCode: "SP" },
              productId: "PRODUCT_ID",
              throttles,
            },
          },
        },
      });

      expect(checkAndDownloadOtaUpdate).toHaveBeenCalledTimes(1);
      expect(checkAndDownloadOtaUpdate).toHaveBeenCalledWith(throttles);
    });
  });

  describe("when action is 'NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING'", () => {
    describe("and isBlockedTerritory is true", () => {
      it("should init one trust before calling next", async () => {
        const nextSpy = jest.fn();

        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
          payload: {
            details: { isBlockedTerritory: true },
          },
        };
        const storeMock = setupStoreFn(undefined, store);
        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);

        expect(initOneTrust).not.toHaveBeenCalled();
      });
    });

    describe("and isBlockedTerritory is false", () => {
      it("should not init one trust", async () => {
        const nextSpy = jest.fn();

        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
          payload: {
            details: { isBlockedTerritory: false },
          },
        };
        const storeMock = setupStoreFn(undefined, store);
        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);

        expect(initOneTrust).not.toHaveBeenCalled();
      });

      it("should forward the next action but not add or remove dynamic modules", async () => {
        const nextSpy = jest.fn();
        getWalletModule.mockReturnValueOnce("getWalletModule");

        const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

        const actionMock = {
          type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
          payload: {
            details: { isBlockedTerritory: false },
          },
        };
        const storeMock = setupStoreFn(undefined, store);
        await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(
          nextSpy,
        )(actionMock);

        expect(store.addModule).not.toHaveBeenCalled();

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expect(nextSpy).toHaveBeenCalledWith(actionMock);
      });
    });
  });

  describe("when action is 'NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE'", () => {
    it("should emit a NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE event", async () => {
      jest.spyOn(DeviceEventEmitter, "emit");

      const nextSpy = jest.fn();
      getWalletModule.mockReturnValueOnce("getWalletModule");

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE);
      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith(actionMock);
    });

    it("should build apollo client with the catalogue fallback endpoint and notify onReady", async () => {
      const nextSpy = jest.fn();
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

      const actionMock = {
        type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
      };
      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(buildApolloClient).toHaveBeenCalledTimes(1);
      expect(buildApolloClient).toHaveBeenCalledWith({
        state: storeMock.getState(),
        catalogueEndpoint: "base-path/bff-gql/v11",
        appKey: "app-key",
        batching: false,
      });

      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action is 'NETWORK__PLACE_SBK_BET_SUCCESS'", () => {
    it("should call appsFlyerTacker.logEvent for each combination", async () => {
      const nextSpy = jest.fn();

      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();

      store.getState.mockReturnValue({
        entities: {
          userdetails: {
            accountId: "acc123",
            countryCode: "IE",
            jurisdiction: { jurisdiction: "INTERNATIONAL" },
            currencyCode: "EUR",
            loggedIn: true,
          },
        },
      });

      const actionMock = {
        type: NETWORK__PLACE_SBK_BET_SUCCESS,
        payload: {
          report: {
            result: {
              combinations: {
                combo1: {
                  displayOdds: { decimalOdds: 2.3400000001 },
                  betType: "MULTI",
                  betReceiptId: "receipt1",
                  betId: "bet1",
                  totalStake: 10.1999999999,
                  legs: ["leg1"],
                },
                combo2: {
                  betType: "SINGLE",
                  betReceiptId: "receipt2",
                  betId: "bet2",
                  totalStake: 20,
                  legs: ["leg2"],
                },
                combo3: {
                  betType: "SINGLE",
                  betReceiptId: "receipt3",
                  betId: "bet3",
                  totalStake: 30,
                  legs: ["leg3"],
                },
              },
              legs: {
                leg1: { displayOdds: { decimalOdds: 5.1 } },
                leg2: { displayOdds: { decimalOdds: 3.9000000001 } },
                leg3: {},
              },
            },
          },
        },
      };

      const storeMock = setupStoreFn(undefined, store);
      await createAppContextMiddleware(store, appKey, userAgent, initialCetFrameworkSetup, onReady)(storeMock)(nextSpy)(
        actionMock,
      );

      expect(appsFlyerTacker.logEvent).toHaveBeenCalledTimes(3);
      expect(appsFlyerTacker.logEvent).toHaveBeenNthCalledWith(
        1,
        "placed_bet",
        expect.objectContaining({
          account_id: "acc123",
          af_sub1: "rfr-cookie",
          af_country: "IE",
          jurisdiction: "international",
          product: "Native",
          af_currency: "EUR",
          price: "2.34",
          bet_type: "MULTI",
          transaction_id: "receipt1",
          bet_id: "bet1",
          af_revenue: "10.20",
        }),
      );

      expect(appsFlyerTacker.logEvent).toHaveBeenNthCalledWith(
        2,
        "placed_bet",
        expect.objectContaining({
          account_id: "acc123",
          af_sub1: "rfr-cookie",
          af_country: "IE",
          jurisdiction: "international",
          product: "Native",
          af_currency: "EUR",
          price: "3.90",
          bet_type: "SINGLE",
          transaction_id: "receipt2",
          bet_id: "bet2",
          af_revenue: "20.00",
        }),
      );

      expect(appsFlyerTacker.logEvent).toHaveBeenNthCalledWith(
        3,
        "placed_bet",
        expect.objectContaining({
          account_id: "acc123",
          af_sub1: "rfr-cookie",
          af_country: "IE",
          jurisdiction: "international",
          product: "Native",
          af_currency: "EUR",
          bet_type: "SINGLE",
          transaction_id: "receipt3",
          bet_id: "bet3",
          af_revenue: "30.00",
        }),
      );

      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe("when there's an error", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      getBasePath.mockReturnValue("base-path");
      AppUpdate.appUpdateStatus = 0; // Hidden
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    it("should handle buildEndpoints error gracefully", async () => {
      buildEndpoints.mockImplementation(() => {
        throw new Error("buildEndpoints failed");
      });
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: { userdetails: { jurisdiction: undefined } },
      });

      await expect(
        createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
              HOST: "host/",
            },
            initialState: {
              entities: {
                appversion: {},
                userdetails: { jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        }),
      ).resolves.not.toThrow();
    });

    it("should handle setEndpointsConfig error gracefully", async () => {
      setEndpointsConfig.mockImplementation(() => {
        throw new Error("setEndpointsConfig failed");
      });
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: { userdetails: { jurisdiction: undefined } },
      });

      await expect(
        createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
              HOST: "host/",
            },
            initialState: {
              entities: {
                appversion: {},
                userdetails: { jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        }),
      ).resolves.not.toThrow();
    });

    it("should handle setupAssets error gracefully", async () => {
      setupAssets.mockImplementation(() => {
        throw new Error("setupAssets failed");
      });
      const { store, appKey, userAgent, initialCetFrameworkSetup, onReady } = setupCreateFn();
      store.getState.mockReturnValue({
        router: { currentUrn: "fake-urn" },
        entities: { userdetails: { jurisdiction: undefined } },
      });

      await expect(
        createAppContextMiddleware(
          store,
          appKey,
          userAgent,
          initialCetFrameworkSetup,
          onReady,
        )(setupStoreFn(undefined, store))(jest.fn())({
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            environment: {
              REFRESH_RATES: "refresh-rates",
              ENDPOINTS: "endpoints const",
              ASSETS: "assets",
              AUTH_DATA: "auth-data",
              BASE_PATH: "base-path",
              HOST: "host/",
            },
            initialState: {
              entities: {
                appversion: {},
                userdetails: { jurisdiction: { jurisdiction: "INTERNATIONAL" } },
                productId: "PRODUCT_ID",
              },
            },
          },
        }),
      ).resolves.not.toThrow();
    });
  });
});
