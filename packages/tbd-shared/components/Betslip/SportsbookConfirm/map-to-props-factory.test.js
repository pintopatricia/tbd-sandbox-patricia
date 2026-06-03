import { VALIDATION_TYPES } from "@ppb/betslip-core";
import {
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_CONFIRM_BETS_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_EDIT_BETS_CLICK,
  UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_EDIT_BETS,
} from "@ppb/tbd-store/actions/betting";
import { EXTERNAL_PUSH, PUSH } from "@ppb/tbd-store/actions/router";
import { getSportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSportsbookConfirmation,
  getBetslipCard,
  getSportsbookConfirmationAvailability,
  createGetBetBuilderConfirmationCombinationIdsSelector,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  isCast,
  isMultiBetBuilder,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { SportsbookPlacePanelContentLayout } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetslipSection } from "../Betslip.types";
import { i18n } from "../../../helpers/i18n";
import { buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";
import {
  buildSportsbookTransactionalError,
  createAreAllCombinationsClosedOrSuspendedSelector,
} from "../connected-sportsbook-betslip-mapper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createGetSbkIsDepositRequiredSelector } from "../betslip-mapper";
import { createValidationsSelector } from "../Notifier/notifier-mapper";
import { createGetConfirmationMultipleCombinations } from "../sportsbook-betslip-confirm-mapper";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { buildFreeBetsAlertMessage, sumWalletsAmounts } from "../../../helpers/generosity-wallets";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({}),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmation: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationAvailability: jest.fn().mockReturnValue({}),
  createGetBetBuilderConfirmationCombinationIdsSelector: jest.fn().mockReturnValue(jest.fn(() => [])),
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn().mockReturnValue({ combinations: {} }),
  createGetCombinationsSelectedWalletsAmounts: jest.fn().mockReturnValue(
    jest.fn().mockReturnValue({
      "COMB:1": {
        numLines: 2,
        combinationAmountPerLine: 5,
        combinationAmount: 10,
      },
    }),
  ),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => () => 200),
}));

jest.mock("../../../helpers/betslip-balance-helper", () => ({
  buildSbkBalanceAfterBetLabel: jest.fn(() => "100 €"),
}));

jest.mock("../../../helpers/betslip-place-button-helper", () => ({
  buildSbkPlaceBetButtonLabels: jest.fn().mockReturnValue({
    label: "placeButtonLabel",
    secondaryLabel: "placeButtonSecondaryLabel",
    loadingLabel: "placeButtonLoadingLabel",
    reverseLabels: "placeButtonReverseLabels",
  }),
}));

jest.mock("../../../helpers/generosity-wallets", () => ({
  buildFreeBetsAlertMessage: jest.fn().mockReturnValue("free bets alert message mock"),
  sumWalletsAmounts: jest.fn((a = 0, b = 0) => a + b),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue({ combinations: {} }),
}));

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  isCast: jest.fn(),
  isMultiBetBuilder: jest.fn(),
  hasAnyMarketClosedFailure: jest.fn(),
  hasAnyMarketSuspendedFailure: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      sportsbookOddsDisplay: "sportsbookOddsDisplay",
      oddsMovement: true,
    }),
  ),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("currencyFormatWithDecimalPlaces"),
}));

jest.mock("../betslip-formatters", () => ({
  buildPotentialReturns: jest.fn().mockReturnValue("potentialReturns"),
  buildTotalOriginalReturns: jest.fn().mockReturnValue("totalOriginalReturns"),
}));

jest.mock("@ppb/the-wall-web/types", () => ({
  AlertType: {
    Warning: "WARNING",
  },
}));

jest.mock("../Notifier/notifier-mapper", () => ({
  createValidationsSelector: jest.fn().mockReturnValue(() => []),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createGetConfirmationMultipleCombinations: jest.fn().mockReturnValue(() => ({})),
}));

jest.mock("../betslip-mapper", () => ({
  createGetSbkIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => {
  const getAreAllCombinationsClosedOrSuspended = jest.fn().mockReturnValue(false);

  return {
    buildSportsbookTransactionalError: jest.fn(),
    createAreAllCombinationsClosedOrSuspendedSelector: () => getAreAllCombinationsClosedOrSuspended,
  };
});

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const APP_STATE = {
  betslip: {
    sportsbookOddsMovement: {},
    sportsbookHandicapMovement: {},
    hasGenerosityWallets: false,
    hasGenerosityTokens: false,
  },
  entities: {
    throttles: {},
  },
};

const i18nLabelsMock = {
  singlesGroup: "I18N.BETSLIP.GROUPS.SINGLES",
  multiplesGroup: "I18N.BETSLIP.GROUPS.MULTIPLES",
  castBetGroup: "I18N.BETSLIP.CASTS",
};

const BET_BUILDER_1 = {
  id: "BET_BUILDER_1",
  stake: 5,
  totalCombinedStake: 5,
  isPriceBoostSelected: false,
};

const BET_BUILDER_2 = {
  id: "BET_BUILDER_2",
  stake: 8,
  totalCombinedStake: 8,
  isPriceBoostSelected: false,
};

const BET_BUILDER_3 = {
  id: "BET_BUILDER_3",
  stake: 15,
  isPriceBoostSelected: false,
};

const ignoredBetsMock = [{ id: "BET_BUILDER_2" }, { id: "BET_BUILDER_3" }];

const legsMock = {
  LEG1: {
    id: "1",
    legType: "SIMPLE_SELECTION",
    runners: ["RUNNER1"],
  },
};

const sportsbookConfirmationMock = {
  combinations: {
    BET_BUILDER_1,
    BET_BUILDER_2,
    BET_BUILDER_3,
  },
  ignoredbets: ignoredBetsMock,
  legs: legsMock,
  failures: {},
};

const sportsbookBettingStateMock = {
  ...sportsbookConfirmationMock,
};

const betBuilderCombinationIdsSelectorMock = ["BET_BUILDER_1", "BET_BUILDER_2", "BET_BUILDER_3"];

const setupMapStateToProps = ({
  appState = APP_STATE,
  sportsbookBettingState = { combinations: {} },
  sportsbookConfirmation = { combinations: {} },
  userDetails = {},
  multipleCombinationsBuilder = jest.fn(() => []),
  validationsBuilder = jest.fn(() => []),
  oddsMovementBuilder = jest.fn(() => []),
  getSbkIsDepositRequiredBuilder = jest.fn(),
  availabilityChanged = false,
} = {}) => {
  getSportsbookBettingState.mockReturnValue(sportsbookBettingState);
  getSportsbookConfirmation.mockReturnValue(sportsbookConfirmation);
  getUserDetails.mockReturnValue(userDetails);
  createValidationsSelector.mockReturnValue(validationsBuilder);
  createOddsMovementSelector.mockReturnValue(oddsMovementBuilder);
  createGetConfirmationMultipleCombinations.mockReturnValue(multipleCombinationsBuilder);
  createGetSbkIsDepositRequiredSelector.mockReturnValue(getSbkIsDepositRequiredBuilder);
  getSportsbookConfirmationAvailability.mockReturnValue(availabilityChanged);

  return makeMapStateToProps()(appState);
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

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

  describe("when betslip state does not exists", () => {
    it("should return an empty object", () => {
      const props = setupMapStateToProps({ appState: { betslip: undefined } });

      expect(props).toEqual({});
    });
  });

  describe("isLoggedIn", () => {
    it("should call getUserDetails", () => {
      setupMapStateToProps();

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    it("should return value from getUserDetails", () => {
      const userDetails = { loggedIn: true };
      const { isLoggedIn } = setupMapStateToProps({ userDetails });

      expect(isLoggedIn).toEqual(true);
    });
  });

  describe("isDepositRequired", () => {
    describe("when it requires the deposit", () => {
      it("should return isDepositRequired as true", () => {
        const getSbkIsDepositRequiredBuilder = () => true;
        const { isDepositRequired } = setupMapStateToProps({ getSbkIsDepositRequiredBuilder });

        expect(isDepositRequired).toEqual(true);
      });
    });

    describe("when it does not require the deposit", () => {
      it("should return isDepositRequired as false", () => {
        const getSbkIsDepositRequiredBuilder = () => false;
        const { isDepositRequired } = setupMapStateToProps({ getSbkIsDepositRequiredBuilder });

        expect(isDepositRequired).toEqual(false);
      });
    });
  });

  describe("betsWithTotalCombinedStake", () => {
    it("should evaluate and return the bets with totalCombinedStake", () => {
      const sportsbookConfirmation = {
        combinations: {
          BET1: {
            id: "1",
            stake: 5,
            totalCombinedStake: 5,
            isPriceBoostSelected: true,
            isSgmMultiple: true,
          },
        },
        ignoredBets: [{ id: "BET2" }, { id: "BET3" }],
        failures: {},
      };
      isMultiBetBuilder.mockReturnValue(true);

      const { betsWithTotalCombinedStake } = setupMapStateToProps({ sportsbookConfirmation });

      expect(betsWithTotalCombinedStake).toEqual({
        [BetslipSection.bbMulti]: true,
        [BetslipSection.betBuilders]: false,
        [BetslipSection.oneLineMultiple]: false,
        [BetslipSection.multiLinesMultiples]: false,
        [BetslipSection.castBets]: false,
        [BetslipSection.singles]: false,
      });
    });

    describe("singles", () => {
      const setup = ({ type = "SINGLE", stake = 5, totalCombinedStake = 5, isCastBet = false } = {}) => {
        const sportsbookConfirmation = {
          combinations: {
            BET1: {
              id: "1",
              stake,
              totalCombinedStake,
              isPriceBoostSelected: true,
              betType: type,
              isSgmMultiple: true,
            },
          },
        };

        isCast.mockReturnValue(isCastBet);

        return setupMapStateToProps({ sportsbookConfirmation });
      };

      it("should return singles as true", () => {
        const { betsWithTotalCombinedStake } = setup();

        expect(betsWithTotalCombinedStake).toEqual(
          expect.objectContaining({
            singles: true,
          }),
        );
      });

      it("should return as false if some combination is cast", () => {
        const { betsWithTotalCombinedStake } = setup({ isCastBet: true });

        expect(betsWithTotalCombinedStake).toEqual(
          expect.objectContaining({
            singles: false,
          }),
        );
      });

      it("should return singles as false if combination is not a single type", () => {
        const { betsWithTotalCombinedStake } = setup({ type: "XPTO" });

        expect(betsWithTotalCombinedStake).toEqual(
          expect.objectContaining({
            singles: false,
          }),
        );
      });

      it("should return singles as false if combination does not have totalCombinedStake", () => {
        const { betsWithTotalCombinedStake } = setup({ totalCombinedStake: 0 });

        expect(betsWithTotalCombinedStake).toEqual(
          expect.objectContaining({
            singles: false,
          }),
        );
      });
    });
  });

  describe("betBuilderIds", () => {
    it("should return bet builders ids", () => {
      createGetBetBuilderConfirmationCombinationIdsSelector.mockReturnValueOnce(
        () => betBuilderCombinationIdsSelectorMock,
      );

      const { betBuilderIds } = setupMapStateToProps({ sportsbookConfirmation: sportsbookConfirmationMock });

      expect(betBuilderIds).toEqual(["BET_BUILDER_1", "BET_BUILDER_2"]);
    });
  });

  describe("betslipCardsOrder", () => {
    const defaultContents = { id: i18nLabelsMock.singlesGroup, cardsOrder: [BetslipSection.singles] };

    const multiplesContents = {
      id: i18nLabelsMock.multiplesGroup,
      cardsOrder: [
        BetslipSection.bbMulti,
        BetslipSection.betBuilders,
        BetslipSection.oneLineMultiple,
        BetslipSection.multiLinesMultiples,
      ],
    };

    const castBetContents = {
      id: i18nLabelsMock.castBetGroup,
      cardsOrder: [BetslipSection.castBets],
    };

    describe("when it does not have multiples", () => {
      it("should return only singles cards order", () => {
        const { betslipCardsOrder } = setupMapStateToProps();

        expect(betslipCardsOrder).toEqual([defaultContents]);
      });
    });

    describe("when it has multiples bets", () => {
      it("should return with multiples cards order", () => {
        createGetBetBuilderConfirmationCombinationIdsSelector.mockReturnValueOnce(
          () => betBuilderCombinationIdsSelectorMock,
        );

        const { betslipCardsOrder } = setupMapStateToProps({ sportsbookConfirmation: sportsbookConfirmationMock });

        expect(betslipCardsOrder).toEqual([multiplesContents, defaultContents]);
      });
    });

    describe("when it has cast bets", () => {
      it("should return with cast cards order", () => {
        const sportsbookConfirmation = {
          combinations: { "C:1": { id: "C:1", stake: 1, totalCombinedStake: 1 } },
          legs: { "L:1": { id: "L:1", stake: 1, totalCombinedStake: 1 } },
        };
        isCast.mockReturnValue({ isCastBet: true });
        isMultiBetBuilder.mockReturnValue(true);

        const { betslipCardsOrder } = setupMapStateToProps({
          sportsbookConfirmation,
          multipleCombinationsBuilder: jest.fn(() => betBuilderCombinationIdsSelectorMock),
        });

        expect(betslipCardsOrder).toEqual([multiplesContents, castBetContents, defaultContents]);
      });
    });
  });

  describe("sections initial state", () => {
    it("should return all sections open", () => {
      const { sectionsInitialState } = setupMapStateToProps();

      expect(sectionsInitialState).toEqual({
        bbMulti: true,
        betBuilders: true,
        castBets: true,
        oneLineMultiple: true,
        multiLinesMultiples: true,
        singles: true,
      });
    });
  });

  describe("contentLayout", () => {
    it("should return contentLayout as ACCORDION", () => {
      const { contentLayout } = setupMapStateToProps();

      expect(contentLayout).toEqual(SportsbookPlacePanelContentLayout.ACCORDION);
    });
  });

  describe("isEligibleToBonus", () => {
    describe("when there is bonus money", () => {
      it("should return true", () => {
        const sportsbookBettingState = {
          combinations: {},
          hasBonusMoney: true,
        };
        const { isEligibleToBonus } = setupMapStateToProps({ sportsbookBettingState });

        expect(isEligibleToBonus).toEqual(true);
      });
    });

    describe("and there is no bonus money", () => {
      it("should return false", () => {
        const sportsbookBettingState = {
          combinations: {},
          hasBonusMoney: false,
        };
        const { isEligibleToBonus } = setupMapStateToProps({ sportsbookBettingState });

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

  describe("hasCTALoading", () => {
    describe("when isDepositRequired is true", () => {
      it("should return hasCTALoading as false", () => {
        const getSbkIsDepositRequiredBuilder = () => true;
        const { hasCTALoading } = setupMapStateToProps({ getSbkIsDepositRequiredBuilder });

        expect(hasCTALoading).toEqual(false);
      });
    });

    describe("when isDepositRequired is false", () => {
      describe("and logged out", () => {
        it("should return hasCTALoading as false", () => {
          const userDetails = { loggedIn: false };
          const { hasCTALoading } = setupMapStateToProps({ userDetails });

          expect(hasCTALoading).toEqual(false);
        });
      });

      describe("and logged in", () => {
        it("should return hasCTALoading as true", () => {
          const userDetails = { loggedIn: true };
          const { hasCTALoading } = setupMapStateToProps({ userDetails });

          expect(hasCTALoading).toEqual(true);
        });
      });
    });
  });

  describe("isFreeBetsSelected", () => {
    describe("when the bonus is selected", () => {
      it("should return true", () => {
        const sportsbookBettingState = {
          combinations: {},
          isBonusSelected: true,
        };
        const { isFreeBetsSelected } = setupMapStateToProps({ sportsbookBettingState });

        expect(isFreeBetsSelected).toEqual(true);
      });
    });

    describe("when the bonus is not selected", () => {
      it("should return false", () => {
        const sportsbookBettingState = {
          combinations: {},
          isBonusSelected: false,
        };
        const { isFreeBetsSelected } = setupMapStateToProps({ sportsbookBettingState });

        expect(isFreeBetsSelected).toEqual(false);
      });
    });
  });

  describe("isOddsBoosted", () => {
    describe("when some bet has price boost selected", () => {
      it("should return isOddsBoosted as true", () => {
        const sportsbookConfirmation = {
          combinations: {
            BET_BUILDER_1: {
              id: "BET_BUILDER_1",
              stake: 5,
              totalCombinedStake: 5,
              isPriceBoostSelected: true,
            },
            BET_BUILDER_2: {
              id: "BET_BUILDER_2",
              stake: 8,
              totalCombinedStake: 8,
              isPriceBoostSelected: false,
            },
          },
          ignoredBets: [{ id: "BET_BUILDER_1" }, { id: "BET_BUILDER_2" }],
          failures: {},
        };
        const { isOddsBoosted } = setupMapStateToProps({ sportsbookConfirmation });

        expect(isOddsBoosted).toEqual(true);
      });
    });

    describe("when every bet hasn't price boost selected", () => {
      it("should return isOddsBoosted as true", () => {
        const sportsbookConfirmation = {
          combinations: {
            BET_BUILDER_1: {
              id: "BET_BUILDER_1",
              stake: 5,
              totalCombinedStake: 5,
              isPriceBoostSelected: false,
            },
            BET_BUILDER_2: {
              id: "BET_BUILDER_2",
              stake: 8,
              totalCombinedStake: 8,
              isPriceBoostSelected: false,
            },
          },
          ignoredBets: [{ id: "BET_BUILDER_1" }, { id: "BET_BUILDER_2" }],
          failures: {},
        };
        const { isOddsBoosted } = setupMapStateToProps({ sportsbookConfirmation });

        expect(isOddsBoosted).toEqual(false);
      });
    });
  });

  describe("totalReturns", () => {
    it("should call buildPotentialReturns", () => {
      const sportsbookBettingState = {
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        combinations: {},
      };
      setupMapStateToProps({ sportsbookBettingState });

      expect(buildPotentialReturns).toHaveBeenCalledWith(1.23, 11, {});
    });

    it("should return the formatted total returns", () => {
      const sportsbookBettingState = {
        totalPotentialReturns: 1.33,
        combinations: {},
      };
      buildPotentialReturns.mockReturnValue("currencyFormatWithDecimalPlaces");

      const { totalReturns } = setupMapStateToProps({ sportsbookBettingState });

      expect(totalReturns).toEqual("currencyFormatWithDecimalPlaces");
    });
  });

  describe("totalOriginalReturns", () => {
    it("should call buildTotalOriginalReturns", () => {
      const sportsbookBettingState = {
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        totalOriginalPotentialReturns: 9,
        combinations: {},
      };
      setupMapStateToProps({ sportsbookBettingState });

      expect(buildTotalOriginalReturns).toHaveBeenCalledWith(1.23, 11, 9, false, {});
    });

    it("should return the formatted total original returns", () => {
      const sportsbookBettingState = {
        totalCombinedStake: 1.23,
        totalPotentialReturns: 11,
        totalOriginalPotentialReturns: 9,
        combinations: {
          "COMB:1": {
            id: "COMB:1",
            stake: 1,
            totalCombinedStake: 1,
            isPriceBoostSelected: true,
          },
        },
      };
      buildTotalOriginalReturns.mockReturnValue("currencyFormatWithDecimalPlaces");
      const { totalOriginalReturns } = setupMapStateToProps({ sportsbookBettingState });

      expect(totalOriginalReturns).toEqual("currencyFormatWithDecimalPlaces");
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

  describe("isPlaceDisabled", () => {
    describe("when there are combinations without totalCombinedStake in sportsbook confirmation", () => {
      it("should return true", () => {
        const sportsbookConfirmation = {
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              stake: undefined,
              totalCombinedStake: undefined,
            },
          },
        };
        const { isPlaceDisabled } = setupMapStateToProps({ sportsbookConfirmation });

        expect(isPlaceDisabled).toEqual(true);
      });
    });

    describe("when there are staked combinations in sportsbook confirmation", () => {
      describe("and when there are validations selectors", () => {
        describe("and when all validations are BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE", () => {
          it("should return false", () => {
            const validationsBuilder = jest.fn(() => [
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
            ]);
            const { isPlaceDisabled } = setupMapStateToProps({
              validationsBuilder,
              sportsbookConfirmation: sportsbookConfirmationMock,
              sportsbookBettingState: sportsbookBettingStateMock,
            });

            expect(isPlaceDisabled).toBe(false);
          });
        });

        describe("and when NOT all validations are BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE", () => {
          it("should return true", () => {
            const validationsBuilder = jest.fn(() => [
              { type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE, notification: { type: "ERROR" } },
              { type: "some other validation", notification: { type: "ERROR" } },
            ]);
            const sportsbookBettingState = {
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  stake: 1,
                  totalCombinedStake: 1,
                },
              },
            };

            const { isPlaceDisabled } = setupMapStateToProps({
              validationsBuilder,
              sportsbookConfirmation: sportsbookConfirmationMock,
              sportsbookBettingState,
            });

            expect(isPlaceDisabled).toBe(true);
          });
        });

        describe("and when all validations are warnings", () => {
          it("should return false", () => {
            const validationsBuilder = jest.fn(() => [{ type: "validation", notification: { type: "WARNING" } }]);
            const { isPlaceDisabled } = setupMapStateToProps({
              validationsBuilder,
              sportsbookConfirmation: sportsbookConfirmationMock,
              sportsbookBettingState: sportsbookBettingStateMock,
            });

            expect(isPlaceDisabled).toBe(false);
          });
        });
      });

      describe("and when there are no validations selectors", () => {
        it("should return isPlaceDisabled as false", () => {
          const { isPlaceDisabled } = setupMapStateToProps({
            sportsbookConfirmation: sportsbookConfirmationMock,
            sportsbookBettingState: sportsbookBettingStateMock,
          });

          expect(isPlaceDisabled).toBe(false);
        });
      });

      describe("and has market failures codes", () => {
        describe("when there are recently runner IDs with market failures added", () => {
          it("should return is place disabled as true", () => {
            const sportsbookConfirmation = {
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  stake: 1,
                  totalCombinedStake: 1,
                },
              },
              ignoredBets: [{ id: "runner1" }],
              failures: {},
            };
            const implyRunnerFailures = {
              runner1: [{ failureType: "closed" }],
              runner2: [{ failureType: "closed" }],
            };

            hasAnyMarketSuspendedFailure.mockReturnValue(false);
            hasAnyMarketClosedFailure.mockReturnValue(true);

            const { isPlaceDisabled } = setupMapStateToProps({ sportsbookConfirmation, implyRunnerFailures });

            expect(isPlaceDisabled).toBe(true);
          });
        });

        describe("when removed a runner ID with failures", () => {
          it("should return isPlaceDisabled as true", () => {
            const sportsbookConfirmation = {
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  stake: 1,
                  totalCombinedStake: 1,
                },
              },
              ignoredBets: [{ id: "runner1" }, { id: "runner2" }],
              failures: {},
            };
            const implyRunnerFailures = {
              runner1: [{ failureType: "closed" }],
            };
            hasAnyMarketSuspendedFailure.mockReturnValue(false);
            hasAnyMarketClosedFailure.mockReturnValue(true);

            const { isPlaceDisabled } = setupMapStateToProps({ sportsbookConfirmation, implyRunnerFailures });

            expect(isPlaceDisabled).toBe(true);
          });
        });

        describe("when added a new failure code which is not market closed or suspended", () => {
          it("should return isPlaceDisabled as false", () => {
            const stateCombinations = {
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  stake: 1,
                  totalCombinedStake: 1,
                },
              },
              ignoredBets: [],
              failures: {},
            };
            const implyRunnerFailures = {
              runner1: [{ failureType: "another error" }],
            };

            hasAnyMarketSuspendedFailure.mockReturnValue(false);
            hasAnyMarketClosedFailure.mockReturnValue(false);

            const { isPlaceDisabled } = setupMapStateToProps({
              sportsbookConfirmation: stateCombinations,
              sportsbookBettingState: stateCombinations,
              implyRunnerFailures,
            });

            expect(isPlaceDisabled).toBe(false);
          });
        });

        describe("when there are no failures", () => {
          it("should return isPlaceDisabled as false", () => {
            const stateCombinations = {
              totalPotentialReturns: 1.33,
              combinations: {
                "COMB:1": {
                  id: "COMB:1",
                  stake: 1,
                  totalCombinedStake: 1,
                },
              },
              ignoredBets: [],
              failures: {},
            };

            hasAnyMarketSuspendedFailure.mockReturnValue(false);
            hasAnyMarketClosedFailure.mockReturnValue(false);

            const { isPlaceDisabled } = setupMapStateToProps({
              sportsbookConfirmation: stateCombinations,
              sportsbookBettingState: stateCombinations,
            });

            expect(isPlaceDisabled).toBe(false);
          });
        });
      });

      describe("and when there are new failure there is not a initial failure", () => {
        it("should return is place disabled as true", () => {
          const sportsbookConfirmation = {
            totalPotentialReturns: 1.33,
            combinations: {
              "COMB:1": {
                id: "COMB:1",
                stake: 1,
                totalCombinedStake: 1,
              },
            },
            ignoredBets: [{ id: "runner1" }, { id: "runner3" }],
            failures: {},
          };
          const implyRunnerFailures = {
            runner1: [{ failureType: "closed" }],
          };

          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const { isPlaceDisabled } = setupMapStateToProps({ sportsbookConfirmation, implyRunnerFailures });

          expect(isPlaceDisabled).toBe(true);
        });
      });
    });

    describe("hasStakeChanged", () => {
      it("returns isPlaceDisabled as true when a combination stake has changed", () => {
        const sportsbookBettingState = {
          totalPotentialReturns: 1.33,
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              stake: 0,
              totalCombinedStake: 0,
            },
          },
          ignoredBets: [],
          failures: {},
        };
        const sportsbookConfirmation = {
          totalPotentialReturns: 1.33,
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              stake: 1,
              totalCombinedStake: 1,
            },
          },
          ignoredBets: [],
          failures: {},
        };
        const { isPlaceDisabled } = setupMapStateToProps({ sportsbookConfirmation, sportsbookBettingState });

        expect(isPlaceDisabled).toEqual(true);
      });

      it("returns isPlaceDisabled as false when no combination stake has changed", () => {
        const { isPlaceDisabled } = setupMapStateToProps({
          sportsbookConfirmation: sportsbookConfirmationMock,
          sportsbookBettingState: sportsbookBettingStateMock,
        });

        expect(isPlaceDisabled).toEqual(false);
      });

      it("returns true when combinations are empty", () => {
        const sportsbookBettingState = {
          combinations: {
            BET_BUILDER_1: {
              id: "BET_BUILDER_1",
              stake: 0,
              totalCombinedStake: 0,
            },
          },
        };
        const sportsbookConfirmation = {
          combinations: {
            BET_BUILDER_1: {
              id: "BET_BUILDER_1",
              stake: 5,
              totalCombinedStake: 5,
            },
          },
        };
        const { isPlaceDisabled } = setupMapStateToProps({
          sportsbookConfirmation,
          sportsbookBettingState,
        });

        expect(isPlaceDisabled).toEqual(true);
      });
    });
  });

  describe("isSummaryDisabled", () => {
    describe("when the totalStake is 0", () => {
      it("should return true", () => {
        const sportsbookBettingState = {
          totalCombinedStake: 0,
          combinations: {},
        };
        const { isSummaryDisabled } = setupMapStateToProps({ sportsbookBettingState });

        expect(isSummaryDisabled).toEqual(true);
      });
    });

    describe("when the totalStake is null", () => {
      it("should return true", () => {
        const sportsbookBettingState = {
          totalCombinedStake: null,
          combinations: {},
        };
        const { isSummaryDisabled } = setupMapStateToProps({ sportsbookBettingState });

        expect(isSummaryDisabled).toEqual(true);
      });
    });

    describe("when the totalStake is more than 0", () => {
      it("should return false", () => {
        const sportsbookBettingState = {
          totalCombinedStake: 3,
          combinations: {},
        };
        const { isSummaryDisabled } = setupMapStateToProps({ sportsbookBettingState });

        expect(isSummaryDisabled).toEqual(false);
      });
    });
  });

  describe("i18n", () => {
    it("should translate all labels", () => {
      const currentMultipleBuilder = jest.fn().mockReturnValue({ numLines: 3 });
      setupMapStateToProps({ currentMultipleBuilder });

      expect(i18n).toHaveBeenCalledTimes(27);
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TOTAL_RETURNS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ADDITIONAL_MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.SINGLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.REMOVE_ALL" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.STAKE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EACHWAY" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.CASTS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BET_BUILDER" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EDIT_BET" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.BET_BUILDER" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.CAST_BET" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.MULTIPLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TABS.SINGLES" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.TITLE" });
    });

    describe("sportsbookPlacePanelI18N", () => {
      it("should return all labels", () => {
        const currentMultipleBuilder = jest.fn().mockReturnValue({ numLines: 3, isAccaInsuranceSelected: true });
        const { sportsbookPlacePanelI18N } = setupMapStateToProps({ currentMultipleBuilder });

        expect(sportsbookPlacePanelI18N).toEqual({
          additionalMultiples: "I18N.BETSLIP.ADDITIONAL_MULTIPLES",
          balanceAfterBet: "I18N.BETSLIP.BALANCE_AFTER_BET",
          betBuilder: "I18N.BETSLIP.BET_BUILDER",
          casts: "I18N.BETSLIP.CASTS",
          eachWay: "I18N.BETSLIP.EACHWAY",
          eachWaySubtitle: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
          freeBetsLabel: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT",
          multiBetBuilder: "I18N.BETSLIP.BET_BUILDER_MULTIS",
          multiples: "I18N.BETSLIP.MULTIPLES",
          oddsLabel: "I18N.BETSLIP.ODDS",
          oddsMovementDown: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE",
          oddsMovementUp: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE",
          removeLabel: "I18N.BETSLIP.REMOVE_ALL",
          singles: "I18N.BETSLIP.SINGLES",
          stakeLabel: "I18N.BETSLIP.STAKE",
          totalReturns: "I18N.BETSLIP.TOTAL_RETURNS",
          priceBoosts: "I18N.BETSLIP.GROUPS.PRICE_BOOST",
          tabAllTitle: "I18N.BETSLIP.TABS.ALL",
          tabBetBuildersTitle: "I18N.BETSLIP.TABS.BET_BUILDER",
          tabCastTitle: "I18N.BETSLIP.TABS.CAST_BET",
          tabMultiplesTitle: "I18N.BETSLIP.TABS.MULTIPLES",
          tabSinglesTitle: "I18N.BETSLIP.TABS.SINGLES",
          betslipAriaTitle: "I18N.BETSLIP.TITLE",
        });
      });
    });

    describe("sportsbooksConfirmI18N", () => {
      it("should return all labels", () => {
        const { sportsbooksConfirmI18N } = setupMapStateToProps();

        expect(sportsbooksConfirmI18N).toEqual({
          additionalMultiples: "I18N.BETSLIP.ADDITIONAL_MULTIPLES",
          betBuilder: "I18N.BETSLIP.BET_BUILDER",
          casts: "I18N.BETSLIP.CASTS",
          multiBetBuilder: "I18N.BETSLIP.BET_BUILDER_MULTIS",
          multiples: "I18N.BETSLIP.MULTIPLES",
          secondaryButtonLabel: "I18N.BETSLIP.EDIT_BET",
          singles: "I18N.BETSLIP.SINGLES",
          tabAllTitle: "I18N.BETSLIP.TABS.ALL",
          tabBetBuildersTitle: "I18N.BETSLIP.TABS.BET_BUILDER",
          tabCastTitle: "I18N.BETSLIP.TABS.CAST_BET",
          tabMultiplesTitle: "I18N.BETSLIP.TABS.MULTIPLES",
          tabSinglesTitle: "I18N.BETSLIP.TABS.SINGLES",
          betslipAriaTitle: "I18N.BETSLIP.TITLE",
        });
      });
    });
  });

  describe("placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels", () => {
    it("should call buildSbkPlaceBetButtonLabels with the correct props", () => {
      const oddsMovementBuilder = jest.fn(() => ({
        selection1: { id: "selection1", movement: "up" },
        selection2: { id: "selection2", movement: "down" },
      }));

      const appState = {
        betslip: {
          sportsbookOddsMovement: {},
          sportsbookHandicapMovement: {},
          hasGenerosityWallets: true,
          hasGenerosityTokens: true,
        },
        entities: {
          throttles: {},
        },
        betting: { sportsbookBetting: "sportsbookBetting" },
      };

      const { placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels } =
        setupMapStateToProps({
          userDetails: { loggedIn: true },
          appState,
          oddsMovementBuilder,
          getSbkIsDepositRequiredBuilder: () => true,
        });

      const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector();
      expect(getAreAllCombinationsClosedOrSuspended).toHaveBeenCalledWith(appState);

      expect(buildSbkPlaceBetButtonLabels).toHaveBeenCalledWith({
        hasGenerosityWallets: true,
        hasGenerosityTokens: true,
        hasOddsChanged: true,
        hasStake: false,
        interpolatedValues: {
          stake: "currencyFormatWithDecimalPlaces",
        },
        isAuthenticating: undefined,
        isDepositRequired: true,
        isLoggedIn: true,
        isSuspended: false,
        isPlacing: false,
        isConfirmationStep: true,
        shouldAcceptOddsMovement: true,
      });

      expect(placeBtnLabel).toBe("placeButtonLabel");
      expect(placeBtnSecondaryLabel).toBe("placeButtonSecondaryLabel");
      expect(placeBtnLoadingLabel).toBe("placeButtonLoadingLabel");
      expect(reversePlaceBtnLabels).toBe("placeButtonReverseLabels");
    });
  });

  describe("freeBetsAlertMessage", () => {
    describe("when hasGenerosityWallets is false", () => {
      it("should return undefined", () => {
        const { freeBetsAlertMessage } = setupMapStateToProps({
          userDetails: { loggedIn: true },
          appState: {
            betslip: {
              sportsbookOddsMovement: {},
              sportsbookHandicapMovement: {},
              hasGenerosityWallets: false,
            },
            entities: {
              throttles: {},
            },
            betting: { sportsbookBetting: "sportsbookBetting" },
          },
        });

        expect(freeBetsAlertMessage).toBeUndefined();
      });
    });

    describe("when hasGenerosityWallets is true", () => {
      let freeBetsAlertMessage;

      describe("and betslip has multiples", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce("userDetailsMock");

          const args = {
            userDetails: { loggedIn: true },
            appState: {
              betslip: {
                sportsbookOddsMovement: {},
                sportsbookHandicapMovement: {},
                hasGenerosityWallets: true,
              },
              entities: {
                throttles: {},
              },
              betting: { sportsbookBetting: "sportsbookBetting" },
            },
            sportsbookConfirmation: {
              combinations: {
                "COMB:1": { id: "COMB:1", stake: 10, totalCombinedStake: 10, betType: "DOUBLE" },
              },
            },
          };

          ({ freeBetsAlertMessage } = setupMapStateToProps(args));
        });

        it("should call buildFreeBetsAlertMessage with the correct data", () => {
          expect(sumWalletsAmounts).toHaveBeenCalledWith(0, 10);
          expect(buildFreeBetsAlertMessage).toHaveBeenCalledWith({
            combinationAmount: 10,
            userDetails: "userDetailsMock",
          });
        });

        it("should return the correct message", () => {
          expect(freeBetsAlertMessage).toEqual("free bets alert message mock");
        });
      });

      describe("and betslip has more than one single", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce("userDetailsMock");

          const args = {
            userDetails: { loggedIn: true },
            appState: {
              betslip: {
                sportsbookOddsMovement: {},
                sportsbookHandicapMovement: {},
                hasGenerosityWallets: true,
              },
              entities: {
                throttles: {},
              },
              betting: { sportsbookBetting: "sportsbookBetting" },
            },
            sportsbookConfirmation: {
              combinations: {
                "COMB:1": { id: "COMB:1", stake: 10, totalCombinedStake: 10, betType: "SINGLE" },
                "COMB:2": { id: "COMB:2", stake: 10, totalCombinedStake: 10, betType: "SINGLE" },
              },
            },
          };

          ({ freeBetsAlertMessage } = setupMapStateToProps(args));
        });

        it("should call buildFreeBetsAlertMessage with the correct data", () => {
          expect(sumWalletsAmounts).toHaveBeenCalledWith(0, 10);
          expect(buildFreeBetsAlertMessage).toHaveBeenCalledWith({
            combinationAmount: 10,
            userDetails: "userDetailsMock",
          });
        });

        it("should return the correct message", () => {
          expect(freeBetsAlertMessage).toEqual("free bets alert message mock");
        });
      });

      describe("and betslip has only one single", () => {
        beforeEach(() => {
          getUserDetails.mockReturnValueOnce("userDetailsMock");

          const args = {
            userDetails: { loggedIn: true },
            appState: {
              betslip: {
                sportsbookOddsMovement: {},
                sportsbookHandicapMovement: {},
                hasGenerosityWallets: true,
              },
              entities: {
                throttles: {},
              },
              betting: { sportsbookBetting: "sportsbookBetting" },
            },
            sportsbookConfirmation: {
              combinations: {
                "COMB:1": { id: "COMB:1", stake: 10, totalCombinedStake: 10, betType: "SINGLE" },
              },
            },
          };

          ({ freeBetsAlertMessage } = setupMapStateToProps(args));
        });

        it("should call buildFreeBetsAlertMessage with the correct data", () => {
          expect(sumWalletsAmounts).toHaveBeenCalledWith(0, 10);
          expect(buildFreeBetsAlertMessage).toHaveBeenCalledWith({
            combinationAmount: 10,
            userDetails: "userDetailsMock",
            combinationAmountPerLine: 5,
            numLines: 2,
          });
        });

        it("should return the correct message", () => {
          expect(freeBetsAlertMessage).toEqual("free bets alert message mock");
        });
      });
    });
  });

  describe("balanceAfterBet", () => {
    it("should return the expected value", () => {
      const sportsbookBettingState = {
        isBonusSelected: true,
        totalStake: 100,
        combinations: {},
      };

      const { balanceAfterBet } = setupMapStateToProps({
        sportsbookBettingState,
        userDetails: { loggedIn: true },
      });

      expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(
        { loggedIn: true },
        {
          accountBalance: 200,
          totalStake: 100,
          isOldUseBonusActive: true,
          isLoggedIn: true,
        },
      );

      expect(balanceAfterBet).toBe("100 €");
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
});

describe("mapDispatchToProps", () => {
  it("should map dispatchCreateSportsbookConfirmation", () => {
    const { dispatchCreateSportsbookConfirmation } = mapDispatchToProps(jest.fn());

    expect(dispatchCreateSportsbookConfirmation).toBeDefined();
  });

  it("should map dispatchRemoveSportsbookConfirmation", () => {
    const { dispatchRemoveSportsbookConfirmation } = mapDispatchToProps(jest.fn());

    expect(dispatchRemoveSportsbookConfirmation).toBeDefined();
  });

  it("should map dispatchPlacement", () => {
    const { dispatchPlacement } = mapDispatchToProps(jest.fn());

    expect(dispatchPlacement).toBeDefined();
  });

  it("should map dispatchLoginToPlaceBetAction", () => {
    const { dispatchLoginToPlaceBetAction } = mapDispatchToProps(jest.fn());

    expect(dispatchLoginToPlaceBetAction).toBeDefined();
  });

  it("should map dispatchLogin", () => {
    const { dispatchLogin } = mapDispatchToProps(jest.fn());

    expect(dispatchLogin).toBeDefined();
  });

  it("should map dispatchDepositRedirect", () => {
    const { dispatchDepositRedirect } = mapDispatchToProps(jest.fn());

    expect(dispatchDepositRedirect).toBeDefined();
  });

  it("should map dispatchNavigate", () => {
    const { dispatchNavigate } = mapDispatchToProps(jest.fn());

    expect(dispatchNavigate).toBeDefined();
  });

  it("should map dispatchEdit", () => {
    const { dispatchEdit } = mapDispatchToProps(jest.fn());

    expect(dispatchEdit).toBeDefined();
  });

  it("should map dispatchRemoveAll", () => {
    const { dispatchRemoveAll } = mapDispatchToProps(jest.fn());

    expect(dispatchRemoveAll).toBeDefined();
  });

  it("should map dispatchAccordionToggle", () => {
    const { dispatchAccordionToggle } = mapDispatchToProps(jest.fn());

    expect(dispatchAccordionToggle).toBeDefined();
  });

  describe("dispatchCreateSportsbookConfirmation", () => {
    describe("when betslip sportsbook confirmation payload was informed", () => {
      it("should dispatch a BettingSportsbookCreateSportsbookConfirmationAction action with its proper payload", () => {
        const dispatch = jest.fn();
        const { dispatchCreateSportsbookConfirmation } = mapDispatchToProps(dispatch);

        dispatchCreateSportsbookConfirmation({ betslipSportsbookConfirmationPayload: sportsbookConfirmationMock });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
          payload: {
            betslipSportsbookConfirmationPayload: sportsbookConfirmationMock,
          },
        });
      });
    });

    describe("when betslip sportsbook confirmation payload was not informed", () => {
      it("should not dispatch a BettingSportsbookCreateSportsbookConfirmationAction action", () => {
        const dispatch = jest.fn();
        const { dispatchCreateSportsbookConfirmation } = mapDispatchToProps(dispatch);

        dispatchCreateSportsbookConfirmation();

        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("dispatchRemoveSportsbookConfirmation", () => {
    it("should dispatch a BettingSportsbookRemoveSportsbookConfirmationAction action", () => {
      const dispatch = jest.fn();
      const { dispatchRemoveSportsbookConfirmation } = mapDispatchToProps(dispatch);

      dispatchRemoveSportsbookConfirmation();

      expect(dispatch).toHaveBeenCalledWith({
        type: BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
      });
    });
  });

  describe("dispatchPlacement", () => {
    it("should dispatch a BetslipSportsbookConfirmBetsClick action", () => {
      const dispatch = jest.fn();
      const { dispatchPlacement } = mapDispatchToProps(dispatch);

      dispatchPlacement();

      expect(dispatch).toHaveBeenNthCalledWith(1, { type: UI__BETSLIP_SBK_CONFIRM_BETS_CLICK });
    });

    it("should dispatch a BettingSportsbookPlaceBetsAction action", () => {
      const dispatch = jest.fn();
      const { dispatchPlacement } = mapDispatchToProps(dispatch);

      dispatchPlacement();

      expect(dispatch).toHaveBeenNthCalledWith(2, { type: BETTING__SBK_PLACE_BETS });
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

  describe("dispatchDepositRedirect", () => {
    it("should dispatch a BetslipSportsbookDepositToConfirmBetClick action", () => {
      const dispatch = jest.fn();
      const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

      dispatchDepositRedirect();

      expect(dispatch).toHaveBeenNthCalledWith(1, { type: UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK });
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

  describe("dispatchEdit", () => {
    it("should dispatch a BetslipSportsbookEditBetsClick action", () => {
      const dispatch = jest.fn();
      const { dispatchEdit } = mapDispatchToProps(dispatch);

      dispatchEdit();

      expect(dispatch).toHaveBeenNthCalledWith(1, { type: UI__BETSLIP_SBK_EDIT_BETS_CLICK });
    });

    it("should dispatch a BettingSportsbookEditBetsAction action", () => {
      const dispatch = jest.fn();
      const { dispatchEdit } = mapDispatchToProps(dispatch);

      dispatchEdit();

      expect(dispatch).toHaveBeenNthCalledWith(2, { type: BETTING__SBK_EDIT_BETS });
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
});
