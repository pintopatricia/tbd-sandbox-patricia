import { buildAppContext, buildEnvironmentForJurisdiction, resolveAppCommands } from "@ppb/tbd-store";
import getResponse from "./controller";
import htmlTemplate from "./templates/master";
import mockEnvironment from "./config/environment.json";
import { getLocaleFromURL } from "./services/jurisdictions-service";
import { fetchAppContext, fetchAppVersion, getPreloadedCatalogData } from "./services/preload-catalog-service";
import { determineJurisdiction } from "./helpers/determine-jurisdiction";
import { buildContext } from "./context";
import { buildAssetsConfig } from "./helpers/assets-builder";
import { buildLinkHeaderValue } from "./early-hints-helper";
import { getQueryParamsFromRequest } from "./services/query-params";
import { getGAHtmlScripts } from "./services/google-analytics-service";
import {
  setEnvironmentCookie,
  setPhoenixEnabledCookie,
  setCookies,
  buildProductPreferenceCookies,
} from "./services/cookie-service";
import { getAppIdentifier } from "./helpers/get-app-identifiers";
import { getPhoenixRouting } from "./helpers/phoenix-routing";

const REQUEST_HOST_MOCK = "www.betfair.com";

const REQUEST_URI_MOCK = "/mock/request/uri";

const USER_CONTEXT_MOCK = {
  loggedIn: true,
  jurisdiction: { jurisdiction: "INTERNATIONAL" },
  localeCode: "en_GB",
  localeCodeBcp47: "en-GB",
};

const CONTEXT_MOCK = {
  cookies: [{ name: "cookieName", value: "cookieVal" }],
  router: {
    currentRoute: null,
    view: null,
    currentView: "ppb:tbd:view:bestrouteever",
    currentUrn: "ppb:urn:1",
    currentUrl: "football/sport:1",
  },
};

const getQueryParamsFromRequestMock = {
  product: "",
  loginStatus: "",
  exchangeEnabled: "",
  desktop: "",
  throttlesOn: "",
  throttlesOff: "",
};

jest.mock("./services/query-params", () => ({
  getQueryParamsFromRequest: jest.fn(() => getQueryParamsFromRequestMock),
}));

jest.mock("./config/template-options.json", () => ({
  KEY: "val",
}));

jest.mock("./config/environment.json", () => ({
  DOMAIN_EXTENSIONS: {
    INTERNATIONAL: "com",
    SPAIN: "es",
  },
}));

jest.mock("./config/environment-backend.json", () => ({
  KEY: "val",
}));

jest.mock("./config/redirect-urls.json", () => ({
  HOME: "https://www.betfair.{domain_extension}/",
}));

jest.mock("./helpers/assets-builder", () => ({
  buildAssetsConfig: jest.fn().mockReturnValue({ PRELOAD_ASSETS: {} }),
}));

jest.mock("./helpers/get-app-identifiers", () => ({
  getAppIdentifier: jest.fn().mockReturnValue({
    product: "some product",
    productId: "some productId",
    appKey: "some app key",
    cbsChannel: "some cbsChannel",
    channel: "some channel",
  }),
}));

jest.mock("@ppb/tbd-store", () => ({
  replaceDomainPlaceholders: jest
    .fn()
    .mockImplementation((homeURL, domainExtension, domain) =>
      homeURL.replace(/{domain_extension}/g, domainExtension).replace(/{domain}/g, domain),
    ),
  buildAppContext: jest.fn().mockResolvedValue(undefined),
  buildEnvironmentForJurisdiction: jest.fn(() => mockEnvironment),
  resolveAppCommands: jest.fn(() => ({})),
  AppKeyType: { DESKTOP: "DESKTOP", MOBILE: "MOBILE" },
  ProductsOption: { exchange: "exchange", sportsbook: "sportsbook", games: "games" },
  DefaultProductOption: { lastViewed: "last_viewed", sportsbook: "sportsbook", exchange: "exchange" },
  LastViewedProductOption: { sportsbook: "sportsbook", exchange: "exchange" },
}));

jest.mock("./services/jurisdictions-service", () => ({
  getLocaleFromURL: jest.fn().mockReturnValue({ localeCode: "pt_BR", base: "/betting/" }),
}));

jest.mock("./services/cookie-service", () => ({
  setCookies: jest.fn(),
  setEnvironmentCookie: jest.fn(),
  setPhoenixEnabledCookie: jest.fn(),
  buildProductPreferenceCookies: jest.fn().mockReturnValue([]),
}));

jest.mock("./helpers/phoenix-routing", () => ({
  getPhoenixRouting: jest.fn().mockReturnValue({
    action: "serve",
    bounceUrl: undefined,
    cookieCorrections: null,
  }),
  ProductCluster: {
    EXCHANGE: "EXC",
    SPORTSBOOK: "SBK",
  },
}));

jest.mock("./services/preload-catalog-service", () => ({
  getPreloadedCatalogData: jest.fn().mockResolvedValue(undefined),
  fetchAppContext: jest.fn().mockResolvedValue(undefined),
  fetchAppVersion: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("./context", () => ({
  buildContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("./helpers/determine-jurisdiction", () => ({
  determineJurisdiction: jest.fn().mockReturnValue("INTERNATIONAL"),
}));

jest.mock("./helpers/build-locale-bcp47", () => ({
  buildLocaleCodeBcp47FromLocaleCode: jest.fn().mockReturnValue("localeCodeBcp47"),
}));

jest.mock("./early-hints-helper", () => ({
  buildLinkHeaderValue: jest.fn().mockReturnValue('<test.css>; rel="preload" as="style'),
}));

jest.mock("./services/google-analytics-service", () => ({
  getGAHtmlScripts: jest.fn().mockReturnValue("GAConfig"),
}));

jest.mock("./templates/master", () => jest.fn().mockReturnValue("html template"));

jest.mock("./helpers/client-context", () => ({
  getClientContext: jest.fn(() => ({
    platform: "web",
    uiVariant: "mobile",
    wrapper: {
      wrapperName: "WrapperName",
      bridgeAPIVersion: "1.0.0",
    },
  })),
}));

const $localStorage = { getItem: jest.fn() };
const $headers = {
  getHeader: jest.fn().mockReturnValue(REQUEST_URI_MOCK),
  setHeader: jest.fn(),
};
const $tbdCatalogue = {};
const $cookies = { setCookie: jest.fn(), getCookie: jest.fn() };
const $log = { error: jest.fn(), info: jest.fn() };
const $requestContext = { host: REQUEST_HOST_MOCK };
const $userContext = USER_CONTEXT_MOCK;
const $params = { requestHost: REQUEST_HOST_MOCK };

const setup = (context = {}) =>
  getResponse(
    context.$params || $params,
    $localStorage,
    $userContext,
    $headers,
    $tbdCatalogue,
    $cookies,
    $log,
    $requestContext,
  );

global.TemporaryRedirectError = function TemporaryRedirectError(message) {
  this.message = message;
  return this;
};

describe("getResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildContext.mockResolvedValue(CONTEXT_MOCK);
    process.env.NODE_ENV = "test";
    getQueryParamsFromRequest.mockReturnValue(getQueryParamsFromRequestMock);
  });

  describe("when the user jurisdiction is not supported by TBD", () => {
    beforeEach(() => {
      determineJurisdiction.mockReturnValueOnce(undefined);
    });

    it("should throw error", async () => {
      let err;

      try {
        await setup();
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeInstanceOf(global.Error);
        expect(err.message).toEqual("Jurisdiction is not supported by TBD: INTERNATIONAL");
      }
    });
  });

  describe("when no error is thrown when checking pre conditions", () => {
    describe("when env is not prod", () => {
      it("should pass the throttles override on+off", async () => {
        process.env.NODE_ENV = "development";
        $headers.getHeader = jest.fn().mockReturnValueOnce(`${REQUEST_URI_MOCK}?throttlesOn=a,b,c,b&throttlesOff=eeee`);
        getQueryParamsFromRequest.mockReturnValue({
          ...getQueryParamsFromRequestMock,
          throttlesOn: "a,b,c",
          throttlesOff: "eeee",
        });
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValue({
          initialState: {
            entities: {
              throttles: {},
              preferences: { products: ["sportsbook"] },
            },
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect(getQueryParamsFromRequest).toHaveBeenCalledWith(
          `${REQUEST_URI_MOCK}?throttlesOn=a,b,c,b&throttlesOff=eeee`,
        );
      });
    });

    describe("when env is prod", () => {
      it("should not pass the throttles override on+off", async () => {
        process.env.NODE_ENV = "production";
        $headers.getHeader = jest.fn().mockReturnValueOnce(`${REQUEST_URI_MOCK}?throttlesOn=a,b,c,b&throttlesOff=eeee`);
        getQueryParamsFromRequest.mockReturnValue({
          ...getQueryParamsFromRequestMock,
          throttlesOn: "a,b,c",
          throttlesOff: "eeee",
        });
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValueOnce({
          initialState: {
            entities: {
              preferences: "initial user details",
              throttles: {
                a: { isActive: true },
                b: { isActive: false },
                c: { isActive: true },
                d: { isActive: false },
              },
            },
            boot: {},
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect(buildEnvironmentForJurisdiction).toHaveBeenCalledWith(mockEnvironment, "INTERNATIONAL", "betfair.com");

        expect(getQueryParamsFromRequest).toHaveBeenCalledWith(
          `${REQUEST_URI_MOCK}?throttlesOn=a,b,c,b&throttlesOff=eeee`,
        );
        expect(fetchAppContext).toHaveBeenCalledWith($tbdCatalogue, "pt_BR", $headers, $params, "some app key", {
          off: new Set(),
          on: new Set(),
        });
        expect(fetchAppVersion).toHaveBeenCalledWith($tbdCatalogue, "pt_BR", $headers, $params, "some app key", {
          off: new Set(),
          on: new Set(),
        });
      });
    });

    it("should correctly build context", async () => {
      $headers.getHeader = jest.fn().mockReturnValueOnce(REQUEST_URI_MOCK).mockReturnValueOnce(null);

      fetchAppContext.mockResolvedValue({
        data: "app context mock",
      });
      buildAppContext.mockReturnValueOnce({
        initialState: {
          entities: {
            preferences: "initial user details",
            throttles: {
              a: { isActive: true },
              b: { isActive: false },
              c: { isActive: true },
              d: { isActive: false },
            },
          },
          boot: {},
        },
        environment: {
          ENDPOINTS: {},
        },
      });
      getQueryParamsFromRequest.mockReturnValue({
        ...getQueryParamsFromRequestMock,
        throttlesOn: "a",
        throttlesOff: "b",
      });

      await setup();

      expect(getQueryParamsFromRequest).toHaveBeenCalledWith(REQUEST_URI_MOCK);
      expect(fetchAppContext).toHaveBeenCalledWith($tbdCatalogue, "pt_BR", $headers, $params, "some app key", {
        on: new Set(["a"]),
        off: new Set(["b"]),
      });
      expect(fetchAppVersion).toHaveBeenCalledWith($tbdCatalogue, "pt_BR", $headers, $params, "some app key", {
        on: new Set(["a"]),
        off: new Set(["b"]),
      });

      expect(htmlTemplate.mock.calls[0][0].initialState.entities.throttles).toEqual({
        a: { isActive: true, isOverriden: true },
        b: { isActive: false, isOverriden: true },
        c: { isActive: true },
        d: { isActive: false },
      });
    });
  });

  describe("when AppContext/AppVersion results are undefined (Promise.allSettled)", () => {
    it("should redirect home when appContextResponse is undefined (fetchAppContext rejected)", async () => {
      fetchAppContext.mockRejectedValueOnce(new Error("promise rejected"));
      fetchAppVersion.mockResolvedValueOnce({ data: { AppVersion: {} } });

      let err;
      try {
        await setup();
      } catch (e) {
        err = e;
      }

      expect(buildAppContext).not.toHaveBeenCalled();
      expect($log.error).toHaveBeenCalledWith(
        "Error while attempting to access TBD",
        expect.stringContaining("Error: Failed to get app context from BFF"),
      );
      expect(err).toBeInstanceOf(global.TemporaryRedirectError);
      expect(err.message).toEqual("https://www.betfair.com/");
    });

    it("should call buildAppContext with undefined appVersion when fetchAppVersion is rejected", async () => {
      fetchAppContext.mockResolvedValueOnce({ data: { AppContext: "app context mock" } });
      fetchAppVersion.mockRejectedValueOnce(new Error("promise rejected"));

      buildAppContext.mockReturnValueOnce({
        environment: { ENDPOINTS: {} },
        initialState: {
          entities: { throttles: {}, preferences: { products: ["sportsbook"] } },
          boot: {},
        },
      });

      await setup();

      expect(buildAppContext).toHaveBeenCalledWith({
        appContextResponse: { AppContext: "app context mock" },
        environment: mockEnvironment,
        productId: "some productId",
        appKeyType: "MOBILE",
      });
    });
  });

  describe("when no redirect should be applied", () => {
    it("should make correct calls and generate html template", async () => {
      buildEnvironmentForJurisdiction.mockReturnValue("environment");
      getLocaleFromURL.mockReturnValueOnce({
        localeCode: "en_GB",
        base: "/betting/",
      });
      fetchAppContext.mockResolvedValue({
        data: {
          AppContext: "app context mock",
        },
      });
      fetchAppVersion.mockResolvedValueOnce({ data: { AppVersion: {} } });
      buildAppContext.mockReturnValueOnce({
        environment: {
          ENDPOINTS: {},
        },
        initialState: {
          entities: {
            appversion: "some app version",
            experiments: "experiments",
            preferences: "preferences",
            brandSettings: { SUPPORT_NATIVE_WRAPPER: true },
            userdetails: "user details",
            throttles: {
              a: { isActive: true },
              b: { isActive: false },
              c: { isActive: true },
              d: { isActive: false },
            },
          },
          boot: {},
        },
      });

      resolveAppCommands.mockReturnValueOnce([]);
      const manifest = { asset: "asset-hash" };

      $headers.getHeader = jest.fn().mockReturnValueOnce(`${REQUEST_URI_MOCK}?throttlesOn=on1,on2&throttlesOff=off1`);
      getQueryParamsFromRequest.mockReturnValue({
        ...getQueryParamsFromRequestMock,
        throttlesOn: "on1,on2",
        throttlesOff: "off1",
      });
      buildContext.mockResolvedValue({ ...CONTEXT_MOCK, manifest });
      getPreloadedCatalogData.mockReturnValue("preloaded data");
      const response = await setup();

      expect(buildAppContext).toHaveBeenCalledWith({
        appContextResponse: { AppContext: "app context mock" },
        environment: "environment",
        productId: "some productId",
        appVersionResponse: {
          AppVersion: {},
        },
        appKeyType: "MOBILE",
      });
      expect(buildAssetsConfig).toHaveBeenCalledWith(
        $log,
        manifest,
        { APP_KEY: "some app key", ENDPOINTS: { CBS: { channel: "some cbsChannel" } }, PRODUCT_ID: "some productId" },
        "environment",
        "en_GB",
        "INTERNATIONAL",
        "betfair.com",
        "preloaded data",
      );
      expect(getPreloadedCatalogData).toHaveBeenCalledWith(
        $tbdCatalogue,
        {
          currentRoute: null,
          view: null,
          currentView: "ppb:tbd:view:bestrouteever",
          currentUrn: "ppb:urn:1",
          currentUrl: "football/sport:1",
        },
        "app context mock",
        "en_GB",
        {
          a: { isActive: true },
          b: { isActive: false },
          c: { isActive: true },
          d: { isActive: false },
        },
        $headers,
        $params,
        "environment",
        "some app key",
        {
          off: new Set(["off1"]),
          on: new Set(["on1", "on2"]),
        },
        $log,
        undefined,
      );
      expect(getGAHtmlScripts).toHaveBeenCalledWith(
        {
          a: { isActive: true },
          b: { isActive: false },
          c: { isActive: true },
          d: { isActive: false },
        },
        "environment",
      );
      expect(htmlTemplate).toHaveBeenCalledWith({
        base: "/betting/",
        assets: { PRELOAD_ASSETS: {} },
        appSuitableEnvironment: {
          APP_KEY: "some app key",
          ENDPOINTS: { CBS: { channel: "some cbsChannel" } },
          PRODUCT_ID: "some productId",
        },
        initialState: {
          router: {
            currentRoute: null,
            view: null,
            currentView: "ppb:tbd:view:bestrouteever",
            currentUrn: "ppb:urn:1",
            currentUrl: "football/sport:1",
          },
          boot: {
            exchangeEnabled: false,
            devTools: false,
          },
          entities: {
            appkey: "some app key",
            appkeytype: "MOBILE",
            appversion: "some app version",
            throttles: {
              a: { isActive: true },
              b: { isActive: false },
              c: { isActive: true },
              d: { isActive: false },
            },
            experiments: "experiments",
            preferences: "preferences",
            productId: "some productId",
            brandSettings: {
              SUPPORT_NATIVE_WRAPPER: true,
            },
            userdetails: "user details",
          },
        },
        environment: "environment",
        $requestContext,
        queryParams: {
          ...getQueryParamsFromRequestMock,
          throttlesOn: "on1,on2",
          throttlesOff: "off1",
        },
        preloadedData: "preloaded data",
        appContext: {
          AppContext: "app context mock",
        },
        appCommands: [],
        GAConfig: "GAConfig",
        clientContext: {
          platform: "web",
          uiVariant: "mobile",
          wrapper: {
            wrapperName: "WrapperName",
            bridgeAPIVersion: "1.0.0",
          },
          webWrappedExperience: true,
        },
      });
      expect(response).toEqual("html template");
    });
  });

  describe("when an error is thrown on main block", () => {
    it("should throw a TemporaryRedirectError with HOME redirect-url interpolated correctly", async () => {
      buildEnvironmentForJurisdiction.mockReturnValue({
        DOMAIN_EXTENSIONS: {
          INTERNATIONAL: "com",
          SPAIN: "es",
        },
      });

      buildContext.mockImplementationOnce(() => {
        throw new Error();
      });

      let err;

      try {
        await setup();
      } catch (e) {
        err = e;
      } finally {
        // expect($log.error).toHaveBeenCalled();
        expect(err).toBeInstanceOf(global.TemporaryRedirectError);
        expect(err.message).toEqual("https://www.betfair.com/");
      }
    });
  });

  describe("when returning early hints", () => {
    describe("when the throttle is on", () => {
      it("should call buildLinkHeaderValue", async () => {
        getLocaleFromURL.mockReturnValueOnce({
          localeCode: "X",
          base: "/apuestas/es/",
        });
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValueOnce({
          initialState: {
            entities: {
              preferences: "initial user details",
              throttles: {
                USE_SERVER_PUSH: { isActive: true },
              },
            },
            boot: {},
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect(buildLinkHeaderValue).toHaveBeenCalledWith("/apuestas/es/", { PRELOAD_ASSETS: {} });
      });

      it("should push Link header", async () => {
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValueOnce({
          initialState: {
            entities: {
              preferences: "initial user details",
              throttles: {
                USE_SERVER_PUSH: { isActive: true },
              },
            },
            boot: {},
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect($headers.setHeader).toHaveBeenCalledWith("Link", '<test.css>; rel="preload" as="style');
      });
    });

    describe("when the throttle is off", () => {
      it("should not call buildLinkHeaderValue", async () => {
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValueOnce({
          initialState: {
            entities: {
              preferences: "initial user details",
              throttles: {
                USE_SERVER_PUSH: { isActive: false },
              },
            },
            boot: {},
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect(buildLinkHeaderValue).not.toHaveBeenCalled();
      });

      it("should not push Link headers", async () => {
        fetchAppContext.mockResolvedValue({
          data: "app context mock",
        });
        buildAppContext.mockReturnValueOnce({
          initialState: {
            entities: {
              preferences: "initial user details",
              throttles: {
                USE_SERVER_PUSH: { isActive: false },
              },
            },
            boot: {},
          },
          environment: {
            ENDPOINTS: {},
          },
        });

        await setup();

        expect($headers.setHeader).not.toHaveBeenCalledWith(expect.stringContaining("Link"), expect.anything());
      });
    });
  });

  describe("when drk query parameter is present", () => {
    it("should set environment cookie", async () => {
      $headers.getHeader.mockReturnValue(`${REQUEST_URI_MOCK}?drk=some_env`);
      getQueryParamsFromRequest.mockReturnValue({
        ...getQueryParamsFromRequestMock,
        drk: "some_hash",
      });

      await setup();

      expect(setEnvironmentCookie).toHaveBeenCalledWith(
        $cookies,
        {
          requestHost: "www.betfair.com",
        },
        "drk",
        "some_hash",
      );
      expect(setEnvironmentCookie).toHaveBeenCalledTimes(1);
    });
  });

  describe("when product query parameter is present", () => {
    const buildAppContextResponse = (canUsePhoenixExchange, products) => ({
      initialState: {
        entities: { throttles: {}, preferences: { products } },
        boot: { canUsePhoenixExchange },
      },
      environment: { ENDPOINTS: {} },
    });

    const expectPreloadedCatalogDataCalledWith = (productsArg) =>
      expect(getPreloadedCatalogData).toHaveBeenCalledWith(
        $tbdCatalogue,
        CONTEXT_MOCK.router,
        undefined,
        "pt_BR",
        {},
        $headers,
        $params,
        mockEnvironment,
        "some app key",
        { off: new Set(), on: new Set() },
        $log,
        productsArg,
      );

    beforeEach(() => {
      fetchAppContext.mockResolvedValue({ data: "app context mock" });
    });

    describe("and product is exc", () => {
      beforeEach(() => {
        getQueryParamsFromRequest.mockReturnValue({ ...getQueryParamsFromRequestMock, product: "exc" });
      });

      describe("and canUsePhoenixExchange is true", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(true, ["exchange"]));
        });

        it("should pass overrideProduct=exchange to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: "exchange" }));
        });

        it("should set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).toHaveBeenCalledWith($cookies, $params, true);
          expect(setPhoenixEnabledCookie).toHaveBeenCalledTimes(1);
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["exchange"]);
        });
      });

      describe("and canUsePhoenixExchange is false", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(false, ["sportsbook"]));
        });

        it("should pass overrideProduct=exchange to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: "exchange" }));
        });

        it("should not set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).not.toHaveBeenCalled();
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["sportsbook"]);
        });
      });
    });

    describe("and product is sbk", () => {
      beforeEach(() => {
        getQueryParamsFromRequest.mockReturnValue({ ...getQueryParamsFromRequestMock, product: "sbk" });
      });

      describe("and canUsePhoenixExchange is true", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(true, ["sportsbook"]));
        });

        it("should pass overrideProduct=sportsbook to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: "sportsbook" }));
        });

        it("should not set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).not.toHaveBeenCalled();
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["sportsbook"]);
        });
      });

      describe("and canUsePhoenixExchange is false", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(false, ["sportsbook"]));
        });

        it("should pass overrideProduct=sportsbook to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: "sportsbook" }));
        });

        it("should not set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).not.toHaveBeenCalled();
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["sportsbook"]);
        });
      });
    });

    describe("and product is unknown", () => {
      beforeEach(() => {
        getQueryParamsFromRequest.mockReturnValue({ ...getQueryParamsFromRequestMock, product: "mockProduct" });
      });

      describe("and canUsePhoenixExchange is true", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(true, ["sportsbook"]));
        });

        it("should pass overrideProduct=undefined to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: undefined }));
        });

        it("should not set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).not.toHaveBeenCalled();
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["sportsbook"]);
        });
      });

      describe("and canUsePhoenixExchange is false", () => {
        beforeEach(() => {
          buildAppContext.mockReturnValueOnce(buildAppContextResponse(false, ["sportsbook"]));
        });

        it("should pass overrideProduct=undefined to buildAppContext", async () => {
          await setup();

          expect(buildAppContext).toHaveBeenCalledWith(expect.objectContaining({ overrideProduct: undefined }));
        });

        it("should not set the phoenixEnabled cookie", async () => {
          await setup();

          expect(setPhoenixEnabledCookie).not.toHaveBeenCalled();
        });

        it("should forward preferences.products to getPreloadedCatalogData", async () => {
          await setup();

          expectPreloadedCatalogDataCalledWith(["sportsbook"]);
        });
      });
    });
  });

  describe("when channel includes desktop", () => {
    it("should make correct calls", async () => {
      getAppIdentifier.mockReturnValue({
        product: "some product",
        productId: "some productId",
        appKey: "some app key",
        cbsChannel: "some cbsChannel",
        channel: "WEB_DESKTOP",
      });

      await setup();

      expect(buildAppContext).toHaveBeenCalledWith({
        appContextResponse: "app context mock",
        environment: { DOMAIN_EXTENSIONS: { INTERNATIONAL: "com", SPAIN: "es" } },
        productId: "some productId",
        appKeyType: "DESKTOP",
      });

      expect(htmlTemplate).toHaveBeenCalledWith({
        $requestContext,
        GAConfig: "GAConfig",
        appCommands: {},
        appContext: "app context mock",
        appSuitableEnvironment: {
          APP_KEY: "some app key",
          ENDPOINTS: { CBS: { channel: "some cbsChannel" } },
          PRODUCT_ID: "some productId",
        },
        assets: { PRELOAD_ASSETS: {} },
        base: "/betting/",
        clientContext: {
          platform: "web",
          uiVariant: "mobile",
          webWrappedExperience: undefined,
          wrapper: { bridgeAPIVersion: "1.0.0", wrapperName: "WrapperName" },
        },
        environment: { DOMAIN_EXTENSIONS: { INTERNATIONAL: "com", SPAIN: "es" } },
        initialState: {
          boot: {
            devTools: false,
            exchangeEnabled: false,
          },
          entities: {
            appkey: "some app key",
            appkeytype: "DESKTOP",
            appversion: undefined,
            brandSettings: undefined,
            experiments: undefined,
            preferences: { products: ["sportsbook"] },
            productId: "some productId",
            throttles: {},
            userdetails: undefined,
          },
          router: {
            currentRoute: null,
            currentUrl: "football/sport:1",
            currentUrn: "ppb:urn:1",
            currentView: "ppb:tbd:view:bestrouteever",
            view: null,
          },
        },
        preloadedData: "preloaded data",
        queryParams: {
          desktop: "",
          exchangeEnabled: "",
          loginStatus: "",
          product: "",
          throttlesOff: "",
          throttlesOn: "",
        },
      });
    });
  });

  describe("Phoenix routing", () => {
    const buildAppContextResponse = (overrides = {}) => ({
      initialState: {
        entities: {
          throttles: {},
          preferences: { products: ["sportsbook"] },
          userdetails: { loggedIn: true },
          ...overrides.entities,
        },
        boot: { ...overrides.boot },
      },
      environment: { ENDPOINTS: {} },
    });

    beforeEach(() => {
      fetchAppContext.mockResolvedValue({ data: { AppContext: "app context mock" } });
    });

    it("throws TemporaryRedirectError to /betting?product=sbk when action is bounce", async () => {
      buildAppContext.mockReturnValueOnce(buildAppContextResponse());
      getPhoenixRouting.mockReturnValueOnce({
        action: "bounce",
        bounceUrl: "/betting?product=sbk",
        cookieCorrections: null,
      });

      let err;
      try {
        await setup();
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(global.TemporaryRedirectError);
      expect(err.message).toBe("/betting?product=sbk");
      expect($log.error).not.toHaveBeenCalled();
    });

    it("calls htmlTemplate when action is serve", async () => {
      buildAppContext.mockReturnValueOnce(buildAppContextResponse());
      getPhoenixRouting.mockReturnValueOnce({
        action: "serve",
        bounceUrl: undefined,
        cookieCorrections: null,
      });

      await setup();

      expect(htmlTemplate).toHaveBeenCalled();
    });

    it("applies cookie corrections via setCookies when cookieCorrections is non-null", async () => {
      buildAppContext.mockReturnValueOnce(buildAppContextResponse());
      const correction = { tbd_dp: "exchange" };
      const correctionCookie = { name: "tbd_dp", value: "exchange", options: { domain: ".betfair.com", path: "/" } };
      getPhoenixRouting.mockReturnValueOnce({
        action: "serve",
        bounceUrl: undefined,
        cookieCorrections: correction,
      });
      buildProductPreferenceCookies.mockReturnValueOnce([correctionCookie]);

      await setup();

      expect(buildProductPreferenceCookies).toHaveBeenCalledWith($params, correction);
      expect(setCookies).toHaveBeenCalledWith($cookies, expect.arrayContaining([correctionCookie]));
    });

    it("calls getPhoenixRouting with values derived from BFF AppContext", async () => {
      buildAppContext.mockReturnValueOnce({
        initialState: {
          entities: {
            throttles: { EXC_ALLOWED_JURISDICTION: { isActive: true } },
            preferences: {
              products: ["exchange"],
              defaultProduct: "exchange",
              lastViewedProduct: "exchange",
            },
            userdetails: { loggedIn: true },
          },
          boot: {},
        },
        environment: { ENDPOINTS: {} },
      });
      $cookies.getCookie = jest.fn().mockReturnValue("sportsbook");

      const originalCluster = process.env.PRODUCT_CLUSTER;
      process.env.PRODUCT_CLUSTER = "EXC";
      try {
        await setup();
      } catch {
        // bounce is fine
      } finally {
        process.env.PRODUCT_CLUSTER = originalCluster;
      }

      expect(getPhoenixRouting).toHaveBeenCalledWith(
        expect.objectContaining({
          cluster: "EXC",
          resolvedProduct: "exchange",
          isExcAllowedJurisdiction: true,
          isLoggedIn: true,
        }),
      );
    });
  });
});
