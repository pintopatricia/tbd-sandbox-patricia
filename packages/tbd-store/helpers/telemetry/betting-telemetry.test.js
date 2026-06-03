import { trace, context, SpanStatusCode, SpanKind } from "@opentelemetry/api";
import { getBasicSpan, getBettingTelemetricFacility } from "./betting-telemetry";

jest.mock("./betting-exceptions", () => ({
  getAuthExceptionSpan: jest.fn(),
  getTechnicalExceptionSpan: jest.fn(),
  getOperationalExceptionSpan: jest.fn(),
  recordException: jest.fn(),
}));

jest.mock("./betting-tracers", () => ({
  traceImply: jest.fn(),
}));

import {
  getAuthExceptionSpan,
  getTechnicalExceptionSpan,
  getOperationalExceptionSpan,
  recordException,
} from "./betting-exceptions";
import { traceImply } from "./betting-tracers";

describe("Betting telemetry", () => {
  let mockTracer;
  let mockSpan;
  let mockParentSpan;
  let consoleErrorSpy;

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
      startActiveSpan: jest.fn((name, options, contextOrCallback, callback) => {
        if (typeof contextOrCallback === "function") {
          return contextOrCallback(mockSpan);
        }
        if (typeof callback === "function") {
          return callback(mockSpan);
        }
        return mockSpan;
      }),
    };

    jest.spyOn(trace, "setSpan").mockImplementation((ctx, span) => ctx);
    jest.spyOn(context, "active").mockReturnValue({});

    // Setup mocked dependency functions to return mock span
    getTechnicalExceptionSpan.mockReturnValue(mockSpan);
    getAuthExceptionSpan.mockReturnValue(mockSpan);
    getOperationalExceptionSpan.mockReturnValue(mockSpan);

    window.SplunkRum = {
      error: jest.fn(),
    };

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    delete window.SplunkRum;
  });

  describe("getBasicSpan", () => {
    it("should create a span with correct name and attributes", () => {
      const spanName = "test.span";
      const span = getBasicSpan(mockTracer, spanName);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        spanName,
        {
          attributes: {
            "workflow.name": spanName,
          },
          kind: SpanKind.CLIENT,
          links: [],
        },
        {},
      );
      expect(span).toBe(mockSpan);
    });

    it("should create a span with custom workflow name", () => {
      const spanName = "test.span";
      const workflowName = "custom.workflow";
      getBasicSpan(mockTracer, spanName, undefined, workflowName);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        spanName,
        expect.objectContaining({
          attributes: {
            "workflow.name": workflowName,
          },
        }),
        {},
      );
    });

    it("should link to parent span when provided", () => {
      const spanName = "test.span";
      getBasicSpan(mockTracer, spanName, mockParentSpan);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        spanName,
        expect.objectContaining({
          links: [{ context: mockParentSpan.spanContext() }],
        }),
        expect.anything(),
      );
      expect(trace.setSpan).toHaveBeenCalledWith(expect.anything(), mockParentSpan);
    });

    describe("when no workflow name is provided", () => {
      it("should default workflow name to span name", () => {
        const spanName = "test.span";
        getBasicSpan(mockTracer, spanName);

        expect(mockTracer.startSpan).toHaveBeenCalledWith(
          spanName,
          expect.objectContaining({
            attributes: {
              "workflow.name": spanName,
            },
          }),
          {},
        );
      });
    });
  });

  describe("getBettingTelemetricFacility", () => {
    let facility;

    beforeEach(() => {
      facility = getBettingTelemetricFacility(mockTracer);
    });

    describe("recordTechnicalException", () => {
      it("should call getTechnicalExceptionSpan with correct arguments", () => {
        const error = new Error("Technical error");

        facility.recordTechnicalException(error);

        expect(getTechnicalExceptionSpan).toHaveBeenCalledWith(mockTracer, error, expect.anything(), undefined);
      });

      it("should call recordException with the span and error", () => {
        const error = new Error("Technical error");

        facility.recordTechnicalException(error);

        expect(recordException).toHaveBeenCalledWith(error, mockSpan, undefined);
      });

      it("should end the span", () => {
        const error = new Error("Technical error");

        facility.recordTechnicalException(error);

        expect(mockSpan.end).toHaveBeenCalled();
      });

      it("should handle errors during recording", () => {
        getTechnicalExceptionSpan.mockImplementationOnce(() => {
          throw new Error("Span creation failed");
        });

        const error = new Error("Technical error");

        expect(() => facility.recordTechnicalException(error)).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed recording to Splunk RUM", expect.any(Error));
      });

      it("should pass parent span when provided", () => {
        const facilityWithParent = getBettingTelemetricFacility(mockTracer, mockParentSpan);
        const error = new Error("Technical error");

        facilityWithParent.recordTechnicalException(error);

        expect(getTechnicalExceptionSpan).toHaveBeenCalledWith(mockTracer, error, expect.anything(), mockParentSpan);
        expect(recordException).toHaveBeenCalledWith(error, mockSpan, mockParentSpan);
      });
    });

    describe("recordAuthException", () => {
      it("should call getAuthExceptionSpan with correct arguments", () => {
        const error = new Error("Authentication error");

        facility.recordAuthException(error);

        expect(getAuthExceptionSpan).toHaveBeenCalledWith(mockTracer, error, expect.anything(), undefined);
      });

      it("should call recordException with the span and error", () => {
        const error = new Error("Authentication error");

        facility.recordAuthException(error);

        expect(recordException).toHaveBeenCalledWith(error, mockSpan, undefined);
      });

      it("should end the span", () => {
        const error = new Error("Authentication error");

        facility.recordAuthException(error);

        expect(mockSpan.end).toHaveBeenCalled();
      });

      it("should handle errors during recording", () => {
        getAuthExceptionSpan.mockImplementationOnce(() => {
          throw new Error("Span creation failed");
        });

        const error = new Error("Auth error");

        expect(() => facility.recordAuthException(error)).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed recording to Splunk RUM", expect.any(Error));
      });

      it("should pass parent span when provided", () => {
        const facilityWithParent = getBettingTelemetricFacility(mockTracer, mockParentSpan);
        const error = new Error("Authentication error");

        facilityWithParent.recordAuthException(error);

        expect(getAuthExceptionSpan).toHaveBeenCalledWith(mockTracer, error, expect.anything(), mockParentSpan);
        expect(recordException).toHaveBeenCalledWith(error, mockSpan, mockParentSpan);
      });
    });

    describe("recordOperationalException", () => {
      const createMockError = () => ({
        name: "SportsbookTransactionalError",
        message: "Operational error",
        stack: "Error stack",
        operation: {
          respCode: "ERROR_CODE",
          failureReason: "Insufficient funds",
          status: "FAILED",
        },
        definitions: [],
      });

      it("should call getOperationalExceptionSpan with correct arguments", () => {
        const error = createMockError();

        facility.recordOperationalException(error);

        expect(getOperationalExceptionSpan).toHaveBeenCalledWith(mockTracer, error, expect.anything());
      });

      it("should call recordException with the span and error", () => {
        const error = createMockError();

        facility.recordOperationalException(error);

        expect(recordException).toHaveBeenCalledWith(error, mockSpan, undefined);
      });

      it("should end the span", () => {
        const error = createMockError();

        facility.recordOperationalException(error);

        expect(mockSpan.end).toHaveBeenCalled();
      });

      it("should handle errors during recording", () => {
        getOperationalExceptionSpan.mockImplementationOnce(() => {
          throw new Error("Span creation failed");
        });

        const error = createMockError();

        expect(() => facility.recordOperationalException(error)).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed recording to Splunk RUM", expect.any(Error));
      });

      it("should pass parent span to recordException when provided", () => {
        const facilityWithParent = getBettingTelemetricFacility(mockTracer, mockParentSpan);
        const error = createMockError();

        facilityWithParent.recordOperationalException(error);

        expect(recordException).toHaveBeenCalledWith(error, mockSpan, mockParentSpan);
      });
    });

    describe("recordImplyResult", () => {
      it("should call traceImply with correct arguments", () => {
        const result = [
          {
            betCombinations: [],
            winRunnerOdds: [],
            betFailures: [],
          },
        ];

        facility.recordImplyResult(result);

        expect(traceImply).toHaveBeenCalledWith(mockTracer, result, undefined);
      });

      it("should pass parent span when provided", () => {
        const facilityWithParent = getBettingTelemetricFacility(mockTracer, mockParentSpan);
        const result = [
          {
            betCombinations: [],
            winRunnerOdds: [],
            betFailures: [],
          },
        ];

        facilityWithParent.recordImplyResult(result);

        expect(traceImply).toHaveBeenCalledWith(mockTracer, result, mockParentSpan);
      });

      it("should handle errors during recording", () => {
        traceImply.mockImplementationOnce(() => {
          throw new Error("Tracing failed");
        });

        const result = [
          {
            betCombinations: [],
            winRunnerOdds: [],
            betFailures: [],
          },
        ];

        expect(() => facility.recordImplyResult(result)).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed recording to Splunk RUM", expect.any(Error));
      });

      it("should handle empty result array", () => {
        expect(() => facility.recordImplyResult([])).not.toThrow();
        expect(traceImply).toHaveBeenCalledWith(mockTracer, [], undefined);
      });
    });

    describe("when SplunkRum is not available", () => {
      beforeEach(() => {
        delete window.SplunkRum;
      });

      it("should not throw when recording technical exception", () => {
        expect(() => facility.recordTechnicalException(new Error("Test"))).not.toThrow();
        expect(getTechnicalExceptionSpan).toHaveBeenCalled();
        expect(mockSpan.end).toHaveBeenCalled();
      });

      it("should not throw when recording auth exception", () => {
        expect(() => facility.recordAuthException(new Error("Test"))).not.toThrow();
        expect(getAuthExceptionSpan).toHaveBeenCalled();
        expect(mockSpan.end).toHaveBeenCalled();
      });

      it("should not throw when recording operational exception", () => {
        const error = {
          name: "SportsbookTransactionalError",
          message: "Test",
          operation: { respCode: "ERROR", failureReason: "Failed" },
          definitions: [],
        };
        expect(() => facility.recordOperationalException(error)).not.toThrow();
        expect(getOperationalExceptionSpan).toHaveBeenCalled();
        expect(mockSpan.end).toHaveBeenCalled();
      });
    });
  });
});
