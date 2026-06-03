import { RUNNER_FAILURE_CODES, VALIDATION_TYPES } from "@ppb/betslip-core";
import {
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_REMOVE_LEG_ACTION,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { EXTERNAL_PUSH, PUSH } from "@ppb/tbd-store/actions/router";
import {
  createGetBetBuilderCombinationIdsSelector,
  createGetBoostedCombinationsSelector,
  createCombinationGroupFailuresSelector,
  createGetBoostedUncombinedGroupIdsSelector,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingState,
  getSingleCombinationIds,
  createHasMultiplesSelector,
  createGetCastGroupIdsSelector,
  getSportsbookBettingRunners,
  getAllUniqueRunnersFailures,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getBetslipCard, getBetslipCurrentTab } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  isCast,
  isMultiBetBuilder,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { Product } from "@ppb/tbd-store/state/entities";
import { BetslipSection } from "../Betslip.types";
import { i18n } from "../../../helpers/i18n";
import { buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";
import {
  buildSportsbookTransactionalError,
  createAreAllCombinationsClosedOrSuspendedSelector,
} from "../connected-sportsbook-betslip-mapper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createGetSbkIsDepositRequiredSelector, createGetSbkRequiredDepositValueSelector } from "../betslip-mapper";
import { createValidationsSelector } from "../Notifier/notifier-mapper";
import { createIsConfirmStepActive } from "../sportsbook-betslip-confirm-mapper";
import { createGetMultipleCombinations } from "./sportsbook-place-mapper";
import { getEndpoint, getBetslipConfig } from "../../../config/endpoints";
import { buildFreeBetsAlertMessage, sumWalletsAmounts } from "../../../helpers/generosity-wallets";
import { BetslipCollapseStrategy } from "./hooks/useCollapseStrategy";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({}),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
  getBetslipCurrentTab: jest.fn().mockReturnValue(""),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetBetBuilderCombinationIdsSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  createGetBoostedCombinationsSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  createCombinationGroupFailuresSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  createGetBoostedUncombinedGroupIdsSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  getSportsbookBettingState: jest.fn().mockReturnValue({ combinations: {}, legs: {} }),
  createGetCombinationsSelectedWalletsAmounts: jest.fn().mockReturnValue(
    jest.fn().mockReturnValue({
      "COMB:1": {
        combinationAmount: 10,
      },
      "COMB:2": {},
    }),
  ),
  getSingleCombinationIds: jest.fn().mockReturnValue([]),
  createHasMultiplesSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue(false)),
  createGetCastGroupIdsSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
  getSportsbookBettingRunners: jest.fn().mockReturnValue({}),
  getAllUniqueRunnersFailures: jest.fn().mockReturnValue([]),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue({ combinations: {} }),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  hasAnyMarketClosedFailure: jest.fn().mockReturnValue(false),
  hasAnyMarketSuspendedFailure: jest.fn().mockReturnValue(false),
  isCast: jest.fn(),
  isMultiBetBuilder: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserSpecificWalletSelector: jest.fn(() => () => ({ amount: 20 })),
}));
jest.mock("@ppb/the-wall-web/types", () => ({
  AlertType: {
    Warning: "WARNING",
  },
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => () => 200),
}));

jest.mock("../../../helpers/betslip-balance-helper", () => ({
  buildSbkBalanceAfterBetLabel: jest.fn(() => "100 €"),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted value"),
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
}));
jest.mock("../betslip-formatters", () => ({
  buildPotentialReturns: jest.fn().mockReturnValue("potentialReturns"),
  buildTotalOriginalReturns: jest.fn().mockReturnValue("totalOriginalReturns"),
  buildCombinationOdds: jest.fn().mockReturnValue("formattedOdds"),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStepActive: jest.fn().mockReturnValue(jest.fn().mockReturnValue(false)),
}));

jest.mock("../Notifier/notifier-mapper", () => ({
  createValidationsSelector: jest.fn().mockReturnValue(() => []),
}));

jest.mock("./sportsbook-place-mapper", () => ({
  createGetMultipleCombinations: jest.fn().mockReturnValue(() => ({})),
}));

jest.mock("../betslip-mapper", () => ({
  createGetSbkIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
  createGetSbkRequiredDepositValueSelector: jest.fn(() => jest.fn(0)),
  buildQuickStakesSelector: jest.fn().mockReturnValue(jest.fn(() => [{ qs: "qs" }])),
}));

jest.mock("../../../helpers/numeric-i18n", () => ({
  getSeparatorByLocale: jest.fn().mockReturnValue(KeyboardSeparator.Dot),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => {
  const getAreAllCombinationsClosedOrSuspended = jest.fn().mockReturnValue(false);

  return {
    createAreAllCombinationsClosedOrSuspendedSelector: () => getAreAllCombinationsClosedOrSuspended,
    createMultiplesNotificationsSelector: jest.fn().mockReturnValue(() => []),
    createAvailabilityNotificationSelector: jest.fn().mockReturnValue(() => undefined),
    buildSportsbookTransactionalError: jest.fn(),
  };
});

jest.mock("../../../helpers/generosity-wallets", () => ({
  buildFreeBetsAlertMessage: jest.fn().mockReturnValue("free bets alert message mock"),
  sumWalletsAmounts: jest.fn((a = 0, b = 0) => a + b),
}));

jest.mock("../../../helpers/betslip-place-button-helper", () => ({
  buildSbkPlaceBetButtonLabels: jest.fn(() => ({
    label: "placeButtonLabel",
    secondaryLabel: "placeButtonSecondaryLabel",
    loadingLabel: "placeButtonLoadingLabel",
    reverseLabels: "placeButtonReverseLabels",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      sportsbookOddsDisplay: "sportsbookOddsDisplay",
      oddsMovement: false,
    }),
  ),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

jest.mock("../../../config/endpoints");

const APP_STATE = {
  betslip: {
    sportsbookOddsMovement: {},
    sportsbookHandicapMovement: {},
    hasUserChangedOddsMovementPreference: false,
  },
  entities: {
    throttles: {},
    experiments: {},
  },
};

const oneLineCombination = {
  id: "TREBLE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
};
const multiLinesCombinations = [
  {
    id: "DOUBLE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
  },
  {
    id: "TRIXIE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
  },
  {
    id: "PATENT:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
  },
];

const i18nLabelsMock = {
  singlesGroup: "singles mock",
  multiplesGroup: "multiples mock",
  priceBoostGroup: "price boost mock",
  castBetGroup: "forecast mock",
};

const mockThrottles = ({
  upsell = false,
  oddsMovementAlert = false,
  stakeFocus = false,
  tabbedAutoFocus = false,
} = {}) => {
  const throttles = {
    UPSELL_BETSLIP: upsell,
    ODDS_MOVEMENT_ALERT_SWITCH: oddsMovementAlert,
    STAKE_FOCUS: stakeFocus,
    TABBED_BETSLIP_AUTO_FOCUS: tabbedAutoFocus,
  };

  createGetThrottleSelector.mockReturnValue(jest.fn((_throttles, key) => throttles[key]));
};

const setupMapStateToProps = ({
  appState = APP_STATE,
  isBetConfirmationStepActive = false,
  multipleCombinationsBuilder = jest.fn(() => []),
  getBoostedCombinations = jest.fn(() => []),
  validationsBuilder = jest.fn(() => []),
  oddsMovementBuilder = jest.fn(() => []),
} = {}) => {
  createValidationsSelector.mockReturnValue(validationsBuilder);
  createOddsMovementSelector.mockReturnValue(oddsMovementBuilder);
  createGetMultipleCombinations.mockReturnValue(multipleCombinationsBuilder);
  createGetBoostedCombinationsSelector.mockReturnValue(getBoostedCombinations);
  createIsConfirmStepActive.mockReturnValue(jest.fn().mockReturnValue(isBetConfirmationStepActive));

  return makeMapStateToProps()(appState);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockThrottles();
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      setupMapStateToProps({});

      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return an empty object", () => {
      expect(setupMapStateToProps({})).toEqual({});
    });
  });

  describe("betBuilderIds", () => {
    it("should return bet builders ids", () => {
      createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => ["betBuilder1", "betBuilder2"]);

      const { betBuilderIds } = setupMapStateToProps();

      expect(betBuilderIds).toEqual(["betBuilder1", "betBuilder2"]);
    });
  });

  describe("boostedCombinationIds", () => {
    it("should return boosted combination ids", () => {
      createGetBoostedCombinationsSelector.mockReturnValueOnce(() => [{ id: "boosted:1" }, { id: "boosted:2" }]);

      const { boostedCombinationIds } = setupMapStateToProps();

      expect(boostedCombinationIds).toEqual(["boosted:1", "boosted:2"]);
    });
  });

  describe("totalReturns", () => {
    it("should call buildPotentialReturns", () => {
      getSportsbookBettingState.mockReturnValue({
        legs: {},
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        combinations: {},
      });

      setupMapStateToProps({});

      expect(buildPotentialReturns).toHaveBeenCalledWith(1.23, 11, {});
    });

    it("should return the formatted total returns", () => {
      getSportsbookBettingState.mockReturnValue({
        legs: {},
        totalPotentialReturns: 1.33,
        combinations: {},
      });
      buildPotentialReturns.mockReturnValue("formatted value");

      const { totalReturns } = setupMapStateToProps({});

      expect(totalReturns).toEqual("formatted value");
    });
  });

  describe("requiredDepositValue", () => {
    it("should return the required deposit value to proceed with the bet placement", () => {
      createGetSbkRequiredDepositValueSelector.mockReturnValue(jest.fn(() => 1337));
      const { requiredDepositValue } = setupMapStateToProps({});

      expect(requiredDepositValue).toBe(1337);
    });
  });

  describe("totalOriginalReturns", () => {
    it("should call buildTotalOriginalReturns", () => {
      getSportsbookBettingState.mockReturnValue({
        legs: {},
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        totalOriginalPotentialReturns: 9,
        combinations: {},
      });

      setupMapStateToProps({});
      expect(buildTotalOriginalReturns).toHaveBeenCalledWith(1.23, 11, 9, false, {});
    });

    it("should return the formatted total original returns", () => {
      getSportsbookBettingState.mockReturnValue({
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        totalOriginalPotentialReturns: 9,
        combinations: {
          "COMB:1": {
            id: "COMB:1",
            totalCombinedStake: 1,
            isPriceBoostSelected: true,
            legs: ["LEG:1"],
          },
        },
        legs: { "LEG:1": { runners: ["R:1"] } },
      });
      buildTotalOriginalReturns.mockReturnValue("formatted value");

      const { totalOriginalReturns } = setupMapStateToProps({});
      expect(totalOriginalReturns).toEqual("formatted value");
    });
  });

  describe("isFreeBetsSelected", () => {
    describe("when the bonus is selected", () => {
      it("should return true", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {},
          isBonusSelected: true,
        });
        const { isFreeBetsSelected } = setupMapStateToProps({});

        expect(isFreeBetsSelected).toEqual(true);
      });
    });

    describe("when the bonus is not selected", () => {
      it("should return false", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {},
          isBonusSelected: false,
        });
        const { isFreeBetsSelected } = setupMapStateToProps({});

        expect(isFreeBetsSelected).toEqual(false);
      });
    });
  });

  describe("isEligibleToBonus", () => {
    describe("when there is bonus money", () => {
      it("should return true", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {},
          hasBonusMoney: true,
        });
        const { isEligibleToBonus } = setupMapStateToProps({});

        expect(isEligibleToBonus).toEqual(true);
      });
    });

    describe("and there is no bonus money", () => {
      it("should return false", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {},
          hasBonusMoney: false,
        });
        const { isEligibleToBonus } = setupMapStateToProps({});

        expect(isEligibleToBonus).toEqual(false);
      });
    });

    describe("when free bets are not enabled", () => {
      it("should return false", () => {
        const { isEligibleToBonus } = setupMapStateToProps({});

        expect(isEligibleToBonus).toEqual(false);
      });
    });
  });

  describe("isPlaceDisabled", () => {
    describe("when there are no staked combinations", () => {
      it("should return true", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          totalPotentialReturns: 1.33,
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              totalCombinedStake: undefined,
            },
          },
        });
        const { isPlaceDisabled } = setupMapStateToProps({});

        expect(isPlaceDisabled).toEqual(true);
      });
    });

    describe("when there are staked combinations", () => {
      it("should return false", () => {
        getSportsbookBettingState.mockReturnValue({
          totalPotentialReturns: 1.33,
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              totalCombinedStake: 1,
              legs: ["LEG:1"],
            },
          },
          legs: { "LEG:1": { runners: ["R:1"] } },
        });
        const { isPlaceDisabled } = setupMapStateToProps({});

        expect(isPlaceDisabled).toEqual(false);
      });

      describe("and when there are runner failures", () => {
        describe("and when there are no market codes", () => {
          it("should return false", () => {
            getSportsbookBettingState.mockReturnValue({
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  totalCombinedStake: 1,
                  legs: ["LEG:1"],
                },
              },
              legs: { "LEG:1": { runners: ["R:1"] } },
            });
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce({
              "R:1": [{ failureCode: RUNNER_FAILURE_CODES.INVALID_COMBINATION }],
            });
            hasAnyMarketClosedFailure.mockReturnValue(false);
            hasAnyMarketSuspendedFailure.mockReturnValue(false);

            const { isPlaceDisabled } = setupMapStateToProps();

            expect(isPlaceDisabled).toBe(false);
          });
        });

        describe("and when there are market codes", () => {
          it("should return true", () => {
            getSportsbookBettingState.mockReturnValue({
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  totalCombinedStake: 1,
                  legs: ["LEG:1"],
                },
              },
              legs: { "LEG:1": { runners: ["R:1"] } },
            });
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce({
              "R:1": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_SUSPENDED }],
            });
            hasAnyMarketClosedFailure.mockReturnValue(false);
            hasAnyMarketSuspendedFailure.mockReturnValue(true);

            const { isPlaceDisabled } = setupMapStateToProps();

            expect(isPlaceDisabled).toBe(true);
          });
        });
      });

      describe("and when there are validations", () => {
        describe("and when all validations are BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE", () => {
          it("should return false", () => {
            const validationsBuilder = jest.fn(() => [
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
            ]);
            getSportsbookBettingState.mockReturnValue({
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  totalCombinedStake: 1,
                  legs: ["LEG:1"],
                },
              },
              legs: { "LEG:1": { runners: ["R:1"] } },
            });

            const { isPlaceDisabled } = setupMapStateToProps({ validationsBuilder });

            expect(isPlaceDisabled).toBe(false);
          });
        });

        describe("and when NOT all validations are BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE", () => {
          it("should return true", () => {
            const validationsBuilder = jest.fn(() => [
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
              { type: "some other validation", notification: { type: "ERROR" } },
            ]);
            getSportsbookBettingState.mockReturnValue({
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  totalCombinedStake: 1,
                  legs: ["LEG:1"],
                },
              },
              legs: { "LEG:1": { runners: ["R:1"] } },
            });

            const { isPlaceDisabled } = setupMapStateToProps({ validationsBuilder });

            expect(isPlaceDisabled).toBe(true);
          });
        });

        describe("and when all validations are warnings", () => {
          it("should return false", () => {
            const validationsBuilder = jest.fn(() => [{ type: "validation", notification: { type: "WARNING" } }]);

            const { isPlaceDisabled } = setupMapStateToProps({ validationsBuilder });

            expect(isPlaceDisabled).toBe(false);
          });
        });
      });

      describe("and when there are no validations", () => {
        it("should return false", () => {
          getSportsbookBettingState.mockReturnValue({
            totalPotentialReturns: 1.33,
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                totalCombinedStake: 1,
                legs: ["LEG:1"],
              },
            },
            legs: { "LEG:1": { runners: ["R:1"] } },
          });

          const { isPlaceDisabled } = setupMapStateToProps();

          expect(isPlaceDisabled).toBe(false);
        });
      });
    });
  });

  describe("isPanelDisabled", () => {
    describe("when there is a place in progress", () => {
      it("should return true", () => {
        getBetslipCard.mockReturnValue({ placeStatus: "INPROGRESS" });
        const { isPanelDisabled } = setupMapStateToProps({});

        expect(isPanelDisabled).toEqual(true);
      });
    });

    describe("when there is no placeStatus", () => {
      it("should return false", () => {
        getBetslipCard.mockReturnValue({});
        const { isPanelDisabled } = setupMapStateToProps({});

        expect(isPanelDisabled).toEqual(false);
      });
    });

    describe("when the user is authenticating", () => {
      it("should return true", () => {
        getBetslipCard.mockReturnValue({});
        getUserDetails.mockReturnValueOnce({ isAuthenticating: true });
        const { isPanelDisabled } = setupMapStateToProps({});

        expect(isPanelDisabled).toEqual(true);
      });
    });
  });

  describe("isSummaryDisabled", () => {
    describe("when the totalCombinedStake is 0", () => {
      it("should return true", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          totalCombinedStake: 0,
          combinations: {},
        });
        const { isSummaryDisabled } = setupMapStateToProps({});

        expect(isSummaryDisabled).toEqual(true);
      });
    });

    describe("when the totalCombinedStake is null", () => {
      it("should return true", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          totalCombinedStake: null,
          combinations: {},
        });
        const { isSummaryDisabled } = setupMapStateToProps({});

        expect(isSummaryDisabled).toEqual(true);
      });
    });

    describe("when the totalCombinedStake is more than 0", () => {
      it("should return false", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          totalCombinedStake: 3,
          combinations: {},
        });
        const { isSummaryDisabled } = setupMapStateToProps({});

        expect(isSummaryDisabled).toEqual(false);
      });
    });
  });

  describe("hasOneLineMultiple", () => {
    it("should call getMultipleCombinations", () => {
      const multipleCombinationsBuilder = jest.fn().mockReturnValue({ oneLineCombination, multiLinesCombinations });

      setupMapStateToProps({ multipleCombinationsBuilder });

      expect(multipleCombinationsBuilder).toHaveBeenCalled();
    });

    describe("when there is no one line multiple", () => {
      it("should return false", () => {
        const multipleCombinationsBuilder = jest
          .fn()
          .mockReturnValue({ oneLineCombination: {}, multiLinesCombinations: [] });
        const { hasOneLineMultiple } = setupMapStateToProps({ multipleCombinationsBuilder });

        expect(hasOneLineMultiple).toEqual(false);
      });
    });

    describe("when there is a one line multiple", () => {
      it("should return true", () => {
        const multipleCombinationsBuilder = jest.fn().mockReturnValue({ oneLineCombination, multiLinesCombinations });
        const { hasOneLineMultiple } = setupMapStateToProps({ multipleCombinationsBuilder });

        expect(hasOneLineMultiple).toEqual(true);
      });
    });
  });

  describe("hasMultipleLinesMultiples", () => {
    it("should call getMultipleCombinations", () => {
      const multipleCombinationsBuilder = jest.fn().mockReturnValue({ oneLineCombination, multiLinesCombinations });

      setupMapStateToProps({ multipleCombinationsBuilder });

      expect(multipleCombinationsBuilder).toHaveBeenCalled();
    });

    describe("when there is no multiples with several lines", () => {
      it("should return false", () => {
        const multipleCombinationsBuilder = jest
          .fn()
          .mockReturnValue({ oneLineCombination, multiLinesCombinations: {} });
        const { hasMultipleLinesMultiples } = setupMapStateToProps({ multipleCombinationsBuilder });

        expect(hasMultipleLinesMultiples).toEqual(false);
      });
    });

    describe("when there is multiples with several lines", () => {
      it("should return true", () => {
        const multipleCombinationsBuilder = jest.fn().mockReturnValue({ oneLineCombination, multiLinesCombinations });
        const { hasMultipleLinesMultiples } = setupMapStateToProps({ multipleCombinationsBuilder });

        expect(hasMultipleLinesMultiples).toEqual(true);
      });
    });
  });

  describe("hasMultiBetBuilder", () => {
    function setupMultiBetBuilder({ isMultiBetBuilderBet = false } = {}) {
      getSportsbookBettingState.mockReturnValue({
        combinations: { "C:1": { id: "C:1" } },
        legs: { "L:1": { id: "L:1" } },
      });
      isMultiBetBuilder.mockReturnValue(isMultiBetBuilderBet);

      return setupMapStateToProps();
    }

    describe("when there is a multi bet builder", () => {
      it("should return true", () => {
        const { hasMultiBetBuilder } = setupMultiBetBuilder({
          isMultiBetBuilderBet: true,
        });

        expect(hasMultiBetBuilder).toBe(true);
      });
    });

    describe("when there is no multi bet builder", () => {
      it("should return false", () => {
        const { hasMultiBetBuilder } = setupMultiBetBuilder({
          isMultiBetBuilderBet: false,
        });

        expect(hasMultiBetBuilder).toBe(false);
      });
    });
  });

  describe("hasCastBets", () => {
    function setupCastBets({ isCastBet = false } = {}) {
      getSportsbookBettingState.mockReturnValue({
        combinations: { "C:1": { id: "C:1" } },
        legs: { "L:1": { id: "L:1" } },
      });
      isCast.mockReturnValue(isCastBet);

      return setupMapStateToProps({});
    }

    describe("when there are cast bets", () => {
      it("should return true", () => {
        const { hasCastBets } = setupCastBets({ isCastBet: true });

        expect(hasCastBets).toBe(true);
      });
    });
    describe("when there are no cast bets", () => {
      it("should return false", () => {
        const { hasCastBets } = setupCastBets();

        expect(hasCastBets).toBe(false);
      });
    });
  });

  describe("hasBetBuilders", () => {
    function setupBetBuilders(betBuilderIds = []) {
      createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => betBuilderIds);
      return setupMapStateToProps();
    }

    describe("when there are betBuilderIds", () => {
      it("should return true", () => {
        const { hasBetBuilders } = setupBetBuilders(["betBuilder1", "betBuilder2"]);

        expect(hasBetBuilders).toBe(true);
      });
    });

    describe("when there are no betBuilderIds", () => {
      it("should return false", () => {
        const { hasBetBuilders } = setupBetBuilders([]);

        expect(hasBetBuilders).toBe(false);
      });
    });
  });

  describe("hasSingles", () => {
    function setupSingles(combinationIds = []) {
      getSingleCombinationIds.mockReturnValueOnce(combinationIds);
      return setupMapStateToProps();
    }

    describe("when there are singles", () => {
      it("should return true", () => {
        const { hasSingles } = setupSingles(["c:1", "c:2"]);

        expect(hasSingles).toBe(true);
      });
    });

    describe("when there are no singles", () => {
      it("should return false", () => {
        const { hasSingles } = setupSingles([]);

        expect(hasSingles).toBe(false);
      });
    });
  });

  describe("hasOnlyOneSingle", () => {
    function setupSingles(combinationIds = []) {
      getSingleCombinationIds.mockReturnValueOnce(combinationIds);
      return setupMapStateToProps();
    }

    describe("when there are two singles", () => {
      it("should return false", () => {
        const { hasOnlyOneSingle } = setupSingles(["c:1", "c:2"]);

        expect(hasOnlyOneSingle).toBe(false);
      });
    });

    describe("when there is one single", () => {
      it("should return true", () => {
        const { hasOnlyOneSingle } = setupSingles(["c:1"]);

        expect(hasOnlyOneSingle).toBe(true);
      });
    });

    describe("when there are no singles", () => {
      it("should return false", () => {
        const { hasOnlyOneSingle } = setupSingles([]);

        expect(hasOnlyOneSingle).toBe(false);
      });
    });
  });

  describe("hasPlaceError", () => {
    describe("when there is an error", () => {
      it("should return true", () => {
        buildSportsbookTransactionalError.mockReturnValue("a");
        const { hasPlaceError } = setupMapStateToProps({});

        expect(hasPlaceError).toEqual(true);
      });
    });

    describe("when there is no error", () => {
      it("should return false", () => {
        buildSportsbookTransactionalError.mockReturnValue(undefined);
        const { hasPlaceError } = setupMapStateToProps({});

        expect(hasPlaceError).toEqual(false);
      });
    });
  });

  describe("hasPriceBoost", () => {
    describe("when there are failed combination group ids", () => {
      it("should return true", () => {
        createGetBoostedUncombinedGroupIdsSelector.mockReturnValueOnce(() => ["failure1", "failure2"]);
        const { hasPriceBoost } = setupMapStateToProps();

        expect(hasPriceBoost).toEqual(true);
      });
    });

    describe("when there are failed boosted combination ids", () => {
      it("should return true", () => {
        createGetBoostedCombinationsSelector.mockReturnValueOnce(() => [{ id: "boosted:1" }, { id: "boosted:2" }]);
        const { hasPriceBoost } = setupMapStateToProps();

        expect(hasPriceBoost).toEqual(true);
      });
    });

    describe("when there are neither", () => {
      it("should return false", () => {
        createGetBoostedUncombinedGroupIdsSelector.mockReturnValueOnce(() => []);
        createGetBoostedCombinationsSelector.mockReturnValueOnce(() => []);

        const { hasPriceBoost } = setupMapStateToProps();

        expect(hasPriceBoost).toEqual(false);
      });
    });
  });

  describe("focusedCard", () => {
    describe("when the throttle STAKE_FOCUS is active", () => {
      it("should select priceBoostMultis", () => {
        createGetBoostedCombinationsSelector.mockReturnValueOnce(() => [{ id: "boosted:1" }]);
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps();
        expect(focusedCard).toEqual(BetslipSection.priceBoostMultis);
      });

      it("should select bbMulti", () => {
        isMultiBetBuilder.mockReturnValueOnce(true);

        getSportsbookBettingState.mockReturnValueOnce({
          legs: {},
          combinations: {
            "SIMPLE:1": { id: "SIMPLE:1" },
          },
        });
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps();

        expect(focusedCard).toEqual(BetslipSection.bbMulti);
      });

      it("should select betBuilders", () => {
        createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => ["betBuilder"]);
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps();

        expect(focusedCard).toEqual(BetslipSection.betBuilders);
      });

      it("should select oneLineMultiple", () => {
        const multipleCombinationsBuilder = jest.fn().mockReturnValueOnce({
          oneLineCombination,
          multiLinesCombinations: [],
        });
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps({
          multipleCombinationsBuilder,
        });

        expect(focusedCard).toEqual(BetslipSection.oneLineMultiple);
      });

      it("should select castBets", () => {
        isCast.mockReturnValueOnce({ isCastBet: true });

        getSportsbookBettingState.mockReturnValueOnce({
          legs: {},
          combinations: {
            "SIMPLE:1": { id: "SIMPLE:1" },
          },
        });
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps();

        expect(focusedCard).toEqual(BetslipSection.castBets);
      });

      it("should select singles", () => {
        getSingleCombinationIds.mockReturnValueOnce(["single:1"]);
        mockThrottles({ stakeFocus: { isActive: true } });

        const { focusedCard } = setupMapStateToProps();

        expect(focusedCard).toEqual(BetslipSection.singles);
      });

      describe("when using ACCORDION layout", () => {
        it("should select the first card in order", () => {
          i18n.mockImplementation(({ key }) => key);
          isMultiBetBuilder.mockReturnValueOnce(true);
          createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => ["betBuilder"]);
          getSportsbookBettingState.mockReturnValueOnce({
            legs: {},
            combinations: {
              "SIMPLE:1": { id: "SIMPLE:1" },
            },
          });
          mockThrottles({ stakeFocus: { isActive: true } });

          const { focusedCard } = setupMapStateToProps();

          expect(focusedCard).toEqual(BetslipSection.bbMulti);
        });

        it("should fallback to singles when has no card", () => {
          getSingleCombinationIds.mockReturnValueOnce(["single:1"]);
          mockThrottles({ stakeFocus: { isActive: true } });

          const { focusedCard } = setupMapStateToProps();

          expect(focusedCard).toEqual(BetslipSection.singles);
        });

        it("should fallback to singles when current tab is undefined and betslipCardsOrder is empty", () => {
          getBetslipCurrentTab.mockReturnValueOnce(undefined);
          mockThrottles({ stakeFocus: { isActive: true } });

          const { betslipCardsOrder, focusedCard } = setupMapStateToProps();

          expect(focusedCard).toEqual(BetslipSection.singles);
          expect(betslipCardsOrder).toEqual([]);
        });
      });
    });

    describe("when the throttle STAKE_FOCUS is not active", () => {
      describe("when only one combination", () => {
        it("should return focusedCard as singles", () => {
          createHasMultiplesSelector().mockReturnValueOnce(false);
          getSingleCombinationIds.mockReturnValueOnce(["c:1"]);
          getSportsbookBettingState.mockReturnValueOnce({
            combinations: {},
            legs: {
              "l:1": { id: "l:1" },
            },
          });
          const { focusedCard } = setupMapStateToProps();

          expect(focusedCard).toEqual(BetslipSection.singles);
        });
      });

      describe("when more than one combination", () => {
        it("should return focusedCard as undefined", () => {
          createHasMultiplesSelector().mockReturnValueOnce(false);
          getSingleCombinationIds.mockReturnValueOnce(["c:1", "c:2"]);
          getSportsbookBettingState.mockReturnValueOnce({
            combinations: {},
            legs: {
              "l:1": { id: "l:1" },
              "l:2": { id: "l:2" },
            },
          });
          const { focusedCard } = setupMapStateToProps();

          expect(focusedCard).toBeUndefined();
        });
      });
    });
  });

  describe("firstCombinationId", () => {
    describe("when combinations is not empty", () => {
      it("should return the first combination id", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {
            "SIMPLE:1": { id: "SIMPLE:1" },
            "SIMPLE:2": { id: "SIMPLE:2" },
          },
        });
        const { firstCombinationId } = setupMapStateToProps({});

        expect(firstCombinationId).toEqual("SIMPLE:1");
      });
    });

    describe("when combinations is empty", () => {
      it("should return undefined", () => {
        getSportsbookBettingState.mockReturnValue({
          legs: {},
          combinations: {},
        });
        const { firstCombinationId } = setupMapStateToProps({});

        expect(firstCombinationId).toEqual(undefined);
      });
    });
  });

  describe("betslipCardsOrder", () => {
    const i18nMockImplementationCallback = ({ key }) => {
      const i18nAnswers = {
        "I18N.BETSLIP.GROUPS.SINGLES": i18nLabelsMock.singlesGroup,
        "I18N.BETSLIP.GROUPS.MULTIPLES": i18nLabelsMock.multiplesGroup,
        "I18N.BETSLIP.GROUPS.PRICE_BOOST": i18nLabelsMock.priceBoostMultis,
        "I18N.BETSLIP.CASTS": i18nLabelsMock.castBetGroup,
      };

      return i18nAnswers[key];
    };

    const defaultContents = { id: i18nLabelsMock.singlesGroup, cardsOrder: [BetslipSection.singles] };

    describe("when it has not only singles cards", () => {
      it("should return singles cards at last position", () => {
        i18n.mockImplementation(i18nMockImplementationCallback);
        getSportsbookBettingState.mockReturnValue({
          combinations: { "C:1": { id: "C:1" } },
          legs: { "L:1": { id: "L:1" } },
        });
        isCast.mockReturnValue({ isCastBet: true });
        getSingleCombinationIds.mockReturnValue(["C:1"]);

        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).toEqual([
          { id: i18nLabelsMock.castBetGroup, cardsOrder: [BetslipSection.castBets] },
          { id: i18nLabelsMock.singlesGroup, cardsOrder: [BetslipSection.singles] },
        ]);
      });
    });

    describe("upsellSuggestions entry", () => {
      it("should include upsellSuggestions entry in first place of betslipCardsOrder when UPSELL_BETSLIP throttle is active and hasBetBuilders is true", () => {
        mockThrottles({ upsell: { isActive: true } });
        createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => ["betBuilder1"]);

        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).toEqual(
          expect.arrayContaining([{ id: "upsellSuggestions", cardsOrder: [BetslipSection.upsellSuggestions] }]),
        );

        expect(betslipCardsOrder[0]).toEqual({
          id: "upsellSuggestions",
          cardsOrder: [BetslipSection.upsellSuggestions],
        });
      });

      it("should not include upsellSuggestions entry when UPSELL_BETSLIP throttle is active but hasBetBuilders is false", () => {
        mockThrottles({ upsell: { isActive: true } });

        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).not.toEqual(
          expect.arrayContaining([{ id: "upsellSuggestions", cardsOrder: [BetslipSection.upsellSuggestions] }]),
        );
      });

      it("should not include upsellSuggestions entry when UPSELL_BETSLIP throttle is not active even if hasBetBuilders is true", () => {
        createGetBetBuilderCombinationIdsSelector.mockReturnValueOnce(() => ["betBuilder1"]);

        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).not.toEqual(
          expect.arrayContaining([{ id: "upsellSuggestions", cardsOrder: [BetslipSection.upsellSuggestions] }]),
        );
      });

      it("should include upsellSuggestions entry when UPSELL_BETSLIP throttle is active and hasMultiBetBuilder is true", () => {
        mockThrottles({ upsell: { isActive: true } });
        getSportsbookBettingState.mockReturnValue({
          combinations: { "C:1": { id: "C:1" } },
          legs: { "L:1": { id: "L:1" } },
        });
        isMultiBetBuilder.mockReturnValue(true);

        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).toEqual(
          expect.arrayContaining([{ id: "upsellSuggestions", cardsOrder: [BetslipSection.upsellSuggestions] }]),
        );

        expect(betslipCardsOrder[0]).toEqual({
          id: "upsellSuggestions",
          cardsOrder: [BetslipSection.upsellSuggestions],
        });
      });

      it("should not include upsellSuggestions entry when UPSELL_BETSLIP throttle is not active", () => {
        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).not.toEqual(
          expect.arrayContaining([{ id: "upsellSuggestions", cardsOrder: [BetslipSection.upsellSuggestions] }]),
        );
      });
    });
  });

  describe("marketSelections", () => {
    it("should return mapped runners from state", () => {
      getSportsbookBettingRunners.mockReturnValue({
        "ppb:runner:1": { selectionId: 111, marketId: "market-1" },
        "ppb:runner:2": { selectionId: 222, marketId: "market-2" },
      });

      const { marketSelections } = setupMapStateToProps();

      expect(marketSelections).toEqual([
        { selectionId: 111, marketId: "market-1" },
        { selectionId: 222, marketId: "market-2" },
      ]);
    });

    it("should return empty array when there are no runners", () => {
      getSportsbookBettingRunners.mockReturnValue({});

      const { marketSelections } = setupMapStateToProps();

      expect(marketSelections).toEqual([]);
    });
  });

  describe("isLoggedIn", () => {
    it("should call getUserDetails", () => {
      setupMapStateToProps();

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    it("should return value from getUserDetails", () => {
      getUserDetails.mockReturnValueOnce({ loggedIn: true });
      const { isLoggedIn } = setupMapStateToProps();

      expect(isLoggedIn).toEqual(true);
    });
  });

  describe("isBetConfirmationStepActive", () => {
    it("should call createIsConfirmStepActive", () => {
      setupMapStateToProps();

      expect(createIsConfirmStepActive).toHaveBeenCalledTimes(1);
    });

    it("should return true when createIsConfirmStepActive returns true", () => {
      const { isBetConfirmationStepActive } = setupMapStateToProps({ isBetConfirmationStepActive: true });

      expect(isBetConfirmationStepActive).toEqual(true);
    });

    it("should return false when createIsConfirmStepActive returns true", () => {
      const { isBetConfirmationStepActive } = setupMapStateToProps({ isBetConfirmationStepActive: false });

      expect(isBetConfirmationStepActive).toEqual(false);
    });
  });

  describe("i18n", () => {
    beforeAll(() => i18n.mockImplementation(({ key, interpolationValues }) => ({ key, interpolationValues })));

    it("should translate all labels", () => {
      const currentMultipleBuilder = jest.fn().mockReturnValue({ numLines: 3 });
      setupMapStateToProps({ currentMultipleBuilder });

      expect(i18n).toHaveBeenCalledTimes(31);

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TOTAL_RETURNS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ADDITIONAL_MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.SINGLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.CASTS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.REMOVE_ALL" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.STAKE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EACHWAY" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BET_BUILDER" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.SKYBETS_RULES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.REMOVE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.OBB.VOID_BLURB" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.ALL" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.BET_BUILDER" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.CAST_BET" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.SINGLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TITLE" });
    });

    it("should return all labels", () => {
      const currentMultipleBuilder = jest.fn().mockReturnValue({ numLines: 3, isAccaInsuranceSelected: true });
      const { i18n: i18nLabels } = setupMapStateToProps({ currentMultipleBuilder });

      expect(i18nLabels).toEqual({
        additionalMultiples: { key: "I18N.BETSLIP.ADDITIONAL_MULTIPLES" },
        balanceAfterBet: { key: "I18N.BETSLIP.BALANCE_AFTER_BET" },
        betBuilder: { key: "I18N.BETSLIP.BET_BUILDER" },
        casts: { key: "I18N.BETSLIP.CASTS" },
        eachWay: { key: "I18N.BETSLIP.EACHWAY" },
        eachWaySubtitle: { key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES" },
        freeBetsAlertRemoveLabel: { key: "I18N.BETSLIP.REMOVE" },
        freeBetsLabel: { key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" },
        multiBetBuilder: { key: "I18N.BETSLIP.BET_BUILDER_MULTIS" },
        multiples: { key: "I18N.BETSLIP.MULTIPLES" },
        oddsLabel: { key: "I18N.BETSLIP.ODDS" },
        oddsMovementDown: { key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" },
        oddsMovementUp: { key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" },
        removeLabel: { key: "I18N.BETSLIP.REMOVE_ALL" },
        singles: { key: "I18N.BETSLIP.SINGLES" },
        stakeLabel: { key: "I18N.BETSLIP.STAKE" },
        termsLabel: { key: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH" },
        termsLinkLabel: { key: "I18N.BETSLIP.SKYBETS_RULES" },
        totalReturns: { key: "I18N.BETSLIP.TOTAL_RETURNS" },
        priceBoosts: { key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" },
        voidBlurbText: { key: "I18N.BETSLIP.OBB.VOID_BLURB" },
        tabAllTitle: { key: "I18N.BETSLIP.TABS.ALL" },
        tabBetBuildersTitle: { key: "I18N.BETSLIP.TABS.BET_BUILDER" },
        tabCastTitle: { key: "I18N.BETSLIP.TABS.CAST_BET" },
        tabMultiplesTitle: { key: "I18N.BETSLIP.TABS.MULTIPLES" },
        tabSinglesTitle: { key: "I18N.BETSLIP.TABS.SINGLES" },
        betslipAriaTitle: { key: "I18N.BETSLIP.TITLE" },
      });
    });

    describe("termsUrl", () => {
      it("should be undefined when endpoint is not set", () => {
        getEndpoint.mockImplementation(() => {
          throw new Error("Some error");
        });
        const { termsUrl } = setupMapStateToProps();
        expect(termsUrl).toBe(undefined);
      });

      it("should be a string when endpoint is set", () => {
        getEndpoint.mockImplementation(() => "generic_terms_endpoint");
        const { termsUrl } = setupMapStateToProps();
        expect(termsUrl).toBe("generic_terms_endpoint");
      });
    });
  });

  describe("placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels", () => {
    it("should call buildSbkPlaceBetButtonLabels with the correct props", () => {
      getUserDetails.mockReturnValueOnce({ loggedIn: true });
      getSingleCombinationIds.mockReturnValueOnce(["c:1"]);
      createGetSbkIsDepositRequiredSelector.mockReturnValueOnce(() => true);
      getSportsbookBettingState.mockReturnValueOnce({
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        totalOriginalPotentialReturns: 9,
        combinations: {
          "COMB:1": {
            id: "COMB:1",
            totalCombinedStake: 1,
            isPriceBoostSelected: true,
            legs: ["LEG:1"],
          },
        },
        legs: { "LEG:1": { runners: ["R:1"] } },
      });

      const appState = APP_STATE;

      const { placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels } =
        setupMapStateToProps({
          appState,
          oddsMovementBuilder: jest.fn(() => ({
            selection1: { id: "COMB:1", movement: "up" },
          })),
        });

      const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector();
      expect(getAreAllCombinationsClosedOrSuspended).toHaveBeenCalledWith(appState);

      expect(buildSbkPlaceBetButtonLabels).toHaveBeenCalledWith({
        hasGenerosityWallets: undefined,
        hasGenerosityTokens: undefined,
        hasOddsChanged: true,
        hasStake: true,
        interpolatedValues: {
          odds: "formattedOdds",
          stake: "formatted value",
        },
        isAuthenticating: undefined,
        isDepositRequired: true,
        isSuspended: false,
        isLoggedIn: true,
        isPlacing: false,
        shouldAcceptOddsMovement: false,
      });

      expect(placeBtnLabel).toBe("placeButtonLabel");
      expect(placeBtnSecondaryLabel).toBe("placeButtonSecondaryLabel");
      expect(placeBtnLoadingLabel).toBe("placeButtonLoadingLabel");
      expect(reversePlaceBtnLabels).toBe("placeButtonReverseLabels");
    });
  });

  describe("collapse strategy", () => {
    describe("when not defined", () => {
      it("should return correct collapse strategy", () => {
        const { collapseStrategy } = setupMapStateToProps();

        expect(collapseStrategy).toBe(BetslipCollapseStrategy.AllOpen);
      });
    });
    describe("when is FIRST_OPEN", () => {
      it("should return correct collapse strategy", () => {
        getBetslipConfig.mockReturnValueOnce({ collapseStrategy: "FIRST_OPEN" });
        const { collapseStrategy } = setupMapStateToProps();

        expect(collapseStrategy).toBe(BetslipCollapseStrategy.FirstOpen);
      });
    });
    describe("when is ALL_OPEN", () => {
      it("should return correct collapse strategy", () => {
        getBetslipConfig.mockReturnValueOnce({ collapseStrategy: "ALL_OPEN" });
        const { collapseStrategy } = setupMapStateToProps();

        expect(collapseStrategy).toBe(BetslipCollapseStrategy.AllOpen);
      });
    });
  });

  describe("failedCombinationGroups", () => {
    describe("when some combinations group has failures", () => {
      it("should return the failed combinations group", () => {
        createCombinationGroupFailuresSelector.mockReturnValueOnce(() => ["failure1", "failure2"]);
        const { failedCombinationGroups } = setupMapStateToProps();

        expect(failedCombinationGroups).toEqual(["failure1", "failure2"]);
      });
    });

    describe("when any combinations group with failures was found", () => {
      it("should return an empty array", () => {
        createCombinationGroupFailuresSelector.mockReturnValueOnce(() => []);
        const { failedCombinationGroups } = setupMapStateToProps();

        expect(failedCombinationGroups).toEqual([]);
      });
    });
  });

  describe("failedCombinationGroupIds", () => {
    describe("when some combinations group id are uncombined", () => {
      it("should return the uncombined combinations group", () => {
        createGetBoostedUncombinedGroupIdsSelector.mockReturnValueOnce(() => ["failure1", "failure2"]);
        const { failedCombinationGroupIds } = setupMapStateToProps();

        expect(failedCombinationGroupIds).toEqual(["failure1", "failure2"]);
      });
    });

    describe("when any combinations group with failures was found", () => {
      it("should return an empty array", () => {
        createGetBoostedUncombinedGroupIdsSelector.mockReturnValueOnce(() => []);
        const { failedCombinationGroupIds } = setupMapStateToProps();

        expect(failedCombinationGroupIds).toEqual([]);
      });
    });
  });

  describe("freeBetsAlertMessage", () => {
    describe("when hasGenerosityWallets is false", () => {
      it("should return undefined", () => {
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.freeBetsAlertMessage).toBeUndefined();
      });
    });

    describe("when hasGenerosityWallets is true", () => {
      let mappedProps;

      beforeEach(() => {
        getUserDetails.mockReturnValueOnce("userDetailsMock");

        mappedProps = setupMapStateToProps({
          appState: {
            betting: {
              sportsbookBetting: {},
            },
            betslip: {
              hasGenerosityWallets: true,
              sportsbookOddsMovement: {},
            },
            entities: {
              throttles: {},
            },
          },
          combinations: {
            "COMB:1": { legs: ["LEG:1"], id: "COMB:1" },
            "COMB:2": { legs: ["LEG:1"], id: "COMB:2" },
          },
        });
      });

      it("should call buildFreeBetsAlertMessage", () => {
        expect(sumWalletsAmounts).toHaveBeenCalledWith(0, 10);
        expect(buildFreeBetsAlertMessage).toHaveBeenCalledWith({
          combinationAmount: 10,
          userDetails: "userDetailsMock",
        });
      });

      it("should return the correct message", () => {
        expect(mappedProps.freeBetsAlertMessage).toEqual("free bets alert message mock");
      });
    });
  });

  describe("balanceAfterBet", () => {
    it("should return the expected value", () => {
      const userDetailsMock = { loggedIn: true };
      getUserDetails.mockReturnValueOnce(userDetailsMock);

      getSportsbookBettingState.mockReturnValue({
        legs: {},
        isBonusSelected: true,
        totalStake: 100,
        combinations: {},
      });

      const mappedProps = setupMapStateToProps({
        appState: {
          betting: {
            sportsbookBetting: {
              isBonusSelected: true,
              totalStake: 100,
            },
          },
          betslip: {
            hasGenerosityWallets: true,
            sportsbookOddsMovement: {},
          },
          entities: {
            throttles: {},
          },
        },
        combinations: {},
      });

      expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(userDetailsMock, {
        accountBalance: 200,
        totalStake: 100,
        isOldUseBonusActive: true,
        isLoggedIn: true,
      });

      expect(mappedProps.balanceAfterBet).toBe("100 €");
    });
  });

  describe("quickStakes", () => {
    it("should return correct quickStakes", () => {
      const mappedProps = setupMapStateToProps();

      expect(mappedProps.quickStakes).toEqual([{ qs: "qs" }]);
    });
  });

  describe("currencySymbol", () => {
    it("should return the getCurrencySymbol output", () => {
      getCurrencySymbol.mockReturnValue("€");
      const mappedProps = setupMapStateToProps();

      expect(mappedProps.currencySymbol).toEqual("€");
    });
  });

  describe("separator", () => {
    it("should call getSeparatorByLocale with the user locale", () => {
      getUserDetails.mockReturnValueOnce({ localeCode: "en-GB", jurisdiction: { jurisdiction: "INTERNATIONAL" } });

      setupMapStateToProps();

      expect(getSeparatorByLocale).toHaveBeenCalledTimes(1);
      expect(getSeparatorByLocale).toHaveBeenCalledWith("en-GB");
    });

    describe("when getSeparatorByLocale returns dot separator", () => {
      it("should return the separator as dot", () => {
        getSeparatorByLocale.mockReturnValueOnce(KeyboardSeparator.Dot);

        const mappedProps = setupMapStateToProps();

        expect(mappedProps.separator).toEqual(KeyboardSeparator.Dot);
      });
    });

    describe("when getSeparatorByLocale returns comma separator", () => {
      it("should return the separator as comma", () => {
        getSeparatorByLocale.mockReturnValueOnce(KeyboardSeparator.Comma);

        const mappedProps = setupMapStateToProps();

        expect(mappedProps.separator).toEqual(KeyboardSeparator.Comma);
      });
    });
  });

  describe("shouldFocusMultiple", () => {
    describe("when TABBED_BETSLIP_AUTO_FOCUS is active", () => {
      it("should return true when a oneLineMultiple exists and there are no price boosts", () => {
        const multipleCombinationsBuilder = jest.fn().mockReturnValue({ oneLineCombination });
        createGetBoostedCombinationsSelector.mockReturnValue(() => []);
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusMultiple } = setupMapStateToProps({
          multipleCombinationsBuilder,
        });

        expect(shouldFocusMultiple).toBe(true);
      });

      it("should return true when NO oneLineMultiple exists but there is EXACTLY one price boost", () => {
        const multipleCombinationsBuilder = jest.fn().mockReturnValue({
          oneLineCombination: undefined,
          multiLinesCombinations: [],
        });

        const boostedCombinations = [{ id: "boosted:1" }];
        const getBoostedCombinations = jest.fn().mockReturnValue(boostedCombinations);
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusMultiple } = setupMapStateToProps({
          multipleCombinationsBuilder,
          getBoostedCombinations,
        });

        expect(shouldFocusMultiple).toBe(true);
      });

      it("should return false when there are multiple price boosts", () => {
        createGetBoostedCombinationsSelector.mockReturnValue(() => [{ id: "boosted:1" }, { id: "boosted:2" }]);
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusMultiple } = setupMapStateToProps({
          appState: APP_STATE,
        });

        expect(shouldFocusMultiple).toBe(false);
      });
    });

    describe("when TABBED_BETSLIP_AUTO_FOCUS is not active", () => {
      it("should return false even if conditions for focusing are met", () => {
        createGetBoostedCombinationsSelector.mockReturnValue(() => [{ id: "boosted:1" }]);
        mockThrottles({ tabbedAutoFocus: { isActive: false } });

        const { shouldFocusMultiple } = setupMapStateToProps({
          appState: APP_STATE,
        });

        expect(shouldFocusMultiple).toBe(false);
      });
    });
  });
  describe("oddsMovementLabels", () => {
    describe("when oddsMovement is undefined and user has not changed preference", () => {
      it("should return accept odds movement labels", () => {
        const oddsMovementBuilder = jest.fn(() => ({}));

        const { oddsMovementLabels } = setupMapStateToProps({
          oddsMovementBuilder,
        });

        expect(oddsMovementLabels).toEqual({
          message: { key: "I18N.BETSLIP.ODDS_MOVEMENT" },
          detailMessage: { key: "I18N.BETSLIP.ODDS_MOVEMENT_DESCRIPTION" },
        });
      });
    });

    describe("when oddsMovement is enabled", () => {
      it("should return odds movement on labels", () => {
        const oddsMovementBuilder = jest.fn(() => ({}));

        const { oddsMovementLabels } = setupMapStateToProps({
          oddsMovementBuilder,
          appState: {
            ...APP_STATE,
            betslip: {
              ...APP_STATE.betslip,
              hasUserChangedOddsMovementPreference: true,
            },
          },
        });

        expect(oddsMovementLabels).toBeDefined();
      });
    });

    describe("when oddsMovement is disabled and user has changed preference", () => {
      it("should return odds movement off labels", () => {
        const oddsMovementBuilder = jest.fn(() => ({}));

        const { oddsMovementLabels } = setupMapStateToProps({
          oddsMovementBuilder,
          appState: {
            ...APP_STATE,
            betslip: {
              ...APP_STATE.betslip,
              hasUserChangedOddsMovementPreference: true,
            },
          },
        });

        expect(oddsMovementLabels).toEqual({
          message: { key: "I18N.BETSLIP.ODDS_MOVEMENT_OFF" },
          detailMessage: { key: "I18N.BETSLIP.ODDS_MOVEMENT_OFF_DESCRIPTION" },
        });
      });
    });
  });

  describe("showAcceptOddsMovementAlert", () => {
    describe("when ODDS_MOVEMENT_ALERT_SWITCH is not active", () => {
      it("should return false even when there is a REQUESTED_PRICE_NOT_AVAILABLE failure", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce([RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(false);
      });

      it("should return false when there are no runner failures", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce([]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(false);
      });
    });

    describe("when ODDS_MOVEMENT_ALERT_SWITCH is active", () => {
      beforeEach(() => {
        mockThrottles({ oddsMovementAlert: { isActive: true } });
      });

      it("should return true when uniqueRunnersFailures includes REQUESTED_PRICE_NOT_AVAILABLE", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce([RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(true);
      });

      it("should return true when REQUESTED_PRICE_NOT_AVAILABLE is one of multiple failures", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce([
          "SOME_OTHER_FAILURE",
          RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE,
        ]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(true);
      });

      it("should return false when uniqueRunnersFailures does not include REQUESTED_PRICE_NOT_AVAILABLE", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce(["SOME_OTHER_FAILURE"]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(false);
      });

      it("should return false when uniqueRunnersFailures is empty", () => {
        getAllUniqueRunnersFailures.mockReturnValueOnce([]);

        const { showAcceptOddsMovementAlert } = setupMapStateToProps();

        expect(showAcceptOddsMovementAlert).toBe(false);
      });
    });
  });

  describe("shouldFocusBetBuilder", () => {
    describe("when TABBED_BETSLIP_AUTO_FOCUS is active", () => {
      it("should return true when there is exactly one bet builder and no multi bet builder", () => {
        const betBuilderIds = ["bb:1"];
        createGetBetBuilderCombinationIdsSelector.mockReturnValue(() => betBuilderIds);
        isMultiBetBuilder.mockReturnValue(false);

        getSportsbookBettingState.mockReturnValue({
          combinations: {},
          legs: {},
        });
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusBetBuilder } = setupMapStateToProps();

        expect(shouldFocusBetBuilder).toBe(true);
      });

      it("should return false when there are multiple bet builders", () => {
        const betBuilderIds = ["bb:1", "bb:2"];
        createGetBetBuilderCombinationIdsSelector.mockReturnValue(() => betBuilderIds);
        isMultiBetBuilder.mockReturnValue(false);

        getSportsbookBettingState.mockReturnValue({
          combinations: {},
          legs: {},
        });
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusBetBuilder } = setupMapStateToProps();

        expect(shouldFocusBetBuilder).toBe(false);
      });

      it("should return false when there is a multi bet builder", () => {
        const betBuilderIds = ["bb:1"];
        createGetBetBuilderCombinationIdsSelector.mockReturnValue(() => betBuilderIds);
        isMultiBetBuilder.mockReturnValue(true);

        getSportsbookBettingState.mockReturnValue({
          combinations: { "combo:1": { id: "combo:1" } },
          legs: {},
        });
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusBetBuilder } = setupMapStateToProps();

        expect(shouldFocusBetBuilder).toBe(false);
      });

      it("should return false when there are no bet builders", () => {
        createGetBetBuilderCombinationIdsSelector.mockReturnValue(() => []);
        createCombinationGroupFailuresSelector.mockReturnValue(() => []);
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusBetBuilder } = setupMapStateToProps();

        expect(shouldFocusBetBuilder).toBe(false);
      });
    });

    describe("when TABBED_BETSLIP_AUTO_FOCUS is not active", () => {
      it("should return false even if conditions for focusing are met", () => {
        const betBuilderIds = ["bb:1"];
        createGetBetBuilderCombinationIdsSelector.mockReturnValue(() => betBuilderIds);
        isMultiBetBuilder.mockReturnValue(false);

        getSportsbookBettingState.mockReturnValue({
          combinations: {},
          legs: {},
        });
        mockThrottles({ tabbedAutoFocus: { isActive: false } });

        const { shouldFocusBetBuilder } = setupMapStateToProps();

        expect(shouldFocusBetBuilder).toBe(false);
      });
    });
  });

  describe("shouldFocusCastBet", () => {
    describe("when TABBED_BETSLIP_AUTO_FOCUS is active", () => {
      it("should return true when there is exactly one cast group and has cast bets", () => {
        isCast.mockReturnValue({ isCastBet: true });
        getSportsbookBettingState.mockReturnValue({
          combinations: { "C:1": { id: "C:1" } },
          legs: { "L:1": { id: "L:1" } },
        });
        createGetCastGroupIdsSelector.mockReturnValueOnce(jest.fn().mockReturnValue(["CAST_GROUP:1"]));
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusCastBet } = setupMapStateToProps();

        expect(shouldFocusCastBet).toBe(true);
      });

      it("should return false when there are multiple cast groups", () => {
        isCast.mockReturnValue({ isCastBet: true });
        getSportsbookBettingState.mockReturnValue({
          combinations: { "C:1": { id: "C:1" } },
          legs: { "L:1": { id: "L:1" } },
        });
        createGetCastGroupIdsSelector.mockReturnValueOnce(jest.fn().mockReturnValue(["CAST_GROUP:1", "CAST_GROUP:2"]));
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusCastBet } = setupMapStateToProps();

        expect(shouldFocusCastBet).toBe(false);
      });

      it("should return false when there are no cast bets", () => {
        isCast.mockReturnValue(undefined);
        getSportsbookBettingState.mockReturnValue({ combinations: {}, legs: {} });
        createGetCastGroupIdsSelector.mockReturnValueOnce(jest.fn().mockReturnValue([]));
        mockThrottles({ tabbedAutoFocus: { isActive: true } });

        const { shouldFocusCastBet } = setupMapStateToProps();

        expect(shouldFocusCastBet).toBe(false);
      });
    });

    describe("when TABBED_BETSLIP_AUTO_FOCUS is not active", () => {
      it("should return false even if conditions are met", () => {
        isCast.mockReturnValue({ isCastBet: true });
        getSportsbookBettingState.mockReturnValue({
          combinations: { "C:1": { id: "C:1" } },
          legs: { "L:1": { id: "L:1" } },
        });
        createGetCastGroupIdsSelector.mockReturnValueOnce(jest.fn().mockReturnValue(["CAST_GROUP:1"]));
        mockThrottles({ tabbedAutoFocus: { isActive: false } });

        const { shouldFocusCastBet } = setupMapStateToProps();

        expect(shouldFocusCastBet).toBe(false);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("should map dispatchSelectionRemove", () => {
      const { dispatchSelectionRemove } = mapDispatchToProps(jest.fn());

      expect(dispatchSelectionRemove).toBeDefined();
    });

    it("should map dispatchPlacement", () => {
      const { dispatchPlacement } = mapDispatchToProps(jest.fn());

      expect(dispatchPlacement).toBeDefined();
    });

    it("should map dispatchRemoveAll", () => {
      const { dispatchRemoveAll } = mapDispatchToProps(jest.fn());

      expect(dispatchRemoveAll).toBeDefined();
    });

    it("should map dispatchAccordionToggle", () => {
      const { dispatchAccordionToggle } = mapDispatchToProps(jest.fn());

      expect(dispatchAccordionToggle).toBeDefined();
    });

    it("should map dispatchTabSwitch", () => {
      const { dispatchTabSwitch } = mapDispatchToProps(jest.fn());

      expect(dispatchTabSwitch).toBeDefined();
    });

    it("should map dispatchSportsbookBonusToggle", () => {
      const { dispatchSportsbookBonusToggle } = mapDispatchToProps(jest.fn());

      expect(dispatchSportsbookBonusToggle).toBeDefined();
    });

    it("should map dispatchLogin", () => {
      const { dispatchLogin } = mapDispatchToProps(jest.fn());

      expect(dispatchLogin).toBeDefined();
    });

    it("should map dispatchConfirmBet", () => {
      const { dispatchConfirmBet } = mapDispatchToProps(jest.fn());

      expect(dispatchConfirmBet).toBeDefined();
    });

    it("should map dispatchDepositRedirect", () => {
      const { dispatchDepositRedirect } = mapDispatchToProps(jest.fn());

      expect(dispatchDepositRedirect).toBeDefined();
    });

    it("should map dispatchOddsMovementChange", () => {
      const { dispatchOddsMovementChange } = mapDispatchToProps(jest.fn());

      expect(dispatchOddsMovementChange).toBeDefined();
    });

    describe("dispatchSelectionRemove", () => {
      it("should dispatch a betting remove selection action when dispatchSelectionRemove is called", () => {
        const dispatch = jest.fn();
        const { dispatchSelectionRemove } = mapDispatchToProps(dispatch);

        dispatchSelectionRemove({ legId: "COMB:1" });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: { legId: "COMB:1" },
        });
      });

      it("should dispatch a UI remove selection when dispatchSelectionRemove is called", () => {
        const dispatch = jest.fn();
        const { dispatchSelectionRemove } = mapDispatchToProps(dispatch);

        dispatchSelectionRemove({ legId: "COMB:1" });

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
          payload: { legId: "COMB:1" },
        });
      });
    });

    describe("dispatchPlacement", () => {
      it("should dispatch a BetslipSportsbookPlaceBetsClick action", () => {
        const dispatch = jest.fn();
        const { dispatchPlacement } = mapDispatchToProps(dispatch);

        dispatchPlacement();

        expect(dispatch).toHaveBeenCalledWith({ type: UI__BETSLIP_SBK_PLACE_BETS_CLICK });
      });

      it("should dispatch a BettingSportsbookPlaceBetsAction action", () => {
        const dispatch = jest.fn();
        const { dispatchPlacement } = mapDispatchToProps(dispatch);

        dispatchPlacement();

        expect(dispatch).toHaveBeenCalledWith({ type: BETTING__SBK_PLACE_BETS });
      });
    });

    describe("dispatchRemoveAll", () => {
      it("should dispatch a UI remove all when dispatchRemoveAll is called", () => {
        const dispatch = jest.fn();
        const { dispatchRemoveAll } = mapDispatchToProps(dispatch);

        dispatchRemoveAll();

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_REMOVE_SELECTIONS,
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_CLEAR_ACTION,
        });
      });
    });

    describe("dispatchAccordionToggle", () => {
      it("should dispatch a betslip accordion header click when dispatchAccordionToggle is called", () => {
        const dispatch = jest.fn();
        const { dispatchAccordionToggle } = mapDispatchToProps(dispatch);

        dispatchAccordionToggle(true);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
          payload: { isExpanded: true },
        });
      });
    });

    describe("dispatchSportsbookBonusToggle", () => {
      it("should dispatch a bonus toggle action when dispatchSportsbookBonusToggle is called", () => {
        const dispatch = jest.fn();
        const { dispatchSportsbookBonusToggle } = mapDispatchToProps(dispatch);

        dispatchSportsbookBonusToggle(true);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_BONUS_TOGGLE_ACTION,
          payload: {
            isFreeBetsSelected: false,
            product: Product.Sportsbook,
          },
        });
      });
    });

    describe("dispatchLogin", () => {
      it("should dispatch an external push action when dispatchLogin is called", () => {
        const dispatch = jest.fn();
        const { dispatchLogin } = mapDispatchToProps(dispatch);

        dispatchLogin("someUrl");

        expect(dispatch).toHaveBeenCalledWith({
          type: EXTERNAL_PUSH,
          payload: {
            viewUrn: "",
            viewUrl: "someUrl",
          },
        });
      });
    });

    describe("dispatchConfirmBet", () => {
      it("should dispatch a BetslipSportsbookPlaceBetsClick action", () => {
        const dispatch = jest.fn();
        const { dispatchConfirmBet } = mapDispatchToProps(dispatch);

        dispatchConfirmBet();

        expect(dispatch).toHaveBeenNthCalledWith(1, { type: UI__BETSLIP_SBK_PLACE_BETS_CLICK });
      });

      it("should dispatch a BettingSportsbookConfirmBetsAction action", () => {
        const dispatch = jest.fn();
        const { dispatchConfirmBet } = mapDispatchToProps(dispatch);

        dispatchConfirmBet();

        expect(dispatch).toHaveBeenNthCalledWith(2, { type: BETTING__SBK_CONFIRM_BETS });
      });
    });

    describe("dispatchDepositRedirect", () => {
      it("should dispatch a BetslipSportsbookDepositToPlaceBetClick action", () => {
        const dispatch = jest.fn();
        const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

        dispatchDepositRedirect();

        expect(dispatch).toHaveBeenNthCalledWith(1, { type: UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK });
      });

      it("should dispatch a BettingDepositToPlaceBetAction action", () => {
        const dispatch = jest.fn();
        const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

        dispatchDepositRedirect();

        expect(dispatch).toHaveBeenNthCalledWith(2, { type: BETTING__DEPOSIT_TO_PLACE_BET });
      });
    });

    describe("dispatchNavigate", () => {
      it("should dispatch a PushAction action", () => {
        const dispatch = jest.fn();
        const { dispatchNavigate } = mapDispatchToProps(dispatch);

        dispatchNavigate("viewUrn", "viewUrl");

        expect(dispatch).toHaveBeenCalledWith({
          type: PUSH,
          payload: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
        });
      });
    });

    describe("dispatchLoginToPlaceBetAction", () => {
      it("should dispatch a BetslipSportsbookLoginToPlaceBetClickAction action", () => {
        const dispatch = jest.fn();
        const { dispatchLoginToPlaceBetAction } = mapDispatchToProps(dispatch);

        dispatchLoginToPlaceBetAction();

        expect(dispatch).toHaveBeenCalledWith({ type: UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK });
      });
    });

    describe("dispatchFreeBetsRemoveAction", () => {
      it("should dispatch a BettingSportsbookRemoveAllWalletsAction action", () => {
        const dispatch = jest.fn();
        const { dispatchFreeBetsRemoveAction } = mapDispatchToProps(dispatch);

        dispatchFreeBetsRemoveAction();

        expect(dispatch).toHaveBeenCalledWith({ type: BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION });
      });
    });

    describe("dispatchIncrementPress", () => {
      it("should dispatch a BettingSportsbookIncrementStake action", () => {
        const dispatch = jest.fn();
        const { dispatchIncrementPress } = mapDispatchToProps(dispatch);

        dispatchIncrementPress("id", 10, "£");

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_INCREMENT_STAKE_ACTION,
          payload: { combinationId: "id", increment: 10 },
        });
      });

      it("should dispatch a UI BetslipSportsbookIncrementStake action", () => {
        const dispatch = jest.fn();
        const { dispatchIncrementPress } = mapDispatchToProps(dispatch);

        dispatchIncrementPress("id", 10, "£");

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
          payload: { increment: 10, currencySymbol: "£" },
        });
      });
    });
    describe("dispatchOddsMovementChange", () => {
      describe("when updated to 'true'", () => {
        it("should dispatch action with payload", () => {
          const dispatch = jest.fn();
          const { dispatchOddsMovementChange } = mapDispatchToProps(dispatch);

          dispatchOddsMovementChange(true);

          expect(dispatch).toHaveBeenCalledWith({
            type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
            payload: { isOddsMovementAccepted: true },
          });
        });
      });

      describe("when updated to 'false'", () => {
        it("should dispatch action with payload", () => {
          const dispatch = jest.fn();
          const { dispatchOddsMovementChange } = mapDispatchToProps(dispatch);

          dispatchOddsMovementChange(false);

          expect(dispatch).toHaveBeenCalledWith({
            type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
            payload: { isOddsMovementAccepted: false },
          });
        });
      });
    });
  });
});
