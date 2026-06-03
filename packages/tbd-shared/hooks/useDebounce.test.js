import { renderHook, act } from "@testing-library/react";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(useDebounce).toBeDefined();
  });

  describe("when called with value and delay (3000ms) props", () => {
    let value = "initial value";
    let result;
    let rerender;

    beforeAll(() => {
      ({ result, rerender } = renderHook(() => useDebounce(value, 3000)));
    });

    it("should return the initial value immediately, and the updated value after 3000ms", () => {
      expect(result.current).toBe("initial value");

      value = "updated value";
      rerender();

      expect(result.current).toBe("initial value");

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current).toBe("initial value");

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current).toBe("updated value");
    });
  });

  describe("when called with value prop only", () => {
    let value = "initial value";
    let result;
    let rerender;

    beforeAll(() => {
      ({ result, rerender } = renderHook(() => useDebounce(value)));
    });

    it("should return the initial value immediately, and the updated value after 500ms (default value)", () => {
      expect(result.current).toBe("initial value");

      value = "updated value";
      rerender();

      expect(result.current).toBe("initial value");

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe("updated value");
    });
  });
});
