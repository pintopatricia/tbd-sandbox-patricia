import normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata, {
  normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite,
  normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial,
} from "./favourite-markets-navigation-tab-normalizer";

jest.mock("../translatable-text/translatable-text-normalizer", () =>
  jest.fn(() => ({ data: { translated: "mocked translation" } })),
);

const BFF_RESPONSE = {
  __typename: "FavouriteMarketsNavigationTab",
  urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
  badgeText: null,
  tabViewLink: {
    viewUrl: "some viewUrl",
    viewUrn: "some viewUrn",
  },
  metadata: null,
  full: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
        },
      },
    ],
  },
};

describe("FavouriteMarketsNavigationTab Normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeFavouriteMarketsNavigationTabFragmentIntoFavouriteMarketsNavigationTab", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when some partials are null", () => {
      const response = JSON.parse(JSON.stringify(BFF_RESPONSE));
      response.partials.edges[0] = null;

      const { data } = normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata(response);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when full is null", () => {
      const response = JSON.parse(JSON.stringify(BFF_RESPONSE));
      response.full.edges[0] = null;

      const { data } = normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata(response);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are empty", () => {
      const response = {
        ...BFF_RESPONSE,
        partials: { edges: [] },
      };

      const { data } = normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata(response);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [],
      });
    });

    it("should correctly transform and return the data object when badgeText is defined", () => {
      const response = {
        ...BFF_RESPONSE,
        badgeText: { translated: "NEW" },
      };

      const { data } = normalizeFavouriteMarketsMetadataFragmentIntoFavouriteMarketsMetadata(response);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        badgeText: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });
  });

  describe("normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial", () => {
    it("should correctly transform and return the data object", () => {
      const partialFragment = {
        __typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        metadata: null,
      };

      const { data } =
        normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        badgeText: undefined,
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      });
    });

    it("should correctly transform and return the data object when there is metadata", () => {
      const partialFragment = {
        __typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        metadata: {
          total: {
            __typename: "FavouriteMarketsCountMetadata",
            urn: "ppb:tbd:favouriteMarkets:metadata:total",
            currentCount: 6,
            limit: 50,
          },
        },
      };

      const { data } =
        normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        badgeText: undefined,
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
      });
    });

    it("should correctly transform and return the data object with badgeText", () => {
      const partialFragment = {
        __typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: {
          translated: "NEW",
          translate: null,
        },
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        metadata: null,
      };

      const { data } =
        normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        badgeText: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      });
    });

    it("should correctly transform and return the data object without viewLink", () => {
      const partialFragment = {
        __typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: null,
        metadata: null,
      };

      const { data } =
        normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        title: {},
        badgeText: undefined,
        viewLink: undefined,
      });
    });
  });

  describe("normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite", () => {
    it("should correctly transform and return the data object", () => {
      const { data } =
        normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        badgeText: undefined,
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when some partials are null", () => {
      const response = JSON.parse(JSON.stringify(BFF_RESPONSE));
      response.partials.edges[0] = null;

      const { data } =
        normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite(response);

      expect(data).toEqual({
        typename: "FavouriteMarketsNavigationTab",
        title: {},
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });
  });
});
