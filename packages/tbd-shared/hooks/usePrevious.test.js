import { renderHook } from "@testing-library/react";
import usePrevious from "./usePrevious";

describe("usePrevious", () => {
  it("should be defined", () => {
    expect(usePrevious).toBeDefined();
  });

  it("should return the initial value on first render", () => {
    const { result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: {
        value: "initial value",
      },
    });

    expect(result.current).toBe("initial value");
  });

  it("should return the previous value after the input changes", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: {
        value: "initial value",
      },
    });

    rerender({ value: "updated value" });

    expect(result.current).toBe("initial value");
  });

  it("should keep tracking the last rendered value across multiple updates", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: {
        value: 1,
      },
    });

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);

    rerender({ value: 3 });
    expect(result.current).toBe(3);
  });
});
