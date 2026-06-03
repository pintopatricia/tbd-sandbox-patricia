/* eslint-disable no-undef */
import { DeviceEventEmitter, Linking } from "react-native";
import { cetMainConfiguration } from "@flutter-global/react-native-cet-framework";

import { navigateMaintenanceScreen } from "@ppb/tbd-router/native";
import { NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE } from "@ppb/tbd-store/actions/app-context";
import createStore from "@ppb/tbd-store/create-store";
import { loadStorageData } from "@ppb/tbd-store/helpers/storage";
import {
  authenticationFailureMiddleware,
  catalogueFailureMiddleware,
  keepAliveMiddleware,
  storageMiddleware,
} from "@ppb/tbd-store/middlewares/index.native";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getEventPushHandlerModule } from "@ppb/tbd-store/modules";
import { getCampaignMeasurementModule } from "@ppb/tbd-store/modules/campaign-measurement-module";
import { getPushNotificationsModule } from "@ppb/tbd-store/modules/push-notifications-load-module";
import { INITIAL_STATE as routerInitialState } from "@ppb/tbd-store/state/router/router-slice";
import { createMaintenanceStatusMiddleware } from "@ppb/tbd-store/middlewares/maintenance-status";

import Storage from "../helpers/storage.native";
import { getThrottlesSettings } from "../config/settings-utils.native";
import { setCustomHeaders } from "../helpers/custom-headers.native";
import { getCustomUserAgent } from "../helpers/user-agent.native";
import { buildPreloadedState, getStoreOptions, initStore } from "./store.native";

jest.mock("react-native", () => ({
  Appearance: { getColorScheme: () => "light" },
  DeviceEventEmitter: { emit: jest.fn() },
  Linking: {
    getInitialURL: jest.fn(),
  },
  Platform: { OS: "ios" },
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  cetMainConfiguration: {
    keepAlive: jest.fn(),
  },
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateMaintenanceScreen: jest.fn(),
  NativeEntityTypes: {
    Home: "fake-urn",
  },
}));

jest.mock("../config/messaging", () => ({
  MESSAGE_CONFIG_MAP: {},
}));

jest.mock("@ppb/tbd-store/config/assets-config", () => ({
  getAssets: jest.fn(() => "NATIVE_ASSETS"),
}));

jest.mock("@ppb/tbd-store/create-store", () => jest.fn(() => ({ addModule: jest.fn() })));

jest.mock("@ppb/tbd-store/helpers/storage", () => ({
  loadStorageData: jest.fn(() => ({
    state: "state",
  })),
}));

jest.mock("@ppb/tbd-store/middlewares/index.native", () => ({
  authenticationFailureMiddleware: jest.fn(() => "authenticationFailureMiddleware"),
  keepAliveMiddleware: jest.fn(() => "keepAliveMiddleware"),
  preferencesMiddleware: jest.fn(() => "preferencesMiddleware"),
  rateMyAppMiddleware: jest.fn(() => "rateMyAppMiddleware"),
  storageMiddleware: jest.fn(() => "storageMiddleware"),
  catalogueFailureMiddleware: jest.fn(() => "catalogueFailureMiddleware"),
}));

jest.mock("@ppb/tbd-store/modules/campaign-measurement-module", () => ({
  getCampaignMeasurementModule: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules", () => ({
  getEventPushHandlerModule: jest.fn(),
}));

jest.mock("@ppb/tbd-store/modules/push-notifications-load-module", () => ({
  getPushNotificationsModule: jest.fn(),
}));

jest.mock("../helpers/performance/performance-metrics-middleware.native", () => ({
  createPerformanceMetricsMiddleware: () => {},
}));

jest.mock("../helpers/quantum-metric-middleware.native", () => ({
  quantumMetricMiddleware: () => {},
}));

jest.mock("../helpers/qualtrics-middleware.native", () => ({
  qualtricsMiddleware: () => {},
}));

jest.mock("../config/settings-utils.native", () => ({
  getThrottlesSettings: jest.fn(() => ({
    feature2: "feature2",
  })),
}));

jest.mock("../helpers/custom-headers.native", () => ({
  setCustomHeaders: jest.fn(() => Promise.resolve()),
}));

jest.mock("../helpers/user-agent.native", () => ({
  getCustomUserAgent: jest.fn().mockReturnValue("fake-user-agent"),
}));

jest.mock("@ppb/tbd-store/middlewares/logging/crash-reporter.native", () => ({
  crashReporter: jest.fn(),
}));

jest.mock("@ppb/tbd-store/middlewares/maintenance-status", () => ({
  createMaintenanceStatusMiddleware: jest.fn(() => () => {}),
}));

jest.mock("../helpers/error-handling-middleware", () => ({
  createErrorHandlingMiddleware: jest.fn(() => () => {}),
}));

jest.mock("../gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
}));

jest.mock("../helpers/storage.native", () => ({
  setItem: jest.fn(),
}));

jest.mock("../helpers/rating", () => ({}));

jest.mock("../helpers/urn-middleware", () => ({
  createUrnMiddleware: jest.fn(() => "createUrnMiddleware"),
}));

jest.mock("./dev/Reactotron.native.config", () => ({
  default: {
    createEnhancer: jest.fn(() => "reactotronEnhancer"),
  },
}));

jest.mock("../config/app-configuration.native", () => ({
  maxPayoutLimits: {
    DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
  },
  appConfig: {
    APP_KEYS: { ios: "IOS_KEY", android: "ANDROID_KEY" },
  },
}));

jest.mock(
  "@flutter-global/react-native-cet-framework/lib/commonjs/authentication/common/services/login-keychain",
  () => ({
    loadAuthData: jest.fn(() => Promise.resolve({ ssoid: "mock-token", loginTimestamp: null })),
  }),
);

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  setApplicationKey: jest.fn(),
}));

jest.mock("../helpers/app-context/app-context-module.native", () => ({
  getAppContextModule: jest.fn((...args) => {
    const onReady = args[args.length - 1];
    if (typeof onReady === "function") {
      onReady();
    }
    return { id: "app-context-module" };
  }),
}));

const mockCetFrameworkSetup = jest.fn();

const mockPersistedState = { state: "state" };

describe("Build Preloaded State", () => {
  beforeEach(jest.clearAllMocks);

  it("should call getThrottlesSettings", () => {
    buildPreloadedState(mockPersistedState, null);

    expect(getThrottlesSettings).toHaveBeenCalled();
  });

  it("should build the correct preloaded state", () => {
    const response = buildPreloadedState(mockPersistedState, null);

    expect(response).toEqual({
      entities: {
        throttles: {
          feature2: "feature2",
        },
      },
      router: {
        ...routerInitialState,
        currentUrn: "fake-urn",
      },
      boot: {
        allowLoadFromStorage: true,
        exchangeEnabled: undefined,
      },
      state: "state",
    });
  });

  describe("when app is launching for the first time and called with exc parameter", () => {
    describe("and the parameter is true", () => {
      it("should build the correct preloaded state with exchangeEnable equals true", () => {
        const response = buildPreloadedState(mockPersistedState, "bfe://exc=true");
        expect(response).toEqual({
          entities: {
            throttles: {
              feature2: "feature2",
            },
          },
          router: {
            ...routerInitialState,
            currentUrn: "fake-urn",
          },
          boot: {
            allowLoadFromStorage: true,
            exchangeEnabled: true,
          },
          state: "state",
        });
      });
    });

    describe("and the parameter is false", () => {
      it("should build the correct preloaded state with exchangeEnable equals false", () => {
        const response = buildPreloadedState(mockPersistedState, "bfe://exc=false");
        expect(response).toEqual({
          entities: {
            throttles: {
              feature2: "feature2",
            },
          },
          router: {
            ...routerInitialState,
            currentUrn: "fake-urn",
          },
          boot: {
            allowLoadFromStorage: true,
            exchangeEnabled: false,
          },
          state: "state",
        });
      });
    });

    describe("and the parameter is different from the expected values", () => {
      it("should build the correct preloaded state with exchangeEnabled equals undefined", () => {
        const response = buildPreloadedState(mockPersistedState, "bfe://exc=truly");
        expect(response).toEqual({
          entities: {
            throttles: {
              feature2: "feature2",
            },
          },
          router: {
            ...routerInitialState,
            currentUrn: "fake-urn",
          },
          boot: {
            allowLoadFromStorage: true,
            exchangeEnabled: undefined,
          },
          state: "state",
        });
      });
    });
  });
});

describe("Init Store", () => {
  beforeEach(jest.clearAllMocks);

  describe("when in PROD mode", () => {
    beforeEach(() => {
      __DEV__ = false;
    });

    it("should call getCustomUserAgent", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(getCustomUserAgent).toHaveBeenCalled();
    });

    it("should set custom headers before store creation", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(setCustomHeaders).toHaveBeenCalledTimes(1);
      expect(setCustomHeaders).toHaveBeenCalledWith(Storage);
      expect(createStore).toHaveBeenCalled();
      expect(setCustomHeaders.mock.invocationCallOrder[0]).toBeLessThan(createStore.mock.invocationCallOrder[0]);
    });

    it("should call createStore with the correct parameters", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(createStore).toHaveBeenCalledWith("NATIVE_ASSETS", "IOS_KEY", {
        preloadedState: expect.any(Object),
        messaging: {},
        overrideUserAgent: "fake-user-agent",
        storage: Storage,
        payouts: {
          limits: {
            DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
          },
        },

        gtm: expect.objectContaining({
          collectorFn: expect.any(Function),
          getCookie: expect.any(Function),
          platformType: "native",
          theme: "light",
        }),
        middlewares: expect.arrayContaining([
          expect.any(Function),
          "storageMiddleware",
          "rateMyAppMiddleware",
          expect.any(Function),
          expect.any(Function),
          "createUrnMiddleware",
          expect.any(Function),
          "authenticationFailureMiddleware",
          expect.any(Function),
          expect.any(Function),
          expect.any(Function),
          "keepAliveMiddleware",
        ]),
      });
    });

    it("should call the correct middlewares", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(storageMiddleware).toHaveBeenCalledTimes(1);
      expect(storageMiddleware).toHaveBeenCalledWith(Storage);

      expect(createMaintenanceStatusMiddleware).toHaveBeenCalledTimes(1);
      expect(createMaintenanceStatusMiddleware).toHaveBeenCalledWith(navigateMaintenanceScreen);
      expect(keepAliveMiddleware).toHaveBeenCalledTimes(1);
      expect(keepAliveMiddleware).toHaveBeenCalledWith(cetMainConfiguration.keepAlive);
    });

    it("should add the correct modules to store", async () => {
      const store = await initStore(mockCetFrameworkSetup);

      expect(store.addModule).toHaveBeenCalledTimes(4);
      expect(store.addModule).toHaveBeenCalledWith(getEventPushHandlerModule());
      expect(store.addModule).toHaveBeenCalledWith(getPushNotificationsModule());
      expect(store.addModule).toHaveBeenCalledWith(
        getCampaignMeasurementModule({
          collectorFn: jest.fn(),
          platformType: PlatformType.Native,
          initialUrlFn: jest.fn(),
        }),
      );
    });

    it("should continue bootstrapping when setting custom headers fails", async () => {
      setCustomHeaders.mockRejectedValueOnce(new Error("header failure"));

      await expect(initStore(mockCetFrameworkSetup)).resolves.toEqual(
        expect.objectContaining({ addModule: expect.any(Function) }),
      );
      expect(createStore).toHaveBeenCalled();
    });
  });

  describe("when in DEV mode", () => {
    beforeEach(() => {
      __DEV__ = true;
    });

    it("should call createStore with the correct parameters", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(createStore).toHaveBeenCalledWith("NATIVE_ASSETS", "IOS_KEY", {
        preloadedState: expect.any(Object),
        messaging: {},
        overrideUserAgent: "fake-user-agent",
        storage: Storage,
        payouts: {
          limits: { DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" } },
        },
        gtm: expect.objectContaining({
          collectorFn: expect.any(Function),
          getCookie: expect.any(Function),
          platformType: "native",
          theme: "light",
        }),
        middlewares: expect.arrayContaining([
          expect.any(Function),
          "storageMiddleware",
          "rateMyAppMiddleware",
          expect.any(Function),
          expect.any(Function),
          "createUrnMiddleware",
          expect.any(Function),
          "authenticationFailureMiddleware",
          expect.any(Function),
          expect.any(Function),
          "keepAliveMiddleware",
          expect.any(Function),
        ]),
        enhancers: ["reactotronEnhancer"],
      });
    });

    it("should add the correct modules to store", async () => {
      const store = await initStore(mockCetFrameworkSetup);

      expect(store.addModule).toHaveBeenCalledTimes(4);
      expect(store.addModule).toHaveBeenCalledWith(getEventPushHandlerModule());
      expect(store.addModule).toHaveBeenCalledWith(getPushNotificationsModule());
      expect(store.addModule).toHaveBeenCalledWith(
        getCampaignMeasurementModule({
          collectorFn: jest.fn(),
          platformType: PlatformType.Native,
          initialUrlFn: jest.fn(),
        }),
      );
    });
  });

  describe("handleAuthenticationFailure middleware", () => {
    it("should add middleware that emits NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE on authentication failure", async () => {
      await initStore(mockCetFrameworkSetup);

      expect(authenticationFailureMiddleware).toHaveBeenCalledWith(expect.any(Function));
      expect(authenticationFailureMiddleware).toHaveBeenCalledTimes(1);
      const [handler] = authenticationFailureMiddleware.mock.calls[0];

      handler();
      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE);
      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getStoreOptions", () => {
  it("should get store options", async () => {
    await initStore(mockCetFrameworkSetup);
    expect(getStoreOptions()).toEqual({
      gtm: expect.any(Object),
      messaging: {},
      payouts: {
        limits: {
          DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
        },
      },
      middlewares: expect.any(Array),
      overrideUserAgent: "fake-user-agent",
      storage: Storage,
      enhancers: ["reactotronEnhancer"],
    });
  });
});
