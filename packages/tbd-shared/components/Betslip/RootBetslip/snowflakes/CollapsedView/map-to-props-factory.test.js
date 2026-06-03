import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BetslipType } from "@ppb/tbd-store/state/constants";

import { createMinimizedTitleSelector } from "../../vm-builder";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => false)),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("../../vm-builder", () => ({
  createMinimizedTitleSelector: jest.fn(() => jest.fn(() => null)),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  ...jest.requireActual("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors"),
  createSimpleSelectionsCounterSelector: jest.fn(() => jest.fn()),
  createGetGreatestOddCombinationSelector: jest.fn(() => jest.fn()),
  createHasMultiplesSelector: jest.fn(() => jest.fn()),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("makeMapStateToProps", () => {
  const DEFAULT_BETSLIP_STATE = {
    exchangeContext: undefined,
    sportsbookReport: undefined,
    step: "PLACE_POTENTIAL",
    isCollapsed: false,
  };

  const DEFAULT_BETTING_STATE = {
    obbBetting: {
      legs: {},
    },
    sportsbookBetting: {
      legs: {},
      failures: {
        legs: {},
        potentialBets: {},
      },
    },
  };
  const DEFAULT_ENTITIES_STATE = {
    throttles: {
      a: false,
      b: true,
    },
  };

  function setup({
    betslipState = {},
    exchangeContext,
    totalSelections = 0,
    confirmationState = {},
    bettingState = {},
  } = {}) {
    const newState = {
      confirmation: confirmationState,
      betslip: {
        ...DEFAULT_BETSLIP_STATE,
        ...betslipState,
      },
      betting: {
        ...DEFAULT_BETTING_STATE,
        ...bettingState,
      },
      entities: DEFAULT_ENTITIES_STATE,
    };

    createSimpleSelectionsCounterSelector.mockReturnValue(() => totalSelections);
    getBetslipExchangeContext.mockReturnValue(exchangeContext);
    getSportsbookPlacedCombinations.mockReturnValue(betslipState.sportsbookReport);

    return makeMapStateToProps()(newState, { experimentVariant: "experiment-variant-mock" });
  }

  beforeEach(jest.clearAllMocks);

  describe("when betslip not exist on state", () => {
    it("should return empty object", () => {
      expect(makeMapStateToProps()({}, {})).toEqual({});
    });
  });

  describe("when there is an minimized title", () => {
    it("should return minimizedTitle", () => {
      const buildMinimizedTitleSpy = jest.fn(() => "TITLE MOCK");
      createMinimizedTitleSelector.mockReturnValue(buildMinimizedTitleSpy);
      const props = setup({});

      expect(buildMinimizedTitleSpy).toHaveBeenCalled();
      expect(props.title).toEqual("TITLE MOCK");
    });
  });

  it("should return total of selections", () => {
    const { totalSelections } = setup({ totalSelections: 1337 });

    expect(totalSelections).toEqual(1337);
  });

  describe("isConfirm", () => {
    describe("when step is CONFIRM_POTENTIAL", () => {
      it("should return true", () => {
        const { isConfirm } = setup({ betslipState: { step: "CONFIRM_POTENTIAL" } });

        expect(isConfirm).toEqual(true);
      });
    });
    describe("when step is not CONFIRM_POTENTIAL", () => {
      it("should return false", () => {
        const { isConfirm } = setup({ betslipState: { step: "PLACE_POTENTIAL" } });

        expect(isConfirm).toEqual(false);
      });
    });
  });

  describe("obb betslip", () => {
    describe("when `sportsbookBetting` contains legs", () => {
      it("should set `activeBetslipType` to `SPORTSBOOK`", () => {
        const { activeBetslipType } = setup({
          bettingState: {
            sportsbookBetting: {
              legs: { leg_0: {} },
            },
          },
        });

        expect(activeBetslipType).toBe(BetslipType.SPORTSBOOK);
      });
    });

    describe("when `obbBetting` contains legs and `sportsbookBetting` does not", () => {
      it("should set `activeBetslipType` to `OBB`", () => {
        const { activeBetslipType } = setup({
          bettingState: { obbBetting: { legs: { leg_0: {} }, failures: { legs: {}, potentialBets: {} } } },
        });

        expect(activeBetslipType).toBe(BetslipType.OBB);
      });
    });

    describe("when `activeBetslipType` is set to `OBB`", () => {
      it("should return the correct totalSelections value", () => {
        const { totalSelections } = setup({
          bettingState: {
            obbBetting: {
              legs: {
                legId1: { templateId: "xOfN" },
                legId2: { templateId: "playerVsPlayer" },
                legId3: { templateId: "playerVsPlayer" },
              },
              failures: { legs: {}, potentialBets: {} },
            },
          },
        });
        expect(totalSelections).toBe(2);
      });

      describe("and there are no combined failures in `obbBetting`", () => {
        it("should return the hasFailures as false", () => {
          const { hasFailures } = setup({
            bettingState: { obbBetting: { legs: { legId1: {} }, failures: { legs: {}, potentialBets: {} } } },
          });

          expect(hasFailures).toBe(false);
        });
      });

      describe("and there are combined failures in `obbBetting`", () => {
        it("should return the hasFailures as true", () => {
          const { hasFailures } = setup({
            bettingState: {
              obbBetting: {
                legs: { legId1: { params: { baseBets: [{}] } }, legId2: {} },
                failures: { legs: { legId1: "IMPOSSIBLE_OBB_CHOICE" }, potentialBets: {} },
              },
            },
          });

          expect(hasFailures).toBe(true);
        });
      });
    });
  });
});
