import {
  UI__FAVOURITE_MARKETS_LIMIT_REACHED,
  UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
} from "@ppb/tbd-store/actions/favourite-markets";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const FAVOURITE_MARKETS_STATE_MOCK = {
  typename: "FavouriteMarketsState",
  urn: "favouriteMarkets:state:1",
  isFavourite: false,
  metadataSportURN: "ppb:tbd:favouriteMarkets:metadata:1",
  metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
};

const getFavouriteMarketsStateByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/favourite-markets-state/favourite-markets-state-selectors", () => ({
  createGetFavouriteMarketsStateByURNSelector: jest.fn(() => getFavouriteMarketsStateByURN),
}));

const getFavouriteMarketsIsMutationInProgress = jest.fn().mockReturnValue(false);

jest.mock("@ppb/tbd-store/state/favourite-markets/favourite-markets-selectors", () => ({
  createGetFavouriteMarketsIsMutationInProgressSelector: jest.fn(() => getFavouriteMarketsIsMutationInProgress),
}));

const STATE_MOCK = {
  entities: {
    favouritemarketsstates: {
      [FAVOURITE_MARKETS_STATE_MOCK.urn]: FAVOURITE_MARKETS_STATE_MOCK,
    },
  },
  favouriteMarkets: {},
};

const CONTAINER_PROPS = {
  urn: FAVOURITE_MARKETS_STATE_MOCK.urn,
};

const setup = () => makeMapStateToProps()(STATE_MOCK, CONTAINER_PROPS);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when favouriteMarketsState is not found", () => {
    it("should return an empty view model", () => {
      getFavouriteMarketsStateByURN.mockReturnValueOnce(undefined);

      const props = setup();

      expect(getFavouriteMarketsStateByURN).toHaveBeenCalledWith(
        STATE_MOCK.entities.favouritemarketsstates,
        CONTAINER_PROPS.urn,
      );

      expect(props).toEqual({});
    });
  });

  describe("when data is defined", () => {
    it("should return the correct view model", () => {
      getFavouriteMarketsStateByURN.mockReturnValueOnce({
        isFavourite: true,
      });

      const props = setup();

      expect(getFavouriteMarketsStateByURN).toHaveBeenCalledWith(
        STATE_MOCK.entities.favouritemarketsstates,
        CONTAINER_PROPS.urn,
      );

      expect(getFavouriteMarketsIsMutationInProgress).toHaveBeenCalledWith(STATE_MOCK.favouriteMarkets);

      expect(props).toEqual({
        isFavourite: true,
        isPressBlocked: false,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchToggleFavouriteAction", () => {
    const { dispatchToggleFavouriteAction } = mapDispatchToProps;

    it("should dispatch a UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE action", () => {
      expect(dispatchToggleFavouriteAction("contentSectionURN:mock", true, "favouriteMarketsURN")).toEqual({
        type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
        payload: {
          contentSectionURN: "contentSectionURN:mock",
          isFavourite: true,
          favouriteMarketsURN: "favouriteMarketsURN",
        },
      });
    });
  });
});
