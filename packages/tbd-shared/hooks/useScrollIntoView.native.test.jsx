import { act, renderHook } from "@testing-library/react-native";
import { useScrollOffsetContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { ScrollIntoViewProvider, useScrollIntoView } from "./useScrollIntoView.native";

jest.mock("@ppb/the-wall-native", () => ({
  useDebounceCallback: jest.fn((cb) => cb),
}));

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  useScrollOffsetContext: jest.fn(() => 1000),
}));

function runUseScrollIntoView({ wrappingRef = { current: null }, scrollableAreaHeight = 0, ref = { current: null } }) {
  const wrapper = ({ children }) => (
    <ScrollIntoViewProvider wrappingRef={wrappingRef} scrollableAreaHeight={scrollableAreaHeight}>
      {children}
    </ScrollIntoViewProvider>
  );
  return renderHook(() => useScrollIntoView(ref), { wrapper });
}

describe("useScrollIntoView", () => {
  beforeEach(jest.clearAllMocks);
  describe("when there's no ref", () => {
    it("should not call scrollToOffset", () => {
      const scrollToOffset = jest.fn();
      const { result } = runUseScrollIntoView({
        wrappingRef: { current: { scrollToOffset } },
      });
      const useScroll = result.current;

      act(() => {
        useScroll({ nativeEvent: { layout: { height: 42 } }, persist: jest.fn() });
      });

      expect(scrollToOffset).not.toHaveBeenCalled();
    });
  });

  describe("when there's a ref", () => {
    it("should call measureLayout", () => {
      const measureLayout = jest.fn();
      const getNativeScrollRef = jest.fn().mockReturnValue(1337);
      const containerHeight = 200;
      const { result } = runUseScrollIntoView({
        wrappingRef: { current: { getNativeScrollRef } },
        ref: { current: { measureLayout } },
      });
      const useScroll = result.current;

      act(() => {
        useScroll({ nativeEvent: { layout: { height: containerHeight } }, persist: jest.fn() });
      });

      expect(measureLayout).toHaveBeenCalledWith(1337, expect.any(Function), expect.any(Function));
      expect(measureLayout).toHaveBeenCalledTimes(1);
    });

    describe("and element is fully visible on viewport", () => {
      it("should not call scrollToOffset", () => {
        const scrollToOffset = jest.fn();
        const measureLayout = jest.fn();
        const getNativeScrollRef = jest.fn().mockReturnValue(1337);
        const scrollableAreaHeight = 600;
        const containerHeight = 300;
        const containerAncestorPositionY = 50;

        useScrollOffsetContext.mockReturnValue(710);

        const { result } = runUseScrollIntoView({
          wrappingRef: { current: { scrollToOffset, getNativeScrollRef } },
          ref: { current: { measureLayout } },
          scrollableAreaHeight,
        });
        const useScroll = result.current;

        act(() => {
          useScroll({ nativeEvent: { layout: { y: containerAncestorPositionY } }, persist: jest.fn() });
        });

        const measureLayoutCallback = measureLayout.mock.calls[0][1];
        measureLayoutCallback(null, 1000, null, containerHeight);

        expect(scrollToOffset).not.toHaveBeenCalled();
      });
    });

    describe("and element is not fully visible on viewport", () => {
      it("should call scrollToOffset", () => {
        const scrollToOffset = jest.fn();
        const measureLayout = jest.fn();
        const getNativeScrollRef = jest.fn().mockReturnValue(1337);
        const scrollableAreaHeight = 600;
        const containerHeight = 300;
        const containerAncestorPositionY = 50;

        useScrollOffsetContext.mockReturnValue(690);

        const { result } = runUseScrollIntoView({
          wrappingRef: { current: { scrollToOffset, getNativeScrollRef } },
          ref: { current: { measureLayout } },
          scrollableAreaHeight,
        });
        const useScroll = result.current;

        act(() => {
          useScroll({ nativeEvent: { layout: { y: containerAncestorPositionY } }, persist: jest.fn() });
        });

        const measureLayoutCallback = measureLayout.mock.calls[0][1];
        measureLayoutCallback(null, 1000, null, containerHeight);

        expect(scrollToOffset).toHaveBeenCalledWith({ offset: 700, animated: false });
        expect(scrollToOffset).toHaveBeenCalledTimes(1);
      });
    });
  });
});
