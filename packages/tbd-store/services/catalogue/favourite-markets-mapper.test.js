import { normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite as normalizeFavouriteMarketsNavigationTabLiteFragment } from "./normalizer/navigation-tabs/favourite-markets-navigation-tab-normalizer";
import { normalizerEngine } from "./normalizer/normalizer-engine";
import { buildFavouriteMarkets } from "./favourite-markets-mapper";

const FAVOURITE_MARKETS_NAVIGATION_TAB_LITE_MOCK = {
  data: {
    mockData: "normalizeFavouriteMarketsNavigationTabLiteMock",
  },
};

jest.mock("./normalizer/navigation-tabs/favourite-markets-navigation-tab-normalizer", () => ({
  normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite: jest.fn(
    () => FAVOURITE_MARKETS_NAVIGATION_TAB_LITE_MOCK,
  ),
}));

const NORMALIZER_ENGINE_MOCK = {
  FavouriteMarketsState: [
    {
      typename: "FavouriteMarketsState",
      urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ|1",
      isFavourite: false,
      metadataSportURN: "ppb:tbd:favouriteMarkets:metadata:1",
      metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
    },
  ],
  FavouriteMarketsCountMetadata: [
    {
      typename: "FavouriteMarketsCountMetadata",
      urn: "ppb:tbd:favouriteMarkets:metadata:1",
      currentCount: 1,
      limit: 10,
    },
    {
      typename: "FavouriteMarketsCountMetadata",
      urn: "ppb:tbd:favouriteMarkets:metadata:total",
      currentCount: 5,
      limit: 50,
    },
  ],
};

jest.mock("./normalizer/normalizer-engine", () => ({
  normalizerEngine: jest.fn(() => NORMALIZER_ENGINE_MOCK),
}));

describe("favouriteMarketsMapper", () => {
  describe("buildFavouriteMarkets", () => {
    describe("when mutation result is undefined", () => {
      it("should throw an error", () => {
        const mutation = {
          setFavouriteMarket: {
            result: undefined,
            error: "some error",
          },
        };

        expect(() => buildFavouriteMarkets(mutation)).toThrow(
          new Error("Set favourite market failed with error: some error"),
        );
      });
    });

    describe("when mutation result is defined", () => {
      it("should return the mapped favourite markets", () => {
        const mutation = {
          setFavouriteMarket: {
            result: {
              favouriteMarketsNavigationTab: {
                __typename: "FavouriteMarketsNavigationTab",
                urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
                badgeText: null,
                tabViewLink: null,
                metadata: null,
                partials: { edges: [] },
              },
              favouriteMarketsState: {
                __typename: "FavouriteMarketsState",
                urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ|1",
                isFavourite: false,
                metadata: {
                  sport: {
                    __typename: "FavouriteMarketsCountMetadata",
                    urn: "ppb:tbd:favouriteMarkets:metadata:1",
                    currentCount: 1,
                    limit: 10,
                  },
                  total: {
                    __typename: "FavouriteMarketsCountMetadata",
                    urn: "ppb:tbd:favouriteMarkets:metadata:total",
                    currentCount: 5,
                    limit: 50,
                  },
                },
              },
            },
            error: "error",
          },
        };

        const result = buildFavouriteMarkets(mutation);

        expect(normalizeFavouriteMarketsNavigationTabLiteFragment).toHaveBeenCalledWith(
          mutation.setFavouriteMarket.result.favouriteMarketsNavigationTab,
        );

        expect(normalizerEngine).toHaveBeenCalledTimes(1);
        expect(normalizerEngine).toHaveBeenCalledWith(mutation.setFavouriteMarket.result.favouriteMarketsState);

        expect(result).toStrictEqual({
          data: {
            FavouriteMarketsNavigationTab: [FAVOURITE_MARKETS_NAVIGATION_TAB_LITE_MOCK.data],
            ...NORMALIZER_ENGINE_MOCK,
          },
          softError: "error",
        });
      });
    });
  });
});
