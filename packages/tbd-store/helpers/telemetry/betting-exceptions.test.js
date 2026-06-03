import { trace, context, SpanStatusCode, SpanKind } from "@opentelemetry/api";
import {
  addErrorAttributesToSpan,
  getTechnicalExceptionSpan,
  getAuthExceptionSpan,
  getOperationalExceptionSpan,
  recordException,
} from "./betting-exceptions";

describe("Betting exceptions", () => {
  let mockTracer;
  let mockSpan;
  let mockParentSpan;
  let mockContext;

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

    mockContext = {};

    mockTracer = {
      startSpan: jest.fn(() => mockSpan),
      startActiveSpan: jest.fn((name, options, contextOrCallback, callback) => {
        // Handle different overloads of startActiveSpan
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
    jest.spyOn(context, "active").mockReturnValue(mockContext);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("addErrorAttributesToSpan", () => {
    it("should set error attributes on the span", () => {
      const error = new Error("Test error");
      error.stack = "Error: Test error\n    at test.js:1:1";

      addErrorAttributesToSpan(error, mockSpan);

      expect(mockSpan.setAttributes).toHaveBeenCalledWith({
        "error.message": "Test error",
        "error.stacktrace": "Error: Test error\n    at test.js:1:1",
        "error.type": "Error",
        error: true,
      });
    });

    it("should set error status on the span", () => {
      const error = new Error("Test error");

      addErrorAttributesToSpan(error, mockSpan);

      expect(mockSpan.setStatus).toHaveBeenCalledWith({
        code: SpanStatusCode.ERROR,
        message: "Test error",
      });
    });

    it("should record the exception on the span", () => {
      const error = new Error("Test error");

      addErrorAttributesToSpan(error, mockSpan);

      expect(mockSpan.recordException).toHaveBeenCalledWith(error);
    });

    it("should handle error without stack trace", () => {
      const error = new Error("Test error");
      error.stack = undefined;

      addErrorAttributesToSpan(error, mockSpan);

      expect(mockSpan.setAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          "error.stacktrace": "No stack trace available",
        }),
      );
    });

    it("should work with custom error types", () => {
      class CustomError extends Error {
        constructor(message) {
          super(message);
          this.name = "CustomError";
        }
      }

      const error = new CustomError("Custom error message");
      addErrorAttributesToSpan(error, mockSpan);

      expect(mockSpan.setAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          "error.type": "CustomError",
          "error.message": "Custom error message",
        }),
      );
    });
  });

  describe("getTechnicalExceptionSpan", () => {
    it("should create a span with correct name and attributes", () => {
      const error = new Error("Technical error");

      getTechnicalExceptionSpan(mockTracer, error);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.technical",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.technical",
            "error.message": "Technical error",
            "error.type": "Error",
            error: true,
          }),
          kind: SpanKind.CLIENT,
        }),
        undefined,
      );
    });

    it("should use provided context", () => {
      const error = new Error("Technical error");
      const customContext = { custom: "context" };

      getTechnicalExceptionSpan(mockTracer, error, customContext);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.technical",
        expect.anything(),
        customContext,
      );
    });

    it("should link to parent span when provided", () => {
      const error = new Error("Technical error");

      getTechnicalExceptionSpan(mockTracer, error, mockContext, mockParentSpan);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.technical",
        expect.objectContaining({
          links: [{ context: mockParentSpan.spanContext() }],
        }),
        expect.anything(),
      );
    });

    it("should return the created span", () => {
      const error = new Error("Technical error");
      const span = getTechnicalExceptionSpan(mockTracer, error);

      expect(span).toBe(mockSpan);
    });
  });

  describe("getAuthExceptionSpan", () => {
    it("should create a span with correct name and attributes", () => {
      const error = new Error("Auth error");

      getAuthExceptionSpan(mockTracer, error);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.auth",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.auth",
            "error.message": "Auth error",
            "error.type": "Error",
            error: true,
          }),
          kind: SpanKind.CLIENT,
        }),
        undefined,
      );
    });

    it("should use provided context", () => {
      const error = new Error("Auth error");
      const customContext = { custom: "context" };

      getAuthExceptionSpan(mockTracer, error, customContext);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.auth",
        expect.anything(),
        customContext,
      );
    });

    it("should link to parent span when provided", () => {
      const error = new Error("Auth error");

      getAuthExceptionSpan(mockTracer, error, mockContext, mockParentSpan);

      expect(mockTracer.startSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.auth",
        expect.objectContaining({
          links: [{ context: mockParentSpan.spanContext() }],
        }),
        expect.anything(),
      );
    });

    it("should return the created span", () => {
      const error = new Error("Auth error");
      const span = getAuthExceptionSpan(mockTracer, error);

      expect(span).toBe(mockSpan);
    });
  });

  describe("getOperationalExceptionSpan", () => {
    const createMockError = (overrides = {}) => ({
      name: "SportsbookTransactionalError",
      message: "Operational error",
      stack: "Error stack",
      operation: {
        respCode: "ERROR_CODE",
        failureReason: "Insufficient funds",
        result: [],
        ...overrides.operation,
      },
      definitions: [],
      ...overrides,
    });

    it("should create a span with correct name and attributes", () => {
      const error = createMockError();

      getOperationalExceptionSpan(mockTracer, error, mockContext);

      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational",
        expect.objectContaining({
          attributes: expect.objectContaining({
            "workflow.name": "betting.placeBet.exception.operational",
            "betting.placeBet.code": "ERROR_CODE",
            "betting.placeBet.reason": "Insufficient funds",
            "error.message": "Operational error",
          }),
        }),
        mockContext,
        expect.any(Function),
      );
    });

    it("should trace unique leg failure codes across all results", () => {
      const error = createMockError({
        operation: {
          respCode: "ERROR",
          failureReason: "Failed",
          result: [
            {
              betNo: 1,
              legs: [{ failureCode: "LEG_FAILURE_1" }, { failureCode: "LEG_FAILURE_2" }],
            },
            {
              betNo: 2,
              legs: [{ failureCode: "LEG_FAILURE_1" }, { failureCode: "LEG_FAILURE_3" }],
            },
          ],
        },
      });

      getOperationalExceptionSpan(mockTracer, error, mockContext);

      // Should trace 3 unique leg failure codes across all results
      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.leg.failure.LEG_FAILURE_1",
        expect.any(Object),
        expect.any(Function),
      );
      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.leg.failure.LEG_FAILURE_2",
        expect.any(Object),
        expect.any(Function),
      );
      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.leg.failure.LEG_FAILURE_3",
        expect.any(Object),
        expect.any(Function),
      );
    });

    it("should trace unique runner failure codes across all results", () => {
      const error = createMockError({
        operation: {
          respCode: "ERROR",
          failureReason: "Failed",
          result: [
            {
              betNo: 1,
              runners: [{ failureCode: "RUNNER_FAILURE_1" }],
            },
            {
              betNo: 2,
              runners: [{ failureCode: "RUNNER_FAILURE_1" }, { failureCode: "RUNNER_FAILURE_2" }],
            },
          ],
        },
      });

      getOperationalExceptionSpan(mockTracer, error, mockContext);

      // Should trace 2 unique runner failure codes across all results
      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.runner.failure.RUNNER_FAILURE_1",
        expect.any(Object),
        expect.any(Function),
      );
      expect(mockTracer.startActiveSpan).toHaveBeenCalledWith(
        "betting.placeBet.exception.operational.result.runner.failure.RUNNER_FAILURE_2",
        expect.any(Object),
        expect.any(Function),
      );
    });

    it("should handle empty results", () => {
      const error = createMockError({
        operation: {
          respCode: "ERROR",
          failureReason: "Failed",
          result: [],
        },
      });

      expect(() => getOperationalExceptionSpan(mockTracer, error, mockContext)).not.toThrow();
    });

    it("should handle undefined results", () => {
      const error = createMockError({
        operation: {
          respCode: "ERROR",
          failureReason: "Failed",
          result: undefined,
        },
      });

      expect(() => getOperationalExceptionSpan(mockTracer, error, mockContext)).not.toThrow();
    });

    it("should return the created span", () => {
      const error = createMockError();
      const span = getOperationalExceptionSpan(mockTracer, error, mockContext);

      expect(span).toBe(mockSpan);
    });
  });

  describe("recordException", () => {
    it("should add error attributes to span", () => {
      const error = new Error("Test error");

      recordException(error, mockSpan);

      expect(mockSpan.setAttributes).toHaveBeenCalled();
      expect(mockSpan.setStatus).toHaveBeenCalledWith({
        code: SpanStatusCode.ERROR,
        message: "Test error",
      });
      expect(mockSpan.recordException).toHaveBeenCalledWith(error);
    });

    it("should add error attributes to parent span when provided", () => {
      const error = new Error("Test error");

      recordException(error, mockSpan, mockParentSpan);

      expect(mockParentSpan.setAttributes).toHaveBeenCalled();
      expect(mockParentSpan.setStatus).toHaveBeenCalledWith({
        code: SpanStatusCode.ERROR,
        message: "Test error",
      });
      expect(mockParentSpan.recordException).toHaveBeenCalledWith(error);

      expect(mockSpan.setAttributes).toHaveBeenCalled();
      expect(mockSpan.setStatus).toHaveBeenCalled();
      expect(mockSpan.recordException).toHaveBeenCalledWith(error);
    });

    it("should not throw when parent is not provided", () => {
      const error = new Error("Test error");

      expect(() => recordException(error, mockSpan)).not.toThrow();
    });
  });
});
