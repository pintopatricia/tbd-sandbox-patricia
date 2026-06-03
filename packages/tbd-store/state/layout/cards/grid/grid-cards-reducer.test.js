import gridReduce from "./grid-cards-reducer";

const DEFAULT_URN = "urn:tbd:card:gridcard:1";

const gridMock = {
  urn: "urn:tbd:card:gridcard:1",
  typename: "GridCard",
  numberOfItemsToDisplay: 1,
  layout: "VERTICAL_MARKETS",
  markets: [],
  runners: [],
};

const STATE_MOCK = { [DEFAULT_URN]: gridMock };

describe("market cards reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = gridReduce(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "markets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            GridCard: [gridMock],
          },
        },
      };
      const state = gridReduce(undefined, action);
      expect(state).toEqual(STATE_MOCK);
    });

    describe('and "selectedMarketTab" is defined', () => {
      it('must not override "selectedMarketTab"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              GridCard: [gridMock],
            },
          },
        };

        const NEW_STATE = {
          ...STATE_MOCK,
          [DEFAULT_URN]: {
            selectedMarketTab: "Exchange",
          },
        };

        const newStateMock = gridReduce(NEW_STATE, action);

        expect(newStateMock).toEqual({
          "urn:tbd:card:gridcard:1": {
            selectedMarketTab: "Exchange",
            layout: "VERTICAL_MARKETS",
            markets: [],
            numberOfItemsToDisplay: 1,
            runners: [],
            typename: "GridCard",
            urn: "urn:tbd:card:gridcard:1",
          },
        });
      });
    });
  });
});
