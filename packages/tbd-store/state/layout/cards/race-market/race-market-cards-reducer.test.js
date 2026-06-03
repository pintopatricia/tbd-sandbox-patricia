import raceMarketReducer from "./race-market-cards-reducer";

const DEFAULT_URN = "urn:tbd:card:racemarketcard##0000000##0000";

const racemarketMock = {
  urn: "urn:tbd:card:racemarketcard##1.163940386##924.209347555",
  title: "Match Odds",
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

const CURRENT_STATE = { [DEFAULT_URN]: racemarketMock };

const CURRENT_STATE_WITH_DISPLAY_RUNNERS = {
  ...CURRENT_STATE,
  [DEFAULT_URN]: {
    ...CURRENT_STATE[DEFAULT_URN],
    displayRunners: displayRunnersMock,
  },
};

const STATE_MOCK = {
  "urn:tbd:card:racemarketcard##1.163940386##924.209347555": racemarketMock,
};

describe('"racemarkets" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    describe("and there is no current state", () => {
      it("must return an empty state", () => {
        const state = raceMarketReducer(undefined, {});
        expect(state).toEqual({});
      });
    });

    describe("and there is already a state", () => {
      it("must return the current state", () => {
        const state = raceMarketReducer(CURRENT_STATE, {});
        expect(state).toEqual(CURRENT_STATE);
      });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return action.payload "racemarkets" data when there are no previous state', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            RaceMarketCard: [racemarketMock],
          },
        },
      };
      const state = raceMarketReducer(undefined, action);
      expect(state).toEqual(STATE_MOCK);
    });

    it('must return the new state with "racemarkets" merged with previous state', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            RaceMarketCard: [racemarketMock],
          },
        },
      };
      const state = raceMarketReducer(CURRENT_STATE, action);
      expect(state).toEqual({ ...CURRENT_STATE, ...STATE_MOCK });
    });

    describe('and "selectedTabUrn" is defined', () => {
      it('must not override "selectedTabUrn"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              RaceMarketCard: [racemarketMock],
            },
          },
        };

        const STATE_WITH_JUST_SELECTED_MARKET_TAB = {
          ...CURRENT_STATE,
          [DEFAULT_URN]: {
            selectedMarketTab: "Exchange",
          },
        };

        const stateMockWithSelectedTab = raceMarketReducer(STATE_WITH_JUST_SELECTED_MARKET_TAB, action);

        expect(stateMockWithSelectedTab).toEqual({ ...STATE_WITH_JUST_SELECTED_MARKET_TAB, ...STATE_MOCK });
      });
    });
  });

  describe('when action type is "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS"', () => {
    it('must return action.payload "racemarketcards" data when there is no display runners on previous state', () => {
      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            RaceMarketCard: [{ urn: DEFAULT_URN, displayRunners: displayRunnersMock }],
          },
        },
      };
      const state = raceMarketReducer(CURRENT_STATE, action);
      expect(state).toEqual(CURRENT_STATE_WITH_DISPLAY_RUNNERS);
    });

    it('must return the new state with "racemarketcards" merged with previous state', () => {
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
            RaceMarketCard: [{ urn: DEFAULT_URN, displayRunners: newDisplayRunnersMock }],
          },
        },
      };
      const state = raceMarketReducer(CURRENT_STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...CURRENT_STATE,
        [DEFAULT_URN]: {
          ...CURRENT_STATE[DEFAULT_URN],
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
            RaceMarketCard: [{ urn: DEFAULT_URN, displayRunners: sbkDisplayRunnersMock }],
          },
        },
      };
      const state = raceMarketReducer(CURRENT_STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...CURRENT_STATE,
        [DEFAULT_URN]: {
          ...CURRENT_STATE[DEFAULT_URN],
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
            RaceMarketCard: [{ urn: DEFAULT_URN, displayRunners: excDisplayRunnersMock }],
          },
        },
      };
      const state = raceMarketReducer(CURRENT_STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...CURRENT_STATE,
        [DEFAULT_URN]: {
          ...CURRENT_STATE[DEFAULT_URN],
          displayRunners: {
            ...displayRunnersMock,
            ...excDisplayRunnersMock,
          },
        },
      });
    });

    it("must return same state when payload is empty", () => {
      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {},
        },
      };
      const state = raceMarketReducer(CURRENT_STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({ ...CURRENT_STATE_WITH_DISPLAY_RUNNERS });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = raceMarketReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
