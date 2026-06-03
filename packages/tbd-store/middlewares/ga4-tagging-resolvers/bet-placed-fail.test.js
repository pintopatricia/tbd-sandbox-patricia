import { buildBetPlacedFailEvent } from "tagging-library";
import {
  getExchangeFailedPlaceBetEvent,
  getSportsbookFailedPlaceBetEvent,
  getUpdateBetFailureEvent,
  getObbFailedPlaceBetEvent,
} from "./bet-placed-fail";
import { getSbkDisplayTransactionalError } from "../../helpers/sportsbook-betting";
import { BetDirection } from "../tagging-resolvers/AnalyticsConstants";
import { getObbFailureError } from "../../helpers/obb-betting";
import { ExchangeSide } from "../../state/constants";

jest.mock("tagging-library", () => ({
  buildBetPlacedFailEvent: jest.fn().mockReturnValue("bet placed fail event"),
}));

jest.mock("../../helpers/sportsbook-betting", () => ({
  getSbkDisplayTransactionalError: jest.fn(() => "error"),
}));

jest.mock("../../helpers/obb-betting", () => ({
  getObbFailureError: jest.fn(() => "error"),
}));

jest.mock("../../state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(() => ({ side: ExchangeSide.BACK })),
}));

describe("bet placed fail events", () => {
  afterEach(jest.clearAllMocks);

  describe("getUpdateBetFailureEvent", () => {
    it("should return event", () => {
      const action = {
        payload: {
          error: {
            errorCode: "error mock",
          },
        },
      };

      const appState = {
        betslip: {
          exchangeContext: {
            side: ExchangeSide.BACK,
          },
        },
      };

      const result = getUpdateBetFailureEvent(action, appState);

      expect(buildBetPlacedFailEvent).toHaveBeenCalledWith({
        betDirection: ExchangeSide.BACK,
        error: "error mock",
      });

      expect(result).toBe("bet placed fail event");
    });
  });

  describe("getExchangeFailedPlaceBetEvent", () => {
    it("should return event", () => {
      const action = {
        payload: {
          error: {
            errorCode: "error mock",
          },
          side: ExchangeSide.BACK,
        },
      };

      const result = getExchangeFailedPlaceBetEvent(action);

      expect(buildBetPlacedFailEvent).toHaveBeenCalledWith({
        betDirection: ExchangeSide.BACK,
        error: "error mock",
      });

      expect(result).toBe("bet placed fail event");
    });
  });

  describe("getSportsbookFailedPlaceBetEvent", () => {
    describe("when err is null", () => {
      it("should not call buildBetPlacedFailEvent and return null", () => {
        getSbkDisplayTransactionalError.mockReturnValueOnce(null);
        const result = getSportsbookFailedPlaceBetEvent({
          payload: { state: { failures: { place: "failureGroup" } } },
        });

        expect(getSbkDisplayTransactionalError).toHaveBeenCalledWith("failureGroup");
        expect(buildBetPlacedFailEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when err is a string", () => {
      it("should call buildBetPlacedFailEvent with the correct payload", () => {
        const result = getSportsbookFailedPlaceBetEvent({
          payload: { state: { failures: { place: "failureGroup" } } },
        });

        expect(getSbkDisplayTransactionalError).toHaveBeenCalledWith("failureGroup");
        expect(buildBetPlacedFailEvent).toHaveBeenCalledWith({
          betDirection: BetDirection.Back,
          error: "error",
        });
        expect(result).toBe("bet placed fail event");
      });
    });
  });
  describe("getObbFailedPlaceBetEvent", () => {
    describe("when err is null", () => {
      it("should not call buildBetPlacedFailEvent and return null", () => {
        getObbFailureError.mockReturnValueOnce(null);
        const result = getObbFailedPlaceBetEvent({
          payload: {
            state: {
              failures: {
                betslip: null,
                potentialBets: {},
                legs: {},
              },
            },
          },
        });

        expect(getObbFailureError).toHaveBeenCalledWith({
          failures: {
            betslip: null,
            potentialBets: {},
            legs: {},
          },
        });
        expect(buildBetPlacedFailEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when err is a string", () => {
      it("should call buildBetPlacedFailEvent with the correct payload", () => {
        const result = getObbFailedPlaceBetEvent({
          payload: {
            state: {
              failures: {
                betslip: "betslipError",
                potentialBets: {},
                legs: {},
              },
            },
          },
        });

        expect(getObbFailureError).toHaveBeenCalledWith({
          failures: {
            betslip: "betslipError",
            potentialBets: {},
            legs: {},
          },
        });
        expect(buildBetPlacedFailEvent).toHaveBeenCalledWith({
          betDirection: BetDirection.Back,
          error: "error",
        });
        expect(result).toBe("bet placed fail event");
      });
    });
  });
});
