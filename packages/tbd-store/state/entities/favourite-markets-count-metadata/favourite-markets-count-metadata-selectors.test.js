import { createGetFavouriteMarketsCountMetadataByURNSelector } from "./favourite-markets-count-metadata-selectors";

const STATE_MOCK = {
  "ppb:tbd:favouriteMarkets:metadata:1": {
    typename: "FavouriteMarketsCountMetadata",
    urn: "ppb:tbd:favouriteMarkets:metadata:1",
    currentCount: 1,
    limit: 10,
  },
  "ppb:tbd:favouriteMarkets:metadata:total": {
    typename: "FavouriteMarketsCountMetadata",
    urn: "ppb:tbd:favouriteMarkets:metadata:total",
    currentCount: 5,
    limit: 50,
  },
};

describe("createGetFavouriteMarketsCountMetadataByURNSelector", () => {
  it("should return the correct FavouriteMarketsCountMetadata for a given URN", () => {
    const getFavouriteMarketsCountMetadataByURN = createGetFavouriteMarketsCountMetadataByURNSelector();

    expect(getFavouriteMarketsCountMetadataByURN(STATE_MOCK, "ppb:tbd:favouriteMarkets:metadata:1")).toEqual(
      STATE_MOCK["ppb:tbd:favouriteMarkets:metadata:1"],
    );
  });

  it("should return undefined if the URN does not exist in the state", () => {
    const getFavouriteMarketsCountMetadataByURN = createGetFavouriteMarketsCountMetadataByURNSelector();

    expect(getFavouriteMarketsCountMetadataByURN(STATE_MOCK, "invalid")).toBeUndefined();
  });

  it("should return undefined if the state is empty", () => {
    const getFavouriteMarketsCountMetadataByURN = createGetFavouriteMarketsCountMetadataByURNSelector();

    expect(getFavouriteMarketsCountMetadataByURN({}, "urn1")).toBeUndefined();
  });
});
