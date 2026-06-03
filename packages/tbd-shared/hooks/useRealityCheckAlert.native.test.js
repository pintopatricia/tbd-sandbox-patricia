import { renderHook } from "@testing-library/react-native";
import { DeviceEventEmitter } from "react-native";

import { EVENTS } from "@flutter-global/react-native-cet-framework";

import { dispatchRealityCheckAlert } from "../helpers/reality-check-alert";

import { useRealityCheckAlert } from "./useRealityCheckAlert.native";

jest.spyOn(DeviceEventEmitter, "addListener");

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  EVENTS: {
    ON_REALITY_CHECK: "ON_REALITY_CHECK",
  },
}));

jest.mock("../helpers/reality-check-alert", () => ({
  dispatchRealityCheckAlert: jest.fn(),
}));

describe("useRealityCheckAlert", () => {
  beforeEach(jest.clearAllMocks);

  describe("when reality check event is emitted", () => {
    describe("when event has totalMinutes", () => {
      it("should call dispatchRealityCheckAlert with the event totalMinutes", () => {
        renderHook(useRealityCheckAlert);

        DeviceEventEmitter.emit(EVENTS.ON_REALITY_CHECK, { totalMinutes: 60 });

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(60);
      });
    });

    describe("when event has only a number", () => {
      it("should call dispatchRealityCheckAlert with undefined", () => {
        renderHook(useRealityCheckAlert);

        DeviceEventEmitter.emit(EVENTS.ON_REALITY_CHECK, 60);

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(undefined);
      });
    });

    describe("when event is undefined", () => {
      it("should call dispatchRealityCheckAlert with undefined", () => {
        renderHook(useRealityCheckAlert);

        DeviceEventEmitter.emit(EVENTS.ON_REALITY_CHECK, undefined);

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(undefined);
      });
    });

    describe("when event totalMinutes is missing", () => {
      it("should call dispatchRealityCheckAlert with undefined", () => {
        renderHook(useRealityCheckAlert);

        DeviceEventEmitter.emit(EVENTS.ON_REALITY_CHECK, {});

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe("listener lifecycle", () => {
    it("should add listener on mount", () => {
      renderHook(useRealityCheckAlert);

      expect(DeviceEventEmitter.addListener).toHaveBeenCalledWith(EVENTS.ON_REALITY_CHECK, expect.any(Function));
      expect(DeviceEventEmitter.addListener).toHaveBeenCalledTimes(1);
    });

    it("should remove listener on unmount", () => {
      const removeMock = jest.fn();

      DeviceEventEmitter.addListener.mockReturnValue({
        remove: removeMock,
      });

      const { unmount } = renderHook(useRealityCheckAlert);

      expect(removeMock).not.toHaveBeenCalled();

      unmount();

      expect(removeMock).toHaveBeenCalledTimes(1);
    });
  });
});
