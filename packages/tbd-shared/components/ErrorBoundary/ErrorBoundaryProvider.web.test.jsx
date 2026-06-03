import { useContext } from "react";
import { renderHook } from "@testing-library/react";
import { ErrorBoundaryContext } from "./error-boundary-context";
import { ErrorBoundaryProvider } from "./ErrorBoundaryProvider.web";

function useError(error, errorInfoMock, urn) {
  const { onError } = useContext(ErrorBoundaryContext);
  onError(error, errorInfoMock, urn);
}

describe("ErrorBoundaryProvider.web", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when SplunkRum is available", () => {
    it("should record error to new relic", () => {
      const errorSpy = window.SplunkRum.error;

      const errorInfoMock = {
        componentStack: "some component stack",
      };
      renderHook(() => useError(new Error("dummy error"), errorInfoMock, "urn:dummy"), {
        wrapper: ({ children }) => <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>,
      });

      expect(errorSpy).toHaveBeenCalledWith(new Error("dummy error"), {
        urn: "urn:dummy",
        componentStack: "some component stack",
      });
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when SplunkRum is not available", () => {
    it("should not throw", () => {
      Object.defineProperty(window, "SplunkRum", {
        value: undefined,
        writable: true,
      });

      const errorInfoMock = {
        componentStack: "some component stack",
      };
      const {
        result: { error },
      } = renderHook(() => useError(new Error("dummy error"), errorInfoMock, "urn:dummy"), {
        wrapper: ({ children }) => <ErrorBoundaryProvider>{children}</ErrorBoundaryProvider>,
      });

      expect(error).toBeUndefined();
    });
  });
});
