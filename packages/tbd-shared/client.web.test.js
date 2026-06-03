import i18next from "i18next";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { getConfiguredStore } from "./store-init.web";
import { buildEndpoints, setEndpointsConfig, setProdIdConfig } from "./config/endpoints";
import { setCookie } from "./helpers/cookies.web";
import { setCookieTheme } from "./config/cookie-theme.web";
import registerEventProcessors from "./event-processors/registry.web";
import { setNewRelicCustomAttributes } from "./helpers/newrelic.web";
import { setOtelCustomAttributes } from "./helpers/otel.web";
import setupTheBridge from "./the-bridge-wrapper/setup.web";

jest.mock("i18next");
jest.mock("@ppb/betslip-core", () => ({ init: jest.fn(() => "mockInit") }));
jest.mock("@ppb/tbd-store", () => ({
  disableExcOnboarding: jest.fn(),
  createGetThrottleSelector: jest.fn(() => jest.fn()),
  buildBootInitialState: jest.fn(),
}));
jest.mock("@ppb/tbd-store/middlewares/http-poller/internet-status");
jest.mock("./config/public-path", () => ({}));
jest.mock("./store-init.web", () => ({ getConfiguredStore: jest.fn() }));
jest.mock("./config/endpoints", () => ({
  buildEndpoints: jest.fn(),
  setEndpointsConfig: jest.fn(),
  setDesktopHeaderConfig: jest.fn(),
  setProdIdConfig: jest.fn(),
  setBetslipConfig: jest.fn(),
  setLoopClientConfig: jest.fn(),
}));
jest.mock("./helpers/cookies.web", () => ({ setCookie: jest.fn(), getCookie: jest.fn() }));
jest.mock("./config/cookie-theme.web", () => ({ setCookieTheme: jest.fn() }));
jest.mock("./helpers/remove-hash-mark.web", () => ({ removeHashMark: jest.fn() }));
jest.mock("./helpers/newrelic.web", () => ({ setNewRelicCustomAttributes: jest.fn() }));
jest.mock("./helpers/otel.web", () => ({ setOtelCustomAttributes: jest.fn() }));
jest.mock("./apollo-client/cache-warmup", () => ({
  apolloCacheWarmUp: {
    loadAppContext: jest.fn(),
    loadCatalogue: jest.fn(),
  },
}));
jest.mock("./apollo-client/cache-listeners", () => ({
  apolloCacheListeners: {
    setupListeners: jest.fn(),
  },
}));
jest.mock("./apollo-client/client", () => ({ buildApolloClient: jest.fn() }));
jest.mock("./event-processors/registry.web", () => jest.fn());
jest.mock("./the-bridge-wrapper/setup.web", () => jest.fn());

describe("initClient", () => {
  let initClient;

  beforeEach(async () => {
    jest.resetAllMocks();

    getConfiguredStore.mockResolvedValue({
      getState: jest.fn(() => ({})),
    });

    window.__PRELOADED_STATE__ = {
      entities: {
        appkey: "mock-app-key",
        productId: "mock-product-id",
        userdetails: { localeCodeBcp47: "en" },
      },
      boot: {},
    };

    window.__TBD_CLIENT_CONTEXT__ = { wrapper: true };
    window.__TBD_APP_COMMANDS__ = {};
    window.__TBD_ENVIRONMENT__ = {
      APP_KEY: "mock-app-key",
      PRODUCT_ID: "mock-product-id",
    };
    window.__TBD__ = { TRANSLATIONS: {} };
    window.__TBD_PRELOADED_CATALOG__ = undefined;
    window.location = { origin: "http://localhost.betfair.com" };

    buildEndpoints.mockReturnValue({ CATALOGUE: "catalogue-endpoint" });
    createGetThrottleSelector.mockReturnValue(() => undefined);

    const module = await import("./client.web");
    initClient = module.initClient;
  });

  it("should initialize the client successfully", async () => {
    await initClient({ payouts: {} });

    expect(i18next.init).toHaveBeenCalled();
    expect(buildEndpoints).toHaveBeenCalled();
    expect(setEndpointsConfig).toHaveBeenCalled();
    expect(setProdIdConfig).toHaveBeenCalledWith("mock-product-id");
    expect(setCookie).toHaveBeenCalledWith("exp", "bf", "/");
    expect(setCookieTheme).toHaveBeenCalled();
    expect(registerEventProcessors).toHaveBeenCalled();
    expect(setupTheBridge).toHaveBeenCalled();
    expect(setNewRelicCustomAttributes).toHaveBeenCalled();
    expect(setOtelCustomAttributes).toHaveBeenCalled();
  });

  it("should throw if APP_KEY or PRODUCT_ID are missing", async () => {
    window.__PRELOADED_STATE__ = {
      entities: {
        userdetails: { localeCodeBcp47: "en" },
      },
      boot: {},
    };
    window.__TBD_ENVIRONMENT__ = {};

    await expect(initClient({ payouts: {} })).rejects.toThrow("Missing APP_KEY or PRODUCT_ID");
  });

  it("should register network listeners", async () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    await initClient({ payouts: {} });

    expect(addEventListenerSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("offline", expect.any(Function));
  });
});
