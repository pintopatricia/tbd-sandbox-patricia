import { getBetslipStep } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipStep: jest.fn(() => null),
}));

const setupMapStateToProps = ({
  appState = {
    entities: {
      throttles: {},
    },
  },
} = {}) => makeMapStateToProps()(appState);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("step", () => {
    it("should return betslip current step", () => {
      getBetslipStep.mockReturnValue("EDIT_UNMATCHED");
      const { step } = setupMapStateToProps();

      expect(step).toBe("EDIT_UNMATCHED");
    });
  });
});
