import { ProductExclusion } from "../state/entities";
import catalogueService from "../services/catalogue/catalogue-service";
import { FETCH_RUNNERS_ORDER_UPDATES_FAILURE, FETCH_RUNNERS_ORDER_UPDATES_SUCCESS } from "../actions/catalogue";
import setupSagaMocks from "../saga-jest-setup";
import { PUSH } from "../actions/router";
import { MARKET_TRANSITIONED_STATUS } from "../actions/market-transitions";

const getExchangeMarketByURN = jest.fn();
const getSportsbookMarketByURN = jest.fn();
const getSportByURN = jest.fn();
const getPreferencesWithProductSwitcherSelector = jest.fn();
const userPreferencesMock = {
  prefA: 1,
  prefB: 2,
};
const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];
const productExclusionsMock = [ProductExclusion.Games];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const routerMock = { currentView: "" };

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
      router: routerMock,
    })),
  ),
}));

jest.mock("../state/entities/sports/sport-selectors", () => ({
  getSportByURN,
}));

jest.mock("../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketSelector: () => getSportsbookMarketByURN,
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: () => getExchangeMarketByURN,
}));

jest.mock("../services/catalogue/catalogue-service", () => ({
  getSortableCardsDisplayRunnersUpdates: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ fetchRunnersOrderUpdatesSaga: saga } = require("./runners-sorting-saga"));
  });
  return setupSagaMocks(saga);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("runnersSortingSaga", () => {
  const bettableCardsRunnersDisplayMock = {
    eventmarketcards: {},
    marketcards: {},
    marketsextendedcards: {},
    racemarketcards: {
      raceMarketURN: {
        urn: "raceMarketURN",
        exchange: {
          runners: ["runner1Urn"],
        },
        sportsbook: {
          runners: ["runner2Urn"],
        },
      },
    },
  };

  beforeEach(() => {
    getExchangeMarketByURN.mockReturnValue({
      urn: "urn:321",
      marketId: "321",
      inplay: false,
      sport: "ppb:eventType:7",
    });

    getSportsbookMarketByURN.mockReturnValue({
      urn: "urn:123",
      marketId: "123",
      inplay: false,
      sport: "ppb:eventType:7",
    });

    getSportByURN.mockReturnValue({
      urn: "ppb:eventType:7",
      name: "Horse Racing",
      sportId: 7,
    });
  });

  catalogueService.getSortableCardsDisplayRunnersUpdates.mockReturnValue(bettableCardsRunnersDisplayMock);

  describe("when a sportsbookMarket goes from pre-play to inplay", () => {
    beforeEach(() => {
      getExchangeMarketByURN.mockReturnValue(null);
    });

    it("should call bettableCardsRunnersDisplay and dispatch FETCH_RUNNERS_ORDER_UPDATES_SUCCESS", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();
      getPreferencesWithProductSwitcherSelector.mockReturnValue(userPreferencesMock);

      getState.mockReturnValue({
        layouts: {
          cards: {
            racemarkets: {
              raceMarketURN: {
                urn: "raceMarketURN",
                displayRunners: {
                  sportsbook: {
                    runners: ["runner2Urn"],
                    market: "urn:123",
                  },
                },
              },
            },
          },
        },
        entities: {
          preferences: {},
        },
      });

      await putActions([
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:123",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).toHaveBeenCalledWith(
        ["raceMarketURN"],
        false,
        true,
        {
          prefA: 1,
          prefB: 2,
        },
        ["GAMES"],
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
        payload: bettableCardsRunnersDisplayMock,
      });
      stopSaga();
    });

    describe("when it is not an HR market", () => {
      beforeEach(() => {
        getSportsbookMarketByURN.mockReturnValue({
          urn: "urn:123",
          marketId: "123",
          sport: "ppb:eventType:1",
        });
        getSportByURN.mockReturnValue({
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        });
      });

      it("should not call bettableCardsRunnersDisplay and dispatch FETCH_RUNNERS_ORDER_UPDATES_SUCCESS", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} } });

        await putActions([
          {
            type: MARKET_TRANSITIONED_STATUS,
            payload: "urn:123",
            transition: {
              before: "PREPLAY",
              after: "INPLAY",
            },
          },
        ]);

        expect(catalogueService.getSortableCardsDisplayRunnersUpdates).not.toHaveBeenCalled();

        expect(dispatch).not.toHaveBeenCalled();
        stopSaga();
      });
    });
  });

  describe("when a exchangeMarket goes from pre-play to inplay", () => {
    beforeEach(() => {
      getSportsbookMarketByURN.mockReturnValue(null);

      getExchangeMarketByURN.mockReturnValue({
        urn: "urn:321",
        marketId: "321",
        sport: "ppb:eventType:7",
      });
      getSportByURN.mockReturnValue({
        urn: "ppb:eventType:7",
        name: "Horse Racing",
        sportId: 7,
      });
    });

    it("should call bettableCardsRunnersDisplay and dispatch FETCH_RUNNERS_ORDER_UPDATES_SUCCESS", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();
      getPreferencesWithProductSwitcherSelector.mockReturnValue(userPreferencesMock);

      getState.mockReturnValue({
        layouts: {
          cards: {
            racemarkets: {
              raceMarketURN: {
                urn: "raceMarketURN",
                displayRunners: {
                  exchange: {
                    runners: ["runner2Urn"],
                    market: "urn:321",
                  },
                },
              },
            },
          },
        },
        entities: {},
      });

      await putActions([
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:321",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).toHaveBeenCalledWith(
        ["raceMarketURN"],
        true,
        false,
        {
          prefA: 1,
          prefB: 2,
        },
        ["GAMES"],
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
        payload: bettableCardsRunnersDisplayMock,
      });
      stopSaga();
    });
  });

  describe("when a card doesn't have displayRunners.sportsbook neither displayRunners.exchange", () => {
    beforeEach(() => {
      getSportsbookMarketByURN.mockReturnValue(null);

      getExchangeMarketByURN.mockReturnValue({
        urn: "urn:321",
        marketId: "321",
        sport: "ppb:eventType:7",
      });
      getSportByURN.mockReturnValue({
        urn: "ppb:eventType:7",
        name: "Horse Racing",
        sportId: 7,
      });
    });

    it("should not call bettableCardsRunnersDisplay and not dispatch FETCH_RUNNERS_ORDER_UPDATES_SUCCESS", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({
        layouts: {
          cards: {
            racemarkets: {
              raceMarketURN: {
                urn: "raceMarketURN",
                displayRunners: {},
              },
            },
          },
        },
        entities: { preferences: {} },
      });

      await putActions([
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:321",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).not.toHaveBeenCalled();

      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });

  describe("when an error is thrown whe fetching getSortableCardsDisplayRunnersUpdates", () => {
    beforeEach(() => {
      getExchangeMarketByURN.mockReturnValue(null);
      getSportsbookMarketByURN.mockReturnValue({
        urn: "urn:321",
        marketId: "321",
        sport: "ppb:eventType:7",
      });
      getSportByURN.mockReturnValue({
        urn: "ppb:eventType:7",
        name: "Horse Racing",
        sportId: 7,
      });

      catalogueService.getSortableCardsDisplayRunnersUpdates.mockImplementation(() => {
        throw new Error("errorMessage");
      });
    });

    it("should call bettableCardsRunnersDisplay and dispatch FETCH_RUNNERS_ORDER_UPDATES_FAILURE", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();
      getPreferencesWithProductSwitcherSelector.mockReturnValue(userPreferencesMock);

      getState.mockReturnValue({
        layouts: {
          cards: {
            racemarkets: {
              raceMarketURN: {
                urn: "raceMarketURN",
                displayRunners: {
                  sportsbook: {
                    runners: ["runner2Urn"],
                    market: "urn:123",
                  },
                },
              },
            },
          },
        },
        entities: {
          sports: {
            "ppb:eventType:7": {
              urn: "ppb:eventType:7",
              name: "Horse Racing",
              sportId: 7,
            },
            "ppb:eventType:1": {
              urn: "ppb:eventType:1",
              name: "Football",
              sportId: 1,
            },
          },
          preferences: {},
        },
      });

      await putActions([
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:123",
          transition: {
            before: "PREPLAY",
            after: "INPLAY",
          },
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).toHaveBeenCalledWith(
        ["raceMarketURN"],
        false,
        true,
        {
          prefA: 1,
          prefB: 2,
        },
        ["GAMES"],
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_RUNNERS_ORDER_UPDATES_FAILURE,
        error: "errorMessage",
      });
      stopSaga();
    });
  });

  describe("when a push occurs and the cards are wiped", () => {
    it("should not call bettableCardsRunnersDisplay and not dispatch FETCH_RUNNERS_ORDER_UPDATES_SUCCESS", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([
        {
          type: PUSH,
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).not.toHaveBeenCalled();

      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });

  describe("when we receive an irrelevant transition", () => {
    it("should not call bettableCardsRunnersDisplay and not dispatch", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:123",
          transition: {
            before: "INPLAY",
            after: "CLOSED",
          },
        },
        {
          type: MARKET_TRANSITIONED_STATUS,
          payload: "urn:123",
          transition: {
            before: "PREPLAY",
            after: "CLOSED",
          },
        },
      ]);

      expect(catalogueService.getSortableCardsDisplayRunnersUpdates).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
      stopSaga();
    });
  });
});
