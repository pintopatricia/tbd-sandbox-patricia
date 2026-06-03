import { DeviceEventEmitter } from "react-native";
import { act, renderHook } from "@testing-library/react-native";

import { useEmitOnce } from "./useEmitOnce.native";

jest.mock("react-native", () => ({
  DeviceEventEmitter: {
    emit: jest.fn(),
  },
}));

function setup({ eventName = "some-event-name" }) {
  return renderHook(() => useEmitOnce(eventName));
}

describe("useEmitOnce", () => {
  beforeEach(jest.clearAllMocks);

  describe("initial state", () => {
    it("expose hasEmitted as false", () => {
      const {
        result: { current },
      } = setup({});

      expect(current.hasEmmitted).toBe(false);
    });

    it("expose emit method", () => {
      const {
        result: { current },
      } = setup({});

      expect(current.emit).toEqual(expect.any(Function));
    });
  });

  describe("whem emit is called once", () => {
    it("should emit event once with given args", () => {
      const {
        result: {
          current: { emit },
        },
      } = setup({ eventName: "boom-shakalaka" });

      act(() => emit(1, 2, 3));

      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith("boom-shakalaka", 1, 2, 3);
      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);
    });

    it("should return hasEmitted as true", async () => {
      const { result } = setup({});

      act(() => result.current.emit(1, 2, 3));

      expect(result.current.hasEmmitted).toBe(true);
    });
  });

  describe("whem emit is called several times", () => {
    it("should emit event once with given args", () => {
      const { result } = setup({ eventName: "boom-shakalaka" });

      act(() => result.current.emit(1));
      act(() => result.current.emit(2));
      act(() => result.current.emit(3));
      act(() => result.current.emit(4));

      expect(DeviceEventEmitter.emit).toHaveBeenCalledWith("boom-shakalaka", 1);
      expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(1);
    });

    it("should return hasEmitted as true", async () => {
      const { result } = setup({});

      act(() => result.current.emit(1, 2, 3));

      expect(result.current.hasEmmitted).toBe(true);
    });
  });
});
