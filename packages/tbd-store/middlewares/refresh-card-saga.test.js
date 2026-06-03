import setupSagaMocks from "../saga-jest-setup";
import { FETCH_CARDS } from "../actions/catalogue";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../actions/sportsbook-markets";
import { START_REFRESH_CARD, STOP_REFRESH_CARD } from "../actions/refresh";

jest.mock("../config", () => ({
  getInterval: jest.fn(),
}));

const STATE = {
  layouts: {
    cards: {
      grids: {
        "ppb:tbd:card:grid:12345": {
          typename: "GridCard",
          markets: [{ urn: "ppb:sbkMarket:924.1111" }, { urn: "ppb:sbkMarket:924.2222" }],
        },
        "ppb:tbd:card:grid:54321": {
          typename: "GridCard",
          markets: [{ urn: "ppb:sbkMarket:924.3333" }, { urn: "ppb:sbkMarket:924.4444" }],
        },
      },
    },
  },
  entities: {
    sportsbookmarkets: {
      "ppb:sbkMarket:924.1111": {
        typename: "SportbookMarket",
        marketId: "924.1111",
      },
      "ppb:sbkMarket:924.2222": {
        typename: "SportbookMarket",
        marketId: "924.2222",
        status: "CLOSED",
      },
    },
  },
};

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ refreshCardSaga: saga } = require("./refresh-card-saga"));
  });

  return setupSagaMocks(saga);
}

describe("refreshCardSaga", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when START_REFRESH_CARD is dispatched", () => {
    it("should call fetchCards and yield a FETCH_CARDS", async () => {
      const { putActions, stopSaga, getState, dispatch } = setup();

      getState.mockReturnValue(STATE);

      await putActions([
        {
          type: START_REFRESH_CARD,
          payload: "ppb:tbd:card:grid:12345",
        },
        {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_CARDS,
        payload: {
          urns: ["ppb:tbd:card:grid:12345"],
          forceRefresh: true,
        },
      });

      stopSaga();
    });

    it("should not dispatch anything when no markets are closed", async () => {
      const { putActions, stopSaga, getState, dispatch } = setup();

      getState.mockReturnValue({
        ...STATE,
        entities: {
          sportsbookmarkets: {},
        },
      });

      await putActions([
        {
          type: START_REFRESH_CARD,
          payload: "ppb:tbd:card:grid:12345",
        },
        {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();

      stopSaga();
    });
  });

  describe("when STOP_REFRESH_CARD is dispatched", () => {
    it("should remove cards from subscriptions", async () => {
      const { putActions, stopSaga, getState, dispatch } = setup();

      getState.mockReturnValue(STATE);

      await putActions([
        {
          type: START_REFRESH_CARD,
          payload: "ppb:tbd:card:grid:12345",
        },
        {
          type: STOP_REFRESH_CARD,
          payload: "ppb:tbd:card:grid:12345",
        },
        {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();

      stopSaga();
    });
  });
});
