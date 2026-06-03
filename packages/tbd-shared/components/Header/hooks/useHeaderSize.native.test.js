import { renderHook, act } from "@testing-library/react-native";
import { DeviceEventEmitter } from "react-native";
import {
  useHeaderSize,
  HEADER__SIZE_CHANGED,
  HEADER__SIZE_REQUESTED,
  useHeaderSizeEmitter,
} from "./useHeaderSize.native";

describe("useHeaderSize", () => {
  beforeEach(() => {
    jest.spyOn(DeviceEventEmitter, "emit");
    jest.clearAllMocks();
    DeviceEventEmitter.removeAllListeners();
  });

  describe("on initialization", () => {
    describe("initial size", () => {
      it("should be null", () => {
        const { result } = renderHook(() => useHeaderSize());

        expect(result.current).toBeNull();
      });

      it("should request size", () => {
        renderHook(() => useHeaderSize());

        expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(HEADER__SIZE_REQUESTED);
      });
    });
  });

  describe("when size changes", () => {
    it("should return new size", () => {
      const { result } = renderHook(() => useHeaderSize());

      expect(result.current).toBeNull();

      act(() => {
        DeviceEventEmitter.emit(HEADER__SIZE_CHANGED, { width: 101, height: 202 });
      });

      expect(result.current).toEqual({ width: 101, height: 202 });

      act(() => {
        DeviceEventEmitter.emit(HEADER__SIZE_CHANGED, { width: 1001, height: 2002 });
      });

      expect(result.current).toEqual({ width: 1001, height: 2002 });
    });
  });
});

describe("useHeaderSizeEmitter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DeviceEventEmitter.removeAllListeners();
  });

  describe("on initialization", () => {
    it("should emit size as null", () => {
      renderHook(() => useHeaderSizeEmitter());

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(HEADER__SIZE_CHANGED, null);
    });
  });

  describe("when size changes", () => {
    it("should emit new size", () => {
      const eventMock = { nativeEvent: { layout: { width: 1, height: 2 } } };
      const { result } = renderHook(() => useHeaderSizeEmitter());

      act(() => {
        result.current(eventMock);
      });

      expect(DeviceEventEmitter.emit).toHaveBeenNthCalledWith(2, HEADER__SIZE_CHANGED, eventMock.nativeEvent.layout);
    });
  });

  describe("when size is requested", () => {
    it("should emit current size", () => {
      const eventMock = { nativeEvent: { layout: { width: 2, height: 3 } } };
      const { result } = renderHook(() => useHeaderSizeEmitter());

      act(() => {
        result.current(eventMock);
      });

      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(2);

      act(() => {
        DeviceEventEmitter.emit(HEADER__SIZE_REQUESTED);
      });

      expect(DeviceEventEmitter.emit).toHaveBeenNthCalledWith(4, HEADER__SIZE_CHANGED, eventMock.nativeEvent.layout);
    });
  });
});
