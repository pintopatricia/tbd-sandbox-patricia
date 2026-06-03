import normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState from "./favourite-markets-state-normalizer";

const BFF_RESPONSE = {
  __typename: "FavouriteMarketsState",
  urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
  isFavourite: true,
  metadata: {
    sport: {
      __typename: "FavouriteMarketsCountMetadata",
      urn: "ppb:tbd:favouriteMarkets:metadata:1",
      currentCount: 1,
      limit: 5,
    },
    total: {
      __typename: "FavouriteMarketsCountMetadata",
      urn: "ppb:tbd:favouriteMarkets:metadata:total",
      currentCount: 10,
      limit: 50,
    },
  },
};

describe("FavouriteMarketsState Normalizer", () => {
  describe("normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState", () => {
    it("should correctly transform and return the data object when all fields are populated", () => {
      const { data } = normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FavouriteMarketsState",
        urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
        isFavourite: true,
        metadataSportURN: "ppb:tbd:favouriteMarkets:metadata:1",
        metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
      });
    });

    it("should not map metadataSportURN and metadataTotalURN when there's no metadata", () => {
      const { data } = normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState({
        ...BFF_RESPONSE,
        metadata: undefined,
      });

      expect(data).toEqual({
        typename: "FavouriteMarketsState",
        urn: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
        isFavourite: true,
      });
    });
  });
});
