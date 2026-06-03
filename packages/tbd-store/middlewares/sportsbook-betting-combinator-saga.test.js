import { buildBetLegs, RUNNER_FAILURE_CODES } from "@ppb/betslip-core";

import { sportsbookBettingCombinatorSaga } from "./sportsbook-betting-combinator-saga";
import { fetchCombinations } from "../services/sportsbook-imply-bets-service";
import setupSagaMocks from "../saga-jest-setup";
import { BETTING__SBK_CLEAR_ACTION, BETTING__SBK_COMBINATIONS_OUTDATED } from "../actions/betting";
import { getSportsbookBettingState } from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
} from "../actions/betslip";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "../actions/sportsbook-markets";
import { buildEntityRunnerMap, isBettingStale } from "../helpers/sportsbook-betting-hasher";
import { getInterval } from "../config";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { getBasicSpan, getBettingTelemetricFacility } from "../helpers/telemetry/betting-telemetry";
import { trace } from "@opentelemetry/api";
import { getThrottles } from "../state/entities/throttles/throttles-selectors";

const mockedInterval = 1000;

jest.mock("../config", () => ({
  getInterval: jest.fn(() => mockedInterval),
}));

jest.mock("../helpers/sportsbook-betting-hasher", () => ({
  isBettingStale: jest.fn().mockReturnValue(true),
  buildEntityRunnerMap: jest.fn().mockReturnValue({}),
}));
jest.mock("../services/sportsbook-imply-bets-service", () => ({
  ...jest.requireActual("../services/sportsbook-imply-bets-service"),
  fetchCombinations: jest.fn().mockReturnValue([{ combinedBets: "combinedBets" }]),
}));
jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn().mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } }),
}));
jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getThrottles: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/betslip-core", () => ({
  ...jest.requireActual("@ppb/betslip-core"),
  buildBetLegs: jest.fn(),
  ImplyBetsResult: {},
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

jest.mock("../helpers/telemetry/betting-telemetry", () => ({
  getBasicSpan: jest.fn().mockReturnValue({
    setAttribute: jest.fn(),
    setAttributes: jest.fn(),
    recordException: jest.fn(),
    setStatus: jest.fn(),
    end: jest.fn(),
  }),
  getBettingTelemetricFacility: jest.fn().mockReturnValue({
    recordImplyResult: jest.fn(),
  }),
}));

jest.mock("../helpers/telemetry/betting-exceptions", () => ({
  addErrorAttributesToSpan: jest.fn(),
}));

jest.mock("@opentelemetry/api", () => {
  const originalModule = jest.requireActual("@opentelemetry/api");

  return {
    ...originalModule,
    trace: {
      getTracer: jest.fn().mockReturnValue({
        startSpan: jest.fn().mockReturnValue({
          end: jest.fn(),
          setAttribute: jest.fn(),
          setAttributes: jest.fn(),
          recordException: jest.fn(),
        }),
      }),
    },
  };
});

async function advanceTimersByTime(saga, ms, times = 3) {
  for (let i = 0; i < times; i++) {
    await saga.advanceTimersByTime(ms);
  }

  return saga.advanceTimersByTime(0);
}

describe("sportsbookBettingCombinatorSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when SKIP_DIRTY_CHECK is enabled", () => {
    beforeAll(() => {
      getThrottles.mockReturnValue({ SKIP_DIRTY_CHECK: { isActive: true } });
    });

    it("should not put SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES", async () => {
      getSportsbookBettingState.mockReturnValue({
        runners: { "R:1": { marketId: "924.1", selectionId: 2 }, "R:2": { marketId: "924.2", selectionId: 2 } },
        failures: { imply: { runners: {} } },
      });

      buildBetLegs.mockReturnValue({
        active: [{ leg: "leg" }],
      });
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });

      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

      expect(saga.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        }),
      );

      saga.stopSaga();
    });

    describe("when fetchCombinations is successful", () => {
      describe.each([
        BETTING__SBK_COMBINATIONS_OUTDATED,
        NETWORK__PLACE_SBK_BET_FAILURE,
        NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      ])("with %s action", (action) => {
        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_IN_PROGRESS", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });

          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          fetchCombinations.mockReturnValue({ combinedBets: "combinedBets" });
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: action }]);

          expect(saga.dispatch.mock.calls[0][0]).toEqual({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_SUCCESS with the result of fetchCombinations", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });

          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          fetchCombinations.mockReturnValueOnce([{ combinedBets: "combinedBets" }]); // first call to active legs
          fetchCombinations.mockReturnValueOnce([]); // second call to the suggested price legs
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: action }]);

          expect(saga.dispatch.mock.calls[1][0]).toEqual({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
            payload: {
              combinations: [{ combinedBets: "combinedBets" }],
            },
          });

          saga.stopSaga();
        });
      });
    });

    describe("when fetchCombinations fails", () => {
      describe.each([
        BETTING__SBK_COMBINATIONS_OUTDATED,
        NETWORK__PLACE_SBK_BET_FAILURE,
        NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      ])("with %s action", (action) => {
        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_IN_PROGRESS", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });

          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          fetchCombinations.mockReturnValue({ combinedBets: "combinedBets" });
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: action }]);
          await advanceTimersByTime(saga, mockedInterval, 3);

          expect(saga.dispatch.mock.calls[0][0]).toEqual({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
          });

          saga.stopSaga();
        });

        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_FAILURE with the error", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });

          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          fetchCombinations.mockRejectedValue("error");
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: action }]);

          await advanceTimersByTime(saga, mockedInterval, 3);

          expect(saga.dispatch.mock.calls[1][0]).toEqual({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
            payload: {
              error: "error",
            },
          });

          saga.stopSaga();
        });
      });
    });

    describe("when fetchCombinations fails with a HTTP unauthorized error", () => {
      describe.each([
        BETTING__SBK_COMBINATIONS_OUTDATED,
        NETWORK__PLACE_SBK_BET_FAILURE,
        NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      ])("with %s action", (action) => {
        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_AUTH_FAILURE", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          isHttpUnauthorizedError.mockReturnValue(true);
          const error = new Error("some error");
          fetchCombinations.mockRejectedValue(error);
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: action }]);

          await advanceTimersByTime(saga, mockedInterval, 3);

          expect(saga.dispatch).toHaveBeenCalledWith({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
          });

          saga.stopSaga();
        });
      });
    });

    describe("retry mechanism", () => {
      it("should retry fetchCombinations up to 3 times before failing", async () => {
        getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        const error = new Error("fetch failed");
        fetchCombinations.mockRejectedValue(error);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: {
            sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
          },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

        await advanceTimersByTime(saga, mockedInterval, 3);

        // With retry(3, 1000, fetchCombinations), each fetch (active and suggested) is retried 3 times
        // So we expect 6 calls total (3 retries for active + 3 retries for suggested)
        expect(fetchCombinations).toHaveBeenCalledTimes(6);

        saga.stopSaga();
      });

      it("should succeed after a retry when fetchCombinations eventually succeeds", async () => {
        getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });

        // First call fails, second call succeeds
        fetchCombinations
          .mockRejectedValueOnce(new Error("transient failure"))
          .mockResolvedValueOnce([{ combinedBets: "combinedBets" }])
          .mockResolvedValueOnce([]);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: {
            sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
          },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

        await advanceTimersByTime(saga, mockedInterval, 3);

        expect(saga.dispatch).toHaveBeenCalledWith({
          type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
          payload: {
            combinations: [{ combinedBets: "combinedBets" }],
          },
        });

        saga.stopSaga();
      });

      it("should dispatch failure after all retries are exhausted", async () => {
        getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        const error = new Error("persistent failure");
        fetchCombinations.mockRejectedValue(error);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: {
            sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
          },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

        await advanceTimersByTime(saga, mockedInterval, 3);

        expect(saga.dispatch).toHaveBeenCalledWith({
          type: NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
          payload: {
            error,
          },
        });

        saga.stopSaga();
      });
    });
  });

  describe("when there are active legs", () => {
    beforeAll(() => {
      getThrottles.mockReturnValue({ SKIP_DIRTY_CHECK: { isActive: false } });
    });

    it("should start a telemetry span chain", async () => {
      const recordResultMock = jest.fn();
      const basicSpanMock = {
        setAttribute: jest.fn(),
        setAttributes: jest.fn(),
        recordException: jest.fn(),
        setStatus: jest.fn(),
        end: jest.fn(),
      };
      getBasicSpan.mockReturnValue(basicSpanMock);
      getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
      buildBetLegs.mockReturnValue({
        active: [{ leg: "leg" }],
      });
      getBettingTelemetricFacility.mockReturnValue({
        recordImplyResult: recordResultMock,
      });
      fetchCombinations.mockReturnValue([{ combinedBets: "combinedBets" }]);
      isBettingStale.mockReturnValue(true);
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });
      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
      await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS }]);

      expect(getBasicSpan).toHaveBeenCalledWith(trace.getTracer(), "betting.implyBets");
      expect(getBasicSpan).toHaveBeenCalledWith(
        trace.getTracer(),
        "betting.implyBets.fetch",
        expect.anything(),
        "betting.implyBets",
      );
      expect(getBasicSpan).toHaveBeenCalledWith(
        trace.getTracer(),
        "betting.implyBets.poll",
        expect.anything(),
        "betting.implyBets",
      );
      expect(recordResultMock).toHaveBeenCalledWith([
        { combinedBets: "combinedBets" },
        { combinedBets: "combinedBets" },
      ]);
      expect(basicSpanMock.setAttributes).toHaveBeenCalledWith({
        "betLegs.active": '[{"leg":"leg"}]',
        "betLegs.suggested": undefined,
      });
      expect(basicSpanMock.setAttributes).toHaveBeenCalledWith({
        "betting.implyBets.refreshed": true,
        "betting.implyBets.fallback": false,
      });

      expect(basicSpanMock.end).toHaveBeenCalledTimes(3);

      saga.stopSaga();
    });

    it("should call fetchCombinations for each FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS passed", async () => {
      getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
      buildBetLegs.mockReturnValue({
        active: [{ leg: "leg" }],
      });

      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });
      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

      expect(fetchCombinations).toHaveBeenCalledTimes(2);

      await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS }]);

      expect(fetchCombinations).toHaveBeenCalledTimes(4);

      saga.stopSaga();
    });

    it("should subscribe to market updates for each market in the state", async () => {
      getSportsbookBettingState.mockReturnValue({
        runners: { "R:1": { marketId: "924.1", selectionId: 2 }, "R:2": { marketId: "924.2", selectionId: 2 } },
        failures: { imply: { runners: {} } },
      });
      buildBetLegs.mockReturnValue({
        active: [{ leg: "leg" }],
      });
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });

      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

      expect(saga.dispatch).toHaveBeenCalledWith({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "924.1", subscriberId: "sbcs" },
      });
      expect(saga.dispatch).toHaveBeenCalledWith({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "924.2", subscriberId: "sbcs" },
      });

      saga.stopSaga();
    });

    it("should re-subscribe each market on next BETTING__SBK_COMBINATIONS_OUTDATED", async () => {
      const sportsbookBettingState = {
        runners: {
          "R:1": { marketId: "924.1", selectionId: 2 },
          "R:2": { marketId: "924.2", selectionId: 2 },
        },
        failures: { imply: { runners: {} } },
      };
      getSportsbookBettingState.mockReturnValue(sportsbookBettingState);
      buildBetLegs.mockReturnValue({
        active: [{ leg: "leg" }],
      });
      isBettingStale.mockReturnValue(false);
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: { sportsbookBetting: sportsbookBettingState },
        entities: {
          sportsbookmarkets: "sportsbookmarkets mock",
          sportsbookrunners: "sportsbookrunners mock",
          throttles: {},
        },
      });

      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
      await saga.putActions([
        {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          payload: { markets: [{ marketId: "924.1" }, { marketId: "924.2" }] },
        },
      ]);

      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
      await saga.putActions([
        {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          payload: { markets: [{ marketId: "924.1" }, { marketId: "924.2" }] },
        },
      ]);

      expect(buildEntityRunnerMap).toHaveBeenCalledWith(
        ["ppb:sbkRunner:924.1/2", "ppb:sbkRunner:924.2/2"],
        "sportsbookmarkets mock",
        "sportsbookrunners mock",
      );

      expect(saga.dispatch).toHaveBeenNthCalledWith(7, {
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "924.1", subscriberId: "sbcs" },
      });
      expect(saga.dispatch).toHaveBeenNthCalledWith(8, {
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "924.2", subscriberId: "sbcs" },
      });

      saga.stopSaga();
    });

    describe("when action is received mid poll", () => {
      describe.each([NETWORK__PLACE_SBK_BET_SUCCESS, BETTING__SBK_CLEAR_ACTION, UI__SWITCH_PRODUCT_PREFERENCE])(
        "with %s action",
        (action) => {
          it("should call fetchCombinations only the necessary amount", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

            expect(fetchCombinations).toHaveBeenCalledWith({ betLegs: [{ leg: "leg" }] });
            expect(fetchCombinations).toHaveBeenCalledTimes(2);

            await saga.putActions([{ type: action }]);

            await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS }]);

            expect(fetchCombinations).toHaveBeenCalledTimes(2);

            saga.stopSaga();
          });

          it("should unsubscribe from each market in the state", async () => {
            getSportsbookBettingState.mockReturnValue({
              runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
              failures: { imply: { runners: {} } },
            });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });

            await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

            await saga.putActions([{ type: action }]);

            expect(saga.dispatch).toHaveBeenCalledWith({
              type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
              payload: { marketId: "924.1", subscriberId: "sbcs" },
            });

            saga.stopSaga();
          });
        },
      );
    });

    describe("when betting is stale", () => {
      describe("when fetchCombinations is successful", () => {
        describe.each([
          BETTING__SBK_COMBINATIONS_OUTDATED,
          NETWORK__PLACE_SBK_BET_FAILURE,
          NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        ])("with %s action", (action) => {
          it("should put NETWORK/SBK_COMBINATIONS_UPDATE_IN_PROGRESS", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            fetchCombinations.mockReturnValue({ combinedBets: "combinedBets" });
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: action }]);

            expect(saga.dispatch.mock.calls[0][0]).toEqual({
              type: NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
            });

            saga.stopSaga();
          });

          it("should put NETWORK/SBK_COMBINATIONS_UPDATE_SUCCESS with the result of fetchCombinations", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            fetchCombinations.mockReturnValueOnce([{ combinedBets: "combinedBets" }]); // first call to active legs
            fetchCombinations.mockReturnValueOnce([]); // second call to the suggested price legs
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: action }]);

            expect(saga.dispatch.mock.calls[1][0]).toEqual({
              type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
              payload: {
                combinations: [{ combinedBets: "combinedBets" }],
              },
            });

            saga.stopSaga();
          });
        });
      });

      describe("when fetchCombinations fails", () => {
        describe.each([
          BETTING__SBK_COMBINATIONS_OUTDATED,
          NETWORK__PLACE_SBK_BET_FAILURE,
          NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        ])("with %s action", (action) => {
          it("should put NETWORK/SBK_COMBINATIONS_UPDATE_IN_PROGRESS", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            fetchCombinations.mockReturnValue({ combinedBets: "combinedBets" });
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: action }]);

            expect(saga.dispatch.mock.calls[0][0]).toEqual({
              type: NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
            });

            saga.stopSaga();
          });

          it("should put NETWORK/SBK_COMBINATIONS_UPDATE_FAILURE with the error", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            fetchCombinations.mockRejectedValue("error");
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: action }]);

            await advanceTimersByTime(saga, mockedInterval, 3);

            expect(saga.dispatch.mock.calls[1][0]).toEqual({
              type: NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
              payload: {
                error: "error",
              },
            });

            saga.stopSaga();
          });
        });
      });

      describe("when fetchCombinations fails with a HTTP unauthorized error", () => {
        describe.each([
          BETTING__SBK_COMBINATIONS_OUTDATED,
          NETWORK__PLACE_SBK_BET_FAILURE,
          NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        ])("with %s action", (action) => {
          it("should put NETWORK/SBK_COMBINATIONS_UPDATE_AUTH_FAILURE", async () => {
            getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
            buildBetLegs.mockReturnValue({
              active: [{ leg: "leg" }],
            });
            isHttpUnauthorizedError.mockReturnValue(true);
            const error = new Error("some error");
            fetchCombinations.mockRejectedValue(error);
            const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
            saga.getState.mockReturnValue({
              betting: {
                sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
              },
              entities: { throttles: {} },
            });
            await saga.putActions([{ type: action }]);

            await advanceTimersByTime(saga, mockedInterval, 3);

            expect(saga.dispatch).toHaveBeenCalledWith({
              type: NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
            });

            saga.stopSaga();
          });
        });
      });
    });

    describe("when betting is up to date", () => {
      it("should not call fetchCombinations when FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS happens", async () => {
        getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        isBettingStale.mockReturnValue(false);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: { sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } } },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

        // First init call
        expect(fetchCombinations).toHaveBeenCalledTimes(2);

        await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS }]);

        // Check there has been no additional calls to fetchCombinations
        expect(fetchCombinations).toHaveBeenCalledTimes(2);

        saga.stopSaga();
      });
    });

    describe("when the market is missing from the response", () => {
      it("should attempt to subscribe the market", async () => {
        getSportsbookBettingState.mockReturnValue({
          runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
          failures: { imply: { runners: {} } },
        });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        isBettingStale.mockReturnValue(false);
        fetchCombinations.mockReturnValue([{ combinedBets: "combinedBets" }]);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: { sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } } },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
        await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, payload: { markets: [] } }]);
        await saga.putActions([
          { type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, payload: { markets: [{ marketId: "924.1" }] } },
        ]);

        expect(saga.dispatch).toHaveBeenNthCalledWith(4, {
          type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: { marketId: "924.1", subscriberId: "sbcs" },
        });

        saga.stopSaga();
      });

      describe("when the market is still missing after a re-subscribe", () => {
        it("should call fetchCombinations to guarantee closure", async () => {
          getSportsbookBettingState.mockReturnValue({
            runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
            failures: { imply: { runners: {} } },
          });
          buildBetLegs.mockReturnValue({
            active: [{ leg: "leg" }],
          });
          isBettingStale.mockReturnValue(false);

          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: { sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } } },
            entities: { throttles: {} },
          });

          await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
          await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, payload: { markets: [] } }]);
          await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, payload: { markets: [] } }]);
          await saga.advanceTimersByTime(getInterval("SIB"));

          expect(fetchCombinations).toHaveBeenCalledTimes(4);

          saga.stopSaga();
        });
      });
    });

    describe("when there is no FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS", () => {
      it("should call fetchCombinations after a delay", async () => {
        getSportsbookBettingState.mockReturnValue({
          runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
          failures: { imply: { runners: {} } },
        });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        isBettingStale.mockReturnValue(false);

        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: { sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } } },
          entities: { throttles: {} },
        });

        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);
        await saga.advanceTimersByTime(getInterval("SMP"));
        await saga.advanceTimersByTime(getInterval("SMP"));
        await saga.advanceTimersByTime(getInterval("SIB"));

        expect(fetchCombinations).toHaveBeenCalledTimes(4);

        saga.stopSaga();
      });
    });

    describe("when all runners are closed", () => {
      it("should stop the poller and unsubscribe", async () => {
        getSportsbookBettingState.mockReturnValue({
          runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
          failures: { imply: { runners: { "R:1": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }] } } },
        });
        buildBetLegs.mockReturnValue({
          active: [{ leg: "leg" }],
        });
        const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
        saga.getState.mockReturnValue({
          betting: {
            sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
          },
          entities: { throttles: {} },
        });
        await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

        expect(fetchCombinations).toHaveBeenCalledTimes(2);

        await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, markets: [] }]);

        expect(fetchCombinations).toHaveBeenCalledTimes(2);
        expect(saga.dispatch).toHaveBeenCalledWith({
          type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
          payload: { marketId: "924.1", subscriberId: "sbcs" },
        });

        await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, markets: [] }]);

        expect(fetchCombinations).toHaveBeenCalledTimes(2);

        saga.stopSaga();
      });
    });
  });

  describe("when there are suggestedPrice legs", () => {
    describe("when betting is stale", () => {
      describe("when fetchCombinations is successful", () => {
        it("should put NETWORK/SBK_COMBINATIONS_UPDATE_SUCCESS with the result of fetchCombinations", async () => {
          getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
          buildBetLegs.mockReturnValue({
            suggestedPrice: [{ leg: "leg" }],
          });
          fetchCombinations.mockReturnValueOnce([]); // first call to active legs
          fetchCombinations.mockReturnValueOnce([{ combinedBets: "combinedBets" }]); // second call to the suggested price legs
          const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
          saga.getState.mockReturnValue({
            betting: {
              sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
            },
            entities: { throttles: {} },
          });
          await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

          expect(saga.dispatch.mock.calls[1][0]).toEqual({
            type: NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
            payload: {
              combinations: [{ combinedBets: "combinedBets" }],
            },
          });

          saga.stopSaga();
        });
      });
    });
  });

  describe("when there are no active legs", () => {
    it("should not call fetchCombinations for each interval passed", async () => {
      getSportsbookBettingState.mockReturnValue({ runners: {}, failures: { imply: { runners: {} } } });
      buildBetLegs.mockReturnValue({
        active: [],
      });
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });
      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

      expect(fetchCombinations).not.toHaveBeenCalled();

      await saga.putActions([{ type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS }]);

      expect(fetchCombinations).not.toHaveBeenCalled();

      saga.stopSaga();
    });

    it("should not subscribe to market updates for each market in the state", async () => {
      getSportsbookBettingState.mockReturnValue({
        runners: { "R:1": { marketId: "924.1", selectionId: 2 } },
        failures: { imply: { runners: {} } },
      });
      buildBetLegs.mockReturnValue({
        active: [],
      });
      const saga = setupSagaMocks(sportsbookBettingCombinatorSaga);
      saga.getState.mockReturnValue({
        betting: {
          sportsbookBetting: { runners: {}, failures: { imply: { runners: {} } } },
        },
        entities: { throttles: {} },
      });

      await saga.putActions([{ type: BETTING__SBK_COMBINATIONS_OUTDATED }]);

      expect(saga.dispatch).not.toHaveBeenCalledWith({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: { marketId: "924.1" },
      });

      saga.stopSaga();
    });
  });
});
