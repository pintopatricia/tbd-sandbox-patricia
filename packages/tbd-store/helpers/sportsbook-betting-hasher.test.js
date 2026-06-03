import { RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { SportsbookMarketStatus } from "../state/constants";

import {
  buildBettingRunnerHash,
  buildEntityRunnerHash,
  buildEntityRunnerMap,
  isBettingStale,
} from "./sportsbook-betting-hasher";

describe("Sportsbook Betting Hasher", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("builEntityRunnerMap", () => {
    it("should build a entity runner map organized by core id for selected runners", () => {
      const markets = {
        "m:1": {
          marketId: "924.1",
          status: SportsbookMarketStatus.CLOSED,
          inplay: true,
        },
      };
      const runners = {
        "r:1": {
          market: "m:1",
          selectionId: 1,
          status: "REMOVED",
          handicap: 0,
          trueOdds: { decimal: 12 },
        },
        "r:2": {
          market: "m:1",
          selectionId: 2,
          status: "REMOVED",
          handicap: 0,
          trueOdds: { decimal: 12 },
        },
        "r:3": {
          market: "m:1",
          selectionId: 3,
          status: "REMOVED",
          handicap: 0,
          trueOdds: { decimal: 12 },
        },
      };
      expect(buildEntityRunnerMap(["r:1", "r:3"], markets, runners)).toEqual({
        "924.1-1": {
          marketId: "924.1",
          inplay: true,
          odds: 12,
          handicap: 0,
          marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
          runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
        },
        "924.1-3": {
          marketId: "924.1",
          inplay: true,
          odds: 12,
          handicap: 0,
          marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
          runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
        },
      });
    });
  });

  describe("isBettingStale", () => {
    describe("hasher pair", () => {
      describe("when entity is the same as betting", () => {
        it("should return true on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
            runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
            inplay: true,
            odds: 12.4,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            odds: { decimalOdds: 12.4 },
            handicap: null,
          };
          const runnerFailures = [
            { failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND },
            { failureCode: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND },
          ];
          expect(buildEntityRunnerHash(entityRunner)).toEqual(buildBettingRunnerHash(bettingRunner, runnerFailures));
        });
      });

      describe("when entity is different in any way from betting", () => {
        it("should return false on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            inplay: true,
            odds: 12.39,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            odds: { decimalOdds: { decimal: 12.4 } },
            handicap: null,
          };
          const runnerFailures = [];
          expect(buildEntityRunnerHash(entityRunner)).not.toEqual(
            buildBettingRunnerHash(bettingRunner, runnerFailures),
          );
        });
      });

      describe("when betting is different in any way from betting", () => {
        it("should return false on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            inplay: true,
            odds: 12.4,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            odds: { decimalOdds: { decimal: 12.41 } },
            handicap: null,
          };
          const runnerFailures = [];
          expect(buildEntityRunnerHash(entityRunner)).not.toEqual(
            buildBettingRunnerHash(bettingRunner, runnerFailures),
          );
        });
      });

      describe("when there is a market failure on both sides", () => {
        it("should return true on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
            inplay: true,
            odds: 12.4,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            odds: { decimalOdds: { decimal: 12.4 } },
            handicap: null,
          };
          const runnerFailures = [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }];

          expect(buildEntityRunnerHash(entityRunner)).toEqual(buildBettingRunnerHash(bettingRunner, runnerFailures));
        });
      });

      describe("when there is a runner failure on both sides", () => {
        it("should return true on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
            inplay: true,
            odds: 12.4,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            odds: { decimalOdds: { decimal: 12.4 } },
            handicap: null,
          };
          const runnerFailures = [{ failureCode: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND }];

          expect(buildEntityRunnerHash(entityRunner)).toEqual(buildBettingRunnerHash(bettingRunner, runnerFailures));
        });
      });

      describe("when there are no odds", () => {
        it("should return true on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            inplay: true,
            handicap: 0,
          };
          const bettingRunner = {
            isInplay: true,
            handicap: null,
          };
          const runnerFailures = [];

          expect(buildEntityRunnerHash(entityRunner)).toEqual(buildBettingRunnerHash(bettingRunner, runnerFailures));
        });
      });

      describe("when there is no handicap", () => {
        it("should return true on comparison", () => {
          const entityRunner = {
            marketId: "924.1",
            inplay: true,
          };
          const bettingRunner = {
            isInplay: true,
          };
          const runnerFailures = [];

          expect(buildEntityRunnerHash(entityRunner)).toEqual(buildBettingRunnerHash(bettingRunner, runnerFailures));
        });
      });
    });

    describe("when any state differs", () => {
      it("should return true", () => {
        const bettingRunners = {
          "924.1:1": {
            marketId: "924.1",
            selectionId: 1,
            isInplay: true,
            odds: { decimalOdds: 12 },
            handicap: null,
          },
          "924.2:1": {
            marketId: "924.2",
            selectionId: 1,
            isInplay: false,
            odds: { decimalOdds: 13.1 },
            handicap: null,
          },
        };
        const bettingRunnersFailures = {
          "924.1:1": [
            { failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND },
            { failureCode: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND },
          ],
        };
        const entityRunners = {
          "924.1:1": {
            marketId: "924.1",
            inplay: true,
            odds: 12,
            handicap: 0,
            marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
            runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
          },
          "924.2:1": {
            marketId: "924.1",
            inplay: false,
            odds: 13,
            handicap: 0,
          },
        };
        expect(isBettingStale(bettingRunners, bettingRunnersFailures, entityRunners)).toEqual(true);
      });
    });

    describe("when all state matches", () => {
      it("should return false", () => {
        const bettingRunners = {
          "924.1:1": {
            marketId: "924.1",
            selectionId: 1,
            isInplay: true,
            odds: { decimalOdds: 12 },
            handicap: null,
          },
          "924.2:1": {
            marketId: "924.2",
            selectionId: 1,
            isInplay: false,
            odds: { decimalOdds: 13 },
            handicap: null,
          },
        };
        const bettingRunnersFailures = {
          "924.1:1": [
            { failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND },
            { failureCode: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND },
          ],
        };
        const entityRunners = {
          "924.1:1": {
            marketId: "924.1",
            inplay: true,
            odds: 12,
            handicap: 0,
            marketStatus: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND,
            runnerStatus: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND,
          },
          "924.2:1": {
            marketId: "924.1",
            inplay: false,
            odds: 13,
            handicap: 0,
          },
        };
        expect(isBettingStale(bettingRunners, bettingRunnersFailures, entityRunners)).toEqual(false);
      });
    });
  });
});
