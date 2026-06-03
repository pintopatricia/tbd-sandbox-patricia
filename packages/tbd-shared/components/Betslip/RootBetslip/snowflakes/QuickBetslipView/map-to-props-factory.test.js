import {
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
} from "@ppb/tbd-store/actions/betting";
import {
  UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import {
  getBettingResolvers,
  getAllUniqueRunnersFailures,
  getSportsbookBettingCombinations,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
  getSportsbookBettingState,
  getSportsbookBettingValidations,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { isStakeValid } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { PUSH } from "@ppb/tbd-store";
import { getLastSuccessfulStake } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";

import { hasSGMFailures, buildSportsbookTransactionalError } from "../../../connected-sportsbook-betslip-mapper";
import { buildSbkBalanceAfterBetLabel } from "../../../../../helpers/betslip-balance-helper";
import {
  buildQuickStakesSelector,
  createGetSbkIsDepositRequiredSelector,
  createGetSbkRequiredDepositValueSelector,
} from "../../../betslip-mapper";
import { buildSbkPlaceBetButtonLabels } from "../../../../../helpers/betslip-place-button-helper";
import { getEndpoint } from "../../../../../config/endpoints";
import { getCurrencySymbol } from "@ppb/formatters";
import { RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { createGetBetslipHeaderViewModel } from "./vm-builder";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { buildPotentialReturns } from "../../../betslip-formatters";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipGroup: jest.fn().mockReturnValue("sportsbook"),
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookBettingValidations: jest.fn().mockReturnValue({}),
  getLastSuccessfulStake: jest.fn().mockReturnValue(undefined),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getBettingResolvers: jest.fn(() => ({
    getMetadata: jest.fn(() => ({})),
  })),
  getAllUniqueRunnersFailures: jest.fn(() => []),
  getSportsbookBettingCombinations: jest.fn(() => ({})),
  getSportsbookBettingImplyRunnerFailures: jest.fn(() => ({})),
  getSportsbookBettingLegs: jest.fn(() => ({})),
  getSportsbookBettingState: jest.fn(() => ({
    totalStake: 0,
    isBonusSelected: false,
    totalPotentialReturns: null,
  })),
  getSportsbookBettingValidations: jest.fn(() => ({ combinations: {} })),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  isStakeValid: jest.fn(() => true),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ currencySymbol: "£", accountBalance: 1000 })),
}));

jest.mock("./vm-builder", () => ({
  createGetBetslipHeaderViewModel: jest.fn(() =>
    jest.fn(() => ({
      counter: 1,
      title: "Some title",
      subtitle: "Some subtitle",
      moreLabel: null,
      isPriceBoostMultiple: false,
    })),
  ),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => jest.fn(() => ({ oddsMovement: false }))),
}));

jest.mock("../../vm-builder", () => ({
  createQuickBetslipTitleSelector: jest.fn(() => jest.fn(() => null)),
}));

jest.mock("../../../connected-sportsbook-betslip-mapper", () => {
  const getAreAllCombinationsClosedOrSuspended = jest.fn().mockReturnValue(false);

  return {
    buildSportsbookTransactionalError: jest.fn(),
    hasSGMFailures: jest.fn(() => false),

    createAreAllCombinationsClosedOrSuspendedSelector: () => getAreAllCombinationsClosedOrSuspended,
  };
});

jest.mock("../../../../../helpers/betslip-balance-helper", () => ({
  buildSbkBalanceAfterBetLabel: jest.fn(() => "100 €"),
}));

jest.mock("../../../betslip-mapper", () => ({
  createGetSbkIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
  createGetSbkRequiredDepositValueSelector: jest.fn(() => jest.fn(0)),
  buildQuickStakesSelector: jest.fn(() => jest.fn(() => [{ stake: 5, displayStake: "+5" }])),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => () => 200),
}));

jest.mock("../../../../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://example.com/terms"),
}));

jest.mock("@ppb/formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted value"),
  getCurrencySymbol: jest.fn(() => "€"),
}));

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../../../helpers/betslip-place-button-helper", () => ({
  buildSbkPlaceBetButtonLabels: jest.fn(() => ({
    label: "Place £10.00 bet",
  })),
}));

jest.mock("../../../betslip-formatters", () => ({
  buildPotentialReturns: jest.fn().mockReturnValue("£25.50"),
}));

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  function setup({
    betslipState = {},
    entitiesState = {
      throttles: {},
    },
    combinations = {
      "COMB:1": {
        id: "COMB:1",
        legs: ["LEG:1"],
        stake: 10,
        isBoosted: false,
      },
    },
    legs = {
      "LEG:1": {
        runners: ["RUNNER:1"],
      },
    },
    metadata = {
      "RUNNER:1": {
        runnerName: "Runner Name",
        marketName: "Market Name",
      },
    },
    sportsbookBettingState = {},
    failedRunners = {},
    validations = { combinations: { "COMB:1": [] } },
    userDetails = { currencySymbol: "£", accountBalance: 1000 },
    header = {
      counter: 1,
      title: "Some title",
      subtitle: "Some subtitle",
      moreLabel: null,
      isPriceBoostMultiple: false,
    },
    runnerFailures = [],
    oddsMovement = false,
    hasUserChangedOddsMovementPreference = false,
  } = {}) {
    const state = {
      betslip: {
        step: "PLACE_POTENTIAL",
        hasUserChangedOddsMovementPreference,
        ...betslipState,
      },
      entities: {
        userdetails: {
          currencySymbol: "£",
          accountBalance: 1000,
        },
        preferences: {},
        ...entitiesState,
      },
    };

    getSportsbookBettingCombinations.mockReturnValue(combinations);
    getSportsbookBettingLegs.mockReturnValue(legs);
    getSportsbookBettingImplyRunnerFailures.mockReturnValue(failedRunners);
    getSportsbookBettingState.mockReturnValue({
      totalStake: 10,
      isBonusSelected: false,
      totalPotentialReturns: 25.5,
      ...sportsbookBettingState,
    });
    getBettingResolvers.mockReturnValue({
      getMetadata: jest.fn(() => metadata),
    });
    getSportsbookBettingValidations.mockReturnValue(validations);
    getUserDetails.mockReturnValue(userDetails);
    createGetBetslipHeaderViewModel.mockReturnValue(() => header);
    getAllUniqueRunnersFailures.mockReturnValue(runnerFailures);
    createUserPreferencesWithProductSwitcherSelector.mockReturnValue(jest.fn(() => ({ oddsMovement })));

    return makeMapStateToProps()(state, { combinationId: "COMB:1", onClick: jest.fn() });
  }

  describe("when betslip does not exist on state", () => {
    it("should return empty object", () => {
      expect(makeMapStateToProps()({}, {})).toEqual({});
    });
  });

  describe("when combination is not found for combinationId", () => {
    it("should return empty object when combinations state is empty", () => {
      const result = setup({ combinations: {} });

      expect(result).toEqual({});
    });

    it("should return empty object when combinationId does not match any combination", () => {
      const result = setup({
        combinations: {
          "COMB:1337": { id: "COMB:1337", legs: ["LEG:1"], stake: 10 },
        },
      });

      expect(result).toEqual({});
    });
  });

  describe("when metadata does not exist", () => {
    it("should return empty object", () => {
      const result = setup({ metadata: {} });

      expect(result).toEqual({});
    });
  });

  describe("combination data", () => {
    it("should return header from createGetBetslipHeaderViewModel", () => {
      const headerMock = {
        counter: 2,
        title: "Quick Betslip Title",
        subtitle: "Sub",
        moreLabel: "+1 more",
        isPriceBoostMultiple: false,
      };
      const { header } = setup({ header: headerMock });

      expect(header).toEqual(headerMock);
    });

    it("should return the termsUrl from getEndpoint", () => {
      getEndpoint.mockReturnValue("https://example.com/terms");
      const { termsUrl } = setup();

      expect(termsUrl).toEqual("https://example.com/terms");
    });

    it("should return null for termsUrl when getEndpoint throws", () => {
      getEndpoint.mockImplementation(() => {
        throw new Error("Endpoint not found");
      });
      const { termsUrl } = setup();

      expect(termsUrl).toBeNull();
    });

    it("should return balanceAfterBet", () => {
      buildSbkBalanceAfterBetLabel.mockReturnValue("£990.00");
      const { balanceAfterBet } = setup();

      expect(balanceAfterBet).toEqual("£990.00");
    });

    it("should return totalStake", () => {
      const { totalStake } = setup({ sportsbookBettingState: { totalStake: 15 } });

      expect(totalStake).toEqual(15);
    });

    it("should return stake from combination", () => {
      const { stake } = setup({
        combinations: {
          "COMB:1": { id: "COMB:1", legs: ["LEG:1"], stake: 20 },
        },
      });

      expect(stake).toEqual(20);
    });

    it("should return undefined stake when combination has no stake", () => {
      const { stake } = setup({
        combinations: {
          "COMB:1": { id: "COMB:1", legs: ["LEG:1"], stake: 0 },
        },
      });

      expect(stake).toBeUndefined();
    });

    it("should return formatted totalReturns", () => {
      const { totalReturns } = setup({ sportsbookBettingState: { totalPotentialReturns: 25.5 } });

      expect(totalReturns).toEqual("£25.50");
    });

    it("should return N/A for totalReturns when totalPotentialReturns is null", () => {
      buildPotentialReturns.mockReturnValue("N/A");
      const { totalReturns } = setup({ sportsbookBettingState: { totalPotentialReturns: null } });

      expect(totalReturns).toEqual("N/A");
    });

    it("should return currencySymbol", () => {
      getCurrencySymbol.mockReturnValue("€");
      const { currencySymbol } = setup();

      expect(currencySymbol).toEqual("€");
    });

    it("should return empty currencySymbol when getCurrencySymbol returns null", () => {
      getCurrencySymbol.mockReturnValue(null);
      const { currencySymbol } = setup();

      expect(currencySymbol).toEqual("");
    });

    it("should return quickStakes", () => {
      buildQuickStakesSelector.mockReturnValue(() => [{ stake: 10, displayStake: "+10" }]);
      const { quickStakes } = setup();

      expect(quickStakes).toEqual([{ stake: 10, displayStake: "+10" }]);
    });

    it("should return placeButtonLabel with stake", () => {
      const { placeButtonLabel } = setup({ sportsbookBettingState: { totalStake: 10 } });

      expect(placeButtonLabel).toEqual("Place £10.00 bet");
    });

    it("should return placeButtonLabel without stake when totalStake is 0", () => {
      buildSbkPlaceBetButtonLabels.mockReturnValue({ label: "Place Bet" });
      const { placeButtonLabel } = setup({ sportsbookBettingState: { totalStake: 0 } });

      expect(placeButtonLabel).toEqual("Place Bet");
    });

    it("should return i18n labels", () => {
      const { i18n: i18nLabels } = setup();

      expect(i18nLabels).toEqual({
        termsLabel: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH",
        termsLinkLabel: "I18N.BETSLIP.SKYBETS_RULES",
        stakePlaceholder: "I18N.BETSLIP.STAKE_PLACEHOLDER",
        totalStakeLabel: "I18N.BETSLIP.BALANCE_AFTER_BET",
        totalReturnsLabel: "I18N.BETSLIP.POTENTIAL_RETURNS",
      });
    });

    it("should call getEndpoint with GENERAL_TERMS_AND_COND", () => {
      setup();

      expect(getEndpoint).toHaveBeenCalledWith("GENERAL_TERMS_AND_COND");
    });
  });

  describe("isStakeValid", () => {
    it("should return true when stake is valid", () => {
      isStakeValid.mockReturnValue(true);
      const result = setup();

      expect(result.isStakeValid).toBe(true);
    });

    it("should return false when stake is invalid", () => {
      isStakeValid.mockReturnValue(false);
      const result = setup();

      expect(result.isStakeValid).toBe(false);
    });

    it("should call isStakeValid with userDetails and combination validations", () => {
      const mockUserDetails = { currencySymbol: "€", accountBalance: 500 };
      const mockValidation = [{ minStake: 0.1, maxStake: 1000 }];

      setup({
        userDetails: mockUserDetails,
        validations: { combinations: { "COMB:1": mockValidation } },
      });

      expect(isStakeValid).toHaveBeenCalledWith(mockUserDetails, mockValidation);
    });
  });

  describe("balanceAfterBet", () => {
    it("should call buildSbkBalanceAfterBetLabel with correct arguments", () => {
      setup({
        sportsbookBettingState: { totalStake: 15, isBonusSelected: false },
        userDetails: { currencySymbol: "£", accountBalance: 1000, loggedIn: true },
      });

      expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(
        { currencySymbol: "£", accountBalance: 1000, loggedIn: true },
        {
          accountBalance: 200,
          totalStake: 15,
          isOldUseBonusActive: false,
          isLoggedIn: true,
        },
      );
    });

    it("should pass isBonusSelected as isOldUseBonusActive", () => {
      setup({ sportsbookBettingState: { totalStake: 10, isBonusSelected: true } });

      expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ isOldUseBonusActive: true }),
      );
    });

    it("should default totalStake to 0 when it is null", () => {
      setup({ sportsbookBettingState: { totalStake: null } });

      expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ totalStake: 0 }),
      );
    });
  });

  describe("requiredDepositValue", () => {
    it("should return the required deposit value to proceed with the bet placement", () => {
      createGetSbkRequiredDepositValueSelector.mockReturnValue(jest.fn(() => 1337));
      const { requiredDepositValue } = setup({});

      expect(requiredDepositValue).toBe(1337);
    });

    it("should return 0 when no deposit is required", () => {
      createGetSbkRequiredDepositValueSelector.mockReturnValue(jest.fn(() => 0));
      const { requiredDepositValue } = setup({});

      expect(requiredDepositValue).toBe(0);
    });
  });

  describe("isDepositRequired", () => {
    it("should return true when deposit is required", () => {
      createGetSbkIsDepositRequiredSelector.mockReturnValue(() => true);
      const { isDepositRequired } = setup({});

      expect(isDepositRequired).toBe(true);
    });

    it("should return false when deposit is not required", () => {
      createGetSbkIsDepositRequiredSelector.mockReturnValue(() => false);
      const { isDepositRequired } = setup({});

      expect(isDepositRequired).toBe(false);
    });
  });

  describe("isLastStakeValid and lastSuccessfulStake", () => {
    const baseCombination = {
      id: "COMB:1",
      legs: ["LEG:1"],
      stake: 10,
      minStake: 1,
      calculatedMaxStake: 100,
      numLines: 1,
    };

    function setupLastStake({
      lastSuccessfulStake,
      combination = baseCombination,
      isDepositRequired = () => false,
    } = {}) {
      getLastSuccessfulStake.mockReturnValue(lastSuccessfulStake);
      createGetSbkIsDepositRequiredSelector.mockReturnValue(isDepositRequired);

      return setup({
        combinations: { "COMB:1": combination },
      });
    }

    it("should expose lastSuccessfulStake from the selector", () => {
      const { lastSuccessfulStake } = setupLastStake({ lastSuccessfulStake: 7 });

      expect(lastSuccessfulStake).toEqual(7);
    });

    it("should expose undefined lastSuccessfulStake when none is stored", () => {
      const { lastSuccessfulStake } = setupLastStake({ lastSuccessfulStake: undefined });

      expect(lastSuccessfulStake).toBeUndefined();
    });

    describe("when within the combination boundaries and deposit is not required", () => {
      it("should return isLastStakeValid as true", () => {
        const { isLastStakeValid } = setupLastStake({ lastSuccessfulStake: 10 });

        expect(isLastStakeValid).toBe(true);
      });

      it("should accept the boundary edges (== minStake and == calculatedMaxStake)", () => {
        const minEdge = setupLastStake({
          lastSuccessfulStake: 1,
          combination: { ...baseCombination, minStake: 1, calculatedMaxStake: 100 },
        });
        expect(minEdge.isLastStakeValid).toBe(true);

        const maxEdge = setupLastStake({
          lastSuccessfulStake: 100,
          combination: { ...baseCombination, minStake: 1, calculatedMaxStake: 100 },
        });
        expect(maxEdge.isLastStakeValid).toBe(true);
      });
    });

    describe("when boundary checks fail", () => {
      it("should return false when lastSuccessfulStake is undefined", () => {
        const { isLastStakeValid } = setupLastStake({ lastSuccessfulStake: undefined });

        expect(isLastStakeValid).toBe(false);
      });

      it("should return false when lastSuccessfulStake is 0", () => {
        const { isLastStakeValid } = setupLastStake({ lastSuccessfulStake: 0 });

        expect(isLastStakeValid).toBe(false);
      });

      it("should return false when minStake is missing on the combination", () => {
        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 10,
          combination: { ...baseCombination, minStake: undefined },
        });

        expect(isLastStakeValid).toBe(false);
      });

      it("should return false when calculatedMaxStake is Number.MAX_VALUE", () => {
        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 10,
          combination: { ...baseCombination, calculatedMaxStake: Number.MAX_VALUE },
        });

        expect(isLastStakeValid).toBe(false);
      });

      it("should return false when lastSuccessfulStake is below minStake", () => {
        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 0.5,
          combination: { ...baseCombination, minStake: 1, calculatedMaxStake: 100 },
        });

        expect(isLastStakeValid).toBe(false);
      });

      it("should return false when lastSuccessfulStake is above calculatedMaxStake", () => {
        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 150,
          combination: { ...baseCombination, minStake: 1, calculatedMaxStake: 100 },
        });

        expect(isLastStakeValid).toBe(false);
      });
    });

    describe("when deposit is required for the projected stake", () => {
      it("should return false even when boundaries are valid", () => {
        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 10,
          isDepositRequired: () => true,
        });

        expect(isLastStakeValid).toBe(false);
      });

      it("should query getIsDepositRequired with lastSuccessfulStake * numLines", () => {
        const isDepositRequiredMock = jest.fn(() => false);

        setupLastStake({
          lastSuccessfulStake: 10,
          combination: { ...baseCombination, numLines: 3 },
          isDepositRequired: isDepositRequiredMock,
        });

        expect(isDepositRequiredMock).toHaveBeenCalledWith(expect.any(Object), 30);
      });

      it("should return true when projected stake is exactly affordable", () => {
        const isDepositRequiredMock = jest.fn((_, stake) => stake !== undefined && stake > 30);

        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 10,
          combination: { ...baseCombination, numLines: 3 },
          isDepositRequired: isDepositRequiredMock,
        });

        expect(isLastStakeValid).toBe(true);
      });

      it("should return false when projected stake exceeds the affordable amount", () => {
        const isDepositRequiredMock = jest.fn((_, stake) => stake !== undefined && stake > 20);

        const { isLastStakeValid } = setupLastStake({
          lastSuccessfulStake: 10,
          combination: { ...baseCombination, numLines: 3 },
          isDepositRequired: isDepositRequiredMock,
        });

        expect(isLastStakeValid).toBe(false);
      });
    });
  });

  describe("hasFailures", () => {
    describe("when there are no failed runners", () => {
      it("should return false", () => {
        hasSGMFailures.mockReturnValue(false);
        const { hasFailures } = setup({ failedRunners: {} });

        expect(hasFailures).toBe(false);
      });
    });

    describe("when there are SGM failures", () => {
      it("should return true", () => {
        hasSGMFailures.mockReturnValue(true);
        const { hasFailures } = setup({
          failedRunners: { "RUNNER:1": [{ code: "SGM_FAILURE" }] },
        });

        expect(hasFailures).toBe(true);
      });
    });

    describe("when hasSGMFailures returns false for all runners", () => {
      it("should return false", () => {
        hasSGMFailures.mockReturnValue(false);
        const { hasFailures } = setup({
          failedRunners: { "RUNNER:1": [{ code: "OTHER_FAILURE" }] },
        });

        expect(hasFailures).toBe(false);
      });
    });

    describe("when there are multiple runners with mixed failures", () => {
      it("should return true when at least one runner has SGM failures", () => {
        hasSGMFailures.mockImplementation((failures) => failures.some((f) => f.code === "SGM_FAILURE"));
        const { hasFailures } = setup({
          failedRunners: {
            "RUNNER:1": [{ code: "OTHER_FAILURE" }],
            "RUNNER:2": [{ code: "SGM_FAILURE" }],
          },
        });

        expect(hasFailures).toBe(true);
      });

      it("should return false when no runners have SGM failures", () => {
        hasSGMFailures.mockReturnValue(false);
        const { hasFailures } = setup({
          failedRunners: {
            "RUNNER:1": [{ code: "OTHER_FAILURE" }],
            "RUNNER:2": [{ code: "ANOTHER_FAILURE" }],
          },
        });

        expect(hasFailures).toBe(false);
      });
    });
  });

  describe("isOddsMovementOn", () => {
    it("should return false when user preferences oddsMovement is false", () => {
      const { isOddsMovementOn } = setup({ oddsMovement: false });

      expect(isOddsMovementOn).toBe(false);
    });

    it("should return true when user preferences oddsMovement is true", () => {
      const { isOddsMovementOn } = setup({ oddsMovement: true });

      expect(isOddsMovementOn).toBe(true);
    });
  });

  describe("showAcceptOddsMovementAlert", () => {
    describe("when ODDS_MOVEMENT_ALERT_SWITCH is active", () => {
      const activeThrottleState = {
        throttles: {
          ODDS_MOVEMENT_ALERT_SWITCH: { isActive: true },
        },
      };

      it("should return false when there are no runner failures", () => {
        const { showAcceptOddsMovementAlert } = setup({
          runnerFailures: [],
          entitiesState: activeThrottleState,
        });

        expect(showAcceptOddsMovementAlert).toBe(false);
      });

      it("should return true when there is a REQUESTED_PRICE_NOT_AVAILABLE runner failure", () => {
        const { showAcceptOddsMovementAlert } = setup({
          runnerFailures: [RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE],
          entitiesState: activeThrottleState,
        });

        expect(showAcceptOddsMovementAlert).toBe(true);
      });

      it("should return false when runner failures do not include REQUESTED_PRICE_NOT_AVAILABLE", () => {
        const { showAcceptOddsMovementAlert } = setup({
          runnerFailures: ["SOME_OTHER_FAILURE"],
          entitiesState: activeThrottleState,
        });

        expect(showAcceptOddsMovementAlert).toBe(false);
      });

      it("should return true when REQUESTED_PRICE_NOT_AVAILABLE is among other failures", () => {
        const { showAcceptOddsMovementAlert } = setup({
          runnerFailures: ["SOME_OTHER_FAILURE", RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE],
          entitiesState: activeThrottleState,
        });

        expect(showAcceptOddsMovementAlert).toBe(true);
      });
    });
  });

  describe("oddsMovementLabels", () => {
    it("should return accept labels when user has not changed preference and odds movement is off", () => {
      const { oddsMovementLabels } = setup({ oddsMovement: false, hasUserChangedOddsMovementPreference: false });

      expect(oddsMovementLabels).toEqual({
        message: "I18N.BETSLIP.ODDS_MOVEMENT",
        detailMessage: "I18N.BETSLIP.ODDS_MOVEMENT_DESCRIPTION",
      });
    });

    it("should return on labels when odds movement is on", () => {
      const { oddsMovementLabels } = setup({ oddsMovement: true, hasUserChangedOddsMovementPreference: true });

      expect(oddsMovementLabels).toEqual({
        message: "I18N.BETSLIP.ODDS_MOVEMENT_ON",
        detailMessage: "I18N.BETSLIP.ODDS_MOVEMENT_ON_DESCRIPTION",
      });
    });

    it("should return off labels when user has changed preference and odds movement is off", () => {
      const { oddsMovementLabels } = setup({ oddsMovement: false, hasUserChangedOddsMovementPreference: true });

      expect(oddsMovementLabels).toEqual({
        message: "I18N.BETSLIP.ODDS_MOVEMENT_OFF",
        detailMessage: "I18N.BETSLIP.ODDS_MOVEMENT_OFF_DESCRIPTION",
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchStakeChange", () => {
    it("should dispatch UI__BETSLIP_SBK_STAKE_INPUT_CHANGE action", () => {
      const dispatch = jest.fn();
      const { dispatchStakeChange } = mapDispatchToProps(dispatch);

      dispatchStakeChange({ id: "COMB:1", newValue: 10 });

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
        payload: { combinationId: "COMB:1", stake: 10 },
      });
    });

    it("should dispatch BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION action", () => {
      const dispatch = jest.fn();
      const { dispatchStakeChange } = mapDispatchToProps(dispatch);

      dispatchStakeChange({ id: "COMB:1", newValue: 10 });

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
        payload: { combinationId: "COMB:1", stake: 10 },
      });
    });

    it("should dispatch both actions with undefined stake when newValue is not provided", () => {
      const dispatch = jest.fn();
      const { dispatchStakeChange } = mapDispatchToProps(dispatch);

      dispatchStakeChange({ id: "COMB:1" });

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
        payload: { combinationId: "COMB:1", stake: undefined },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
        payload: { combinationId: "COMB:1", stake: undefined },
      });
    });
  });

  describe("dispatchIncrementPress", () => {
    it("should dispatch BETTING__SBK_INCREMENT_STAKE_ACTION with combinationId and increment", () => {
      const dispatch = jest.fn();
      const { dispatchIncrementPress } = mapDispatchToProps(dispatch);

      dispatchIncrementPress("COMB:1", 5, "£");

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_INCREMENT_STAKE_ACTION,
        payload: { combinationId: "COMB:1", increment: 5 },
      });
    });

    it("should dispatch UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION with increment and currencySymbol", () => {
      const dispatch = jest.fn();
      const { dispatchIncrementPress } = mapDispatchToProps(dispatch);

      dispatchIncrementPress("COMB:1", 5, "£");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
        payload: { increment: 5, currencySymbol: "£" },
      });
    });

    it("should dispatch both actions", () => {
      const dispatch = jest.fn();
      const { dispatchIncrementPress } = mapDispatchToProps(dispatch);

      dispatchIncrementPress("COMB:2", 10, "€");

      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });
  describe("dispatchPlacement", () => {
    it("should dispatch UI__BETSLIP_SBK_PLACE_BETS_CLICK action", () => {
      const dispatch = jest.fn();
      const { dispatchPlacement } = mapDispatchToProps(dispatch);

      dispatchPlacement();

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_PLACE_BETS_CLICK,
      });
    });

    it("should dispatch BETTING__SBK_PLACE_BETS action", () => {
      const dispatch = jest.fn();
      const { dispatchPlacement } = mapDispatchToProps(dispatch);

      dispatchPlacement();

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_PLACE_BETS,
      });
    });
  });
  describe("dispatchDepositRedirect", () => {
    it("should dispatch UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK action", () => {
      const dispatch = jest.fn();
      const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

      dispatchDepositRedirect();

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK,
      });
    });
    it("should dispatch BETTING__DEPOSIT_TO_PLACE_BET action", () => {
      const dispatch = jest.fn();
      const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

      dispatchDepositRedirect();

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__DEPOSIT_TO_PLACE_BET,
      });
    });
  });
  describe("dispatchNavigate", () => {
    it("should dispatch PUSH action", () => {
      const dispatch = jest.fn();
      const { dispatchNavigate } = mapDispatchToProps(dispatch);

      dispatchNavigate("viewUrn", "https://example.com/some-page");

      expect(dispatch).toHaveBeenCalledWith({
        type: PUSH,
        payload: {
          viewUrn: "viewUrn",
          viewUrl: "https://example.com/some-page",
        },
      });
    });
  });

  describe("dispatchOddsMovementChange", () => {
    it("should dispatch UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE with isChecked true", () => {
      const dispatch = jest.fn();
      const { dispatchOddsMovementChange } = mapDispatchToProps(dispatch);

      dispatchOddsMovementChange(true);

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
        payload: { isOddsMovementAccepted: true },
      });
    });

    it("should dispatch UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE with isChecked false", () => {
      const dispatch = jest.fn();
      const { dispatchOddsMovementChange } = mapDispatchToProps(dispatch);

      dispatchOddsMovementChange(false);

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
        payload: { isOddsMovementAccepted: false },
      });
    });

    it("should dispatch exactly one action", () => {
      const dispatch = jest.fn();
      const { dispatchOddsMovementChange } = mapDispatchToProps(dispatch);

      dispatchOddsMovementChange(true);

      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
