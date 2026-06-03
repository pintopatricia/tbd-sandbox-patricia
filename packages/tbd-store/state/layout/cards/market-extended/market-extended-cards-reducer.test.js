import marketExtendedReducer from "./market-extended-cards-reducer";

const DEFAULT_URN = "urn:tbd:card:marketextendedcard##1.163940386##924.209347555";

const marketExtendedMock = {
  urn: "urn:tbd:card:marketextendedcard##1.163940386##924.209347555",
  title: "Match Odds",
  selectedMarketTab: undefined,
  type: "MARKET_EXTENDED_CARD",
  cashoutQuotes: {
    exchangeCashoutQuotesURNs: ["ppb:excCashoutQuote:1.163940386/0"],
  },
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

const STATE_MOCK = { [DEFAULT_URN]: marketExtendedMock };

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

describe("Market Extended Reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = marketExtendedReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("and there aren't previous markets stored", () => {
      it('must return the new state with "marketsExtended"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              MarketExtendedCard: [marketExtendedMock],
            },
          },
        };
        const state = marketExtendedReducer(undefined, action);
        expect(state).toEqual(STATE_MOCK);
      });
    });
    describe("and there is one market stored", () => {
      it('must return the new state with "marketsExtended"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              MarketExtendedCard: [marketExtendedMock],
            },
          },
        };

        const previousState = {
          "urn:tbd:card:marketextendedcard##1.123456789##000.123456789": marketExtendedMock,
        };

        const state = marketExtendedReducer(previousState, action);
        expect(state).toEqual({
          "urn:tbd:card:marketextendedcard##1.123456789##000.123456789": marketExtendedMock,
          "urn:tbd:card:marketextendedcard##1.163940386##924.209347555": marketExtendedMock,
        });
      });
    });

    describe('and "selectedMarketTab" is defined', () => {
      it('must not override "selectedMarketTab"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              MarketExtendedCard: [marketExtendedMock],
            },
          },
        };

        const STATE_WITH_JUST_SELECTED_MARKET_TAB = {
          ...STATE_MOCK,
          [DEFAULT_URN]: {
            selectedMarketTab: "Exchange",
          },
        };

        const stateMockWithSelectedTab = marketExtendedReducer(STATE_WITH_JUST_SELECTED_MARKET_TAB, action);

        expect(stateMockWithSelectedTab).toEqual(STATE_WITH_SELECTED_MARKET_TAB);
      });
    });
  });

  describe('when action type is "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS"', () => {
    it('must return action.payload "marketsextendedcards" data when there is no display runners on previous state', () => {
      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            MarketExtendedCard: [{ urn: DEFAULT_URN, displayRunners: displayRunnersMock }],
          },
        },
      };
      const state = marketExtendedReducer(STATE_MOCK, action);
      expect(state).toEqual(STATE_WITH_DISPLAY_RUNNERS);
    });

    it('must return the new state with "marketsextendedcards" merged with previous state', () => {
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
            MarketExtendedCard: [{ urn: DEFAULT_URN, displayRunners: newDisplayRunnersMock }],
          },
        },
      };
      const state = marketExtendedReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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
            MarketExtendedCard: [{ urn: DEFAULT_URN, displayRunners: sbkDisplayRunnersMock }],
          },
        },
      };
      const state = marketExtendedReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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
            MarketExtendedCard: [{ urn: DEFAULT_URN, displayRunners: excDisplayRunnersMock }],
          },
        },
      };
      const state = marketExtendedReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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
      const state = marketExtendedReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
