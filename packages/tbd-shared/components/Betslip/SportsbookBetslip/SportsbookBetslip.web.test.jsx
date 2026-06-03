import { useContext } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import ConnectedSportsbookPlace from "../SportsbookPlace";
import { SportsbookPlace } from "../SportsbookPlace/SportsbookPlace.web";
import ConnectedSportsbookReceipt from "../SportsbookReceipt";
import { SportsbookReceipt } from "../SportsbookReceipt/SportsbookReceipt.web";
import ConnectedSportsbookConfirm from "../SportsbookConfirm";
import { SportsbookConfirm } from "../SportsbookConfirm/SportsbookConfirm.web";
import { RefProvider } from "../../RefContext";

import { SportsbookBetslip } from "./SportsbookBetslip.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ setIsBetConfirmationStep: jest.fn() })),
}));

jest.mock("../SportsbookReceipt", () => jest.fn(() => <connected-sportsbook-receipt-mock />));
jest.mock("../SportsbookReceipt/SportsbookReceipt.web", () => ({
  SportsbookReceipt: jest.fn(() => <sportsbook-receipt-mock />),
}));

jest.mock("../SportsbookConfirm", () => jest.fn(() => <connected-sportsbook-place-mock />));
jest.mock("../SportsbookConfirm/SportsbookConfirm.web", () => ({
  SportsbookConfirm: jest.fn(() => <sportsbook-place-mock />),
}));

jest.mock("../SportsbookPlace", () => jest.fn(() => <connected-sportsbook-place-mock />));
jest.mock("../SportsbookPlace/SportsbookPlace.web", () => ({
  SportsbookPlace: jest.fn(() => <sportsbook-place-mock />),
}));

jest.mock("../../RefContext", () => ({
  RefProvider: jest.fn(({ children }) => <ref-provider>{children}</ref-provider>),
}));

function renderSportsbookBetslip({ step }, { setIsBetConfirmationStep = jest.fn() } = {}) {
  useContext.mockReturnValue({ setIsBetConfirmationStep });
  return render(<SportsbookBetslip step={step} />);
}

describe("SportsbookBetslip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when in PLACE_POTENTIAL step", () => {
    it("should call RefProvider", () => {
      renderSportsbookBetslip({
        step: "PLACE_POTENTIAL",
      });

      expect(RefProvider).toHaveBeenCalledWith({ children: expect.any(Object) }, undefined);
      expect(RefProvider).toHaveBeenCalledTimes(1);
    });

    it("should delegate to ConnectedSportsbookPlace", () => {
      renderSportsbookBetslip({
        step: "PLACE_POTENTIAL",
      });

      expect(ConnectedSportsbookPlace).toHaveBeenCalledWith(
        {
          component: SportsbookPlace,
        },
        undefined,
      );
    });

    it("should set the bet confirmation flag as false", () => {
      const setIsBetConfirmationStepSpy = jest.fn();
      renderSportsbookBetslip({ step: "PLACE_POTENTIAL" }, { setIsBetConfirmationStep: setIsBetConfirmationStepSpy });

      expect(setIsBetConfirmationStepSpy).toHaveBeenCalledWith(false);
      expect(setIsBetConfirmationStepSpy).toHaveBeenCalledTimes(1);
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
      const setIsBetConfirmationStepSpy = jest.fn();
      renderSportsbookBetslip({ step: "CONFIRM_POTENTIAL" }, { setIsBetConfirmationStep: setIsBetConfirmationStepSpy });

      expect(setIsBetConfirmationStepSpy).toHaveBeenCalledWith(true);
      expect(setIsBetConfirmationStepSpy).toHaveBeenCalledTimes(1);
    });
  });
});
