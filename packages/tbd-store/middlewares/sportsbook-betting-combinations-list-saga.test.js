import { buildGetCombinationsPayload } from "@ppb/betslip-core";

import setupSagaMocks from "../saga-jest-setup";
import { getSportsbookBettingState } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getCombinationsList } from "../services/bet-combination-engine-service";
import {
  UI__OPEN_COMBINATIONS_LIST,
  NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS,
  NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
  NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
} from "../actions/betslip";

jest.mock("@ppb/betslip-core", () => ({
  buildGetCombinationsPayload: jest.fn(),
}));

jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn(),
}));

jest.mock("../services/bet-combination-engine-service", () => ({
  getCombinationsList: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ combinationsListSaga: saga } = require("./sportsbook-betting-combinations-list-saga"));
  });

  return setupSagaMocks(saga);
}

describe("combinationsListSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UI__OPEN_COMBINATIONS_LIST", () => {
    it("should dispatch NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS", async () => {
      const saga = setup();

      saga.putActions([
        {
          type: UI__OPEN_COMBINATIONS_LIST,
          payload: {
            combinationId: "c:id",
            maxCombinations: 42,
          },
        },
      ]);

      expect(saga.dispatch).toHaveBeenNthCalledWith(1, { type: NETWORK__FETCH_COMBINATIONS_LIST_IN_PROGRESS });

      saga.stopSaga();
    });

    it("should call getSportsbookBettingState", async () => {
      const saga = setup();
      saga.getState.mockReturnValue("stateMock");

      saga.putActions([
        {
          type: UI__OPEN_COMBINATIONS_LIST,
          payload: {
            combinationId: "c:id",
            maxCombinations: 42,
          },
        },
      ]);

      expect(getSportsbookBettingState).toHaveBeenCalledWith("stateMock");
      expect(getSportsbookBettingState).toHaveBeenCalledTimes(1);

      saga.stopSaga();
    });

    it("should call buildGetCombinationsPayload", async () => {
      const saga = setup();
      saga.getState.mockReturnValueOnce("stateMock");
      getSportsbookBettingState.mockReturnValueOnce("groupMock");

      saga.putActions([
        {
          type: UI__OPEN_COMBINATIONS_LIST,
          payload: {
            combinationId: "c:id",
            maxCombinations: 42,
          },
        },
      ]);

      expect(buildGetCombinationsPayload).toHaveBeenCalledWith("groupMock", "c:id", { maxCombinations: 42 });
      expect(buildGetCombinationsPayload).toHaveBeenCalledTimes(1);

      saga.stopSaga();
    });

    describe("when buildGetCombinationsPayload returns null", () => {
      it("should dispatch NETWORK__FETCH_COMBINATIONS_LIST_FAILURE", async () => {
        const saga = setup();
        saga.getState.mockReturnValueOnce("stateMock");
        getSportsbookBettingState.mockReturnValueOnce("groupMock");
        buildGetCombinationsPayload.mockReturnValueOnce(null);

        saga.putActions([
          {
            type: UI__OPEN_COMBINATIONS_LIST,
            payload: {
              combinationId: "c:id",
              maxCombinations: 42,
            },
          },
        ]);

        expect(saga.dispatch).toHaveBeenNthCalledWith(2, {
          type: NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
          payload: { error: "Failed to build getCombinations payload" },
        });

        saga.stopSaga();
      });
    });

    describe("when buildGetCombinationsPayload returns the payload", () => {
      it("should call getCombinationsList", async () => {
        const saga = setup();
        saga.getState.mockReturnValueOnce("stateMock");
        getSportsbookBettingState.mockReturnValueOnce("groupMock");
        buildGetCombinationsPayload.mockReturnValueOnce("payloadMock");

        saga.putActions([
          {
            type: UI__OPEN_COMBINATIONS_LIST,
            payload: {
              combinationId: "c:id",
              maxCombinations: 42,
            },
          },
        ]);

        expect(getCombinationsList).toHaveBeenCalledWith("payloadMock");
        expect(getCombinationsList).toHaveBeenCalledTimes(1);

        saga.stopSaga();
      });

      describe("when getCombinationsList throws", () => {
        it("should dispatch NETWORK__FETCH_COMBINATIONS_LIST_FAILURE", async () => {
          const saga = setup();
          saga.getState.mockReturnValueOnce("stateMock");
          getSportsbookBettingState.mockReturnValueOnce("groupMock");
          buildGetCombinationsPayload.mockReturnValueOnce("payloadMock");
          getCombinationsList.mockImplementation(() => {
            throw new Error("errorMock");
          });

          saga.putActions([
            {
              type: UI__OPEN_COMBINATIONS_LIST,
              payload: {
                combinationId: "c:id",
                maxCombinations: 42,
              },
            },
          ]);

          expect(saga.dispatch).toHaveBeenNthCalledWith(2, {
            type: NETWORK__FETCH_COMBINATIONS_LIST_FAILURE,
            payload: { error: "errorMock" },
          });

          saga.stopSaga();
        });
      });

      describe("when getCombinationsList returns the response", () => {
        it("should dispatch NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS", async () => {
          const saga = setup();
          saga.getState.mockReturnValueOnce("stateMock");
          getSportsbookBettingState.mockReturnValueOnce("groupMock");
          buildGetCombinationsPayload.mockReturnValueOnce("payloadMock");
          getCombinationsList.mockReturnValueOnce("combinationsListMock");

          saga.putActions([
            {
              type: UI__OPEN_COMBINATIONS_LIST,
              payload: {
                combinationId: "c:id",
                maxCombinations: 42,
              },
            },
          ]);

          expect(saga.dispatch).toHaveBeenNthCalledWith(2, {
            type: NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
            payload: { combinationId: "c:id", response: "combinationsListMock" },
          });

          saga.stopSaga();
        });
      });
    });
  });
});
