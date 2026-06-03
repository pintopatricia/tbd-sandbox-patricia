import { useContext } from "react";
import { renderHook } from "@testing-library/react-native";
import { ErrorBoundaryContext } from "./error-boundary-context";
import { ErrorBoundaryProvider } from "./ErrorBoundaryProvider.native";

const mockRecordException = jest.fn();
const mockSetStatus = jest.fn();

jest.mock("@opentelemetry/api", () => ({
  SpanStatusCode: { ERROR: 2 },
  trace: {
    getActiveSpan: jest.fn(() => ({
      recordException: mockRecordException,
      setStatus: mockSetStatus,
    })),
  },
}));

function useError(error) {
  const { onError } = useContext(ErrorBoundaryContext);
  onError(error);
}

describe("ErrorBoundaryProvider.web", () => {
  it("should record error to new relic", () => {
    renderHook(() => useError(new Error("dummy error")), {
      wrapper: ({ children }) => <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>,
    });

    expect(mockRecordException).toHaveBeenCalledWith(new Error("dummy error"));
    expect(mockSetStatus).toHaveBeenCalledWith({
      code: 2,
      message: "dummy error",
    });
  });
});
