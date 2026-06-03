import marketReducer from "./market-cards-reducer";

const DEFAULT_URN = "urn:tbd:card:marketcard##1.163940386##924.209347555";

const marketMock = {
  urn: DEFAULT_URN,
  title: "Match Odds",
  selectedMarketTab: undefined,
  type: "MARKET_CARD",
  displayRunners: {},
};

const displayRunnersMock = {
  exchange: {
    market: "marketUrn",
    runners: ["runner1Urn", "runner2Urn"],
  },
  sportsbook: {
    market: "marketUrn2",
    runners: ["runner1Urn", "runner2Urn"],
  },
};

const STATE_MOCK = { [DEFAULT_URN]: marketMock };

const STATE_WITH_DISPLAY_RUNNERS = {
  ...STATE_MOCK,
  [DEFAULT_URN]: {
    ...STATE_MOCK[DEFAULT_URN],
    displayRunners: displayRunnersMock,
  },
};

const STATE_WITH_SELECTED_MARKET_TAB = {
  ...STATE_MOCK,
  [DEFAULT_URN]: {
    ...STATE_MOCK[DEFAULT_URN],
    selectedMarketTab: "Exchange",
  },
};

describe("market cards reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = marketReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "markets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { MarketCard: [marketMock] },
        },
      };
      const state = marketReducer(undefined, action);
      expect(state).toEqual(STATE_MOCK);
    });

    describe('and "selectedMarketTab" is defined', () => {
      it('must not override "selectedMarketTab"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { MarketCard: [marketMock] },
          },
        };

        const STATE_WITH_JUST_SELECTED_MARKET_TAB = {
          ...STATE_MOCK,
          [DEFAULT_URN]: {
            selectedMarketTab: "Exchange",
          },
        };

        const stateMockWithSelectedTab = marketReducer(STATE_WITH_JUST_SELECTED_MARKET_TAB, action);

        expect(stateMockWithSelectedTab).toEqual(STATE_WITH_SELECTED_MARKET_TAB);
      });
    });
  });

  describe('when action type is "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS"', () => {
    it('must return action.payload "marketcards" data when there is no display runners on previous state', () => {
      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            MarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: displayRunnersMock,
              },
            ],
          },
        },
      };
      const state = marketReducer(STATE_MOCK, action);
      expect(state).toEqual(STATE_WITH_DISPLAY_RUNNERS);
    });

    it('must return the new state with "marketcards" merged with previous state', () => {
      const newDisplayRunnersMock = {
        exchange: {
          market: "marketUrn",
          runners: ["runner2Urn", "runner1Urn"],
        },
        sportsbook: {
          market: "marketUrn2",
          runners: ["runner2Urn", "runner1Urn"],
        },
      };

      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            MarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: newDisplayRunnersMock,
              },
            ],
          },
        },
      };
      const state = marketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...STATE_MOCK,
        [DEFAULT_URN]: {
          ...STATE_MOCK[DEFAULT_URN],
          displayRunners: newDisplayRunnersMock,
        },
      });
    });

    it("must return the new state with new sportsbook merged with previous state", () => {
      const sbkDisplayRunnersMock = {
        sportsbook: {
          market: "marketUrn2",
          runners: ["runner2Urn", "runner1Urn"],
        },
      };

      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            MarketCard: [{ urn: DEFAULT_URN, displayRunners: sbkDisplayRunnersMock }],
          },
        },
      };
      const state = marketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...STATE_MOCK,
        [DEFAULT_URN]: {
          ...STATE_MOCK[DEFAULT_URN],
          displayRunners: {
            ...displayRunnersMock,
            ...sbkDisplayRunnersMock,
          },
        },
      });
    });

    it("must return the new state with new exchange merged with previous state", () => {
      const excDisplayRunnersMock = {
        exchange: {
          market: "marketUrn2",
          runners: ["runner2Urn", "runner1Urn"],
        },
      };

      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            MarketCard: [{ urn: DEFAULT_URN, displayRunners: excDisplayRunnersMock }],
          },
        },
      };
      const state = marketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...STATE_MOCK,
        [DEFAULT_URN]: {
          ...STATE_MOCK[DEFAULT_URN],
          displayRunners: {
            ...displayRunnersMock,
            ...excDisplayRunnersMock,
          },
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = marketReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
