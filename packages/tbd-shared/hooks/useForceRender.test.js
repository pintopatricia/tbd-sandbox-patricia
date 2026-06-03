import { renderHook, act } from "@testing-library/react";
import { useForceRender } from "./useForceRender";

describe("useForceUpdate", () => {
  it("should be defined", () => {
    expect(useForceRender).toBeDefined();
  });

  describe("when called", () => {
    let result;

    beforeEach(() => {
      ({ result } = renderHook(() => useForceRender()));
    });

    it("should return a function", () => {
      expect(typeof result.current).toBe("function");
    });

    it("should force a re-render when called", () => {
      const { result: rerenderResult, rerender } = renderHook(() => {
        const forceUpdate = useForceRender();
        return forceUpdate;
      });

      expect(typeof rerenderResult.current).toBe("function");

      act(() => {
        rerenderResult.current();
      });

      expect(rerender).toBeDefined();
    });
  });
});
