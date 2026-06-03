import { renderHook } from "@testing-library/react";

import { dispatchRealityCheckAlert } from "../helpers/reality-check-alert";

import { useRealityCheckAlert } from "./useRealityCheckAlert.web";

jest.spyOn(window, "addEventListener");
jest.spyOn(window, "removeEventListener");

jest.mock("../helpers/reality-check-alert", () => ({
  dispatchRealityCheckAlert: jest.fn(),
}));

const SG_TIME_ALERT_EVENT = "sgTimeAlert";

describe("useRealityCheckAlert", () => {
  beforeEach(jest.clearAllMocks);

  describe("when reality check alert event is emitted", () => {
    describe("when detail has the time spent", () => {
      it("should call dispatchRealityCheckAlert with the event params", () => {
        renderHook(useRealityCheckAlert);

        window.dispatchEvent(new CustomEvent(SG_TIME_ALERT_EVENT, { detail: { timeSpent: 60 } }));

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(60);
      });
    });

    describe("when event detail is undefined", () => {
      it("should call dispatchRealityCheckAlert with undefined", () => {
        renderHook(useRealityCheckAlert);

        window.dispatchEvent(new CustomEvent(SG_TIME_ALERT_EVENT, { detail: undefined }));

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(undefined);
      });
    });

    describe("when event detail timeSpent is missing", () => {
      it("should call dispatchRealityCheckAlert with undefined", () => {
        renderHook(useRealityCheckAlert);

        window.dispatchEvent(new CustomEvent(SG_TIME_ALERT_EVENT, { detail: {} }));

        expect(dispatchRealityCheckAlert).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe("listener lifecycle", () => {
    it("should add listener on mount", () => {
      renderHook(useRealityCheckAlert);

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.addEventListener).toHaveBeenCalledWith(SG_TIME_ALERT_EVENT, expect.any(Function));
    });

    it("should remove listener on unmount", () => {
      const { unmount } = renderHook(useRealityCheckAlert);

      expect(window.removeEventListener).not.toHaveBeenCalled();

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledWith(SG_TIME_ALERT_EVENT, expect.any(Function));
    });
  });
});
