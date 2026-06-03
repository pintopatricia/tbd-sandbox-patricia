import { buildViewResult } from "@ppb/tbd-store";
import { fetchAppContext, fetchAppVersion, getPreloadedCatalogData } from "./preload-catalog-service";
import { getCriticalChunksAssets } from "../preload-critical-chunks";

const APP_CONTEXT_MOCK = {
  userdetails: {
    productExclusions: ["VIRTUALS"],
  },
  activeExperiments: [
    {
      name: "exp:1",
      variant: "1",
    },
  ],
  preferences: {
    favoriteSports: { selectedFavoriteSports: [{ urn: "sport:1" }, { urn: "sport:7" }] },
  },
};

const variables = {
  urn: "ppb:urn:sport:1",
  numberOfFilledCardsInCardGroup: 2,
  numberOfFilledCardsInView: 3,
  withBottomBar: true,
  withLeftSidebar: true,
  withRegulatoryData: true,
  withPageInfo: true,
  preferences: {
    userProducts: null,
    favoriteSports: ["sport:1", "sport:7"],
  },
  productExclusions: ["VIRTUALS"],
  experiments: [
    {
      id: "exp:1",
      variant: "1",
    },
  ],
  throttlesOn: ["on1", "on2"],
  throttlesOff: ["off"],
};

const $tbdCatalogue = {
  post: jest.fn().mockReturnValue({
    data: () => ({ data: { View: { __typename: "GenericView", urn: "ppb:tbd:view:generic:home" } } }),
    isSuccess: () => true,
  }),
};

const $log = {
  error: jest.fn(),
  info: jest.fn(),
};

const $headers = {
  getHeader: jest.fn(),
};

jest.mock("@ppb/tbd-store", () => ({
  buildViewResult: jest.fn(() => ({
    data: "normalizer-result",
    router: "router-result",
  })),
  ProductsOption: { exchange: "exchange", sportsbook: "sportsbook", games: "games" },
  CatalogueResponseTypes: {
    UserProducts: { Exchange: "EXCHANGE", Sportsbook: "SPORTSBOOK", Games: "GAMES" },
  },
}));

jest.mock("../preload-critical-chunks", () => ({
  getCriticalChunksAssets: jest.fn(() => ({
    criticalChunksJs: ["chunk.js"],
    criticalChunksCss: ["chunk.css"],
    criticalImages: ["https://pma-s3.betfair.com/test.png"],
  })),
}));

const defaultThrottleOverrides = { on: new Set(["on1", "on2"]), off: new Set(["off"]) };

describe("preload-catalog-service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("#getPreloadedCatalogData", () => {
    describe("when the PRELOAD_CATALOG throttle is off", () => {
      it("should return undefined", async () => {
        const result = await getPreloadedCatalogData(
          $tbdCatalogue,
          {},
          {
            activeExperiments: [],
          },
          "en_GB",
          {
            PRELOAD_CATALOG: { isActive: false },
          },
          {},
          "appKey",
          defaultThrottleOverrides,
          $log,
        );

        expect(result).toStrictEqual(undefined);
      });
    });

    describe("when the PRELOAD_CATALOG throttle is on", () => {
      it("should proxy cookies to tbdCatalogue", async () => {
        const $headersMock = {
          getHeader: () => "random=Random",
        };

        await getPreloadedCatalogData(
          $tbdCatalogue,
          {
            currentView: "ppb:tbd:view:bestrouteever",
            currentUrn: "ppb:urn:sport:1",
            currentUrl: "football/s-1",
          },
          APP_CONTEXT_MOCK,
          "en_GB",
          {
            PRELOAD_CATALOG: { isActive: true },
          },
          $headersMock,
          { requestHost: "betfair.com" },
          {
            CATALOG: {
              FILLED_CARDS_PER_CARD_GROUP: 2,
              FILLED_CARDS_PER_VIEW: 3,
            },
            APP_KEYS: {
              WEB: "WEB",
            },
          },
          "appKey",
          defaultThrottleOverrides,
          $log,
        );

        expect($tbdCatalogue.post.mock.calls[0][2].headers).toEqual({
          "Content-Type": "application/json",
          Cookie: "random=Random;locale=en_GB",
          host: "betfair.com",
        });
      });

      describe("and tbdCatalogue call succeeds", () => {
        it("should return correct data", async () => {
          const result = await getPreloadedCatalogData(
            $tbdCatalogue,
            {
              currentView: "ppb:tbd:view:bestrouteever",
              currentUrn: "ppb:urn:sport:1",
              currentUrl: "football/s-1",
            },
            APP_CONTEXT_MOCK,
            "en_GB",
            {
              PRELOAD_CATALOG: { isActive: true },
            },
            $headers,
            { requestHost: "test-host.com" },
            {
              CATALOG: {
                FILLED_CARDS_PER_CARD_GROUP: 2,
                FILLED_CARDS_PER_VIEW: 3,
              },
            },
            "appKey",
            defaultThrottleOverrides,
            $log,
          );

          expect($tbdCatalogue.post).toHaveBeenCalledWith("/", "catalog", {
            body: { documentId: expect.stringContaining("View#"), variables },
            query: {
              _ak: "appKey",
              currentUrl: "football/s-1",
            },
            headers: {
              "Content-Type": "application/json",
              Cookie: "locale=en_GB",
              host: "test-host.com",
            },
          });
          expect(buildViewResult).toHaveBeenCalledTimes(1);
          expect(buildViewResult).toHaveBeenCalledWith({
            View: {
              __typename: "GenericView",
              urn: "ppb:tbd:view:generic:home",
            },
          });
          expect(getCriticalChunksAssets).toHaveBeenCalledTimes(1);
          expect(getCriticalChunksAssets).toHaveBeenCalledWith("normalizer-result");
          expect(result).toStrictEqual({
            criticalChunksCss: ["chunk.css"],
            criticalChunksJs: ["chunk.js"],
            criticalImages: ["https://pma-s3.betfair.com/test.png"],
            viewRequestPayload: {
              data: "normalizer-result",
              router: "router-result",
            },
          });
        });
      });

      describe("and userProducts is provided", () => {
        it("should map exchange to the catalogue UserProducts value", async () => {
          await getPreloadedCatalogData(
            $tbdCatalogue,
            {
              currentView: "ppb:tbd:view:bestrouteever",
              currentUrn: "ppb:urn:sport:1",
              currentUrl: "football/s-1",
            },
            APP_CONTEXT_MOCK,
            "en_GB",
            { PRELOAD_CATALOG: { isActive: true } },
            $headers,
            { requestHost: "test-host.com" },
            {
              CATALOG: {
                FILLED_CARDS_PER_CARD_GROUP: 2,
                FILLED_CARDS_PER_VIEW: 3,
              },
            },
            "appKey",
            defaultThrottleOverrides,
            $log,
            ["exchange"],
          );

          expect($tbdCatalogue.post.mock.calls[0][2].body.variables.preferences.userProducts).toEqual(["EXCHANGE"]);
        });

        it("should map sportsbook to the catalogue UserProducts value", async () => {
          await getPreloadedCatalogData(
            $tbdCatalogue,
            {
              currentView: "ppb:tbd:view:bestrouteever",
              currentUrn: "ppb:urn:sport:1",
              currentUrl: "football/s-1",
            },
            APP_CONTEXT_MOCK,
            "en_GB",
            { PRELOAD_CATALOG: { isActive: true } },
            $headers,
            { requestHost: "test-host.com" },
            {
              CATALOG: {
                FILLED_CARDS_PER_CARD_GROUP: 2,
                FILLED_CARDS_PER_VIEW: 3,
              },
            },
            "appKey",
            defaultThrottleOverrides,
            $log,
            ["sportsbook"],
          );

          expect($tbdCatalogue.post.mock.calls[0][2].body.variables.preferences.userProducts).toEqual(["SPORTSBOOK"]);
        });

        it("should preserve games alongside the overridden product", async () => {
          await getPreloadedCatalogData(
            $tbdCatalogue,
            {
              currentView: "ppb:tbd:view:bestrouteever",
              currentUrn: "ppb:urn:sport:1",
              currentUrl: "football/s-1",
            },
            APP_CONTEXT_MOCK,
            "en_GB",
            { PRELOAD_CATALOG: { isActive: true } },
            $headers,
            { requestHost: "test-host.com" },
            {
              CATALOG: {
                FILLED_CARDS_PER_CARD_GROUP: 2,
                FILLED_CARDS_PER_VIEW: 3,
              },
            },
            "appKey",
            defaultThrottleOverrides,
            $log,
            ["sportsbook", "games"],
          );

          expect($tbdCatalogue.post.mock.calls[0][2].body.variables.preferences.userProducts).toEqual([
            "SPORTSBOOK",
            "GAMES",
          ]);
        });
      });

      describe("and userProducts is undefined", () => {
        it("should send null userProducts to the catalogue", async () => {
          await getPreloadedCatalogData(
            $tbdCatalogue,
            {
              currentView: "ppb:tbd:view:bestrouteever",
              currentUrn: "ppb:urn:sport:1",
              currentUrl: "football/s-1",
            },
            APP_CONTEXT_MOCK,
            "en_GB",
            { PRELOAD_CATALOG: { isActive: true } },
            $headers,
            { requestHost: "test-host.com" },
            {
              CATALOG: {
                FILLED_CARDS_PER_CARD_GROUP: 2,
                FILLED_CARDS_PER_VIEW: 3,
              },
            },
            "appKey",
            defaultThrottleOverrides,
            $log,
            undefined,
          );

          expect($tbdCatalogue.post.mock.calls[0][2].body.variables.preferences.userProducts).toBeNull();
        });
      });

      describe("and tbdCatalogue call doesn't succeed", () => {
        describe("and basic information is provided", () => {
          it("should return undefined", async () => {
            $tbdCatalogue.post.mockRejectedValueOnce(null);

            const result = await getPreloadedCatalogData(
              $tbdCatalogue,
              {
                currentView: "ppb:tbd:view:bestrouteever",
                currentUrn: "ppb:urn:sport:1",
                currentUrl: "football/s-1",
              },
              APP_CONTEXT_MOCK,
              "en_GB",
              {
                PRELOAD_CATALOG: { isActive: true },
              },
              $headers,
              {},
              {
                CATALOG: {
                  FILLED_CARDS_PER_CARD_GROUP: 2,
                  FILLED_CARDS_PER_VIEW: 3,
                },
              },
              "appKey",
              defaultThrottleOverrides,
              $log,
            );
            expect($tbdCatalogue.post).toHaveBeenCalledWith("/", "catalog", {
              body: { documentId: expect.stringContaining("View#"), variables },
              query: {
                _ak: "appKey",
                currentUrl: "football/s-1",
              },
              headers: {
                "Content-Type": "application/json",
                Cookie: "locale=en_GB",
              },
            });
            expect($log.error).toHaveBeenCalledTimes(2);
            expect($log.error).toHaveBeenNthCalledWith(1, "Error while requesting catalog", null);
            expect($log.error).toHaveBeenNthCalledWith(2, "Unable to retrieve preloaded catalog");
            expect(result).toStrictEqual(undefined);
          });
        });
      });
    });
  });

  describe("#fetchAppContext", () => {
    it("should call BFF app context", async () => {
      const tbdCatalogueMock = {
        post: jest.fn().mockReturnValue({
          data: () => ({ data: { AppContext: { __typename: "AppContext", urn: "ppb:tbd:appcontext" } } }),
          isSuccess: () => true,
        }),
      };

      const appContext = await fetchAppContext(
        tbdCatalogueMock,
        "some locale code",
        $headers,
        {
          some: "params",
          requestHost: "some host",
        },
        "some app key",
        defaultThrottleOverrides,
      );

      expect(tbdCatalogueMock.post).toHaveBeenCalledTimes(1);
      expect(tbdCatalogueMock.post).toHaveBeenCalledWith("/", "catalog", {
        body: {
          documentId: expect.stringContaining("AppContext#"),
          variables: {
            throttlesOn: ["on1", "on2"],
            throttlesOff: ["off"],
          },
        },
        query: { _ak: "some app key" },
        headers: {
          host: "some host",
          "Content-Type": "application/json",
          Cookie: "locale=some locale code",
        },
      });
      expect(appContext).toEqual({ data: { AppContext: { __typename: "AppContext", urn: "ppb:tbd:appcontext" } } });
    });
  });

  describe("#fetchAppVersion", () => {
    it("should call BFF app version", async () => {
      const tbdCatalogueMock = {
        post: jest.fn().mockReturnValue({
          data: () => ({ data: { AppVersion: { __typename: "AppVersion", platform: "android" } } }),
          isSuccess: () => true,
        }),
      };

      const appVersion = await fetchAppVersion(
        tbdCatalogueMock,
        "some locale code",
        $headers,
        {
          some: "params",
          requestHost: "some host",
        },
        "some app key",
        defaultThrottleOverrides,
      );

      expect(tbdCatalogueMock.post).toHaveBeenCalledTimes(1);
      expect(tbdCatalogueMock.post).toHaveBeenCalledWith("/", "catalog", {
        body: {
          documentId: expect.stringContaining("AppVersion#"),
          variables: {
            throttlesOn: ["on1", "on2"],
            throttlesOff: ["off"],
          },
        },
        query: { _ak: "some app key" },
        headers: {
          host: "some host",
          "Content-Type": "application/json",
          Cookie: "locale=some locale code",
        },
      });
      expect(appVersion).toEqual({ data: { AppVersion: { __typename: "AppVersion", platform: "android" } } });
    });
  });
});
