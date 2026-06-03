import { renderHook, act } from "@testing-library/react";
import { useScrollForSearchBar } from "./useScrollForSearchBar.web";

jest.useFakeTimers();

describe("useScrollForSearchBar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 0 });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should start visible by default", () => {
    const { result } = renderHook(() => useScrollForSearchBar(true));
    expect(result.current).toBe(true);
  });

  it("should hide on scroll down", () => {
    const { result } = renderHook(() => useScrollForSearchBar(true));

    // simulate scrolling down
    act(() => {
      Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 100 });
      window.dispatchEvent(new Event("scroll"));

      // Fast-forward throttle timeout
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(false);
  });

  it("should show on scroll up", () => {
    Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 100 });

    const { result } = renderHook(() => useScrollForSearchBar(true));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      jest.advanceTimersByTime(100);
    });

    act(() => {
      Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 50 });
      window.dispatchEvent(new Event("scroll"));
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(true);
  });

  it("should throttle scroll events", () => {
    const { result } = renderHook(() => useScrollForSearchBar(true));

    act(() => {
      // First scroll event
      Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 50 });
      window.dispatchEvent(new Event("scroll"));

      // Dispatch another scroll event immediately (should be ignored due to throttle)
      Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 150 });
      window.dispatchEvent(new Event("scroll"));

      jest.advanceTimersByTime(50);
    });

    // Still visible, because second event ignored (throttled)
    expect(result.current).toBe(true);

    // After throttle timeout completes, next event processed
    act(() => {
      jest.advanceTimersByTime(50); // finish throttle delay
    });

    expect(result.current).toBe(false);
  });

  it("should reset visibility and cleanup when inactive", () => {
    const { result, rerender, unmount } = renderHook(({ active }) => useScrollForSearchBar(active), {
      initialProps: { active: true },
    });

    act(() => {
      Object.defineProperty(window, "pageYOffset", { writable: true, configurable: true, value: 100 });
      window.dispatchEvent(new Event("scroll"));
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);

    rerender({ active: false });

    expect(result.current).toBe(true);

    unmount();
  });
});
