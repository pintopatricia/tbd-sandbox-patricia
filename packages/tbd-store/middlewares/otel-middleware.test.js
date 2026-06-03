import { trace, SpanStatusCode } from "@opentelemetry/api";
import { otelMiddleware } from "./otel-middleware";
import {
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_PLACE_BETS,
} from "../actions/betting";
import {
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
} from "../actions/betslip";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";

let next = jest.fn().mockReturnValue("nextResult");
let spanEndMock = jest.fn();
let setAttributeMock = jest.fn();
let recordExceptionMock = jest.fn();
let setStatusMock = jest.fn();
let startSpanMock = jest.fn().mockReturnValue({
  end: spanEndMock,
  setAttribute: setAttributeMock,
  recordException: recordExceptionMock,
  setStatus: setStatusMock,
});
let getTracerMock = jest.spyOn(trace, "getTracer").mockReturnValue({
  startSpan: startSpanMock,
});

describe("otelMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a span and calls next with the action", async () => {
    const action = { type: "TEST_ACTION" };
    const middleware = otelMiddleware();
    const result = await middleware(next)(action);

    expect(getTracerMock).toHaveBeenCalledWith("reduxAction");
    expect(startSpanMock).toHaveBeenCalledWith("Redux - TEST_ACTION");
    expect(next).toHaveBeenCalledWith(action);
    expect(spanEndMock).toHaveBeenCalled();
    expect(result).toBe("nextResult");
  });

  describe("betting actions", () => {
    it.each([
      ["BETTING__SBK_PLACE_BETS", BETTING__SBK_PLACE_BETS],
      ["NETWORK__PLACE_SBK_BET_IN_PROGRESS", NETWORK__PLACE_SBK_BET_IN_PROGRESS],
      ["NETWORK__PLACE_SBK_BET_FAILURE", NETWORK__PLACE_SBK_BET_FAILURE],
      ["NETWORK__PLACE_SBK_BET_AUTH_FAILURE", NETWORK__PLACE_SBK_BET_AUTH_FAILURE],
      ["NETWORK__PLACE_SBK_BET_SUCCESS", NETWORK__PLACE_SBK_BET_SUCCESS],
    ])("sets workflow.name to betting.placeBet for %s", async (_, actionType) => {
      const action = { type: actionType };
      const middleware = otelMiddleware();
      await middleware(next)(action);

      expect(setAttributeMock).toHaveBeenCalledWith("workflow.name", "betting.placeBet");
      expect(spanEndMock).toHaveBeenCalled();
    });
  });

  describe("combinator actions", () => {
    it.each([
      ["BETTING__SBK_COMBINATIONS_OUTDATED", BETTING__SBK_COMBINATIONS_OUTDATED],
      ["BETTING__SBK_CLEAR_ACTION", BETTING__SBK_CLEAR_ACTION],
      ["NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS", NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS],
      ["NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE", NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE],
      ["NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE", NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE],
      ["NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS", NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS],
      ["UI__SWITCH_PRODUCT_PREFERENCE", UI__SWITCH_PRODUCT_PREFERENCE],
    ])("sets workflow.name to betting.implyBets for %s", async (_, actionType) => {
      const action = { type: actionType };
      const middleware = otelMiddleware();
      await middleware(next)(action);

      expect(setAttributeMock).toHaveBeenCalledWith("workflow.name", "betting.implyBets");
      expect(spanEndMock).toHaveBeenCalled();
    });
  });

  describe("non-tagged actions", () => {
    it("does not set workflow.name for actions not in either list", async () => {
      const action = { type: "SOME_OTHER_ACTION" };
      const middleware = otelMiddleware();
      await middleware(next)(action);

      expect(setAttributeMock).not.toHaveBeenCalled();
      expect(startSpanMock).toHaveBeenCalledWith("Redux - SOME_OTHER_ACTION");
      expect(next).toHaveBeenCalledWith(action);
      expect(spanEndMock).toHaveBeenCalled();
    });

    it("should create a span and call next for untagged actions", async () => {
      const action = { type: "FETCH_USER_DATA" };
      const middleware = otelMiddleware();
      const result = await middleware(next)(action);

      expect(getTracerMock).toHaveBeenCalledWith("reduxAction");
      expect(startSpanMock).toHaveBeenCalledWith("Redux - FETCH_USER_DATA");
      expect(next).toHaveBeenCalledWith(action);
      expect(spanEndMock).toHaveBeenCalled();
      expect(result).toBe("nextResult");
    });
  });

  describe("error handling", () => {
    it("should record exception and set error status when next throws an Error", async () => {
      const error = new Error("Test error message");
      next.mockImplementationOnce(() => {
        throw error;
      });

      const action = { type: "FAILING_ACTION" };
      const middleware = otelMiddleware();

      await expect(middleware(next)(action)).rejects.toThrow("Test error message");

      expect(recordExceptionMock).toHaveBeenCalledWith(error);
      expect(setStatusMock).toHaveBeenCalledWith({
        code: SpanStatusCode.ERROR,
        message: "Test error message",
      });
    });

    it("should still end the span when an error is thrown", async () => {
      const error = new Error("Another error");
      next.mockImplementationOnce(() => {
        throw error;
      });

      const action = { type: "FAILING_ACTION" };
      const middleware = otelMiddleware();

      await expect(middleware(next)(action)).rejects.toThrow();

      expect(spanEndMock).toHaveBeenCalled();
    });

    it("should re-throw the original error", async () => {
      const error = new Error("Original error");
      next.mockImplementationOnce(() => {
        throw error;
      });

      const action = { type: "FAILING_ACTION" };
      const middleware = otelMiddleware();

      await expect(middleware(next)(action)).rejects.toThrow(error);
    });

    it("should not record exception for non-Error thrown values", async () => {
      const nonError = "string error";
      next.mockImplementationOnce(() => {
        throw nonError;
      });

      const action = { type: "FAILING_ACTION" };
      const middleware = otelMiddleware();

      await expect(middleware(next)(action)).rejects.toBe(nonError);

      expect(recordExceptionMock).not.toHaveBeenCalled();
      expect(setStatusMock).not.toHaveBeenCalled();
      expect(spanEndMock).toHaveBeenCalled();
    });

    it("should handle error during a betting action", async () => {
      const error = new Error("Place bet failed");
      next.mockImplementationOnce(() => {
        throw error;
      });

      const action = { type: BETTING__SBK_PLACE_BETS };
      const middleware = otelMiddleware();

      await expect(middleware(next)(action)).rejects.toThrow("Place bet failed");

      expect(setAttributeMock).toHaveBeenCalledWith("workflow.name", "betting.placeBet");
      expect(recordExceptionMock).toHaveBeenCalledWith(error);
      expect(setStatusMock).toHaveBeenCalledWith({
        code: SpanStatusCode.ERROR,
        message: "Place bet failed",
      });
      expect(spanEndMock).toHaveBeenCalled();
    });
  });
});
