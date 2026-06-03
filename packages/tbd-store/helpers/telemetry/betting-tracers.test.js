import { trace, context, SpanKind } from "@opentelemetry/api";
import {
  traceLegDefinition,
  traceLegResult,
  traceRunnerResult,
  tracePlaceBet,
  traceCombinations,
  traceWinRunnerOdds,
  traceBetFailures,
  traceImply,
} from "./betting-tracers";

jest.mock("./betting-telemetry", () => ({
  getBasicSpan: jest.fn(),
}));

import { getBasicSpan } from "./betting-telemetry";

describe("Betting tracers", () => {
  let mockTracer;
  let mockSpan;
  let mockParentSpan;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSpan = {
      spanContext: jest.fn(() => ({ traceId: "trace-123", spanId: "span-123" })),
      setAttribute: jest.fn(),
      setAttributes: jest.fn(),
      setStatus: jest.fn(),
      recordException: jest.fn(),
      end: jest.fn(),
    };

    mockParentSpan = {
      spanContext: jest.fn(() => ({ traceId: "parent-trace-123", spanId: "parent-span-123" })),
      setAttribute: jest.fn(),
      setAttributes: jest.fn(),
      setStatus: jest.fn(),
      recordException: jest.fn(),
      end: jest.fn(),
    };

    mockTracer = {
      startSpan: jest.fn(() => mockSpan),
      startActiveSpan: jest.fn((name, options, callback) => {
        if (typeof callback === "function") {
          return callback(mockSpan);
        }
        return mockSpan;
      }),
    };

    getBasicSpan.mockReturnValue(mockSpan);

    jest.spyOn(trace, "setSpan").mockImplementation((ctx, span) => ctx);
    jest.spyOn(context, "active").mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("traceLegDefinition", () => {
    it("should create spans for each leg in the definition", () => {
      const definition = {
        betNo: 1,
        legs: [
          {
            betRunners: [{ marketId: "1.123", selectionId: "456" }],
            winExpectedOdds: { decimalOdds: { decimalOdds: 2.5 } },
          },
        ],
      };

      traceLegDefinition(mockTracer, definition);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.definition.1.leg.0",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
            "bet.1.leg.0.runners": '[{"marketId":"1.123","selectionId":"456"}]',
            "bet.1.leg.0.odds": 2.5,
          }),
        }),
        expect.any(Function),
      );
    });

    it("should call span.end() for each leg", () => {
      const definition = {
        betNo: 1,
        legs: [
          {
            betRunners: [{ marketId: "1.123", selectionId: "456" }],
            winExpectedOdds: { decimalOdds: { decimalOdds: 2.5 } },
          },
          {
            betRunners: [{ marketId: "1.789", selectionId: "012" }],
            winExpectedOdds: { decimalOdds: { decimalOdds: 3.0 } },
          },
        ],
      };

      traceLegDefinition(mockTracer, definition);

      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    it("should handle definition with no legs", () => {
      const definition = { betNo: 1 };

      expect(() => traceLegDefinition(mockTracer, definition)).not.toThrow();
    });
  });

  describe("traceLegResult", () => {
    it("should create spans for each unique leg failure code", () => {
      const legs = [{ failureCode: "LEG_FAILURE_1" }, { failureCode: "LEG_FAILURE_2" }];

      traceLegResult(mockTracer, legs);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.leg.failure.LEG_FAILURE_1",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
          }),
        }),
        expect.any(Function),
      );

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.leg.failure.LEG_FAILURE_2",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
          }),
        }),
        expect.any(Function),
      );
    });

    it("should only create one span per unique failure code when duplicates exist", () => {
      const legs = [
        { failureCode: "FAILURE_1" },
        { failureCode: "FAILURE_1" },
        { failureCode: "FAILURE_2" },
        { failureCode: "FAILURE_1" },
      ];

      traceLegResult(mockTracer, legs);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledTimes(2);
      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    it("should call span.end() for each unique failure code", () => {
      const legs = [{ failureCode: "FAILURE_1" }, { failureCode: "FAILURE_2" }];

      traceLegResult(mockTracer, legs);

      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    it("should handle empty legs array", () => {
      expect(() => traceLegResult(mockTracer, [])).not.toThrow();
    });
  });

  describe("traceRunnerResult", () => {
    it("should create spans for each unique runner failure code", () => {
      const runners = [{ failureCode: "RUNNER_FAILURE_1" }, { failureCode: "RUNNER_FAILURE_2" }];

      traceRunnerResult(mockTracer, runners);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.runner.failure.RUNNER_FAILURE_1",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
          }),
        }),
        expect.any(Function),
      );

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.runner.failure.RUNNER_FAILURE_2",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
          }),
        }),
        expect.any(Function),
      );
    });

    it("should only create one span per unique failure code when duplicates exist", () => {
      const runners = [
        { failureCode: "FAILURE_1" },
        { failureCode: "FAILURE_1" },
        { failureCode: "FAILURE_2" },
        { failureCode: "FAILURE_1" },
      ];

      traceRunnerResult(mockTracer, runners);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledTimes(2);
      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    it("should call span.end() for each unique failure code", () => {
      const runners = [{ failureCode: "FAILURE_1" }, { failureCode: "FAILURE_2" }];

      traceRunnerResult(mockTracer, runners);

      expect(mockSpan.end).toHaveBeenCalledTimes(2);
    });

    it("should handle empty runners array", () => {
      expect(() => traceRunnerResult(mockTracer, [])).not.toThrow();
    });
  });

  describe("tracePlaceBet", () => {
    it("should create a span for the bet definition", () => {
      const definition = {
        betNo: 1,
        betReference: "BET-123",
        betType: "SINGLE",
        stakePerLine: 10,
        winExpectedOdds: {
          trueOdds: { decimalOdds: { decimalOdds: 2.5 } },
        },
        legs: [],
      };

      tracePlaceBet(mockTracer, definition);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.definition.1",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
            "bet.1.ref": "BET-123",
            "bet.1.type": "SINGLE",
            "bet.1.stake": 10,
            "bet.1.odds": 2.5,
          }),
        }),
        expect.any(Function),
      );
    });

    it("should trace leg definitions", () => {
      const definition = {
        betNo: 1,
        legs: [
          {
            betRunners: [{ marketId: "1.123", selectionId: "456" }],
            winExpectedOdds: { decimalOdds: { decimalOdds: 2.5 } },
          },
        ],
      };

      tracePlaceBet(mockTracer, definition);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.definition.1.leg.0",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
          }),
        }),
        expect.any(Function),
      );
    });

    it("should call span.end()", () => {
      const definition = { betNo: 1, legs: [] };

      tracePlaceBet(mockTracer, definition);

      expect(mockSpan.end).toHaveBeenCalled();
    });
  });

  describe("traceCombinations", () => {
    it("should create spans for each combination", () => {
      const combinations = [
        {
          betType: "SINGLE",
          betReference: "BET-1",
          numLines: 1,
          combinationGroup: "GROUP-1",
          combinationGroupId: "ID-1",
          winAvgOdds: { trueOdds: { decimalOdds: { decimalOdds: 2.5 } } },
          eachwayAvgOdds: { trueOdds: { decimalOdds: { decimalOdds: 1.5 } } },
        },
      ];

      traceCombinations(mockTracer, combinations);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.combination.SINGLE.BET-1",
        undefined,
        "betting.implyBets.combination",
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        "combination.numLines": 1,
        "combination.combinationGroup": "GROUP-1",
        "combination.combinationGroupId": "ID-1",
        "combination.trueWinAvgOdds": '{"decimalOdds":{"decimalOdds":2.5}}',
        "combination.trueEachwayAvgOdds": '{"decimalOdds":{"decimalOdds":1.5}}',
      });

      expect(mockSpan.end).toHaveBeenCalled();
    });

    it("should use index when betReference is not available", () => {
      const combinations = [
        {
          betType: "SINGLE",
          numLines: 1,
        },
      ];

      traceCombinations(mockTracer, combinations);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.combination.SINGLE.0",
        undefined,
        "betting.implyBets.combination",
      );
    });

    it("should link to parent span when provided", () => {
      const combinations = [{ betType: "SINGLE", numLines: 1 }];

      traceCombinations(mockTracer, combinations, mockParentSpan);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        expect.any(String),
        mockParentSpan,
        "betting.implyBets.combination",
      );
    });

    it("should handle empty combinations array", () => {
      expect(() => traceCombinations(mockTracer, [])).not.toThrow();
      expect(mockSpan.end).not.toHaveBeenCalled();
    });
  });

  describe("traceWinRunnerOdds", () => {
    it("should create spans for each runner with valid runner property", () => {
      const runnerOdds = [
        {
          runner: { marketId: "1.123", selectionId: "456" },
          combinationGroups: ["GROUP-1", "GROUP-2"],
          inplay: true,
          odds: { trueOdds: { decimalOdds: { decimalOdds: 2.5 } } },
        },
      ];

      traceWinRunnerOdds(mockTracer, runnerOdds);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.runner.1.123-456",
        undefined,
        "betting.implyBets.runner",
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        "runner.combinationGroups": "GROUP-1,GROUP-2",
        "runner.inplay": true,
        "runner.trueOdds": '{"decimalOdds":{"decimalOdds":2.5}}',
      });

      expect(mockSpan.end).toHaveBeenCalled();
    });

    it("should filter out runners without runner property", () => {
      const runnerOdds = [
        { combinationGroups: ["GROUP-1"], inplay: true, odds: {} },
        {
          runner: { marketId: "1.123", selectionId: "456" },
          combinationGroups: ["GROUP-2"],
          inplay: false,
          odds: {},
        },
      ];

      traceWinRunnerOdds(mockTracer, runnerOdds);

      expect(getBasicSpan).toHaveBeenCalledTimes(1);
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.runner.1.123-456",
        undefined,
        "betting.implyBets.runner",
      );
    });

    it("should link to parent span when provided", () => {
      const runnerOdds = [
        {
          runner: { marketId: "1.123", selectionId: "456" },
          combinationGroups: [],
          inplay: false,
          odds: {},
        },
      ];

      traceWinRunnerOdds(mockTracer, runnerOdds, mockParentSpan);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        expect.any(String),
        mockParentSpan,
        "betting.implyBets.runner",
      );
    });

    it("should handle empty runnerOdds array", () => {
      expect(() => traceWinRunnerOdds(mockTracer, [])).not.toThrow();
      expect(mockSpan.end).not.toHaveBeenCalled();
    });

    it("should handle undefined runnerOdds", () => {
      expect(() => traceWinRunnerOdds(mockTracer, undefined)).not.toThrow();
    });
  });

  describe("traceBetFailures", () => {
    it("should create spans for each failure with valid failedRunner", () => {
      const failures = [
        {
          failedRunner: { marketId: "1.123", selectionId: "456" },
          failureCode: "INSUFFICIENT_FUNDS",
          combinationGroupIds: ["ID-1", "ID-2"],
          combinationGroups: ["GROUP-1", "GROUP-2"],
        },
      ];

      traceBetFailures(mockTracer, failures);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.runner.failure.INSUFFICIENT_FUNDS",
        undefined,
        "betting.implyBets.runner.failure",
      );

      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        "runner.failure.runner": "betting.implyBets.runner.1.123-456",
        "runner.failure.failureCode": "INSUFFICIENT_FUNDS",
        "runner.failure.combinationGroupIds": "ID-1,ID-2",
        "runner.failure.combinationGroups": "GROUP-1,GROUP-2",
      });

      expect(mockSpan.end).toHaveBeenCalled();
    });

    it("should filter out failures without failedRunner property", () => {
      const failures = [
        { failureCode: "FAILURE_1", combinationGroupIds: [], combinationGroups: [] },
        {
          failedRunner: { marketId: "1.123", selectionId: "456" },
          failureCode: "FAILURE_2",
          combinationGroupIds: [],
          combinationGroups: [],
        },
      ];

      traceBetFailures(mockTracer, failures);

      expect(getBasicSpan).toHaveBeenCalledTimes(1);
      expect(mockSpan.end).toHaveBeenCalledTimes(1);
    });

    it("should link to parent span when provided", () => {
      const failures = [
        {
          failedRunner: { marketId: "1.123", selectionId: "456" },
          failureCode: "FAILURE",
          combinationGroupIds: [],
          combinationGroups: [],
        },
      ];

      traceBetFailures(mockTracer, failures, mockParentSpan);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        expect.any(String),
        mockParentSpan,
        "betting.implyBets.runner.failure",
      );
    });

    it("should handle empty failures array", () => {
      expect(() => traceBetFailures(mockTracer, [])).not.toThrow();
      expect(mockSpan.end).not.toHaveBeenCalled();
    });

    it("should handle undefined failures", () => {
      expect(() => traceBetFailures(mockTracer, undefined)).not.toThrow();
    });
  });

  describe("traceImply", () => {
    it("should create root span for each result", () => {
      const response = [
        {
          betCombinations: [],
          winRunnerOdds: [],
          betFailures: [],
        },
      ];

      traceImply(mockTracer, response);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.result.0",
        undefined,
        "betting.implyBets.result",
      );

      expect(mockSpan.end).toHaveBeenCalled();
    });

    it("should trace combinations, runner odds, and failures for each result", () => {
      const response = [
        {
          betCombinations: [{ betType: "SINGLE", betReference: "BET-1" }],
          winRunnerOdds: [
            {
              runner: { marketId: "1.123", selectionId: "456" },
              combinationGroups: [],
              inplay: false,
              odds: {},
            },
          ],
          betFailures: [
            {
              failedRunner: { marketId: "1.789", selectionId: "012" },
              failureCode: "FAILURE",
              combinationGroupIds: [],
              combinationGroups: [],
            },
          ],
        },
      ];

      traceImply(mockTracer, response);

      // Root span
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.result.0",
        undefined,
        "betting.implyBets.result",
      );

      // Combination span
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.combination.SINGLE.BET-1",
        mockSpan,
        "betting.implyBets.combination",
      );

      // Runner span
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.runner.1.123-456",
        mockSpan,
        "betting.implyBets.runner",
      );

      // Failure span
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.runner.failure.FAILURE",
        mockSpan,
        "betting.implyBets.runner.failure",
      );
    });

    it("should link to parent span when provided", () => {
      const response = [
        {
          betCombinations: [],
          winRunnerOdds: [],
          betFailures: [],
        },
      ];

      traceImply(mockTracer, response, mockParentSpan);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.result.0",
        mockParentSpan,
        "betting.implyBets.result",
      );
    });

    it("should handle multiple results", () => {
      const response = [
        { betCombinations: [], winRunnerOdds: [], betFailures: [] },
        { betCombinations: [], winRunnerOdds: [], betFailures: [] },
      ];

      traceImply(mockTracer, response);

      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.result.0",
        undefined,
        "betting.implyBets.result",
      );
      expect(getBasicSpan).toHaveBeenCalledWith(
        mockTracer,
        "betting.implyBets.result.1",
        undefined,
        "betting.implyBets.result",
      );
    });

    it("should handle empty response array", () => {
      expect(() => traceImply(mockTracer, [])).not.toThrow();
      expect(mockSpan.end).not.toHaveBeenCalled();
    });
  });
});
