import { renderHook, waitFor } from "@testing-library/react";
import useTicker from "./useTicker";

describe("useTicker", () => {
  it("should load with initial state of label value", () => {
    const { result } = renderHook(() => useTicker(100066.92));
    expect(result.current.ticker).toBe(100066.92);
  });

  it("should return 0 if initial value is zero", () => {
    const { result } = renderHook(() => useTicker(0));
    expect(result.current.ticker).toBe(0);
  });

  it("should increment label value", async () => {
    const { result } = renderHook(() => useTicker(100066.92));
    expect(result.current.ticker).toBe(100066.92);

    await waitFor(() => {
      expect(result.current.ticker).not.toBe(100066.92);
    });
  });
});
