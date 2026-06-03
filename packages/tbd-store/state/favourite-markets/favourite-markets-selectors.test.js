import { createGetFavouriteMarketsIsMutationInProgressSelector } from "./favourite-markets-selectors";

const FAVOURITE_MARKETS = {
  isMutationInProgress: false,
};

describe("favourite markets selectors", () => {
  describe("createGetFavouriteMarketsIsMutationInProgressSelector", () => {
    it("returns isMutationInProgress when it is defined", () => {
      const isMutationInProgress = createGetFavouriteMarketsIsMutationInProgressSelector()(FAVOURITE_MARKETS);

      expect(isMutationInProgress).toEqual(false);
    });
  });
});
