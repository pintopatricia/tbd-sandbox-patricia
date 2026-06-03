import { getBetslipStep } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipStep: jest.fn().mockReturnValue("step"),
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: true })),
}));

describe("ObbBetslip mapToPropsFactory", () => {
  const DEFAULT_BETTING_STATE = {
    obbBetting: {
      legs: {},
    },
    sportsbookBetting: {
      legs: {},
    },
  };

  const DEFAULT_BETSLIP_STATE = {
    step: "PLACE_POTENTIAL",
  };

  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function getMockState({ betslipState = {}, bettingState = {} } = {}) {
      return {
        betslip: {
          ...DEFAULT_BETSLIP_STATE,
          ...betslipState,
        },
        betting: {
          ...DEFAULT_BETTING_STATE,
          ...bettingState,
        },
      };
    }

    function setup({ betslipState = {}, bettingState = {} } = {}) {
      const mockState = getMockState({ betslipState, bettingState });
      return makeMapStateToProps()(mockState);
    }
    describe("step", () => {
      it("should call getBetslipStep", () => {
        const state = { betslipState: { step: "someStep" } };
        const { step } = setup(state);

        expect(getBetslipStep).toHaveBeenCalledWith(getMockState(state));

        expect(step).toBe("step");
      });

      it("should call getBetslipStep and get step undefined", () => {
        getBetslipStep.mockReturnValueOnce(null);
        const setupResult = setup();

        expect(setupResult).toBe(false);
      });
    });
  });
});
