import {
  SUBSCRIBE_MARKET_GRAPH,
  FETCH_MARKET_GRAPH_SUCCESS,
  UNSUBSCRIBE_MARKET_GRAPH,
} from "../actions/exchange-markets";
import { getInterval } from "../config";
import exchangeService from "../services/exchange-market-service";
import setupSagaMocks from "../saga-jest-setup";

jest.mock("../config", () => ({
  getInterval: jest.fn(),
}));

jest.mock("../services/exchange-market-service", () => ({
  getRunnerMarketUpdate: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ exchangeMarketGraphSaga: saga } = require("./exchange-market-graph-saga"));
  });
  return setupSagaMocks(saga);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("exchangeMarketGraphSaga", () => {
  describe("when it intercepts a SUBSCRIBE_MARKET_GRAPH action", () => {
    describe("when no marketId is subscribed", () => {
      it("should yield a FETCH_MARKET_GRAPH_FAILURE", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([
          {
            type: SUBSCRIBE_MARKET_GRAPH,
            payload: { selectionId: 12345, localeCode: "en", currencyCode: "EUR" },
          },
        ]);

        expect(dispatch).toHaveBeenCalledWith({
          error: "No marketId subscribed",
          type: "FETCH_MARKET_GRAPH_FAILURE",
        });
        stopSaga();
      });
    });

    it("should start polling getRunnerMarketUpdate at the given interval", async () => {
      const { putActions, dispatch, advanceTimersByTime, stopSaga } = setup();
      const runerUpdate = {
        urn: "runnerUrn",
        exchange: {
          availableToBack: "availableToBack",
          availableToLay: "availableToLay",
          traded: "traded",
        },
      };
      getInterval.mockReturnValue(2000);

      exchangeService.getRunnerMarketUpdate.mockReturnValue(runerUpdate);

      await putActions([
        {
          type: SUBSCRIBE_MARKET_GRAPH,
          payload: { marketId: "1.111111111", selectionId: 12345, localeCode: "en", currencyCode: "EUR" },
        },
      ]);

      await advanceTimersByTime(1999);

      expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledTimes(1);

      const [firstCall] = dispatch.mock.calls;
      expect(firstCall[0].type).toEqual("FETCH_MARKET_GRAPH_SUCCESS");
      expect(dispatch).toHaveBeenCalledTimes(1);

      await advanceTimersByTime(1);
      // resume iterator
      await advanceTimersByTime(0);

      expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledTimes(2);

      const [, secondCall] = dispatch.mock.calls;
      expect(secondCall[0].type).toEqual("FETCH_MARKET_GRAPH_SUCCESS");
      expect(dispatch).toHaveBeenCalledTimes(2);

      stopSaga();
    });

    describe("when request is successful", () => {
      it("should call getRunnerMarketUpdate with market description and yield a FETCH_MARKET_GRAPH_SUCCESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        getInterval.mockReturnValue(2000);

        const runerUpdate = {
          urn: "runnerUrn",
          exchange: {
            availableToBack: "availableToBack",
            availableToLay: "availableToLay",
            traded: "traded",
          },
        };

        exchangeService.getRunnerMarketUpdate.mockReturnValue(runerUpdate);

        await putActions([
          {
            type: SUBSCRIBE_MARKET_GRAPH,
            payload: { marketId: "1.111111111", selectionId: 12345, localeCode: "en", currencyCode: "EUR" },
          },
        ]);

        expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledWith("1.111111111", 12345, "en", "EUR");

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_MARKET_GRAPH_SUCCESS,
          payload: runerUpdate,
        });
        stopSaga();
      });
    });

    describe("when request is not successful", () => {
      it("should yield a FETCH_MARKET_GRAPH_FAILURE", async () => {
        exchangeService.getRunnerMarketUpdate.mockImplementation(() => {
          throw new Error("errorMessage");
        });

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([
          {
            type: SUBSCRIBE_MARKET_GRAPH,
            payload: { marketId: "1.111111111", selectionId: 12345, localeCode: "en", currencyCode: "EUR" },
          },
        ]);

        expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledWith("1.111111111", 12345, "en", "EUR");

        expect(dispatch).toHaveBeenCalledWith({
          error: "errorMessage",
          type: "FETCH_MARKET_GRAPH_FAILURE",
        });
        stopSaga();
      });
    });
  });

  describe("when it intercepts a UNSUBSCRIBE_MARKET_GRAPH action", () => {
    it("should stop the polling", async () => {
      const { putActions, stopSaga, advanceTimersByTime } = setup();

      exchangeService.getRunnerMarketUpdate.mockReturnValue({
        markets: [{ marketId: "1.111111111" }],
      });

      await putActions([
        {
          type: SUBSCRIBE_MARKET_GRAPH,
          payload: { marketId: "1.111111111", selectionId: 12345, localeCode: "en", currencyCode: "EUR" },
        },
      ]);

      expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledTimes(1);

      await putActions([
        {
          type: UNSUBSCRIBE_MARKET_GRAPH,
          payload: { marketId: "1.111111111" },
        },
      ]);

      await advanceTimersByTime(2001);

      expect(exchangeService.getRunnerMarketUpdate).toHaveBeenCalledTimes(1);

      stopSaga();
    });
  });
});
