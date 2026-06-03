import eventMarketReducer from "./event-market-cards-reducer";

const DEFAULT_URN = "ppb:tbd:card:eventPrimaryMarket:29650135";

const eventMarketCardMock = {
  urn: "ppb:tbd:card:eventPrimaryMarket:29650135",
  type: "EventMarketCard",
  fixture: "ppb:footballfixture:29650135",
  selectedMarketTab: undefined,
  title: "Crystal Palace v Southampton",
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

const STATE_MOCK = { [DEFAULT_URN]: eventMarketCardMock };

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

describe('"event market card" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = eventMarketReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "fixtures"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            EventMarketCard: [eventMarketCardMock],
          },
        },
      };
      const state = eventMarketReducer(undefined, action);
      expect(state).toEqual(STATE_MOCK);
    });

    describe('and "selectedMarketTab" is defined', () => {
      it('must not override "selectedMarketTab"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              EventMarketCard: [eventMarketCardMock],
            },
          },
        };

        const STATE_WITH_JUST_SELECTED_MARKET_TAB = {
          ...STATE_MOCK,
          [DEFAULT_URN]: {
            selectedMarketTab: "Exchange",
          },
        };

        const stateMockWithSelectedTab = eventMarketReducer(STATE_WITH_JUST_SELECTED_MARKET_TAB, action);

        expect(stateMockWithSelectedTab).toEqual(STATE_WITH_SELECTED_MARKET_TAB);
      });
    });
  });

  describe('when action type is "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS"', () => {
    it('must return action.payload "eventmarketcards" data when there is no display runners on previous state', () => {
      const action = {
        type: "FETCH_RUNNERS_ORDER_UPDATES_SUCCESS",
        payload: {
          data: {
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: displayRunnersMock,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_MOCK, action);
      expect(state).toEqual(STATE_WITH_DISPLAY_RUNNERS);
    });

    it('must return the new state with "eventmarketcards" merged with previous state', () => {
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
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: newDisplayRunnersMock,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: sbkDisplayRunnersMock,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                displayRunners: excDisplayRunnersMock,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
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

  describe('when action type is "FETCH_MAIN_MARKETS_UPDATES_SUCCESS"', () => {
    it("must return the new state with new data merged with previous state", () => {
      const mainMarketUpdates = {
        fixture: "ppb:footballfixture:29650135",
        displayRunners: {
          exchange: {
            market: "marketUrn",
            runners: ["runner2Urn", "runner1Urn"],
          },
          sportsbook: {
            market: "marketUrn2",
            runners: ["runner2Urn", "runner1Urn"],
          },
        },
        runnerViewLinks: {
          111: { viewUrn: "newViewUrn", viewUrl: "newViewUrl" },
        },
        eventViewLink: { viewUrn: "newViewUrn", viewUrl: "newViewUrl" },
        title: "new Title",
      };

      const action = {
        type: "FETCH_MAIN_MARKETS_UPDATES_SUCCESS",
        payload: {
          data: {
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                ...mainMarketUpdates,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state).toEqual({
        ...STATE_MOCK,
        [DEFAULT_URN]: {
          ...STATE_MOCK[DEFAULT_URN],
          ...mainMarketUpdates,
        },
      });
    });

    it("must return the base fixture as object", () => {
      const mainMarketUpdates = {
        fixture: {
          typename: "BaseFixture",
          sportevent: "ppb:event:1234",
          mainMarket: {
            exchange: "ppb:excMarket:1.178522912",
            sportsbook: "ppb:sbkMarket:1234",
          },
        },
        displayRunners: {
          exchange: {
            market: "marketUrn",
            runners: ["runner2Urn", "runner1Urn"],
          },
          sportsbook: {
            market: "marketUrn2",
            runners: ["runner2Urn", "runner1Urn"],
          },
        },
        runnerViewLinks: {
          111: { viewUrn: "newViewUrn", viewUrl: "newViewUrl" },
        },
        eventViewLink: { viewUrn: "newViewUrn", viewUrl: "newViewUrl" },
        title: "new Title",
      };

      const action = {
        type: "FETCH_MAIN_MARKETS_UPDATES_SUCCESS",
        payload: {
          data: {
            EventMarketCard: [
              {
                urn: DEFAULT_URN,
                ...mainMarketUpdates,
              },
            ],
          },
        },
      };
      const state = eventMarketReducer(STATE_WITH_DISPLAY_RUNNERS, action);
      expect(state["ppb:tbd:card:eventPrimaryMarket:29650135"].fixture).toEqual({
        typename: "BaseFixture",
        sportevent: "ppb:event:1234",
        mainMarket: {
          exchange: "ppb:excMarket:1.178522912",
          sportsbook: "ppb:sbkMarket:1234",
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = eventMarketReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
