import { getBetslipStep, getBetslipPlaceStatus } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

const hasMultiplesSelector = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: true })),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createHasMultiplesSelector: jest.fn(() => hasMultiplesSelector),
  getSportsbookBettingLegs: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipStep: jest.fn(() => "step"),
  getBetslipPlaceStatus: jest.fn(() => "NONE"),
}));
jest.mock("@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types", () => ({
  OddsDisplayPreference: { Decimal: "DECIMAL" },
}));
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn((odds) => odds),
}));
jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStepActive: jest.fn(() => () => false),
}));

const APP_STATE = {
  entities: { sportsbookBetting: { combinations: {} } },
  betslip: {},
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("step", () => {
    function setup({ step, placeStatus, appState } = {}) {
      getBetslipStep.mockReturnValue(step);
      getBetslipPlaceStatus.mockReturnValue(placeStatus);
      return makeMapStateToProps()(appState);
    }

    it("should call getBetslipStep", () => {
      const { step } = setup({ step: "someStep", appState: APP_STATE });

      expect(getBetslipStep).toHaveBeenCalledWith(APP_STATE);
      expect(getBetslipStep).toHaveBeenCalledTimes(1);

      expect(step).toBe("someStep");
    });

    it("should call getBetslipPlaceStatus and return placeStatus", () => {
      const result = setup({ step: "someStep", placeStatus: "PENDING", appState: APP_STATE });

      expect(getBetslipPlaceStatus).toHaveBeenCalledWith(APP_STATE);
      expect(getBetslipPlaceStatus).toHaveBeenCalledTimes(1);

      expect(result.placeStatus).toBe("PENDING");
    });

    it("should default placeStatus to NONE when getBetslipPlaceStatus returns null", () => {
      const result = setup({ step: "someStep", placeStatus: null, appState: APP_STATE });

      expect(result.placeStatus).toBe("NONE");
    });

    it("should default placeStatus to NONE when getBetslipPlaceStatus returns undefined", () => {
      const result = setup({ step: "someStep", placeStatus: undefined, appState: APP_STATE });

      expect(result.placeStatus).toBe("NONE");
    });
  });
});
