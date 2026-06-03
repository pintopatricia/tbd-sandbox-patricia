import { renderHook } from "@testing-library/react";
import { useDebounceCallback } from "./useDebounceCallback";

describe("useDebounceCallback", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe("when the callback is called consecutively before the delay", () => {
    it("should call only once", () => {
      const cb = jest.fn();
      const {
        result: { current: debouncedCb },
      } = renderHook(() => useDebounceCallback(cb, 50));

      debouncedCb(2, 3);
      jest.advanceTimersByTime(10);
      debouncedCb(4, 5);
      jest.advanceTimersByTime(40);
      debouncedCb(6, 7);
      jest.advanceTimersByTime(50);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith(6, 7);
    });
  });

  describe("when the callback is called consecutively after the delay", () => {
    it("should call all times", () => {
      const cb = jest.fn();
      const {
        result: { current: debouncedCb },
      } = renderHook(() => useDebounceCallback(cb, 50));

      debouncedCb(2, 3);
      jest.advanceTimersByTime(50);
      debouncedCb(4, 5);
      jest.advanceTimersByTime(50);

      expect(cb).toHaveBeenCalledTimes(2);
      expect(cb).toHaveBeenCalledWith(2, 3);
      expect(cb).toHaveBeenCalledWith(4, 5);
    });
  });
});
