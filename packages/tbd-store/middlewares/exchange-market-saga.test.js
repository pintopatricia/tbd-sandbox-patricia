import { ExchangeMarketStatus } from "../state/entities";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
} from "../actions/exchange-markets";
import exchangeService from "../services/exchange-market-service";
import { getMarketPositionViews } from "../services/live-bet-reporting-service";
import setupSagaMocks from "../saga-jest-setup";
import { FETCH_EXC_OPEN_BETS_SUCCESS } from "../actions/exchange-open-bets";
import { PUSH } from "../actions/router";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { NETWORK__EXC_BY_MARKET_AUTH_FAILURE } from "../actions/betslip";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";

const pollerInterval = 2000;

jest.mock("../config", () => ({
  getInterval: jest.fn(() => pollerInterval),
}));

jest.mock("../services/exchange-market-service", () => ({
  getPrices: jest.fn(() => Promise.rejects(undefined)),
}));

jest.mock("../services/live-bet-reporting-service", () => ({
  getMarketPositionViews: jest.fn(() => Promise.rejects(undefined)),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    loggedIn: true,
    localeCode: "en",
    currencyCode: "EUR",
  })),
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

jest.spyOn(console, "warn").mockImplementation();

let putActions;
let advanceTimersByTime;
let stopSaga;
let stopPollingSaga;
let dispatch;

function setup() {
  let saga;
  let pollingSaga;
  jest.isolateModules(() => {
    ({ exchangeMarketSaga: saga, startExchangeMarketUpdates: pollingSaga } = require("./exchange-market-saga"));
  });
  ({ putActions, advanceTimersByTime, stopSaga } = setupSagaMocks(saga));
  ({ dispatch, stopSaga: stopPollingSaga } = setupSagaMocks(pollingSaga));
}

describe("exchangeMarketSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  afterEach(() => {
    stopSaga();
    stopPollingSaga();
  });

  describe("when it intercepts a SUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
    describe("and user is loggedIn", () => {
      describe("and exchangeService.getPrices promise succeeds", () => {
        it("should call getPrices with market description and yield a FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS", async () => {
          exchangeService.getPrices.mockResolvedValue({
            markets: [{ marketId: "1.111111111" }],
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ]);

          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledWith(["1.111111111"], "en", "EUR", true);

          expect(dispatch).toHaveBeenCalledWith({
            type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
            payload: {
              markets: [{ marketId: "1.111111111" }],
            },
          });
        });
      });

      describe("and exchangeService.getPrices throws an error", () => {
        it("should call getPrices with market description and not yield a FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS", async () => {
          exchangeService.getPrices.mockImplementationOnce(() => {
            throw new Error("Error message");
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ]);

          expect(exchangeService.getPrices).toHaveBeenCalledWith(["1.111111111"], "en", "EUR", true);

          expect(dispatch).not.toHaveBeenCalled();

          // eslint-disable-next-line no-console
          expect(console.warn.mock.calls[0][0]).toEqual(
            "Error fetching exchange market prices (1.111111111): Error message",
          );
        });
      });

      describe("and exchangeService.getPrices throws an HTTP unauthorized error", () => {
        it("should yield a NETWORK__EXC_BY_MARKET_AUTH_FAILURE", async () => {
          isHttpUnauthorizedError.mockReturnValueOnce(true);
          exchangeService.getPrices.mockImplementationOnce(() => {
            throw new Error("Error message");
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ]);

          expect(dispatch).toHaveBeenCalledWith({ type: NETWORK__EXC_BY_MARKET_AUTH_FAILURE });
        });
      });

      describe("and getMarketPositionViews throws an error", () => {
        it("should call getPrices with market description and not yield a FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS", async () => {
          getMarketPositionViews.mockImplementationOnce(() => {
            throw new Error("Error message");
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ]);

          expect(exchangeService.getPrices).toHaveBeenCalledWith(["1.111111111"], "en", "EUR", true);

          expect(dispatch).not.toHaveBeenCalled();

          // eslint-disable-next-line no-console
          expect(console.warn.mock.calls[0][0]).toEqual(
            "Error fetching exchange market positions (1.111111111): Error message",
          );
        });
      });

      it("should aggregate multiple sync requests", async () => {
        exchangeService.getPrices.mockReturnValue({
          markets: [{ marketId: "1.111111111" }],
        });

        await putActions([
          {
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: { marketId: "1.111111111" },
          },
          {
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: { marketId: "1.222222222" },
          },
          {
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: { marketId: "1.333333333" },
          },
        ]);

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledWith(
          ["1.111111111", "1.222222222", "1.333333333"],
          "en",
          "EUR",
          true,
        );

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
          payload: {
            markets: [{ marketId: "1.111111111" }],
          },
        });
      });

      describe("when isInline flag is undefined", () => {
        it("should start polling getPrices and getMarketPositionViews at the given interval", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [{ marketId: "1.111111111" }],
          });
          getMarketPositionViews.mockResolvedValue({});

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ]);

          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(1);

          const [firstCall, secondCall] = dispatch.mock.calls;
          expect(firstCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");
          expect(secondCall[0].type).toEqual("FETCH_EXC_OPEN_BETS_SUCCESS");
          expect(dispatch).toHaveBeenCalledTimes(2);

          await advanceTimersByTime(pollerInterval);
          // resume iterator
          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(2);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(2);

          const [, , thirdCall, fourthCall] = dispatch.mock.calls;
          expect(thirdCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");
          expect(fourthCall[0].type).toEqual("FETCH_EXC_OPEN_BETS_SUCCESS");
          expect(dispatch).toHaveBeenCalledTimes(4);
        });
      });

      describe("when isInline flag is false", () => {
        it("should start polling getPrices and getMarketPositionViews at the given interval", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [{ marketId: "1.111111111" }],
          });
          getMarketPositionViews.mockResolvedValue({});

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111", isInline: false },
            },
          ]);

          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(1);

          const [firstCall, secondCall] = dispatch.mock.calls;
          expect(firstCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");
          expect(secondCall[0].type).toEqual("FETCH_EXC_OPEN_BETS_SUCCESS");
          expect(dispatch).toHaveBeenCalledTimes(2);

          await advanceTimersByTime(pollerInterval);
          // resume iterator
          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(2);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(2);

          const [, , thirdCall, fourthCall] = dispatch.mock.calls;
          expect(thirdCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");
          expect(fourthCall[0].type).toEqual("FETCH_EXC_OPEN_BETS_SUCCESS");
          expect(dispatch).toHaveBeenCalledTimes(4);
        });
      });

      describe("when isInline flag is true", () => {
        it("should start polling only getPrices at the given interval", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [{ marketId: "1.111111111" }],
          });

          getMarketPositionViews.mockResolvedValue({});

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111", isInline: true },
            },
          ]);

          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(1);

          const [firstCall] = dispatch.mock.calls;
          expect(firstCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");

          await advanceTimersByTime(pollerInterval);
          // resume iterator
          await advanceTimersByTime(0);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(2);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(0);
          expect(dispatch).toHaveBeenCalledTimes(2);

          const [, secondCall] = dispatch.mock.calls;
          expect(secondCall[0].type).toEqual("FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS");
        });
      });

      describe("open bets", () => {
        async function setupOpenBetsScenario() {
          exchangeService.getPrices.mockResolvedValue({
            markets: [{ marketId: "1.111111111" }],
          });
          getMarketPositionViews.mockResolvedValue({
            1.1: {
              settledProfit: 1,
            },
            1.2: {
              settledProfit: 2,
            },
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.1" },
            },
          ]);
        }

        it("should call getMarketPositionViews with the markets urns", async () => {
          await setupOpenBetsScenario();

          expect(getMarketPositionViews).toHaveBeenCalledWith(["1.1"]);
          expect(getMarketPositionViews).toHaveBeenCalledTimes(1);
        });

        it("should yield a FETCH_EXC_OPEN_BETS_SUCCESS", async () => {
          await setupOpenBetsScenario();

          expect(dispatch).toHaveBeenCalledWith({
            type: FETCH_EXC_OPEN_BETS_SUCCESS,
            payload: {
              markets: {
                1.1: {
                  settledProfit: 1,
                },
                1.2: {
                  settledProfit: 2,
                },
              },
            },
          });
        });
      });

      describe("when ERO returns a CLOSED market", () => {
        it("should be removed from subscribed markets to ERO", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [{ marketId: "1.111111111", status: ExchangeMarketStatus.Closed }, { marketId: "1.222222222" }],
          });
          getMarketPositionViews.mockResolvedValue({});

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.222222222" },
            },
          ]);

          await advanceTimersByTime(0);
          expect(exchangeService.getPrices.mock.calls[0]).toEqual([["1.111111111", "1.222222222"], "en", "EUR", true]);
          await advanceTimersByTime(pollerInterval);

          expect(exchangeService.getPrices.mock.calls.length).toEqual(2);
          expect(exchangeService.getPrices.mock.calls[1]).toEqual([["1.222222222"], "en", "EUR", false]);
        });
      });

      describe("when ERO returns all CLOSED markets", () => {
        it("should stop polling all subscribed markets", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [
              { marketId: "1.111111111", status: ExchangeMarketStatus.Closed },
              { marketId: "1.222222222", status: ExchangeMarketStatus.Closed },
            ],
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.222222222" },
            },
          ]);

          await advanceTimersByTime(0);
          expect(exchangeService.getPrices.mock.calls[0]).toEqual([["1.111111111", "1.222222222"], "en", "EUR", true]);

          await advanceTimersByTime(10000000);
          await advanceTimersByTime(0);

          expect(exchangeService.getPrices.mock.calls.length).toEqual(1);
        });
      });

      describe("when new markets are requested", () => {
        it("should request getPrices with market description", async () => {
          exchangeService.getPrices.mockReturnValue({
            markets: [{ marketId: "1.111111111" }, { marketId: "1.222222222" }],
          });

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.222222222" },
            },
          ]);

          await advanceTimersByTime(0);
          expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);

          await putActions([
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.333333333" },
            },
          ]);

          await advanceTimersByTime(pollerInterval);

          expect(exchangeService.getPrices).toHaveBeenCalledTimes(2);
          expect(exchangeService.getPrices.mock.calls[1]).toEqual([
            ["1.111111111", "1.222222222", "1.333333333"],
            "en",
            "EUR",
            true,
          ]);
        });
      });
    });

    describe("and user is not loggedIn", () => {
      it("should only poll getPrices at the given interval", async () => {
        getUserDetails.mockReturnValue({ loggedIn: false });

        exchangeService.getPrices.mockReturnValue({
          markets: [{ marketId: "1.111111111" }],
        });
        getMarketPositionViews.mockResolvedValue({});

        await putActions([
          {
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: { marketId: "1.111111111" },
          },
        ]);

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
        expect(getMarketPositionViews).toHaveBeenCalledTimes(0);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS" }),
        );

        await advanceTimersByTime(pollerInterval);
        // resume iterator
        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(2);
        expect(getMarketPositionViews).toHaveBeenCalledTimes(0);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS" }),
        );
      });
    });

    describe("and user login state changes", () => {
      it("should request position views only after change", async () => {
        getUserDetails.mockReturnValue({ loggedIn: false });

        getMarketPositionViews.mockResolvedValue({});

        await putActions([
          {
            type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
            payload: { marketId: "1.111111111" },
          },
        ]);

        await advanceTimersByTime(pollerInterval);
        expect(getMarketPositionViews).toHaveBeenCalledTimes(0);

        getUserDetails.mockReturnValue({ loggedIn: true });

        await advanceTimersByTime(pollerInterval);
        expect(getMarketPositionViews).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when it intercepts a UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES action", () => {
    describe("for a market that has multiple subscriptions", () => {
      it("should keep market in the polling subscriptions list", async () => {
        exchangeService.getPrices.mockReturnValue({
          markets: [{ marketId: "1.111111111" }],
        });

        await putActions(
          [
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);
        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);

        exchangeService.getPrices.mockClear();

        await putActions(
          [
            {
              type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
      });
    });

    describe("for a market that hasn't subscriptions", () => {
      it("should keep the polling subscriptions as-is", async () => {
        exchangeService.getPrices.mockReturnValue({
          markets: [{ marketId: "1.111111111" }, { marketId: "1.22222222" }],
        });

        await putActions(
          [
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.22222222" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
        expect(exchangeService.getPrices.mock.calls[0][0].includes("1.22222222")).toBeTruthy();

        exchangeService.getPrices.mockClear();

        await putActions(
          [
            {
              type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
        expect(exchangeService.getPrices.mock.calls[0][0].includes("1.22222222")).toBeTruthy();
      });
    });

    describe("for a market that has a single subscription", () => {
      it("should remove that market from the polling subscriptions list", async () => {
        exchangeService.getPrices.mockReturnValue({
          markets: [{ marketId: "1.111111111" }],
        });

        await putActions(
          [
            {
              type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).toHaveBeenCalledTimes(1);
        expect(exchangeService.getPrices.mock.calls[0][0].includes("1.111111111")).toBeTruthy();

        exchangeService.getPrices.mockClear();

        await putActions(
          [
            {
              type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
              payload: { marketId: "1.111111111" },
            },
          ],
          2000,
        );

        await advanceTimersByTime(0);

        expect(exchangeService.getPrices).not.toHaveBeenCalled();
      });
    });
  });

  describe.each([PUSH, UI__SWITCH_PRODUCT_PREFERENCE])("when it intercepts a %s action", (action) => {
    it("should stop polling all subscribed markets", async () => {
      exchangeService.getPrices.mockReturnValue({
        markets: [{ marketId: "1.111111111" }, { marketId: "1.222222222" }],
      });

      await putActions([
        {
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: { marketId: "1.111111111" },
        },
        {
          type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
          payload: { marketId: "1.222222222" },
        },
      ]);

      await advanceTimersByTime(0);

      expect(exchangeService.getPrices.mock.calls.length).toEqual(1);

      await putActions([{ type: action }]);

      await advanceTimersByTime(10000000);
      expect(exchangeService.getPrices.mock.calls.length).toEqual(1);
    });
  });
});
