import normalizeFavouriteMarketsCountMetadataFragmentIntoFavouriteMarketsCountMetadata from "./favourite-markets-count-metadata-normalizer";

const BFF_RESPONSE = {
  __typename: "FavouriteMarketsCountMetadata",
  urn: "ppb:tbd:favouriteMarkets:metadata:1",
  currentCount: 1,
  limit: 2,
};

describe("FavouriteMarketsCountMetadata Normalizer", () => {
  describe("normalizeFavouriteMarketsCountMetadataFragmentIntoFavouriteMarketsCountMetadata", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeFavouriteMarketsCountMetadataFragmentIntoFavouriteMarketsCountMetadata(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "FavouriteMarketsCountMetadata",
        urn: "ppb:tbd:favouriteMarkets:metadata:1",
        currentCount: 1,
        limit: 2,
      });
    });
  });
});
