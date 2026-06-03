import { UI__BETSLIP_HEADER_CLICK, UI__BETSLIP_SET_COLLAPSE_ACTION } from "@ppb/tbd-store/actions/betslip";
import { BETTING__OBB_UPDATE_QUOTES } from "@ppb/tbd-store/actions/betting";
import { getSportsbookPlacedCombinations } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import {
  createHasMultiplesSelector,
  createQuickBetslipBetPickerSelector,
  createSimpleSelectionsCounterSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BetslipType } from "@ppb/tbd-store/state/constants";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("./vm-builder", () => ({
  createMinimizedTitleSelector: jest.fn(() => jest.fn(() => null)),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  ...jest.requireActual("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors"),
  createSimpleSelectionsCounterSelector: jest.fn(() => jest.fn()),
  createHasMultiplesSelector: jest.fn(() => jest.fn()),
  createQuickBetslipBetPickerSelector: jest.fn(() => jest.fn()),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
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
    };

    createSimpleSelectionsCounterSelector.mockReturnValue(() => totalSelections);
    getSportsbookPlacedCombinations.mockReturnValue(betslipState.sportsbookReport);

    return makeMapStateToProps()(newState);
  }

  beforeEach(jest.clearAllMocks);

  describe("when betslip not exist on state", () => {
    it("should return empty object", () => {
      expect(makeMapStateToProps()({})).toEqual({});
    });
  });

  describe("when there are one or more selections", () => {
    it("should return isClosed as false", () => {
      const { isClosed } = setup({ totalSelections: 1337 });

      expect(isClosed).toEqual(false);
    });
  });

  describe("when there are placed combinations", () => {
    it("should return isClosed as false", () => {
      const { isClosed } = setup({ betslipState: { sportsbookReport: "Report with combinations" } });

      expect(getSportsbookPlacedCombinations).toHaveBeenCalledWith({
        betslip: expect.objectContaining({ sportsbookReport: "Report with combinations" }),
        betting: DEFAULT_BETTING_STATE,
        confirmation: {},
      });
      expect(isClosed).toEqual(false);
    });
  });

  describe("when there are no selections", () => {
    it("should return isClosed as true", () => {
      const { isClosed } = setup({ totalSelections: 0 });

      expect(isClosed).toEqual(true);
    });
  });

  describe("betslip step", () => {
    it("should return betslip step value", () => {
      const { step } = setup({ betslipState: { step: "REPORT" } });

      expect(step).toEqual("REPORT");
    });
  });

  describe("isCollapsed", () => {
    it("should return isCollapsed value", () => {
      const { isCollapsed } = setup({ betslipState: { isCollapsed: true } });

      expect(isCollapsed).toEqual(true);
    });
  });

  describe("hasMultiples", () => {
    describe("when there are multiples", () => {
      it("should return true", () => {
        createHasMultiplesSelector.mockReturnValue(() => true);

        const { hasMultiples } = setup();

        expect(hasMultiples).toBe(true);
      });
    });

    describe("when there are no multiples", () => {
      it("should return false", () => {
        createHasMultiplesSelector.mockReturnValue(() => false);

        const { hasMultiples } = setup();

        expect(hasMultiples).toBe(false);
      });
    });
  });

  describe("hasConfirmation", () => {
    describe("when there is a confirmation pending", () => {
      it("should return true", () => {
        const { hasConfirmation } = setup({ confirmationState: { id: "x" } });

        expect(hasConfirmation).toBe(true);
      });
    });

    describe("when there is no confirmation pending", () => {
      it("should return false", () => {
        const { hasConfirmation } = setup({ confirmationState: null });

        expect(hasConfirmation).toBe(false);
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
  });

  describe("quickBetslipBet", () => {
    describe("when there is a quick bet", () => {
      it("should return the quickBetslipBet object with combinationId", () => {
        createQuickBetslipBetPickerSelector.mockReturnValue(() => ({ combinationId: "COMB:1" }));

        const { quickBetslipBet } = setup();

        expect(quickBetslipBet).toEqual({ combinationId: "COMB:1" });
      });
    });

    describe("when there is no quick bet", () => {
      it("should return null", () => {
        createQuickBetslipBetPickerSelector.mockReturnValue(() => null);

        const { quickBetslipBet } = setup();

        expect(quickBetslipBet).toBeNull();
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchHeaderToggle", () => {
    describe("when the betslip is collapsed", () => {
      it("should return header click action", () => {
        const dispatchSpy = jest.fn();
        const { dispatchHeaderToggle } = mapDispatchToProps(dispatchSpy);

        dispatchHeaderToggle(true, "betslipSubType");

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: UI__BETSLIP_HEADER_CLICK,
          payload: {
            isCollapsed: false,
            betslipSubType: "betslipSubType",
          },
        });
        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: false,
          },
        });
        expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
          type: BETTING__OBB_UPDATE_QUOTES,
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(3);
      });
    });

    describe("when the betslip is expanded", () => {
      it("should return header click action", () => {
        const dispatchSpy = jest.fn();
        const { dispatchHeaderToggle } = mapDispatchToProps(dispatchSpy);

        dispatchHeaderToggle(false, "betslipSubType");

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: UI__BETSLIP_HEADER_CLICK,
          payload: {
            isCollapsed: true,
            betslipSubType: "betslipSubType",
          },
        });
        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: UI__BETSLIP_SET_COLLAPSE_ACTION,
          payload: {
            collapse: true,
          },
        });

        expect(dispatchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("dispatchHeaderCollapse", () => {
    it("should dispatch header collapse action", () => {
      const dispatchSpy = jest.fn();
      const { dispatchHeaderCollapse } = mapDispatchToProps(dispatchSpy);

      dispatchHeaderCollapse();

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: {
          collapse: true,
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
