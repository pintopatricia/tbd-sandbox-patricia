import { createGetFavouriteMarketsStateByURNSelector } from "./favourite-markets-state-selectors";

const STATE_MOCK = {
  "favouriteMarkets:state:1": {
    typename: "FavouriteMarketsState",
    urn: "favouriteMarkets:state:1",
    isFavourite: false,
    metadataSportURN: "favouriteMarkets:metadata:1",
    metadataTotalURN: "favouriteMarkets:metadata:total",
  },
  "favouriteMarkets:state:2": {
    typename: "FavouriteMarketsState",
    urn: "favouriteMarkets:state:2",
    isFavourite: true,
    metadataSportURN: "favouriteMarkets:metadata:2",
    metadataTotalURN: "favouriteMarkets:metadata:total",
  },
};

describe("createGetFavouriteMarketsStateByURNSelector", () => {
  it("should return the correct FavouriteMarketsState for a given URN", () => {
    const getFavouriteMarketsStateByURN = createGetFavouriteMarketsStateByURNSelector();

    expect(getFavouriteMarketsStateByURN(STATE_MOCK, "favouriteMarkets:state:1")).toEqual(
      STATE_MOCK["favouriteMarkets:state:1"],
    );
  });

  it("should return undefined if the URN does not exist in the state", () => {
    const getFavouriteMarketsStateByURN = createGetFavouriteMarketsStateByURNSelector();

    expect(getFavouriteMarketsStateByURN(STATE_MOCK, "invalid")).toBeUndefined();
  });

  it("should return undefined if the state is empty", () => {
    const getFavouriteMarketsStateByURN = createGetFavouriteMarketsStateByURNSelector();

    expect(getFavouriteMarketsStateByURN({}, "urn1")).toBeUndefined();
  });
});
