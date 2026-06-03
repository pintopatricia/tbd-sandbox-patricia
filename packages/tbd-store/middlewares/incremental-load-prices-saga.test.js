/**
 * @jest-environment jsdom
 */

/* eslint-disable no-underscore-dangle */
import setupSagaMocks from "../saga-jest-setup";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";
import { FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS } from "../actions/exchange-markets";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../actions/sportsbook-markets";
import exchangeService from "../services/exchange-market-service";
import sportsbookService from "../services/sportsbook-market-service";

const STATE = {
  router: "router",
  layouts: {
    views: "views",
  },
  entities: {
    sportsbookmarkets: [{ marketId: "924.1" }],
    exchangemarkets: [{ marketId: "1.1" }],
  },
};

const USER_DETAILS = {
  localeCode: "EN",
  currencyCode: "EUR",
};

const PRICE_HISTORY = 1;

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ incrementalLoadPricesSaga: saga } = require("./incremental-load-prices-saga"));
  });
  return setupSagaMocks(saga);
}

jest.mock("../services/exchange-market-service", () => ({
  getPrices: jest.fn(),
}));

jest.mock("../services/sportsbook-market-service", () => ({
  getPrices: jest.fn(),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => USER_DETAILS),
}));

describe("incrementalLoadPricesSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when FETCH_CATALOGUE_SUCCESS is dispatched", () => {
    it("should call getUserDetails with the correct arguments", async () => {
      window.__CONTENT_LOADING_PARAMETERS__ = {
        exchangePrices: true,
      };

      const { putActions, stopSaga, getState } = setup();

      const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

      getState.mockReturnValue(STATE);

      await putActions([action]);

      expect(getUserDetails).toHaveBeenCalledWith(STATE);

      stopSaga();
    });

    describe("when exchangePrices toggle is on", () => {
      beforeEach(() => {
        window.__CONTENT_LOADING_PARAMETERS__ = {
          exchangePrices: true,
        };
      });

      describe("when there are exchange market ids to fetch", () => {
        it("should call getPrices with the correct arguments", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);

          await putActions([action]);

          expect(exchangeService.getPrices).toHaveBeenCalledWith(
            ["1.1"],
            USER_DETAILS.localeCode,
            USER_DETAILS.currencyCode,
            true,
          );

          stopSaga();
        });

        it("should dispatch FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS with service response", async () => {
          const { putActions, stopSaga, getState, dispatch } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);
          exchangeService.getPrices.mockReturnValue("response");

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "response",
            type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
          });

          stopSaga();
        });
      });

      describe("when duplicate exchange market is requested", () => {
        it("should not call getPrices", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);

          await putActions([action]);

          await putActions([action]);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);

          stopSaga();
        });
      });

      describe("when there are no exchange market ids to fetch", () => {
        it("should not call getPrices", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue({
            ...STATE,
            entities: {
              sportsbookmarkets: [{ marketId: "924.1" }],
              exchangemarkets: [],
            },
          });

          await putActions([action]);

          expect(exchangeService.getPrices).not.toHaveBeenCalled();

          stopSaga();
        });
      });
    });

    describe("when exchangePrices toggle is off", () => {
      it("should not call exchange getPrices", async () => {
        window.__CONTENT_LOADING_PARAMETERS__ = {
          exchangePrices: false,
        };

        const { putActions, stopSaga, getState } = setup();

        const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

        getState.mockReturnValue(STATE);

        await putActions([action]);

        expect(exchangeService.getPrices).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when sportsbookPrices toggle is on", () => {
      beforeEach(() => {
        window.__CONTENT_LOADING_PARAMETERS__ = {
          sportsbookPrices: true,
        };
      });

      describe("when there are sportsbook market ids to fetch", () => {
        it("should call getPrices with the correct arguments", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);

          await putActions([action]);

          expect(sportsbookService.getPrices).toHaveBeenCalledWith(["924.1"], PRICE_HISTORY);

          stopSaga();
        });

        it("should dispatch FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS with service response", async () => {
          const { putActions, stopSaga, getState, dispatch } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);
          sportsbookService.getPrices.mockReturnValue("response");

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "response",
            type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          });

          stopSaga();
        });
      });

      describe("when there are no sportsbook market ids to fetch", () => {
        it("should not call getPrices", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue({
            ...STATE,
            entities: {
              sportsbookmarkets: [],
              exchangemarkets: [{ marketId: "1.1" }],
            },
          });

          await putActions([action]);

          expect(sportsbookService.getPrices).not.toHaveBeenCalled();

          stopSaga();
        });
      });

      describe("when duplicate sportsbook market is requested", () => {
        it("should not call getPrices", async () => {
          const { putActions, stopSaga, getState } = setup();

          const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

          getState.mockReturnValue(STATE);

          await putActions([action]);

          await putActions([action]);

          expect(sportsbookService.getPrices).toHaveBeenCalledTimes(1);

          stopSaga();
        });
      });
    });

    describe("when sportsbookPrices toggle is off", () => {
      it("should not call sportsbook getPrices", async () => {
        window.__CONTENT_LOADING_PARAMETERS__ = {
          sportsbookPrices: false,
        };

        const { putActions, stopSaga, getState } = setup();

        const action = { type: FETCH_CATALOGUE_SUCCESS, payload: "payload" };

        getState.mockReturnValue(STATE);

        await putActions([action]);

        expect(sportsbookService.getPrices).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });
});
