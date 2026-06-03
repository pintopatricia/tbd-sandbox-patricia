import { useContext } from "react";
import { render } from "@testing-library/react-native";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";

import ConnectedSportsbookReceipt from "../SportsbookReceipt";
import { SportsbookReceipt } from "../SportsbookReceipt/SportsbookReceipt.native";
import ConnectedSportsbookPlace from "../SportsbookPlace";
import { SportsbookPlace } from "../SportsbookPlace/SportsbookPlace.native";
import ConnectedSportsbookConfirm from "../SportsbookConfirm";
import { SportsbookConfirm } from "../SportsbookConfirm/SportsbookConfirm.native";

import { SportsbookBetslip } from "./SportsbookBetslip.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ setIsBetConfirmationStep: jest.fn() })),
}));
jest.mock("../SportsbookReceipt", () => jest.fn(() => <connected-sportsbook-receipt-mock />));
jest.mock("../SportsbookReceipt/SportsbookReceipt.native", () => ({
  SportsbookReceipt: jest.fn(() => <sportsbook-receipt-mock />),
}));
jest.mock("../SportsbookPlace", () => jest.fn(() => <connected-sportsbook-place-mock />));

jest.mock("../SportsbookPlace/SportsbookPlace.native", () => ({
  SportsbookPlace: jest.fn(() => <sportsbook-place-mock />),
}));

jest.mock("../SportsbookConfirm", () => jest.fn(() => <connected-sportsbook-receipt-mock />));
jest.mock("../SportsbookConfirm/SportsbookConfirm.native", () => ({
  SportsbookReceipt: jest.fn(() => <sportsbook-receipt-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  OddsMovementDirection: {
    Up: "up",
    Down: "down",
  },
}));

jest.mock("@ppb/the-wall-native/hooks/useHaptics", () => ({
  useHaptics: jest.fn(() => ({
    trigger: jest.fn(),
  })),
}));

function renderSportsbookBetslip({ step, placeStatus = "NONE" }, { setIsBetConfirmationStep = jest.fn() } = {}) {
  useContext.mockReturnValue({ setIsBetConfirmationStep });
  return render(<SportsbookBetslip step={step} placeStatus={placeStatus} />);
}

describe("SportsbookBetslip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when in PLACE_POTENTIAL step", () => {
    it("should delegate to ConnectedSportsbookPlace", () => {
      renderSportsbookBetslip({
        step: "PLACE_POTENTIAL",
        hasSeveralLegs: true,
      });

      expect(ConnectedSportsbookPlace).toHaveBeenCalledWith(
        {
          component: SportsbookPlace,
        },
        undefined,
      );
    });

    it("should set the bet confirmation flag as false", () => {
      const setisBetConfirmationStepSpy = jest.fn();
      renderSportsbookBetslip({ step: "PLACE_POTENTIAL" }, { setIsBetConfirmationStep: setisBetConfirmationStepSpy });

      expect(setisBetConfirmationStepSpy).toHaveBeenCalledWith(false);
      expect(setisBetConfirmationStepSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when in REPORT step", () => {
    it("should delegate to ConnectedSportsbookReceipt", () => {
      renderSportsbookBetslip({ step: "REPORT" });

      expect(ConnectedSportsbookReceipt).toHaveBeenCalledWith({ component: SportsbookReceipt }, undefined);
    });
  });

  describe("when in CONFIRM_POTENTIAL step", () => {
    it("should delegate to ConnectedSportsbookConfirm", () => {
      renderSportsbookBetslip({ step: "CONFIRM_POTENTIAL" });

      expect(ConnectedSportsbookConfirm).toHaveBeenCalledWith({ component: SportsbookConfirm }, undefined);
    });

    it("should disable input fields", () => {
      const setisBetConfirmationStepSpy = jest.fn();
      renderSportsbookBetslip({ step: "CONFIRM_POTENTIAL" }, { setIsBetConfirmationStep: setisBetConfirmationStepSpy });

      expect(setisBetConfirmationStepSpy).toHaveBeenCalledWith(true);
      expect(setisBetConfirmationStepSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("haptic feedback", () => {
    it("should trigger success haptic when transitioning to REPORT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderSportsbookBetslip({ step: "PLACE_POTENTIAL" });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<SportsbookBetslip step="REPORT" />);
      expect(triggerMock).toHaveBeenCalledWith("success");
      expect(triggerMock).toHaveBeenCalledTimes(1);
    });

    it("should not trigger haptic on initial render with REPORT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      renderSportsbookBetslip({ step: "REPORT" });
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger haptic when transitioning between non-REPORT steps", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderSportsbookBetslip({ step: "PLACE_POTENTIAL" });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<SportsbookBetslip step="CONFIRM_POTENTIAL" />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger haptic when staying in REPORT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderSportsbookBetslip({ step: "REPORT" });
      triggerMock.mockClear();

      rerender(<SportsbookBetslip step="REPORT" placeStatus="NONE" />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should trigger error haptic when placeStatus transitions from INPROGRESS to FAILURE", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderSportsbookBetslip({ step: "PLACE_POTENTIAL", placeStatus: "INPROGRESS" });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<SportsbookBetslip step="PLACE_POTENTIAL" placeStatus="FAILURE" />);
      expect(triggerMock).toHaveBeenCalledWith("error");
      expect(triggerMock).toHaveBeenCalledTimes(1);
    });

    it("should not trigger error haptic when placeStatus transitions to FAILURE from non-INPROGRESS states", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderSportsbookBetslip({ step: "PLACE_POTENTIAL", placeStatus: "NONE" });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<SportsbookBetslip step="PLACE_POTENTIAL" placeStatus="FAILURE" />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger error haptic on initial render with FAILURE placeStatus", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      renderSportsbookBetslip({ step: "PLACE_POTENTIAL", placeStatus: "FAILURE" });
      expect(triggerMock).not.toHaveBeenCalled();
    });
  });
});
