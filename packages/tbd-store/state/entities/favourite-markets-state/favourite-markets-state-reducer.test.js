import { FETCH_CATALOGUE_SUCCESS } from "../../../actions";
import { UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE } from "../../../actions/favourite-markets";
import { reduceEntities } from "../create-entity-reducer";

import favouriteMarketsStateReducer from "./favourite-markets-state-reducer";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn((state) => state),
}));

const stateMock = {
  FAVOURITE_MARKETS_STATE_1: {
    typename: "FavouriteMarketsState",
    urn: "FAVOURITE_MARKETS_STATE_1",
    isFavourite: false,
    metadataSportURN: "metadataSportURN",
    metadataTotalURN: "metadataTotalURN",
  },
  FAVOURITE_MARKETS_STATE_2: {
    typename: "FavouriteMarketsState",
    urn: "FAVOURITE_MARKETS_STATE_2",
    isFavourite: false,
    metadataSportURN: "metadataSportURN",
    metadataTotalURN: "metadataTotalURN",
  },
};

describe("favourite markets state reducer", () => {
  describe("when don't have any action type or the action is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = favouriteMarketsStateReducer({ state: stateMock }, {});

      expect(state).toEqual({ state: stateMock });
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it("should return the correct state", () => {
      const action = {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          entities: {},
          data: {},
        },
      };

      const result = favouriteMarketsStateReducer(stateMock, action);

      expect(reduceEntities).toHaveBeenCalledWith(stateMock, action.payload, "FavouriteMarketsState");
      expect(result).toEqual(stateMock);
    });
  });

  describe("when action type is UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE", () => {
    describe("and the favouriteMarketsURN does not exist in the payload", () => {
      it("should return the original state", () => {
        const action = {
          type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
          payload: {
            isFavourite: true,
            favouriteMarketsURN: "some urn not in state",
          },
        };

        const resultState = favouriteMarketsStateReducer(stateMock, action);

        expect(resultState).toEqual(stateMock);
      });
    });

    describe("and the favouriteMarketsURN exists in the payload", () => {
      it("should return the correct state with isFavourite updated", () => {
        const action = {
          type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
          payload: {
            favouriteMarketsURN: "FAVOURITE_MARKETS_STATE_2",
            isFavourite: true,
          },
        };

        const resultState = favouriteMarketsStateReducer(stateMock, action);

        expect(resultState).toEqual({
          ...stateMock,
          [action.payload.favouriteMarketsURN]: {
            ...stateMock.FAVOURITE_MARKETS_STATE_2,
            isFavourite: action.payload.isFavourite,
          },
        });
      });
    });
  });
});
