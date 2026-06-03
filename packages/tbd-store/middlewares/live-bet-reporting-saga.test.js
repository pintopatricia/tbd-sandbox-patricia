import { searchOrders } from "../services/live-bet-reporting-service";
import setupSagaMocks from "../saga-jest-setup";
import { UI__MARKET_EXC_BET_BUTTON_CLICK } from "../actions/betting";
import {
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
  NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
  NETWORK__SEARCH_EXC_ORDERS_FAILURE,
} from "../actions/betslip";

const mockedInterval = 1000;

jest.mock("../config", () => ({
  getInterval: jest.fn(() => mockedInterval),
}));

jest.mock("../services/live-bet-reporting-service", () => ({ searchOrders: jest.fn() }));
jest.mock("../services/live-bet-reporting-service-mapper", () => ({
  mapResponseToInstructionReport: jest.fn((orders) => orders[0]),
}));

describe("fetchExchangeBetsUpdatesSaga", () => {
  function createPlaceBetSuccessAction({ unmatched, betIds }) {
    return {
      type: NETWORK__PLACE_EXC_BET_SUCCESS,
      payload: {
        report: {
          runner: "placeRunner:urn",
          metadata: {
            runnerName: "Runner Name",
            marketName: "Market Name",
            eventName: "Event Name",
          },
          betIds,
          unmatched,
        },
      },
    };
  }

  const createUpdateBetSuccessAction = ({ unmatched, betIds }) => ({
    type: NETWORK__UPDATE_EXC_BET_SUCCESS,
    payload: {
      report: {
        runner: "placeRunner:urn",
        metadata: {
          runnerName: "Runner Name",
          marketName: "Market Name",
          eventName: "Event Name",
        },
        betIds,
        unmatched,
      },
    },
  });

  function setup() {
    let saga;
    jest.isolateModules(() => {
      ({ fetchExchangeBetsUpdatesSaga: saga } = require("./live-bet-reporting-saga"));
    });
    return setupSagaMocks(saga);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when action is UI/MARKET_EXC_BET_BUTTON_CLICK", () => {
    describe("when there are active subscriptions", () => {
      it("should cancel the subscription", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess, { type: UI__MARKET_EXC_BET_BUTTON_CLICK }]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        saga.stopSaga();
      });
    });

    describe("when there are no active subscriptions", () => {
      it("should keep the subscription empty", async () => {
        const saga = setup();

        await saga.advanceTimersByTime(mockedInterval);
        await saga.putActions([{ type: UI__MARKET_EXC_BET_BUTTON_CLICK }]);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });

  describe("when action is UI/BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK", () => {
    describe("when there are active subscriptions", () => {
      it("should cancel the subscription", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess, { type: UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK }]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        saga.stopSaga();
      });
    });

    describe("when there are no active subscriptions", () => {
      it("should keep the subscription empty", async () => {
        const saga = setup();

        await saga.advanceTimersByTime(mockedInterval);
        await saga.putActions([{ type: UI__MARKET_EXC_BET_BUTTON_CLICK }]);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });

  describe("when action is UI/BETSLIP_EXC_UNMATCHED_DONE_CLICK", () => {
    describe("when there are active subscriptions", () => {
      it("should cancel the subscription", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess, { type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK }]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        saga.stopSaga();
      });
    });

    describe("when there are no active subscriptions", () => {
      it("should keep the subscription empty", async () => {
        const saga = setup();

        await saga.advanceTimersByTime(mockedInterval);
        await saga.putActions([{ type: UI__MARKET_EXC_BET_BUTTON_CLICK }]);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });

  describe("when action is UI/BETSLIP_EXC_UNMATCHED_CANCEL_CLICK", () => {
    describe("when there are active subscriptions", () => {
      it("should cancel the subscription", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess, { type: UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK }]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        saga.stopSaga();
      });
    });

    describe("when there are no active subscriptions", () => {
      it("should keep the subscription empty", async () => {
        const saga = setup();

        await saga.advanceTimersByTime(mockedInterval);
        await saga.putActions([{ type: UI__MARKET_EXC_BET_BUTTON_CLICK }]);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });

  describe("when action is NETWORK/PLACE_EXC_BET_SUCCESS", () => {
    describe("when there are unmatched bets", () => {
      it("should poll searchOrder for each interval passed with the betId", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess]);

        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        saga.stopSaga();
      });

      it("should cancel the subscription after TTL", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([placeBetSuccess]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        await saga.advanceTimersByTime(120000);
        expect(searchOrders).toHaveBeenCalledTimes(3);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledTimes(3);

        saga.stopSaga();
      });

      describe("when retrieving orders fails", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockRejectedValue("Error");

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_FAILURE at most 4 times", async () => {
          searchOrders.mockRejectedValue("Error");

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch.mock.calls[0][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch.mock.calls[1][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_FAILURE });

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          expect(saga.dispatch.mock.calls[6][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch.mock.calls[7][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_FAILURE });

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          // There are no more requests since we hit the retry limit
          // Also the last put happened with a failure
          expect(saga.dispatch.mock.calls[8]).not.toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch).toHaveBeenCalledTimes(8);
          expect(saga.dispatch).toHaveBeenLastCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_FAILURE,
          });

          saga.stopSaga();
        });
      });

      describe("when there are no orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should not put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS }),
          );

          saga.stopSaga();
        });
      });

      describe("when there are only matched orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                runner: "placeRunner:urn",
                metadata: {
                  runnerName: "Runner Name",
                  marketName: "Market Name",
                  eventName: "Event Name",
                },
                matched: 5,
              },
            },
          });

          saga.stopSaga();
        });

        it("should clean the subscription", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          await saga.advanceTimersByTime(mockedInterval);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          saga.stopSaga();
        });
      });

      describe("when there are only unmatched orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                runner: "placeRunner:urn",
                metadata: {
                  runnerName: "Runner Name",
                  marketName: "Market Name",
                  eventName: "Event Name",
                },
                unmatched: 3,
              },
            },
          });

          saga.stopSaga();
        });

        it("should keep the subscription", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const placeBetSuccess = createPlaceBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([placeBetSuccess]);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          await saga.advanceTimersByTime(mockedInterval);

          expect(searchOrders).toHaveBeenCalledTimes(2);

          saga.stopSaga();
        });
      });
    });

    describe("when there are no unmatched bets", () => {
      it("should not poll searchOrder", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
        });

        await saga.putActions([placeBetSuccess]);

        expect(searchOrders).not.toHaveBeenCalled();

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });

  describe("when action is NETWORK/UPDATE_EXC_BET_SUCCESS", () => {
    describe("when there are unmatched bets", () => {
      it("should poll searchOrder for each interval passed with the betId", async () => {
        const saga = setup();
        const updateBetSuccess = createUpdateBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([updateBetSuccess]);

        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        saga.stopSaga();
      });

      it("should cancel the subscription after TTL", async () => {
        const saga = setup();
        const updateBetSuccess = createUpdateBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });
        await saga.putActions([updateBetSuccess]);

        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        await saga.advanceTimersByTime(120000);
        expect(searchOrders).toHaveBeenCalledTimes(3);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledTimes(3);

        saga.stopSaga();
      });

      it("should restart the searchOrder poll TTL when a new bet success update arrives with a new betId", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });

        const updateBetSuccess = createUpdateBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedUpdatedBetId"],
        });

        await saga.putActions([placeBetSuccess]);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(100000);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        await saga.putActions([updateBetSuccess]);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedUpdatedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(3);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedUpdatedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(4);

        await saga.advanceTimersByTime(120000); // Overlaps the first TTL for place
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedUpdatedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(5);

        saga.stopSaga();
      });

      it("should not restart the searchOrder poll TTL when a new bet success update arrives with same betId", async () => {
        const saga = setup();
        const placeBetSuccess = createPlaceBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });

        const updateBetSuccess = createUpdateBetSuccessAction({
          unmatched: {},
          betIds: ["unmatchedBetId"],
        });

        await saga.putActions([placeBetSuccess]);
        expect(searchOrders).toHaveBeenCalledWith(["unmatchedBetId"]);
        expect(searchOrders).toHaveBeenCalledTimes(1);

        await saga.advanceTimersByTime(mockedInterval);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        await saga.putActions([updateBetSuccess]);
        expect(searchOrders).toHaveBeenCalledTimes(2);

        saga.stopSaga();
      });

      describe("when retrieving orders fails", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockRejectedValue("Error");

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_FAILURE at most 4 times", async () => {
          searchOrders.mockRejectedValue("Error");

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch.mock.calls[0][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch.mock.calls[1][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_FAILURE });

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          expect(saga.dispatch.mock.calls[6][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch.mock.calls[7][0]).toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_FAILURE });

          await saga.advanceTimersByTime(mockedInterval);
          await saga.advanceTimersByTime(0);

          // There are no more requests since we hit the retry limit
          // Also the last put happened with a failure
          expect(saga.dispatch.mock.calls[8]).not.toEqual({ type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS });
          expect(saga.dispatch).toHaveBeenCalledTimes(8);
          expect(saga.dispatch).toHaveBeenLastCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_FAILURE,
          });

          saga.stopSaga();
        });
      });

      describe("when there are no orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should not put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS }),
          );

          saga.stopSaga();
        });
      });

      describe("when there are only matched orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                runner: "placeRunner:urn",
                metadata: {
                  runnerName: "Runner Name",
                  marketName: "Market Name",
                  eventName: "Event Name",
                },
                matched: 5,
              },
            },
          });

          saga.stopSaga();
        });

        it("should clean the subscription", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ matched: 5 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          await saga.advanceTimersByTime(mockedInterval);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          saga.stopSaga();
        });
      });

      describe("when there are only unmatched orders", () => {
        it("should put NETWORK/SEARCH_EXC_ORDERS_IN_PROGRESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SEARCH_EXC_ORDERS_SUCCESS", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
            payload: {
              report: {
                runner: "placeRunner:urn",
                metadata: {
                  runnerName: "Runner Name",
                  marketName: "Market Name",
                  eventName: "Event Name",
                },
                unmatched: 3,
              },
            },
          });

          saga.stopSaga();
        });

        it("should keep the subscription", async () => {
          searchOrders.mockReturnValue({
            liveOrders: [{ unmatched: 3 }],
          });

          const saga = setup();
          const updateBetSuccess = createUpdateBetSuccessAction({
            unmatched: {},
            betIds: ["unmatchedBetId"],
          });
          await saga.putActions([updateBetSuccess]);

          expect(searchOrders).toHaveBeenCalledTimes(1);

          await saga.advanceTimersByTime(mockedInterval);

          expect(searchOrders).toHaveBeenCalledTimes(2);

          saga.stopSaga();
        });
      });
    });

    describe("when there are no unmatched bets", () => {
      it("should not poll searchOrder", async () => {
        const saga = setup();
        const updateBetSuccess = createUpdateBetSuccessAction({});

        await saga.putActions([updateBetSuccess]);

        expect(searchOrders).not.toHaveBeenCalled();

        await saga.advanceTimersByTime(mockedInterval);

        expect(searchOrders).not.toHaveBeenCalled();

        saga.stopSaga();
      });
    });
  });
});
