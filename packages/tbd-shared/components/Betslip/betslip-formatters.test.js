import { CONST } from "@ppb/bet-engine";
import { AlertType } from "@ppb/the-wall-common/types";

import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import {
  buildExchangeTransactionalError,
  buildPriceNotification,
  buildSizeNotification,
  buildMarketNotification,
  buildFreeBetsLabel,
  buildOriginalPotentialReturns,
  buildPotentialReturns,
  buildTotalOriginalReturns,
  buildSportsbookFreeBetsLabel,
  buildAccaInsuranceLabels,
  getPotentialExposure,
  getCastOrdinal,
  buildOdds,
  buildCombinationOdds,
  buildObbPotentialBetOdds,
  buildCombinationPreviousOdds,
  buildRacingTitle,
  getBetData,
} from "./betslip-formatters";
import { formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/the-wall-common/types", () => ({
  AlertType: { Error: "error", Warning: "warning" },
}));

jest.mock("@ppb/tbd-store/helpers/formatters");

jest.mock("../../formatters/currency-formatters", () => ({ currencyFormatWithDecimalPlaces: jest.fn() }));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn().mockReturnValue("17:00"),
}));

describe("Betslip Helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("buildExchangeTransactionalError", () => {
    describe("when there is a translation for given error", () => {
      it("should call i18n with translation key", () => {
        buildExchangeTransactionalError(
          {
            errorCode: "INSUFFICIENT_FUNDS",
            details: {
              price: 1.01,
              size: 2,
            },
          },
          "€",
        );
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.ERROR.INSUFFICIENT_FUNDS",
          interpolationValues: {
            currencySymbol: "€",
            price: "1.01",
            size: "2",
          },
        });
        expect(i18n).toHaveBeenCalledTimes(1);
      });
      it("should return BetslipPlacePanelError with message translated", () => {
        expect(
          buildExchangeTransactionalError(
            {
              errorCode: "INSUFFICIENT_FUNDS",
              details: {
                price: 1.01,
                size: 2,
              },
            },
            "€",
          ),
        ).toEqual({
          type: "error",
          message: {
            interpolationValues: {
              price: "1.01",
              size: "2",
              currencySymbol: "€",
            },
            key: "I18N.BETSLIP.ERROR.INSUFFICIENT_FUNDS",
          },
        });
      });
    });
    describe("when there is not a translation for given error", () => {
      function setupUnknownError() {
        i18n.mockImplementation(({ key }) => (key === "I18N.BETSLIP.ERROR.SOME_ERROR" ? undefined : key));
        return buildExchangeTransactionalError({
          errorCode: "SOME_ERROR",
        });
      }

      it("should call i18n with given key and default translation key", () => {
        setupUnknownError();

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.ERROR.SOME_ERROR",
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.ERROR.UNKNOWN",
        });
        expect(i18n).toHaveBeenCalledTimes(2);
      });
      it("should return BetslipPlacePanelError with default message translated", () => {
        expect(setupUnknownError()).toEqual({
          type: "error",
          message: "I18N.BETSLIP.ERROR.UNKNOWN",
        });
      });
    });
  });

  describe("getBetData", () => {
    describe("when isDepositRequired is true", () => {
      it("should return the fallback bet data", () => {
        const betData = getBetData({ side: ExchangeSide.BACK }, { userDetails: "userDetails" }, true);

        expect(betData).toEqual({
          label: "",
          value: "",
          rawValue: 0,
        });
      });
    });

    describe("when side is Back", () => {
      describe("when there is profit", () => {
        it("should return the profit bet data", () => {
          currencyFormatWithDecimalPlaces.mockReturnValue("123");
          const betData = getBetData({ side: ExchangeSide.BACK, profit: 123 }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "I18N.BETSLIP.PROFIT:",
            value: "123",
            rawValue: 123,
          });
        });
      });

      describe("when there is no profit", () => {
        it("should return the fallback bet data", () => {
          const betData = getBetData({ side: ExchangeSide.BACK }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "",
            value: "",
            rawValue: 0,
          });
        });
      });

      describe("when the profit is zero", () => {
        it("should return the fallback bet data", () => {
          currencyFormatWithDecimalPlaces.mockReturnValue("0");
          const betData = getBetData({ side: ExchangeSide.BACK, profit: 0 }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "I18N.BETSLIP.PROFIT:",
            value: "0",
            rawValue: 0,
          });
        });
      });
    });

    describe("when side is Lay", () => {
      describe("when there is liability", () => {
        it("should return the liability bet data", () => {
          currencyFormatWithDecimalPlaces.mockReturnValue("456");
          const betData = getBetData({ side: ExchangeSide.LAY, liability: 456 }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "I18N.BETSLIP.LIABILITY:",
            value: "456",
            rawValue: 456,
          });
        });
      });

      describe("when there is no liability", () => {
        it("should return the fallback bet data", () => {
          const betData = getBetData({ side: ExchangeSide.LAY }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "",
            value: "",
            rawValue: 0,
          });
        });
      });

      describe("when the liability is zero", () => {
        it("should return the liability bet data", () => {
          currencyFormatWithDecimalPlaces.mockReturnValue("0");
          const betData = getBetData({ side: ExchangeSide.LAY, liability: 0 }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "I18N.BETSLIP.LIABILITY:",
            value: "0",
            rawValue: 0,
          });
        });
      });

      describe("when the liability is a negative number", () => {
        it("should return the minimum liability bet data", () => {
          currencyFormatWithDecimalPlaces.mockReturnValue("0");
          const betData = getBetData({ side: ExchangeSide.LAY, liability: -10 }, { userDetails: "userDetails" });

          expect(betData).toEqual({
            label: "I18N.BETSLIP.LIABILITY:",
            value: "0",
            rawValue: 0,
          });
        });
      });
    });
  });

  describe("getPotentialExposure", () => {
    describe("when side is Back", () => {
      it("should return a potential exposure equals bet size", () => {
        const potentialExposure = getPotentialExposure({ side: ExchangeSide.BACK, size: 2, liability: 10 });

        expect(potentialExposure).toEqual(2);
      });
    });

    describe("when side is Lay", () => {
      it("should return a potential exposure equals bet liability", () => {
        const potentialExposure = getPotentialExposure({ side: ExchangeSide.LAY, size: 2, liability: 10 });

        expect(potentialExposure).toEqual(10);
      });
    });
  });

  describe("buildPriceNotification", () => {
    describe("when price validation is for exceeding maximum value", () => {
      it("should return the proper notification", () => {
        const maximum = 99;
        const notification = buildPriceNotification({
          reason: CONST.LADDER.VALIDATIONS_REASONS.ABOVE_MAX_PRICE,
          maximum,
        });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PRICES",
          interpolationValues: { maximumOdds: "99" },
        });
        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PRICES",
          detail: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE",
        });
      });
    });

    describe("when price validation is for in between step prices", () => {
      it("should return the proper notification", () => {
        const increment = 10;
        const interval = {
          minimum: 50,
          maximum: 100,
        };
        const notification = buildPriceNotification({
          reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP,
          increment,
          interval,
        });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.VALIDATION_INVALID_STEP",
          interpolationValues: { intervalMin: "50", intervalMax: "100", increment: "10" },
        });
        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_INVALID_STEP",
          detail: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE",
        });
      });
    });

    describe("when price validation is for falling short of minimum value", () => {
      it("should return the proper notification", () => {
        const minimum = 1;
        const notification = buildPriceNotification({
          reason: CONST.LADDER.VALIDATIONS_REASONS.BELOW_MIN_PRICE,
          minimum,
        });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.VALIDATION_BELOW_MIN_PRICE",
          interpolationValues: { minimumOdds: "1" },
        });
        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_BELOW_MIN_PRICE",
          detail: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE",
        });
      });
    });

    describe("when reason isn't met", () => {
      it("should throw error", () => {
        expect(() => {
          buildPriceNotification({ reason: "no reason" });
        }).toThrow();
      });
    });
  });

  describe("buildSizeNotification", () => {
    describe("when size validation is for falling short of minimum value", () => {
      it("should return the proper notification", () => {
        const newSize = 1;
        const notification = buildSizeNotification(
          {
            reason: CONST.LADDER.VALIDATIONS_REASONS.BELOW_MIN_SIZE,
          },
          newSize,
        );

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.EXC.MIN_STAKE",
          interpolationValues: { minStake: `${newSize}` },
        });
        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.EXC.MIN_STAKE",
        });
      });
    });

    describe("when reason isn't met", () => {
      it("should fallback to snapped value warning", () => {
        const notification = buildSizeNotification({ reason: "no reason" }, "1.00");

        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE",
        });
      });
    });

    describe("when size validation is for exceeding maximum value", () => {
      it("should return max stake notification", () => {
        const notification = buildSizeNotification(
          {
            reason: CONST.LADDER.VALIDATIONS_REASONS.ABOVE_MAX_SIZE,
          },
          "12.00",
        );

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
          interpolationValues: { maxStake: "12.00" },
        });
        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
        });
      });
    });

    describe("when size validation is for invalid step", () => {
      it("should return snapped value warning", () => {
        const notification = buildSizeNotification(
          {
            reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP,
          },
          "2.50",
        );

        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE",
        });
      });
    });
  });

  describe("buildMarketNotification", () => {
    describe("when market status is open", () => {
      it("should throw an error", () => {
        expect(() => buildMarketNotification(ExchangeMarketStatus.Open)).toThrow(
          "Unexpected market status, must be SUSPENDED or CLOSED",
        );
      });
    });

    describe("when market status is suspended", () => {
      it("should return expected notification with suspended translation", () => {
        const notification = buildMarketNotification(ExchangeMarketStatus.Suspended);

        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.EXC.MARKET_SUSPENDED",
        });

        expect(i18n).toHaveBeenCalledTimes(1);
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EXC.MARKET_SUSPENDED" });
      });
    });

    describe("when market status is closed", () => {
      it("should return expected notification with closed translation", () => {
        const notification = buildMarketNotification(ExchangeMarketStatus.Closed);

        expect(notification).toStrictEqual({
          type: AlertType.Warning,
          message: "I18N.BETSLIP.EXC.MARKET_CLOSED",
        });

        expect(i18n).toHaveBeenCalledTimes(1);
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.EXC.MARKET_CLOSED" });
      });
    });
  });

  describe("buildFreeBetsLabel", () => {
    function setupBuildFreeBetsLabel(fullString, subString) {
      const userDetails = { countryCode: "GB", currencyCode: "GBP", localeCode: "en" };

      currencyFormatWithDecimalPlaces.mockReturnValue(subString);
      i18n.mockImplementation(({ key }) => key);

      return buildFreeBetsLabel(fullString, userDetails, 24);
    }

    it("should call currencyFormatWithDecimalPlaces", () => {
      setupBuildFreeBetsLabel("i18n.FOO", "€24");

      expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
        countryCode: "GB",
        currencyCode: "GBP",
        localeCode: "en",
        value: 24,
      });
    });

    it("should call to i18n", () => {
      setupBuildFreeBetsLabel("i18n.FOO", "€24");

      expect(i18n).toHaveBeenCalledWith({
        interpolationValues: { bonus: "€24" },
        key: "i18n.FOO",
      });
    });

    it("should return i18n function result", () => {
      const freeBetsLabel = setupBuildFreeBetsLabel("i18n.FOO", "€24");

      expect(freeBetsLabel).toBe("i18n.FOO");
    });
  });

  describe("buildSportsbookFreeBetsLabel", () => {
    function setupBuildSportsbookFreeBetsLabel({ totalBonusUsed }) {
      const USER_DETAILS = { countryCode: "GB", currencyCode: "GBP", localeCode: "en" };

      i18n.mockImplementation(({ key }) => key);

      currencyFormatWithDecimalPlaces.mockReturnValue(`${totalBonusUsed}€`);

      return buildSportsbookFreeBetsLabel(totalBonusUsed, USER_DETAILS, "translationKey");
    }

    describe("when totalBonusUsed is undefined", () => {
      it("should return a empty string", () => {
        const bonusLabel = setupBuildSportsbookFreeBetsLabel({ totalBonusUsed: undefined });

        expect(bonusLabel).toBe("");
      });

      it("should not call i18n", () => {
        setupBuildSportsbookFreeBetsLabel({ totalBonusUsed: undefined });

        expect(i18n).not.toHaveBeenCalled();
      });
    });

    describe("when totalBonusUsed is equals 0", () => {
      it("should call i18n with bonus not available label key", () => {
        setupBuildSportsbookFreeBetsLabel({ totalBonusUsed: 0 });

        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.BONUS_NOT_AVAILABLE" });
      });

      it("should return bonus not available label", () => {
        const bonusLabel = setupBuildSportsbookFreeBetsLabel({ totalBonusUsed: 0 });

        expect(bonusLabel).toBe("I18N.BETSLIP.BONUS_NOT_AVAILABLE");
      });
    });

    describe("when totalBonusUsed is greater than 0", () => {
      it("should return the respective value for given translationKey", () => {
        const bonusLabel = setupBuildSportsbookFreeBetsLabel({ totalBonusUsed: 10 });

        expect(bonusLabel).toBe("translationKey");
      });
    });
  });

  describe("buildAccaInsuranceLabels", () => {
    function setupBuildAccaInsuranceLabels({ isAccaInsuranceSelected } = {}) {
      i18n.mockImplementation(({ key }) => key);

      return buildAccaInsuranceLabels(isAccaInsuranceSelected);
    }

    describe("when isAccaInsuranceSelected is true", () => {
      it("should return correct title", () => {
        const { accaInsuranceTitle } = setupBuildAccaInsuranceLabels({ isAccaInsuranceSelected: true });

        expect(accaInsuranceTitle).toBe("I18N.BETSLIP.ACCA_INSURANCE_APPLIED");
      });
    });

    describe("when isAccaInsuranceSelected is false", () => {
      it("should return correct title", () => {
        const { accaInsuranceTitle } = setupBuildAccaInsuranceLabels({ isAccaInsuranceSelected: false });

        expect(accaInsuranceTitle).toBe("I18N.BETSLIP.APPLY_ACCA_INSURANCE");
      });
    });

    it("should return correct subtitle", () => {
      const { accaInsuranceSubtitle } = setupBuildAccaInsuranceLabels();

      expect(accaInsuranceSubtitle).toBe("I18N.BETSLIP.MESSAGING.DESCRIPTION.ACCA_INSURANCE_PLACE");
    });

    it("should return correct terms label", () => {
      const { accaInsuranceTermsLabel } = setupBuildAccaInsuranceLabels();

      expect(accaInsuranceTermsLabel).toBe("I18N.BETSLIP.ACCA_INSURANCE_TERMS_LABEL");
    });
  });

  describe("buildOriginalPotentialReturns", () => {
    function setupOriginalPotentialReturns(stake, value) {
      currencyFormatWithDecimalPlaces.mockReturnValue("Formatted Currency");

      const USER_DETAILS = {
        countryCode: "PT",
        currencyCode: "EUR",
        localeCode: "pt",
      };

      return buildOriginalPotentialReturns(stake, value, USER_DETAILS);
    }

    describe("when totalOriginalPotentialReturns is not a number", () => {
      it("should return undefined", () => {
        const originalPotentialReturns = setupOriginalPotentialReturns(1, null);

        expect(originalPotentialReturns).toBe(undefined);
      });
    });

    describe("when totalStake is not a number", () => {
      it("should call currency formatter with 0", () => {
        setupOriginalPotentialReturns(null, 1);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          decimalPlaces: 2,
          localeCode: "pt",
          value: 0,
        });
      });
    });

    describe("when totalOriginalPotentialReturns matches the criteria", () => {
      it("should call currencyFormatWithDecimalPlaces with the user details and 2 decimal places", () => {
        setupOriginalPotentialReturns(1, 1.23456789);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          decimalPlaces: 2,
          localeCode: "pt",
          value: 1.23456789,
        });
      });

      it("should return the potentialReturns value correctly formatted", () => {
        const originalPotentialReturns = setupOriginalPotentialReturns(1, 1.23456789);

        expect(originalPotentialReturns).toEqual("Formatted Currency");
      });
    });
  });

  describe("buildPotentialReturns", () => {
    function setupPotentialReturns(stake, value) {
      currencyFormatWithDecimalPlaces.mockReturnValue("Formatted Currency");

      const USER_DETAILS = {
        countryCode: "PT",
        currencyCode: "EUR",
        localeCode: "pt",
      };

      return buildPotentialReturns(stake, value, USER_DETAILS);
    }

    describe("when totalPotentialReturns is not a number", () => {
      it("should return a TBD translation", () => {
        const potentialReturns = setupPotentialReturns(1, null);

        expect(potentialReturns).toBe("I18N.BETSLIP.TBD");
      });
    });

    describe("when totalStake is not a number", () => {
      it("should call currency formatter with 0", () => {
        setupPotentialReturns(null, 1);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          decimalPlaces: 2,
          localeCode: "pt",
          value: 0,
        });
      });
    });

    describe("when totalPotentialReturns matches the criteria", () => {
      it("should call currencyFormatWithDecimalPlaces with the user details and 2 decimal places", () => {
        setupPotentialReturns(1, 1.23456789);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          decimalPlaces: 2,
          localeCode: "pt",
          value: 1.23456789,
        });
      });

      it("should return the potentialReturns value correctly formatted", () => {
        const potentialReturns = setupPotentialReturns(1, 1.23456789);

        expect(potentialReturns).toEqual("Formatted Currency");
      });
    });
  });

  describe("buildTotalOriginalReturns", () => {
    function setupTotalOriginalPotentialReturns(
      stake,
      totalPotentialReturns,
      totalOriginalReturns,
      hasPriceBoostedCombination,
    ) {
      currencyFormatWithDecimalPlaces.mockReturnValue("Formatted Currency");

      const USER_DETAILS = {
        countryCode: "PT",
        currencyCode: "EUR",
        localeCode: "pt",
      };

      return buildTotalOriginalReturns(
        stake,
        totalPotentialReturns,
        totalOriginalReturns,
        hasPriceBoostedCombination,
        USER_DETAILS,
      );
    }

    describe("when totalStake is not a number", () => {
      it("should return undefined", () => {
        const totalOriginalReturns = setupTotalOriginalPotentialReturns(null, null, null, false);

        expect(totalOriginalReturns).toBeUndefined();
      });
    });

    describe("when totalPotentialReturns is not a number", () => {
      it("should return undefined", () => {
        const totalOriginalReturns = setupTotalOriginalPotentialReturns(1, null, null, false);

        expect(totalOriginalReturns).toBeUndefined();
      });
    });

    describe("when totalOriginalReturns is not a number", () => {
      it("should return undefined", () => {
        const totalOriginalReturns = setupTotalOriginalPotentialReturns(1, 1, null, false);

        expect(totalOriginalReturns).toBeUndefined();
      });
    });

    describe("when hasPriceBoostedCombination is false", () => {
      it("should return undefined", () => {
        const totalOriginalReturns = setupTotalOriginalPotentialReturns(1, 1, 1, false);

        expect(totalOriginalReturns).toBeUndefined();
      });
    });

    describe("when all values are numbers and hasPriceBoostedCombination is true", () => {
      it("should call currencyFormatWithDecimalPlaces with the user details and 2 decimal places", () => {
        setupTotalOriginalPotentialReturns(1, 1, 1.23456789, true);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          countryCode: "PT",
          currencyCode: "EUR",
          decimalPlaces: 2,
          localeCode: "pt",
          value: 1.23456789,
        });
      });
    });
  });

  describe("buildOdds", () => {
    describe("when there are no displayOdds", () => {
      it("should return I18N.BETSLIP.STARTING_PRICE", () => {
        const odds = buildOdds(null);

        expect(odds).toEqual("I18N.BETSLIP.STARTING_PRICE");
      });
    });

    describe("when there is displayOdds", () => {
      it("should return formatted odds", () => {
        formatOdds.mockReturnValue("odds");
        const odds = buildOdds(1, "pref");

        expect(odds).toEqual("odds");
        expect(formatOdds).toHaveBeenCalledWith(1, "pref", false);
      });
    });
  });

  describe("buildCombinationOdds", () => {
    describe("when there are no displayOdds", () => {
      it("should return I18N.BETSLIP.STARTING_PRICE", () => {
        expect(buildCombinationOdds({ displayOdds: null, isSPAvailable: false, isSPSelected: false })).toEqual(
          "I18N.BETSLIP.STARTING_PRICE",
        );
      });
    });

    describe("when there is displayOdds", () => {
      it("should return formatted odds", () => {
        formatOdds.mockReturnValue("odds");
        expect(buildCombinationOdds({ displayOdds: 1, isSPAvailable: false, isSPSelected: false }, "pref")).toEqual(
          "odds",
          false,
        );
        expect(formatOdds).toHaveBeenCalledWith(1, "pref", false);
      });
    });

    describe("when acca insurance is selected and there is accaInsuranceDisplayOdds", () => {
      it("should return formatted accaInsuranceDisplayOdds", () => {
        formatOdds.mockReturnValue("odds");
        expect(
          buildCombinationOdds(
            { displayOdds: 1, isAccaInsuranceSelected: true, accaInsuranceDisplayOdds: "acca odds" },
            "pref",
            false,
          ),
        ).toEqual("odds");
        expect(formatOdds).toHaveBeenCalledWith("acca odds", "pref", false);
      });
    });

    describe("when price boost is selected and there is priceBoostDisplayOdds", () => {
      it("should return formatted priceBoostDisplayOdds", () => {
        formatOdds.mockReturnValue("odds");
        expect(
          buildCombinationOdds(
            { displayOdds: 1, isPriceBoostSelected: true, priceBoostDisplayOdds: "price boost odds" },
            "pref",
          ),
        ).toEqual("odds");
        expect(formatOdds).toHaveBeenCalledWith("price boost odds", "pref", false);
      });
    });

    describe("when there is combination legs with null odds", () => {
      it("should return I18N.BETSLIP.STARTING_PRICE", () => {
        expect(
          buildCombinationOdds(
            { displayOdds: 1, isSPAvailable: true, isSPSelected: true, legs: ["LEG:1"] },
            undefined,
            { "LEG:1": { id: "LEG:1", odds: null } },
          ),
        ).toEqual("I18N.BETSLIP.STARTING_PRICE");
      });
    });

    describe("when there is sp available and it is selected", () => {
      it("should return I18N.BETSLIP.STARTING_PRICE", () => {
        expect(buildCombinationOdds({ displayOdds: 1, isSPAvailable: true, isSPSelected: true })).toEqual(
          "I18N.BETSLIP.STARTING_PRICE",
        );
      });
    });

    describe("when there is sp available and it is not selected", () => {
      it("should return the odds value", () => {
        formatOdds.mockReturnValue("odds");
        expect(buildCombinationOdds({ displayOdds: 1, isSPAvailable: true, isSPSelected: false })).toEqual("odds");
      });
    });
  });
  describe("buildObbPotentialBetOdds", () => {
    it("should return N/A if received quote is undefined", () => {
      expect(buildObbPotentialBetOdds(undefined, "pref", false)).toEqual("I18N.BETSLIP.NOT_AVAILABLE");

      expect(formatOdds).not.toHaveBeenCalled();
    });

    it("should return formatted odds", () => {
      formatOdds.mockReturnValue("odds");
      expect(
        buildObbPotentialBetOdds(
          { price: { decimal: 1, fractional: { numerator: 1, denominator: 1 } } },
          "pref",
          false,
        ),
      ).toEqual("odds");
      expect(formatOdds).toHaveBeenCalledWith(
        { decimalOdds: 1, fractionalOdds: { denominator: 1, numerator: 1 } },
        "pref",
        false,
      );
    });
  });

  describe("buildCombinationPreviousOdds", () => {
    describe("when price boost is selected and there is currentOdds", () => {
      it("should return formatted currentOdds", () => {
        formatOdds.mockReturnValue("odds");
        expect(buildCombinationPreviousOdds("currentOdds", "previousOdds", true, "pref")).toEqual("odds");
        expect(formatOdds).toHaveBeenCalledWith("currentOdds", "pref");
      });
    });

    describe("when price boost is not selected", () => {
      describe("when there are no previousOdds", () => {
        it("should return undefined", () => {
          expect(buildCombinationPreviousOdds("currentOdds", null, false, "pref")).toEqual(undefined);
          expect(formatOdds).not.toHaveBeenCalled();
        });
      });

      describe("when there are previousOdds", () => {
        it("should return formatted previousOdds", () => {
          formatOdds.mockReturnValue("odds");
          expect(buildCombinationPreviousOdds("currentOdds", "previousOdds", false, "pref")).toEqual("odds");
          expect(formatOdds).toHaveBeenCalledWith("previousOdds", "pref");
        });
      });
    });
  });

  describe("getCastOrdinal", () => {
    describe("when the number is 1", () => {
      it("should return I18N.BETSLIP.SBK.ORDINAL.FIRST", () => {
        expect(getCastOrdinal(1)).toEqual("I18N.BETSLIP.SBK.ORDINAL.FIRST");
      });
    });

    describe("when the number is 2", () => {
      it("should return I18N.BETSLIP.SBK.ORDINAL.SECOND", () => {
        expect(getCastOrdinal(2)).toEqual("I18N.BETSLIP.SBK.ORDINAL.SECOND");
      });
    });

    describe("when the number is 3", () => {
      it("should return I18N.BETSLIP.SBK.ORDINAL.THIRD", () => {
        expect(getCastOrdinal(3)).toEqual("I18N.BETSLIP.SBK.ORDINAL.THIRD");
      });
    });

    describe("when the number is any other", () => {
      it("should return I18N.BETSLIP.SBK.ORDINAL.OTHER", () => {
        expect(getCastOrdinal(4)).toEqual("I18N.BETSLIP.SBK.ORDINAL.OTHER");
      });
    });
  });

  describe("buildRacingTitle", () => {
    describe("when the metadata type is not of racing", () => {
      it("should return the metadada event name", () => {
        const metadada = {
          type: "GENERIC",
          eventName: "mocked",
        };

        expect(buildRacingTitle(metadada, {})).toEqual("mocked");
      });
    });

    describe("when the metadata type is of racig", () => {
      it("should format the date and build the racing title", () => {
        const userDetails = {
          localeCodeBcp47: "locale",
          timezone: "timezone",
        };

        const metadada = {
          type: "RACING",
          racing: {
            time: "17:00",
            venue: "Eng",
          },
        };

        const result = buildRacingTitle(metadada, userDetails);

        expect(result).toEqual("17:00 Eng");
        expect(formatTime).toHaveBeenCalledWith("17:00", "locale", "timezone");
      });
    });
  });
});
