import { renderHook, act } from "@testing-library/react-native";
import { DeviceEventEmitter } from "react-native";

import {
  useGenericViewScrollListener,
  SCROLL_UP_EVENT,
  SCROLL_DOWN_EVENT,
  DEBOUNCE_INTERVAL_MS,
  SCROLL_THRESHOLD,
} from "./generic-view-scroll-listener";

describe("useGenericViewScrollListener", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(DeviceEventEmitter, "emit");
    jest.spyOn(Date, "now").mockReturnValue(0);
    DeviceEventEmitter.removeAllListeners();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function setup() {
    return renderHook(() => useGenericViewScrollListener());
  }

  function createScrollEventMock(y) {
    return {
      nativeEvent: {
        contentOffset: { y },
      },
    };
  }

  describe("on initialization", () => {
    it("should return an onScroll callback", () => {
      const { result } = setup();

      expect(result.current.onScroll).toEqual(expect.any(Function));
    });

    it("should return a ref with initial value of 0", () => {
      const { result } = setup();

      expect(result.current.ref.current).toBe(0);
    });
  });

  describe("when scrolling down", () => {
    it("should emit SCROLL_DOWN_EVENT when scrolling down past threshold", () => {
      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      const { result } = setup();

      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD + 1));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(SCROLL_DOWN_EVENT);
    });

    it("should not emit SCROLL_DOWN_EVENT when scroll delta is below threshold", () => {
      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      const { result } = setup();

      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD - 1));
      });

      expect(DeviceEventEmitter.emit).not.toHaveBeenCalledWith(SCROLL_DOWN_EVENT);
    });

    it("should update ref with current scroll position", () => {
      const { result } = setup();

      act(() => {
        result.current.onScroll(createScrollEventMock(100));
      });

      expect(result.current.ref.current).toBe(100);
    });
  });

  describe("when scrolling up", () => {
    it("should emit SCROLL_UP_EVENT when scrolling up past threshold", () => {
      const { result } = setup();

      act(() => {
        result.current.onScroll(createScrollEventMock(100));
      });

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      act(() => {
        result.current.onScroll(createScrollEventMock(100 - SCROLL_THRESHOLD - 1));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(SCROLL_UP_EVENT);
    });

    it("should not emit SCROLL_UP_EVENT when scroll delta is below threshold", () => {
      const { result } = setup();

      act(() => {
        result.current.onScroll(createScrollEventMock(100));
      });

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      act(() => {
        result.current.onScroll(createScrollEventMock(100 - SCROLL_THRESHOLD + 1));
      });

      expect(DeviceEventEmitter.emit).not.toHaveBeenCalledWith(SCROLL_UP_EVENT);
    });
  });

  describe("debounce behavior", () => {
    it("should not emit events within debounce interval", () => {
      const { result } = setup();

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD + 1));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 100);
      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD * 3));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);
    });

    it("should emit events after debounce interval has passed", () => {
      const { result } = setup();

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1);
      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD + 1));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);

      Date.now.mockReturnValue(DEBOUNCE_INTERVAL_MS + 1 + DEBOUNCE_INTERVAL_MS + 1);
      act(() => {
        result.current.onScroll(createScrollEventMock(SCROLL_THRESHOLD * 3));
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(2);
    });
  });
});
