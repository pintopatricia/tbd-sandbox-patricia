import { fireEvent, renderHook, act } from "@testing-library/react";
import * as React from "react";

const useInfiniteScroll = require("./useInfiniteScroll.web").default;

function useInfiniteScrollHook(loadMoreCallback = () => {}, threshold = 250, executeOnLoad = false) {
  return renderHook(() => useInfiniteScroll(loadMoreCallback, threshold, executeOnLoad));
}

describe("useInfiniteScroll.web", () => {
  beforeEach(jest.clearAllMocks);
  it("should not call the callback", () => {
    const fakeCallback = jest.fn();
    useInfiniteScrollHook(fakeCallback);
    expect(fakeCallback).not.toHaveBeenCalled();
  });

  describe("when the bottom offset is less than the threshold defined", () => {
    it("should call the callback one time", () => {
      const fakeCallback = jest.fn();
      const { result } = useInfiniteScrollHook(fakeCallback);

      result.current.scrollViewRef.current = {
        clientHeight: 800,
        getBoundingClientRect: jest.fn(() => ({ bottom: 800 })),
      };

      // fire scroll event
      act(() => {
        fireEvent.scroll(window, { target: { scrollY: 0 } });
      });
      expect(fakeCallback).toHaveBeenCalledTimes(1);
    });

    describe("when onload flag is true", () => {
      it("should call the callback one time", () => {
        const fakeCallback = jest.fn();
        const { result } = useInfiniteScrollHook(fakeCallback, undefined, true);

        result.current.scrollViewRef.current = {
          clientHeight: 800,
          getBoundingClientRect: jest.fn(() => ({ bottom: 800 })),
        };

        act(() => {
          fireEvent.load(window);
        });

        expect(fakeCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe("but the list height is the same as before", () => {
      it("shouldn't call the callback", () => {
        const fakeCallback = jest.fn();
        const { result } = useInfiniteScrollHook(fakeCallback);

        result.current.scrollViewRef.current = {
          clientHeight: 800,
          getBoundingClientRect: jest.fn(() => ({ bottom: 800 })),
        };

        // fire scroll event
        act(() => {
          fireEvent.scroll(window, { target: { scrollY: 0 } });
        });

        fakeCallback.mockClear();

        // fire scroll event
        act(() => {
          fireEvent.scroll(window, { target: { scrollY: 0 } });
        });

        expect(fakeCallback).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the bottom offset is greater than the threshold defined", () => {
    const fakeCallback = jest.fn();
    const { result } = useInfiniteScrollHook(fakeCallback);
    const ref = result.current;
    ref.current = {
      clientHeight: 800,
      // window.innerHeight is 768, 1000 - 768 = 232, 232 > 150 (default threshold)
      getBoundingClientRect: jest.fn(() => ({
        bottom: 1000,
      })),
    };

    it("shouldn't call the callback", () => {
      // fire scroll event
      act(() => {
        fireEvent.scroll(window, { target: { scrollY: 0 } });
      });
      expect(fakeCallback).not.toHaveBeenCalled();
    });

    describe("when onload flag is true", () => {
      it("shouldn't call the callback", () => {
        useInfiniteScrollHook(fakeCallback, undefined, false);

        expect(fakeCallback).toHaveBeenCalledTimes(0);
      });
    });
  });
});
