import {
  getBetslipCard,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getSportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { VALIDATION_TYPES } from "@ppb/betslip-core";
import { isStakeValid } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
  UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
  UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
  UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_EACH_WAY_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_STARTING_PRICE_TOGGLE,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_VALIDATE_STAKE,
  BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  UI__GENEROSITY_WALLET_REMOVE_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { KeyboardSeparator } from "@ppb/the-wall-common/types";

import { ValueIconName } from "@ppb/the-wall-icons";
import { getExternalLink } from "../../../helpers/external-links";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { getCurrencySymbol, currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { buildAccaInsuranceLabels } from "../betslip-formatters";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { buildSingleLegExtraDetails } from "./bet-controls-mapper";
import { getGenerosityBetslipAlertData } from "../../../helpers/generosity-wallets";

const mockGetUserPreferencesWithProductSwitcher = jest.fn(() => ({
  sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ localeCode: "en-GB", jurisdiction: { jurisdiction: "INTERNATIONAL" } })),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: () => mockGetUserPreferencesWithProductSwitcher,
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationCombinations: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationRunners: jest.fn().mockReturnValue({}),
}));
const getCombinationsSelectedWalletsAmounts = jest.fn().mockReturnValue({
  "COMB:1": {
    numLines: 3,
    combinationAmountPerLine: 5,
    combinationAmount: 10,
  },
});
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn().mockReturnValue({
    combinations: {
      "COMB:1": {},
    },
  }),
  getBettingResolvers: jest.fn().mockReturnValue({ getMetadata: jest.fn().mockReturnValue({}) }),
  createGetCombinationsSelectedWalletsAmounts: jest.fn(() => getCombinationsSelectedWalletsAmounts),
}));

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("../../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => "terms url"),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("../../../helpers/numeric-i18n", () => ({
  getSeparatorByLocale: jest.fn().mockReturnValue(KeyboardSeparator.Dot),
}));
jest.mock("../../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation(({ value }) => `${value}.00€`),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  translateMultiple: jest.fn().mockReturnValue("Translated Multiple"),
}));

jest.mock("../betslip-formatters", () => ({
  buildCombinationOdds: jest.fn().mockReturnValue("13.1"),
  buildCombinationPreviousOdds: jest.fn().mockReturnValue("1.11"),
  buildAccaInsuranceLabels: jest.fn().mockReturnValue("acca label"),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(() => false),
}));

jest.mock("./bet-controls-mapper", () => ({
  buildSingleLegExtraDetails: jest.fn().mockReturnValue({ hasFailure: false }),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

jest.mock("../../../helpers/generosity-wallets", () => {
  const originalModule = jest.requireActual("../../../helpers/generosity-wallets");
  return {
    ...originalModule,
    getGenerosityBetslipAlertData: jest.fn(originalModule.getGenerosityBetslipAlertData),
  };
});

const setupMapStateToProps = ({
  appState = {
    betslip: {
      sportsbookOddsMovement: {},
    },
    entities: {
      throttles: {},
    },
  },
  hasAvailabilityHints,
  isDividend,
  combinationId = "COMB:1",
  combination = {},
  wallets = {},
  validations = {},
  bettingState = {},
  combinations = null,
  title,
  getThrottle = jest.fn().mockReturnValue({ isActive: false }),
  getOddsMovement = jest.fn().mockReturnValue({}),
} = {}) => {
  getSportsbookBettingState.mockReturnValue({
    combinations: combinations ?? { "COMB:1": { legs: ["LEG:1"], ...combination, id: combinationId } },
    validations: { combinations: { ...validations } },
    legs: {
      "LEG:1": {
        id: "LEG:1",
        odds: {},
        runners: ["RUNNER:1"],
      },
    },
    runners: {
      "RUNNER:1": {
        availablePriceTypes: ["LIVE", "STARTING_PRICE"],
      },
    },
    failures: {
      imply: {
        runners: {},
      },
    },
    wallets,
    ...bettingState,
  });
  createGetThrottleSelector.mockReturnValue(getThrottle);
  createOddsMovementSelector.mockReturnValue(getOddsMovement);

  return makeMapStateToProps()(appState, { combinationId, hasAvailabilityHints, isDividend, title });
};

describe("Bet Controls map", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("makeMapStateToProps", () => {
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
    describe("odds", () => {
      describe("when one line", () => {
        it("should return the current odds", () => {
          const mappedProps = setupMapStateToProps({ combination: { odds: "13.1", numLines: 1 } });

          expect(mappedProps.odds).toEqual("13.1");
        });
      });

      describe("when several lines", () => {
        it("should return undefined", () => {
          const mappedProps = setupMapStateToProps({ combination: { odds: 13.1 } });

          expect(mappedProps.odds).toEqual(undefined);
        });
      });
    });

    describe("isDividend", () => {
      describe("when true", () => {
        it("should return always lines", () => {
          const mappedProps = setupMapStateToProps({
            combination: { numLines: 1, odds: "13.1" },
            isDividend: true,
          });

          expect(mappedProps.linesLabel).toEqual({
            interpolationValues: { numLines: "1" },
            key: "I18N.BETSLIP.NUM_LINES",
          });
        });

        it("should return dividend bet label", () => {
          const mappedProps = setupMapStateToProps({
            combination: { numLines: 1, odds: "13.1" },
            isDividend: true,
          });

          expect(mappedProps.dividendBetLabel).toEqual({
            key: "I18N.BETSLIP.DIVIDEND_BET",
          });
        });
      });

      describe("when false and numLines > 1", () => {
        it("should return linesLabel string with multiple combination type and num lines", () => {
          const mappedProps = setupMapStateToProps({
            combination: { numLines: 2, odds: "13.1" },
            isDividend: false,
          });

          expect(mappedProps.linesLabel).toEqual("Translated Multiple (x2)");
        });
      });
    });

    describe("stake", () => {
      describe("when step is not confirm potential", () => {
        describe("when null", () => {
          it("should return stake as undefined", () => {
            const mappedProps = setupMapStateToProps({ combination: { stake: null } });

            expect(mappedProps.stake).toEqual(undefined);
          });
        });

        describe("when defined with a value", () => {
          it("should return the current stake", () => {
            const mappedProps = setupMapStateToProps({ combination: { stake: 11 } });

            expect(mappedProps.stake).toEqual(11);
          });

          describe("when stake is 0", () => {
            it("should return the current stake", () => {
              const mappedProps = setupMapStateToProps({ combination: { stake: 0 } });

              expect(mappedProps.stake).toEqual(0);
            });
          });
        });
      });

      describe("when step is confirm potential", () => {
        it("should return stake with its proper value", () => {
          const confirmationCombinations = {
            "COMB:1": { legs: ["LEG:1"], stake: 23, id: "COMB:1" },
          };
          const confirmationLegs = {
            "LEG:1": {
              id: "LEG:1",
              odds: {},
              runners: ["RUNNER:1"],
            },
          };
          const confirmationRunners = {
            "RUNNER:1": {
              availablePriceTypes: [],
            },
          };
          createIsConfirmStep.mockReturnValueOnce(() => true);
          const getSportsbookConfirmationCombinationsSpy =
            getSportsbookConfirmationCombinations.mockReturnValueOnce(confirmationCombinations);
          const getSportsbookConfirmationLegsSpy = getSportsbookConfirmationLegs.mockReturnValueOnce(confirmationLegs);
          const getSportsbookConfirmationRunnersSpy =
            getSportsbookConfirmationRunners.mockReturnValueOnce(confirmationRunners);

          const mappedProps = setupMapStateToProps({ combination: { stake: 1 } });

          expect(mappedProps.stake).toEqual(23);
          expect(getSportsbookConfirmationCombinationsSpy).toHaveBeenCalled();
          expect(getSportsbookConfirmationLegsSpy).toHaveBeenCalled();
          expect(getSportsbookConfirmationRunnersSpy).toHaveBeenCalled();
        });
      });
    });

    describe("separator", () => {
      it("should call getSeparatorByLocale with the user locale", () => {
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

    describe("hasGenerosity", () => {
      describe("when free bets wallets are available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { applicableWallets: [{}, {}] } });

          expect(mappedProps.hasGenerosity).toEqual(true);
        });
      });

      describe("when user has price boost offers", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { priceBoostOffers: [{}, {}] },
          });

          expect(mappedProps.hasGenerosity).toEqual(true);
        });
      });

      describe("when acca insurance tokens are available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { accaInsuranceOffers: [{}, {}] },
          });

          expect(mappedProps.hasGenerosity).toEqual(true);
        });
      });

      describe("when money back tokens are available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { moneyBackOffers: [{}, {}] },
          });

          expect(mappedProps.hasGenerosity).toEqual(true);
        });
      });

      describe("when ghost leg tokens are available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { ghostLegOffers: [{}, {}] },
          });

          expect(mappedProps.hasGenerosity).toEqual(true);
        });
      });

      describe("when free bets, price boost, acca insurance, money back and ghost leg tokens are unavailable", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              applicableWallets: [],
              priceBoostOffers: [],
              accaInsuranceOffers: [],
              moneyBackOffers: [],
              ghostLegOffers: [],
            },
          });

          expect(mappedProps.hasGenerosity).toEqual(false);
        });
      });
    });

    describe("generosityIconName and generosityType", () => {
      describe("when acca insurance tokens are selected", () => {
        it("should be ValueIconName.MONEY_BACK and ACCA_INSURANCE_TOKEN", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              isAccaInsuranceSelected: true,
              accaInsuranceTokenId: mockTokenId,
              accaInsuranceNumberOfLegs: 2,
              accaInsuranceAmountLimit: 20,
            },
          });

          expect(mappedProps.generosityIconName).toEqual(ValueIconName.MONEY_BACK);
          expect(mappedProps.generosityType).toEqual(WalletTypes.AccaInsuranceToken);
        });
      });

      describe("when money back tokens are selected", () => {
        it("should be ValueIconName.MONEY_BACK and MONEY_BACK_TOKEN", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              isMoneyBackSelected: true,
              moneyBackTokenId: mockTokenId,
              moneyBackNumberOfPlaces: 3,
              moneyBackAmountLimit: 20,
            },
          });

          expect(mappedProps.generosityIconName).toEqual(ValueIconName.MONEY_BACK);
          expect(mappedProps.generosityType).toEqual(WalletTypes.MoneyBackToken);
        });
      });

      describe("when price boost is selected", () => {
        it("should be ValueIconName.BOOSTER and PRICE_BOOST_TOKEN", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              priceBoostTokenId: mockTokenId,
              isPriceBoostSelected: true,
              priceBoostOffers: [{ tokenId: mockTokenId, generosity: 25 }],
            },
          });

          expect(mappedProps.generosityIconName).toEqual(ValueIconName.BOOSTER);
          expect(mappedProps.generosityType).toEqual(WalletTypes.PriceBoostToken);
        });
      });

      describe("when free bets is selected", () => {
        it("should be ValueIconName.FREE_BET AND BONUS_CASH", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isAccaInsuranceSelected: true },
            combinations: {
              "COMB:1": { legs: ["LEG:1"], id: "COMB:1" },
              "COMB:2": { legs: ["LEG:1"], id: "COMB:2" },
            },
            wallets: {
              "WALLET:1": { walletId: "WALLET:1", type: "WALLET TYPE", amount: 10, combinationId: "COMB:1" },
            },
          });

          expect(mappedProps.generosityIconName).toEqual(ValueIconName.FREE_BET);
          expect(mappedProps.generosityType).toEqual(WalletTypes.BonusCash);
        });
      });

      describe("when ghost leg tokens are selected", () => {
        it("should be ValueIconName.GHOST_LEG and GHOST_LEG_TOKEN", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              isGhostLegSelected: true,
              ghostLegTokenId: mockTokenId,
              ghostLegOffers: [{ tokenId: mockTokenId, numberOfLegs: 2 }],
            },
          });

          expect(mappedProps.generosityIconName).toEqual(ValueIconName.GHOST_LEG);
          expect(mappedProps.generosityType).toEqual(WalletTypes.GhostLegToken);
        });
      });
    });

    describe("hasEachWay", () => {
      describe("when each way is available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWayAvailable: true } });

          expect(mappedProps.hasEachWay).toEqual(true);
        });
      });

      describe("when each way is unavailable", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWayAvailable: false } });

          expect(mappedProps.hasEachWay).toEqual(false);
        });
      });
    });

    describe("hasStartingPrice", () => {
      describe("when starting price is available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isSPAvailable: true, numLines: 1, odds: { decimal: 3 } },
          });

          expect(mappedProps.hasStartingPrice).toEqual(true);
        });
      });

      describe("when starting price is not available", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isSPAvailable: false } });

          expect(mappedProps.hasStartingPrice).toEqual(false);
        });
      });
    });

    describe("hasAccaInsurance", () => {
      describe("when only the previous acca insurance offer is available", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isAccaInsuranceAvailable: true, accaInsuranceOffers: [] },
            bettingState: {
              legs: {
                "LEG:1": {
                  id: "LEG:1",
                  odds: "odds",
                  runners: ["RUNNER:1"],
                },
              },
              runners: {
                "RUNNER:1": {
                  availablePriceTypes: ["LIVE", "STARTING_PRICE"],
                },
              },
            },
          });

          expect(mappedProps.hasAccaInsurance).toEqual(true);
        });
      });

      describe("when both acca insurance experiences are available", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isAccaInsuranceAvailable: false, accaInsuranceOffers: [{}, {}] },
          });

          expect(mappedProps.hasAccaInsurance).toEqual(false);
        });
      });
    });

    describe("isPanelDisabled", () => {
      describe("when there is a place happening", () => {
        it("should return true", () => {
          buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false });
          getBetslipCard.mockReturnValue({ placeStatus: "INPROGRESS" });

          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isPanelDisabled).toEqual(true);
        });
      });

      describe("when there is a failure", () => {
        it("should return true", () => {
          buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true });
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isPanelDisabled).toEqual(true);
        });
      });

      describe("when there is no failure or place happening", () => {
        it("should return false", () => {
          buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false });
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isPanelDisabled).toEqual(false);
        });
      });
    });

    describe("isEachWaySelected", () => {
      describe("when each way is selected", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWaySelected: true } });

          expect(mappedProps.isEachWaySelected).toEqual(true);
        });
      });

      describe("when each way is not selected", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWaySelected: false } });

          expect(mappedProps.isEachWaySelected).toEqual(false);
        });
      });
    });

    describe("isStartingPriceSelected", () => {
      describe("when starting price is selected", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { isSPSelected: true } });

          expect(mappedProps.isStartingPriceSelected).toEqual(true);
        });
      });

      describe("when starting price is not selected", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isSPSelected: false } });

          expect(mappedProps.isStartingPriceSelected).toEqual(false);
        });
      });
    });

    describe("isAccaInsuranceSelected", () => {
      describe("when acca insurance is selected", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { isAccaInsuranceSelected: true } });

          expect(mappedProps.isAccaInsuranceSelected).toEqual(true);
        });
      });

      describe("when acca insurance is not selected", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isAccaInsuranceSelected: false } });

          expect(mappedProps.isAccaInsuranceSelected).toEqual(false);
        });
      });
    });

    describe("isPriceBoostSelected", () => {
      describe("when price boost is selected", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ combination: { isPriceBoostSelected: true } });

          expect(mappedProps.isPriceBoostSelected).toEqual(true);
        });
      });

      describe("when price boost is not selected", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({ combination: { isPriceBoostSelected: false } });

          expect(mappedProps.isPriceBoostSelected).toEqual(false);
        });
      });
    });

    describe("isGenerosityWalletSelected", () => {
      describe("when there are free bets for one existing combination", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            wallets: {
              "WALLET:1": { walletId: "WALLET:1", type: "WALLET TYPE", amount: 10, combinationId: "COMB:1" },
            },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(true);
        });
      });

      describe("when price boost is selected for one existing combination", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isPriceBoostSelected: true },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(true);
        });
      });

      describe("when acca insurance has a token for one existing combination", () => {
        it("should return true", () => {
          const mockTokenId = "11111312#1";
          const mappedProps = setupMapStateToProps({
            combination: {
              accaInsuranceTokenId: mockTokenId,
            },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(true);
        });
      });

      describe("when money back has a token for one existing combination", () => {
        it("should return true", () => {
          const mockTokenId = "11111312#1";
          const mappedProps = setupMapStateToProps({
            combination: {
              moneyBackTokenId: mockTokenId,
            },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(true);
        });
      });

      describe("when ghost leg has a token for one existing combination", () => {
        it("should return true", () => {
          const mockTokenId = "11111312#1";
          const mappedProps = setupMapStateToProps({
            combination: {
              ghostLegTokenId: mockTokenId,
              ghostLegOffers: [{ tokenId: mockTokenId, numberOfLegs: 2 }],
            },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(true);
        });
      });

      describe("when there are not free bets and price boost is not selected and acca insurance, money back and ghost leg do not have a token for any existing combination", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              isPriceBoostSelected: false,
              accaInsuranceTokenId: undefined,
              moneyBackTokenId: undefined,
              ghostLegTokenId: undefined,
            },
          });

          expect(mappedProps.isGenerosityWalletSelected).toEqual(false);
        });
      });
    });

    describe("multiplier", () => {
      describe("when each way is selected", () => {
        it("should return 2x", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWaySelected: true } });

          expect(mappedProps.multiplier).toEqual("2x");
        });
      });

      describe("when each way is not selected", () => {
        it("should return undefined", () => {
          const mappedProps = setupMapStateToProps({ combination: { isEachWaySelected: false } });

          expect(mappedProps.multiplier).toEqual(undefined);
        });
      });
    });

    describe("oddsMovement", () => {
      describe("when there is a movement for the combination", () => {
        describe("when live price", () => {
          it("should return the movement direction", () => {
            const mappedProps = setupMapStateToProps({
              bettingState: {
                legs: {
                  "LEG:1": {
                    id: "LEG:1",
                    odds: "odds",
                    runners: ["RUNNER:1"],
                  },
                },
                runners: {
                  "RUNNER:1": {
                    availablePriceTypes: ["LIVE", "STARTING_PRICE"],
                  },
                },
              },
              getOddsMovement: jest.fn().mockReturnValue({ "COMB:1": { movement: "UP" } }),
            });

            expect(mappedProps.oddsMovement).toEqual("UP");
          });
        });

        describe("when starting price", () => {
          it("should not return the movement direction", () => {
            const mappedProps = setupMapStateToProps({
              bettingState: {
                combinations: {
                  "COMB:1": {
                    legs: ["LEG:1"],
                    odds: {
                      decimal: 33,
                    },
                  },
                },
                legs: {
                  "LEG:1": {
                    id: "LEG:1",
                    odds: null,
                    runners: ["RUNNER:1"],
                  },
                },
                runners: {
                  "RUNNER:1": {
                    availablePriceTypes: ["LIVE", "STARTING_PRICE"],
                  },
                },
              },
              getOddsMovement: jest.fn().mockReturnValue({ "COMB:1": { movement: "UP" } }),
            });

            expect(mappedProps.oddsMovement).toEqual(undefined);
          });
        });
      });

      describe("when there is no movement for the combination", () => {
        it("should return undefined", () => {
          const mappedProps = setupMapStateToProps({});

          expect(mappedProps.oddsMovement).toEqual(undefined);
        });
      });
    });

    describe("currencySymbol", () => {
      it("should return the getCurrencySymbol output", () => {
        getCurrencySymbol.mockReturnValue("symbol");
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.currencySymbol).toEqual("symbol");
      });
    });

    describe("eachWaySubtitle", () => {
      describe("when there is a eachWaySubtitle detail", () => {
        it("should return the subtitle", () => {
          buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true, eachWaySubtitle: "Each Way Subtitle" });
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

          const mappedProps = setupMapStateToProps();

          expect(mappedProps.eachWaySubtitle).toEqual("Each Way Subtitle");
        });
      });

      describe("when there is no eachWaySubtitle detail", () => {
        it("should return undefined", () => {
          buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true });
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

          const mappedProps = setupMapStateToProps();

          expect(mappedProps.eachWaySubtitle).toEqual(undefined);
        });
      });
    });

    describe("hints", () => {
      describe("when hasAvailabilityHints is true", () => {
        describe("when hasFailure is true", () => {
          it("should return hintType", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true, hintType: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: true });

            expect(mappedProps.hintType).toEqual("Hint Type");
          });

          it("should return hintMessage", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true, hintMessage: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: true });

            expect(mappedProps.hintMessage).toEqual("Hint Type");
          });
        });

        describe("when hasFailure is false", () => {
          it("should return hintType as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false, hintType: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: true });

            expect(mappedProps.hintType).toEqual(undefined);
          });

          it("should return hintMessage as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false, hintMessage: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: true });

            expect(mappedProps.hintMessage).toEqual(undefined);
          });
        });
      });

      describe("when hasAvailabilityHints is false", () => {
        describe("when hasFailure is true", () => {
          it("should return hintType as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true, hintType: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: false });

            expect(mappedProps.hintType).toEqual(undefined);
          });

          it("should return hintMessage as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: true, hintMessage: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: false });

            expect(mappedProps.hintMessage).toEqual(undefined);
          });
        });

        describe("when hasFailure is false", () => {
          it("should return hintType as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false, hintType: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: false });

            expect(mappedProps.hintType).toEqual(undefined);
          });

          it("should return hintMessage as undefined", () => {
            buildSingleLegExtraDetails.mockReturnValue({ hasFailure: false, hintMessage: "Hint Type" });
            getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

            const mappedProps = setupMapStateToProps({ hasAvailabilityHints: false });

            expect(mappedProps.hintMessage).toEqual(undefined);
          });
        });
      });
    });

    describe("isStakeValid", () => {
      it("should return output of isStakeValid", () => {
        isStakeValid.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          combination: { isBonusAvailable: true },
          validations: {},
          bettingState: { isBonusSelected: true },
        });

        expect(mappedProps.isStakeValid).toEqual(true);
      });
    });

    describe("bonusAvailabilityLabel", () => {
      describe("when bonus is selected", () => {
        describe("when bonus is not available", () => {
          it("should return a bonus availability label", () => {
            const mappedProps = setupMapStateToProps({
              combination: { isBonusAvailable: false },
              bettingState: { isBonusSelected: true },
            });

            expect(mappedProps.bonusAvailabilityLabel).toEqual({ key: "I18N.BETSLIP.BONUS_NOT_AVAILABLE" });
          });
        });

        describe("when bonus is incompatible", () => {
          describe("when using an incompatible AccaInsurance", () => {
            it("should return a bonus ineligible label", () => {
              const mappedProps = setupMapStateToProps({
                combination: { isBonusAvailable: true },
                validations: { "COMB:1": [{ type: VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE }] },
                bettingState: { isBonusSelected: true },
              });

              expect(mappedProps.bonusAvailabilityLabel).toEqual({ key: "I18N.BETSLIP.FREE_BET_INELIGIBLE" });
            });
          });
          describe("when using an incompatible Price Boost", () => {
            it("should return a bonus ineligible label", () => {
              const mappedProps = setupMapStateToProps({
                combination: { isBonusAvailable: true, isPriceBoostSelected: true },
                validations: { "COMB:1": [{ type: VALIDATION_TYPES.BONUS_USAGE_PRICE_BOOST_INCOMPATIBLE }] },
                bettingState: { isBonusSelected: true },
              });

              expect(mappedProps.bonusAvailabilityLabel).toEqual({ key: "I18N.BETSLIP.FREE_BET_INELIGIBLE" });
            });
          });
        });

        describe("when bonus is available", () => {
          it("should return no bonus availability label", () => {
            const mappedProps = setupMapStateToProps({
              combination: { isBonusAvailable: true },
              bettingState: { isBonusSelected: true },
            });

            expect(mappedProps.bonusAvailabilityLabel).toEqual("");
          });
        });
      });

      describe("when bonus is not selected", () => {
        it("should return no bonus availability label", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isBonusAvailable: false },
            bettingState: { isBonusSelected: false },
          });

          expect(mappedProps.bonusAvailabilityLabel).toEqual("");
        });
      });
    });

    describe("formattedOriginalPotentialReturns", () => {
      describe("when there is only one combination", () => {
        it("should not return the formatted original potential returns", () => {
          const mappedProps = setupMapStateToProps({
            combination: { isPriceBoostSelected: true, originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
            combinations: {
              "COMB:1": {
                legs: ["LEG:1"],
                id: "COMB:1",
                originalPotentialReturns: 2,
                potentialReturns: 20,
                isPriceBoostSelected: true,
                odds: {},
              },
            },
          });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(0);
          expect(mappedProps.formattedOriginalPotentialReturns).toBeUndefined();
        });
      });

      describe("when there are more than one combination", () => {
        describe("and is odds boost", () => {
          it("should return the formatted original potential returns", () => {
            const mappedProps = setupMapStateToProps({
              combination: { isPriceBoostSelected: true, originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
              combinations: {
                "COMB:1": {
                  legs: ["LEG:1"],
                  id: "COMB:1",
                  originalPotentialReturns: 2,
                  potentialReturns: 20,
                  isPriceBoostSelected: true,
                  odds: {},
                },
                "COMB:2": {
                  legs: ["LEG:1"],
                  id: "COMB:2",
                  originalPotentialReturns: 2,
                  potentialReturns: 20,
                  isPriceBoostSelected: true,
                  odds: {},
                },
              },
            });

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(2);
            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
              localeCode: "en-GB",
              value: 2,
              decimalPlaces: 2,
            });

            expect(mappedProps.formattedOriginalPotentialReturns).toEqual("2.00€");
          });
        });

        describe("and is not odds boost", () => {
          it("should not return the formatted original potential returns", () => {
            const mappedProps = setupMapStateToProps({
              combination: { isPriceBoostSelected: false, originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
              combinations: {
                "COMB:1": {
                  legs: ["LEG:1"],
                  id: "COMB:1",
                  originalPotentialReturns: 2,
                  potentialReturns: 20,
                  isPriceBoostSelected: false,
                  odds: {},
                },
                "COMB:2": {
                  legs: ["LEG:1"],
                  id: "COMB:2",
                  originalPotentialReturns: 2,
                  potentialReturns: 20,
                  isPriceBoostSelected: false,
                  odds: {},
                },
              },
            });

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(1);

            expect(mappedProps.formattedOriginalPotentialReturns).toBeUndefined();
          });
        });
      });
    });

    describe("formattedPotentialReturns", () => {
      describe("when there is only one combination", () => {
        it("should not return the formatted potential returns", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              originalPotentialReturns: 2,
              potentialReturns: 20,
              odds: {},
            },
          });

          expect(currencyFormatWithDecimalPlaces).not.toHaveBeenCalled();
          expect(mappedProps.formattedPotentialReturns).toBeUndefined();
        });
      });

      describe("when there are more than one combination", () => {
        it("should return the formatted potential returns", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              originalPotentialReturns: 2,
              potentialReturns: 20,
              odds: {},
            },
            combinations: {
              "COMB:1": { legs: ["LEG:1"], id: "COMB:1", originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
              "COMB:2": { legs: ["LEG:1"], id: "COMB:2", originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
            },
          });

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(1);
          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
            localeCode: "en-GB",
            value: 20,
            decimalPlaces: 2,
          });

          expect(mappedProps.formattedPotentialReturns).toEqual("20.00€");
        });
      });
    });

    describe("isGenerosityDisabled", () => {
      describe("when is the confirm step", () => {
        it("should return true", () => {
          createIsConfirmStep.mockReturnValueOnce(() => true);
          getSportsbookConfirmationCombinations.mockReturnValueOnce({
            "COMB:1": { legs: ["LEG:1"], stake: 23, id: "COMB:1" },
          });
          getSportsbookConfirmationLegs.mockReturnValueOnce({
            "LEG:1": {
              id: "LEG:1",
              odds: {},
              runners: ["RUNNER:1"],
            },
          });
          getSportsbookConfirmationRunners.mockReturnValueOnce({
            "RUNNER:1": {},
          });

          const mappedProps = setupMapStateToProps({});

          expect(mappedProps.isGenerosityDisabled).toBe(true);
        });
      });

      describe("when isn't the confirm step", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps({});

          expect(mappedProps.isGenerosityDisabled).toBe(false);
        });
      });
    });

    describe("displayReturns", () => {
      describe("when there is only one combination", () => {
        it("should return a false displayReturns", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              originalPotentialReturns: 2,
              potentialReturns: 20,
              odds: {},
            },
          });

          expect(currencyFormatWithDecimalPlaces).not.toHaveBeenCalled();
          expect(mappedProps.displayReturns).toBe(false);
        });
      });

      describe("when there are more than one combination", () => {
        it("should return a true displayReturns", () => {
          const mappedProps = setupMapStateToProps({
            combination: {
              originalPotentialReturns: 2,
              potentialReturns: 20,
              odds: {},
            },
            combinations: {
              "COMB:1": { legs: ["LEG:1"], id: "COMB:1", originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
              "COMB:2": { legs: ["LEG:1"], id: "COMB:2", originalPotentialReturns: 2, potentialReturns: 20, odds: {} },
            },
          });

          expect(mappedProps.displayReturns).toBe(true);
        });
      });
    });

    describe("returnsLabel", () => {
      it("should return the return label", () => {
        const mappedProps = setupMapStateToProps({
          combination: { originalPotentialReturns: 2, potentialReturns: 20 },
        });

        expect(mappedProps.returnsLabel).toEqual({
          key: "I18N.BETSLIP.RETURNS",
        });
      });

      it("should return the returns tbd label if leg has starting price", () => {
        const mappedProps = setupMapStateToProps({
          legs: {
            "LEG:1": {
              id: "LEG:1",
              odds: {},
            },
          },
          combinations: { "COMB:1": { legs: ["LEG:1"] } },
        });

        expect(mappedProps.returnsLabel).toEqual({
          key: "I18N.BETSLIP.BET_RETURNS_TBD",
        });
      });

      it("should return the returns tbd label if combination doesn't have potential returns or odds", () => {
        const mappedProps = setupMapStateToProps({
          combination: { originalPotentialReturns: 2 },
        });

        expect(mappedProps.returnsLabel).toEqual({
          key: "I18N.BETSLIP.BET_RETURNS_TBD",
        });
      });
    });

    describe("previousOdds", () => {
      it("should return the formatted previous odds", () => {
        const mappedProps = setupMapStateToProps({});

        expect(mappedProps.previousOdds).toEqual("1.11");
      });
    });

    describe("combinationId", () => {
      it("should passthrough the combinationId", () => {
        const mappedProps = setupMapStateToProps({});

        expect(mappedProps.combinationId).toEqual("COMB:1");
      });
    });

    describe("betType", () => {
      it("should use the given title", () => {
        expect(setupMapStateToProps().betType).toBeUndefined();
        expect(setupMapStateToProps({ title: "title" }).betType).toEqual("title");
      });
    });

    describe("accaInsuranceTermsUrl", () => {
      it("should call getExternalLink", () => {
        setupMapStateToProps();

        expect(getExternalLink).toHaveBeenCalledTimes(1);
        expect(getExternalLink).toHaveBeenCalledWith("ACCA_INSURANCE", "INTERNATIONAL", "en-GB");
      });

      it("should return the built acca insurance terms url", () => {
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.accaInsuranceTermsUrl).toEqual("terms url");
      });
    });

    describe("accaInsuranceTitle", () => {
      it("should return the title built from buildAccaInsuranceLabels", () => {
        buildAccaInsuranceLabels.mockReturnValue({ accaInsuranceTitle: "title" });
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.accaInsuranceTitle).toEqual("title");
      });
    });

    describe("accaInsuranceSubtitle", () => {
      it("should return the title built from buildAccaInsuranceLabels", () => {
        buildAccaInsuranceLabels.mockReturnValue({ accaInsuranceSubtitle: "title" });
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.accaInsuranceSubtitle).toEqual("title");
      });
    });

    describe("accaInsuranceTermsLabel", () => {
      it("should return the title built from buildAccaInsuranceLabels", () => {
        buildAccaInsuranceLabels.mockReturnValue({ accaInsuranceTermsLabel: "title" });
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.accaInsuranceTermsLabel).toEqual("title");
      });
    });

    describe("labels", () => {
      it("should return the static labels", () => {
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.labels).toEqual({
          eachWayTitle: {
            key: "I18N.BETSLIP.EACHWAY",
          },
          startingPriceTitle: {
            key: "I18N.BETSLIP.TITLE.STARTING_PRICE",
          },
          odds: {
            key: "I18N.BETSLIP.ODDS",
          },
          stake: {
            key: "I18N.BETSLIP.STAKE_PLACEHOLDER",
          },
          oddsMovementUp: {
            key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE",
          },
          oddsMovementDown: {
            key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE",
          },
          generosityAlertRemoveLabel: {
            key: "I18N.BETSLIP.REMOVE",
          },
        });
      });
    });

    describe("generosityAlertMessage", () => {
      describe("when isGenerosityWalletSelected, isPriceBoostSelected and isAccaInsuranceTokenSelected are false", () => {
        it("should return undefined", () => {
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.generosityAlertMessage).toBeUndefined();
        });
      });

      describe("when acca insurance tokens are selected", () => {
        it("should have the correct message", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              isAccaInsuranceSelected: true,
              accaInsuranceTokenId: mockTokenId,
              accaInsuranceNumberOfLegs: 2,
              accaInsuranceAmountLimit: 20,
            },
          });

          expect(mappedProps.generosityAlertMessage).toEqual({
            interpolationValues: { numberOfLegs: 2, value: "20.00€" },
            key: "I18N.MONEY_BACK_ACCA_CONDITION",
          });
        });
      });

      describe("when price boost is selected", () => {
        it("should have the correct message", () => {
          const mockTokenId = "11111312#1";
          const mappedProps = setupMapStateToProps({
            combination: {
              priceBoostTokenId: mockTokenId,
              isPriceBoostSelected: true,
              priceBoostOffers: [{ tokenId: mockTokenId, generosity: 25 }],
            },
          });

          expect(mappedProps.generosityAlertMessage).toEqual({
            interpolationValues: { value: 25 },
            key: "I18N.BOOST_VALUE_APPLIED",
          });
        });
      });

      describe("when ghost leg tokens are selected", () => {
        it("should have the correct message", () => {
          const mockTokenId = "11111312#1";

          const mappedProps = setupMapStateToProps({
            combination: {
              isGhostLegSelected: true,
              ghostLegTokenId: mockTokenId,
              ghostLegOffers: [{ tokenId: mockTokenId, numberOfLegs: 2 }],
            },
          });

          expect(mappedProps.generosityAlertMessage).toEqual({
            interpolationValues: { numberOfLegs: 2 },
            key: "I18N.GHOST_LEG_CONDITION",
          });
        });
      });

      describe("when free bets is selected", () => {
        describe("when the number of combinations is lower than two", () => {
          it("should return undefined", () => {
            const mappedProps = setupMapStateToProps({
              appState: {
                betslip: {
                  isFreeBetsWalletsActive: true,
                  sportsbookOddsMovement: {},
                },
                entities: {
                  throttles: {},
                },
              },
            });

            expect(mappedProps.generosityAlertMessage).toBeUndefined();
          });
        });

        describe("when the number of combinations is at least two", () => {
          let mappedProps;

          beforeEach(() => {
            mappedProps = setupMapStateToProps({
              appState: {
                betting: {
                  sportsbookBetting: {},
                },
                betslip: {
                  isFreeBetsWalletsActive: true,
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
              wallets: {
                "WALLET:1": { walletId: "WALLET:1", type: "WALLET TYPE", amount: 10, combinationId: "COMB:1" },
              },
            });
          });

          it("should call getCombinationsSelectedWalletsAmounts", () => {
            expect(getCombinationsSelectedWalletsAmounts).toHaveBeenCalledWith({});
          });

          it("should call getGenerosityMessageAndIconName", () => {
            expect(getGenerosityBetslipAlertData).toHaveBeenCalledWith({
              combination: {
                id: "COMB:1",
                legs: ["LEG:1"],
              },
              isAccaInsuranceTokenSelected: false,
              isGhostLegTokenSelected: false,
              isFreeBetsSelected: true,
              isPriceBoostSelected: false,
              isMoneyBackTokenSelected: false,
              isSingleBetBetslip: false,
              numLines: 3,
              combinationAmountPerLine: 5,
              combinationAmount: 10,
              ghostLegs: undefined,
              userDetails: {
                jurisdiction: {
                  jurisdiction: "INTERNATIONAL",
                },
                localeCode: "en-GB",
              },
              oddsDisplayPreference: OddsDisplayPreference.Decimal,
            });
          });

          it("should call getGenerosityBetslipAlertData with oddsDisplayPreference 'FRACTIONAL' when the user preference is fractional", () => {
            mockGetUserPreferencesWithProductSwitcher.mockReturnValueOnce({
              sportsbookOddsDisplay: OddsDisplayPreference.Fractional,
            });

            setupMapStateToProps({
              appState: {
                betting: { sportsbookBetting: {} },
                betslip: { isFreeBetsWalletsActive: true, sportsbookOddsMovement: {} },
                entities: { throttles: {} },
              },
              combinations: {
                "COMB:1": { legs: ["LEG:1"], id: "COMB:1" },
                "COMB:2": { legs: ["LEG:1"], id: "COMB:2" },
              },
              wallets: {
                "WALLET:1": { walletId: "WALLET:1", type: "WALLET TYPE", amount: 10, combinationId: "COMB:1" },
              },
            });

            expect(getGenerosityBetslipAlertData).toHaveBeenCalledWith(
              expect.objectContaining({ oddsDisplayPreference: OddsDisplayPreference.Fractional }),
            );
          });

          it("should return the correct message", () => {
            expect(mappedProps.generosityAlertMessage).toEqual({
              key: "I18N.LABEL.BETSLIP_FREEBETS",
              interpolationValues: { bonus: "3 x 5.00€" },
            });
          });
        });
      });
    });

    describe("hasStakeCaret", () => {
      describe("when INPUT_MARKER throttle is not active", () => {
        it("should return false", () => {
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.hasStakeCaret).toBe(false);
        });
      });
      describe("when INPUT_MARKER throttle is active", () => {
        it("should return true", () => {
          const mappedProps = setupMapStateToProps({ getThrottle: jest.fn().mockReturnValue({ isActive: true }) });

          expect(mappedProps.hasStakeCaret).toBe(true);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    function setupMapDispatchToProps({ dispatch = jest.fn() } = {}) {
      return mapDispatchToProps(dispatch);
    }

    it("should have defined dispatchers", () => {
      const dispatchers = setupMapDispatchToProps();

      expect(dispatchers.dispatchStakeChange).toBeDefined();
      expect(dispatchers.dispatchStakeValidate).toBeDefined();
      expect(dispatchers.dispatchEachWayPress).toBeDefined();
      expect(dispatchers.dispatchAccaInsurancePress).toBeDefined();
      expect(dispatchers.dispatchPriceBoostPress).toBeDefined();
      expect(dispatchers.dispatchGenerosityPress).toBeDefined();
      expect(dispatchers.dispatchStartPricePress).toBeDefined();
      expect(dispatchers.dispatchGenerosityWalletRemoveAction).toBeDefined();
    });

    describe("dispatchStakeChange", () => {
      it("should call dispatch with UI__BETSLIP_SBK_STAKE_INPUT_CHANGE", () => {
        const dispatch = jest.fn();
        const { dispatchStakeChange } = setupMapDispatchToProps({ dispatch });

        dispatchStakeChange({ id: "id", newValue: 3 });

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
          payload: { combinationId: "id", stake: 3 },
        });
      });

      it("should call dispatch with BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION", () => {
        const dispatch = jest.fn();
        const { dispatchStakeChange } = setupMapDispatchToProps({ dispatch });

        dispatchStakeChange({ id: "id", newValue: 3 });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
          payload: { combinationId: "id", stake: 3 },
        });
      });
    });

    describe("dispatchStakeValidate", () => {
      it("should call dispatch with BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION", () => {
        const dispatch = jest.fn();
        const { dispatchStakeValidate } = setupMapDispatchToProps({ dispatch });

        dispatchStakeValidate({ id: "id" });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_VALIDATE_STAKE,
          payload: { combinationId: "id" },
        });
      });
    });

    describe("dispatchEachWayPress", () => {
      it("should call dispatch with UI__BETSLIP_SBK_EACH_WAY_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchEachWayPress } = setupMapDispatchToProps({ dispatch });

        dispatchEachWayPress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
          payload: { isSelected: false },
        });
      });

      it("should call dispatch with BETTING__SBK_EACH_WAY_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchEachWayPress } = setupMapDispatchToProps({ dispatch });

        dispatchEachWayPress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_EACH_WAY_TOGGLE,
          payload: { combinationId: "id", isSelected: false },
        });
      });
    });

    describe("dispatchStartPricePress", () => {
      it("should call dispatch with BETTING__SBK_STARTING_PRICE_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchStartPricePress } = setupMapDispatchToProps({ dispatch });

        dispatchStartPricePress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_STARTING_PRICE_TOGGLE,
          payload: {
            combinationId: "id",
            isSelected: false,
          },
        });
      });
    });

    describe("dispatchAccaInsurancePress", () => {
      it("should call dispatch with UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchAccaInsurancePress } = setupMapDispatchToProps({ dispatch });

        dispatchAccaInsurancePress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
          payload: { isSelected: false },
        });
      });

      it("should call dispatch with BETTING__SBK_ACCA_INSURANCE_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchAccaInsurancePress } = setupMapDispatchToProps({ dispatch });

        dispatchAccaInsurancePress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
          payload: { combinationId: "id" },
        });
      });
    });

    describe("dispatchPriceBoostPress", () => {
      it("should call dispatch with UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchPriceBoostPress } = setupMapDispatchToProps({ dispatch });

        dispatchPriceBoostPress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
          payload: { isSelected: false },
        });
      });

      it("should call dispatch with BETTING__SBK_PRICE_BOOST_TOGGLE", () => {
        const dispatch = jest.fn();
        const { dispatchPriceBoostPress } = setupMapDispatchToProps({ dispatch });

        dispatchPriceBoostPress("id", true);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_PRICE_BOOST_TOGGLE,
          payload: { combinationId: "id" },
        });
      });
    });

    describe("dispatchGenerosityPress", () => {
      describe("should call dispatch with BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION", () => {
        it("when button is selected", () => {
          const dispatch = jest.fn();
          const { dispatchGenerosityPress } = setupMapDispatchToProps({ dispatch });

          dispatchGenerosityPress("id", true);

          expect(dispatch).toHaveBeenCalledWith({
            type: BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
            payload: { combinationId: "id", isSelected: true },
          });
        });

        it("when button is not selected", () => {
          const dispatch = jest.fn();
          const { dispatchGenerosityPress } = setupMapDispatchToProps({ dispatch });

          dispatchGenerosityPress("id", false);

          expect(dispatch).toHaveBeenCalledWith({
            type: BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
            payload: { combinationId: "id", isSelected: false },
          });
        });
      });

      it("should call dispatch with FETCH_CARDS", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityPress } = setupMapDispatchToProps({ dispatch });

        dispatchGenerosityPress("id");

        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CARDS",
          payload: { urns: ["ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets"] },
        });
      });
    });
    describe("dispatchGenerosityWalletRemoveAction", () => {
      it("should dispatch a BettingSportsbookRemoveAllWalletsAction action when type is BONUS_CASH", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId", WalletTypes.BonusCash);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
          payload: { combinationId: "combinationId" },
        });
      });
      it("should dispatch a BettingSportsbookAccaInsuranceToggleAction action when type is ACCA_INSURANCE_TOKEN", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId", WalletTypes.AccaInsuranceToken);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
          payload: { combinationId: "combinationId" },
        });
      });
      it("should dispatch a BettingSportsbookPriceBoostToggleAction action when type is PRICE_BOOST_TOKEN", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId", WalletTypes.PriceBoostToken);

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_PRICE_BOOST_TOGGLE,
          payload: { combinationId: "combinationId" },
        });
      });
      it("should dispatch a BettingSportsbookMoneyBackToggleAction action when type is MONEY_BACK_TOKEN", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId", WalletTypes.MoneyBackToken);
        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_MONEY_BACK_TOGGLE,
          payload: { combinationId: "combinationId" },
        });
      });
      it("should dispatch a BettingSportsbookGhostLegToggleAction action when type is GHOST_LEG_TOKEN", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId", WalletTypes.GhostLegToken);
        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__SBK_GHOST_LEG_TOGGLE,
          payload: { combinationId: "combinationId" },
        });
      });
      it("should not dispatch anything in case there is no type", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityWalletRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityWalletRemoveAction("combinationId");

        expect(dispatch).not.toHaveBeenCalled();
      });
    });

    describe("dispatchGenerosityRemoveAction", () => {
      it("should dispatch a BettingSportsbookRemoveGenerosityWalletsAction action", () => {
        const dispatch = jest.fn();
        const { dispatchGenerosityRemoveAction } = mapDispatchToProps(dispatch);

        dispatchGenerosityRemoveAction();

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__GENEROSITY_WALLET_REMOVE_CLICK,
        });
      });
    });
  });
});
