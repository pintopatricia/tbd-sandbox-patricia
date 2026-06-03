import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { isOrderableCast } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { WalletNames } from "@ppb/tbd-store/state/constants";
import {
  createGetUserMainWalletValueSelector,
  createGetUserSpecificWalletSelector,
} from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { CONST } from "@ppb/bet-engine";

import { LADDER_DEFAULT_MIN_SIZE } from "@ppb/tbd-store/config/bet-engine-config";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import {
  buildExchangeTransactionalError,
  buildMarketNotification,
  buildPriceNotification,
  buildRacingTitle,
  buildSizeNotification,
  getCastOrdinal,
} from "./betslip-formatters";
import {
  buildCastBet,
  buildMarketError,
  buildPlaceError,
  buildPriceError,
  buildQuickStakesSelector,
  buildSizeError,
  createBuildDemonstrationCombination,
  createGetCastBetSelector,
  createGetObbIsDepositRequiredSelector,
  createGetSbkIsDepositRequiredSelector,
  createGetSbkRequiredDepositValueSelector,
  generateCastTypes,
  getPriceBoostCount,
  getPriceSnapValue,
  isAnyPriceBoostAvailable,
  isNotification,
} from "./betslip-mapper";
import { translateMultiple } from "./connected-sportsbook-betslip-mapper";

jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesQuickStakesSelector: jest.fn(),
  createUserPreferencesWithProductSwitcherSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("./betslip-formatters");
jest.mock("./connected-sportsbook-betslip-mapper");
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn().mockReturnValue("Formatted Odds"),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetCastGroupSelector: jest.fn(),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
  }),
  getSportsbookBettingCombinations: jest.fn(),
  getSportsbookBettingLegs: jest.fn(),
  createGetCalculatedCombination: jest.fn(() => jest.fn()),
  createGetGreatestOddCombinationSelector: jest.fn(() => jest.fn()),
  createSportsbookBettingRunnerSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserSpecificWalletSelector: jest.fn(),
  createGetUserMainWalletValueSelector: jest.fn(),
}));
jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted value"),
  currencyFormatWithoutDecimalPlaces: jest.fn(({ value }) => `currency ${value}`),
}));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

beforeEach(jest.clearAllMocks);

describe("buildQuickStakesSelector", () => {
  const userDetails = {
    currencyCode: "currencyCode",
    localeCodeBcp47: "localeCodeBcp47",
  };

  describe("when calling buildQuickStakesSelector with an array", () => {
    it("should return array of objects which have displayStake", () => {
      const quickStakes = [{ stake: 5 }, { stake: 10 }, { stake: 20 }, { stake: 50 }];
      const result = buildQuickStakesSelector()(quickStakes, userDetails);

      expect(result[0]).toEqual({ stake: 5, displayStake: "+ currency 5" });
      expect(result[1]).toEqual({ stake: 10, displayStake: "+ currency 10" });
      expect(result[2]).toEqual({ stake: 20, displayStake: "+ currency 20" });
      expect(result[3]).toEqual({ stake: 50, displayStake: "+ currency 50" });
    });
  });

  describe("when there are no quickStakes", () => {
    it("should return an empty array", () => {
      const quickStakes = [];
      const result = buildQuickStakesSelector()(quickStakes, userDetails);

      expect(result).toEqual([]);
    });
  });
});

describe("createBuildDemonstrationCombination", () => {
  describe("when there is no combination", () => {
    it("should return undefined", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();
      const result = buildDemonstrationCombination({ userDetails: "details" }, { prefs: "prefs" }, undefined);

      expect(result).toEqual(undefined);
    });
  });

  describe("when there is no betType for the combination", () => {
    it("should return undefined", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();
      const result = buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: undefined, displayOdds: { trueOdds: 2 }, potentialReturns: 2 },
      );

      expect(result).toEqual(undefined);
    });
  });

  describe("when there is no odds for the combination", () => {
    it("should return undefined", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();
      const result = buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: "DOUBLE", displayOdds: undefined, potentialReturns: 2 },
      );

      expect(result).toEqual(undefined);
    });
  });

  describe("when there is no potentialReturns for the combination", () => {
    it("should return undefined", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();
      const result = buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: undefined },
      );

      expect(result).toEqual(undefined);
    });
  });

  describe("when there is all data", () => {
    it("should format stake as currency", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();

      buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: 2, totalStake: 2 },
      );

      expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(1, {
        userDetails: "details",
        value: 2,
        decimalPlaces: 2,
      });
    });

    it("should format returns as currency", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();

      buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: 2, totalStake: 2 },
      );

      expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(2, {
        userDetails: "details",
        value: 2,
        decimalPlaces: 2,
      });
    });

    it("should format displayOdds", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();

      buildDemonstrationCombination(
        { userDetails: "details" },
        { sportsbookOddsDisplay: "sbOddPref" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: 2, totalStake: 2 },
      );

      expect(formatOdds).toHaveBeenCalledWith({ trueOdds: 2 }, "sbOddPref");
    });

    it("should translate betType", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();

      buildDemonstrationCombination(
        { userDetails: "details" },
        { sportsbookOddsDisplay: "sbOddPref" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: 2, totalStake: 2 },
      );

      expect(translateMultiple).toHaveBeenCalledWith("DOUBLE");
      expect(translateMultiple).toHaveBeenCalledTimes(1);
    });

    it("should return the built acca", () => {
      const buildDemonstrationCombination = createBuildDemonstrationCombination();

      translateMultiple.mockReturnValue("some translated value");

      const result = buildDemonstrationCombination(
        { userDetails: "details" },
        { prefs: "prefs" },
        { betType: "DOUBLE", displayOdds: { trueOdds: 2 }, potentialReturns: 2, totalStake: 2 },
      );

      expect(result).toEqual({
        betType: "DOUBLE",
        translatedBetType: "some translated value",
        odds: "Formatted Odds",
        potentialReturns: "formatted value",
        stake: "formatted value",
      });
    });
  });
});

describe("createGetSbkIsDepositRequiredSelector", () => {
  const DEFAULT_BETTING_STATE = {
    isBonusSelected: false,
    totalStake: 100,
  };
  const DEFAULT_MAIN_WALLET = 50;
  const DEFAULT_WAGERING_WALLET = {
    amount: 0,
  };

  function setupGetSbkIsDepositRequired({
    bettingState = DEFAULT_BETTING_STATE,
    mainWallet = DEFAULT_MAIN_WALLET,
    wageringWallet = DEFAULT_WAGERING_WALLET,
    stake,
  } = {}) {
    return createGetSbkIsDepositRequiredSelector()(stake, bettingState, mainWallet, wageringWallet);
  }

  it("should call createGetUserMainWalletValueSelector", () => {
    setupGetSbkIsDepositRequired();

    expect(createGetUserMainWalletValueSelector).toHaveBeenCalled();
  });

  it("should call createGetUserSpecificWalletSelector with SPORTSBOOK_BONUS_WAGERING wallet", () => {
    setupGetSbkIsDepositRequired();

    expect(createGetUserSpecificWalletSelector).toHaveBeenCalledWith(WalletNames.SPORTSBOOK_BONUS_WAGERING);
  });

  describe("when there is a main wallet without funds", () => {
    describe("when bonus is toggled on", () => {
      describe("when the totalStake surpasses the funds", () => {
        it("should return false", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: true,
              totalStake: 70,
            },
          });

          expect(isDepositRequired).toEqual(false);
        });
      });

      describe("when the totalStake does not surpass the funds", () => {
        it("should return false", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: true,
              totalStake: 30,
            },
          });

          expect(isDepositRequired).toEqual(false);
        });
      });
    });

    describe("when bonus is toggled off", () => {
      describe("when the totalStake surpasses the funds of main and wagering but the wagering wallet is UNKNOWN", () => {
        it("should return true", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 70,
            },
            mainWallet: 3,
            wageringWallet: {
              status: "UNKNOWN",
              amount: 65,
            },
          });

          expect(isDepositRequired).toEqual(true);
        });
      });

      describe("when the totalStake surpasses the funds of main + wagering wallet", () => {
        it("should return true", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 70,
            },
            mainWallet: 3,
            wageringWallet: {
              status: "SUCCESS",
              amount: 65,
            },
          });

          expect(isDepositRequired).toEqual(true);
        });
      });

      describe("when the totalStake has a floating point issue it should round to 2 decimal places", () => {
        it("should return true when equal to the total wallet", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 70.00000000000001,
            },
            mainWallet: 5,
            wageringWallet: {
              status: "SUCCESS",
              amount: 65,
            },
          });

          expect(isDepositRequired).toEqual(false);
        });

        it("should return true when greater than the total wallet", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 70.01000000000001,
            },
            mainWallet: 5,
            wageringWallet: {
              status: "SUCCESS",
              amount: 65,
            },
          });

          expect(isDepositRequired).toEqual(true);
        });
      });

      describe("when the totalStake surpasses the funds of main wallet only", () => {
        it("should return false", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 51,
            },
            wageringWallet: {
              status: "SUCCESS",
              amount: 10,
            },
          });

          expect(isDepositRequired).toEqual(false);
        });
      });

      describe("when the totalStake does not surpass the funds", () => {
        it("should return false", () => {
          const isDepositRequired = setupGetSbkIsDepositRequired({
            bettingState: {
              isBonusSelected: false,
              totalStake: 30,
            },
          });

          expect(isDepositRequired).toEqual(false);
        });
      });
    });
  });

  describe("when there is no main wallet", () => {
    it("should return false", () => {
      const isDepositRequired = setupGetSbkIsDepositRequired({ mainWallet: null });

      expect(isDepositRequired).toEqual(false);
    });
  });
});

describe("createGetSbkRequiredDepositValueSelector", () => {
  const DEFAULT_BETTING_STATE = {
    totalStake: 100,
  };
  const DEFAULT_MAIN_WALLET = 50;

  function setupGetSbkRequiredDepositValue({
    bettingState = DEFAULT_BETTING_STATE,
    isDepositRequired = false,
    mainWallet = DEFAULT_MAIN_WALLET,
  } = {}) {
    return createGetSbkRequiredDepositValueSelector()(bettingState, isDepositRequired, mainWallet);
  }

  describe("when deposit is not required", () => {
    it("should return 0", () => {
      const result = setupGetSbkRequiredDepositValue({
        isDepositRequired: false,
      });
      expect(result).toBe(0);
    });
  });

  describe("when deposit is required", () => {
    it("should return missing amount rounded up", () => {
      const result = setupGetSbkRequiredDepositValue({
        bettingState: {
          totalStake: 123.45,
        },
        isDepositRequired: true,
      });
      expect(result).toBe(74);
    });
  });

  it("should call createGetUserMainWalletValueSelector", () => {
    setupGetSbkRequiredDepositValue();

    expect(createGetUserMainWalletValueSelector).toHaveBeenCalled();
  });
});

describe("createGetObbIsDepositRequiredSelector", () => {
  const DEFAULT_OBB_BETTING_STATE = {
    totalStake: 100,
  };
  const DEFAULT_MAIN_WALLET = 50;

  function setupGetObbIsDepositRequired({
    obbBettingState = DEFAULT_OBB_BETTING_STATE,
    mainWallet = DEFAULT_MAIN_WALLET,
  } = {}) {
    return createGetObbIsDepositRequiredSelector()(obbBettingState, mainWallet);
  }

  it("should call createGetUserMainWalletValueSelector", () => {
    setupGetObbIsDepositRequired();

    expect(createGetUserMainWalletValueSelector).toHaveBeenCalled();
  });

  describe("when there is a main wallet without funds", () => {
    describe("when the totalStake surpasses the funds of main wallet only", () => {
      it("should return true", () => {
        const isDepositRequired = setupGetObbIsDepositRequired({
          obbBettingState: {
            totalStake: 51,
          },
        });

        expect(isDepositRequired).toEqual(true);
      });
    });

    describe("when the totalStake does not surpass the funds", () => {
      it("should return false", () => {
        const isDepositRequired = setupGetObbIsDepositRequired({
          obbBettingState: {
            totalStake: 30,
          },
        });

        expect(isDepositRequired).toEqual(false);
      });
    });

    describe("when the totalStake contains a floating point issue", () => {
      it("should return false when it's the the same value as the main wallet", () => {
        const isDepositRequired = setupGetObbIsDepositRequired({
          obbBettingState: {
            totalStake: 50.000000000001,
          },
        });

        expect(isDepositRequired).toEqual(false);
      });

      it("should return true when it's the the same value as the main wallet", () => {
        const isDepositRequired = setupGetObbIsDepositRequired({
          obbBettingState: {
            totalStake: 50.010000000001,
          },
        });

        expect(isDepositRequired).toEqual(true);
      });
    });
  });

  describe("when there is no main wallet", () => {
    it("should return false", () => {
      const isDepositRequired = setupGetObbIsDepositRequired({ mainWallet: null });

      expect(isDepositRequired).toEqual(false);
    });
  });
});

describe("isNotification", () => {
  describe("with undefined value", () => {
    it("should return false", () => {
      expect(isNotification(undefined)).toBe(false);
    });
  });

  describe("with truthy value", () => {
    it("should return true", () => {
      expect(isNotification({ message: "1 2 testing" })).toBe(true);
    });
  });
});

describe("getPriceSnapValue", () => {
  describe("when price validation is for exceeding maximum value", () => {
    it("should return maximum value", () => {
      const minimum = 1;
      const returnedValue = getPriceSnapValue({ reason: CONST.LADDER.VALIDATIONS_REASONS.BELOW_MIN_PRICE, minimum });

      expect(returnedValue).toBe(minimum);
    });
  });

  describe("when price validation is for in between step prices", () => {
    describe("when current price is undefined", () => {
      it("should return undefined", () => {
        const previousStep = 1;
        const currentPrice = undefined;
        const nextStep = 10;
        const returnedValue = getPriceSnapValue(
          { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep },
          currentPrice,
        );

        expect(returnedValue).toBeUndefined();
      });
    });

    describe("when price is closer to previous step", () => {
      it("should return previous step value", () => {
        const previousStep = 1;
        const currentPrice = 2;
        const nextStep = 10;
        const returnedValue = getPriceSnapValue(
          { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep },
          currentPrice,
        );

        expect(returnedValue).toBe(previousStep);
      });
    });

    describe("when price is closer to next step", () => {
      it("should return next step value", () => {
        const previousStep = 1;
        const currentPrice = 9;
        const nextStep = 10;
        const returnedValue = getPriceSnapValue(
          { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep },
          currentPrice,
        );

        expect(returnedValue).toBe(nextStep);
      });
    });

    describe("when price is exactly between next and previous step", () => {
      it("should return previous step value", () => {
        const previousStep = 1;
        const currentPrice = 5;
        const nextStep = 10;
        const returnedValue = getPriceSnapValue(
          { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep },
          currentPrice,
        );

        expect(returnedValue).toBe(previousStep);
      });
    });
  });

  describe("when price validation is for falling short of minimum value", () => {
    it("should return minimum value", () => {
      const minimum = 1;
      const returnedValue = getPriceSnapValue({ reason: CONST.LADDER.VALIDATIONS_REASONS.BELOW_MIN_PRICE, minimum });

      expect(returnedValue).toBe(minimum);
    });
  });

  describe("when reason isn't met", () => {
    it("should return undefined", () => {
      expect(getPriceSnapValue({ reason: "?????" })).toBe(undefined);
    });
  });
});

describe("generateCastTypes", () => {
  it("should generate cast types", () => {
    const legs = {
      "FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "FORECAST",
      },
      "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "REVERSE_FORECAST",
      },
    };
    const castGroup = {
      id: "924.270009402",
      combinations: [
        {
          id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        },
        {
          id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        },
      ],
    };

    const expected = [
      { id: castGroup.combinations[0].id, text: `I18N.BETSLIP.SBK.CAST.${castGroup.combinations[0].id.split(":")[0]}` },
      { id: castGroup.combinations[1].id, text: `I18N.BETSLIP.SBK.CAST.${castGroup.combinations[1].id.split(":")[0]}` },
    ];

    expect(generateCastTypes(legs, castGroup)).toEqual(expected);
  });
});

describe("buildCastBet", () => {
  const DEFAULT_CAST_GROUP = {
    id: "924.270009402",
    metadataRunnerId: "924.270009402-18766064",
    combinations: [
      {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legs: ["FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        numLines: 1,
        potentialReturns: 1,
        stake: 1,
        totalStake: 0,
        odds: "ODDS",
      },
      {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legs: ["REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        numLines: 1,
        stake: 1,
        potentialReturns: 1,
        totalStake: 0,
        odds: "ODDS",
      },
    ],
  };

  const DEFAULT_CAST_CONTEXT = {
    924.270009402: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
  };

  const DEFAULT_BETTING_STATE = {
    legs: {
      "FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
      "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "REVERSE_FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
    },
    runners: {
      "924.270011329-19450853": { order: 1 },
      "924.270011329-24174446": { order: 2 },
    },
  };

  const DEFAULT_METADATA = {
    "924.270011329-19450853": "METADATA:19450853",
    "924.270011329-24174446": "METADATA:24174446",
  };

  function setupCastBet({
    castGroup = DEFAULT_CAST_GROUP,
    castContext = DEFAULT_CAST_CONTEXT,
    bettingState = DEFAULT_BETTING_STATE,
    metadata = DEFAULT_METADATA,
    userDetails = "userDetails",
  } = {}) {
    getCastOrdinal.mockReturnValue("ordinal");
    buildRacingTitle.mockReturnValue("racing title");

    return buildCastBet(castGroup, castContext, bettingState, metadata, userDetails);
  }

  describe("when there is a valid cast group", () => {
    const VALID_CAST_GROUP = {
      id: "924.270009402",
      metadataRunnerId: "924.270009402-18766064",
      combinations: [
        {
          id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
          numLines: 1,
          potentialReturns: 1,
          stake: 1,
          totalStake: 0,
          odds: "ODDS",
        },
        {
          id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
          numLines: 1,
          stake: 1,
          potentialReturns: 1,
          totalStake: 0,
          odds: "ODDS",
        },
      ],
    };

    it("should return an id", () => {
      const { id } = setupCastBet();

      expect(id).toEqual("924.270009402");
    });

    it("should return a racing title", () => {
      const { title } = setupCastBet();

      expect(title).toEqual("racing title");
    });

    it("should return a selectedCastType using the context", () => {
      const { selectedCastType } = setupCastBet();

      expect(selectedCastType).toEqual("FORECAST:[924.270011329-19450853,924.270011329-24174446]");
    });

    describe("isOrderable", () => {
      describe("when leg is undefined", () => {
        it("should build with isOrderable as false", () => {
          isOrderableCast.mockReturnValue(true);

          const { isOrderable } = setupCastBet({
            castGroup: {
              ...DEFAULT_CAST_GROUP,
              combinations: [
                {
                  ...DEFAULT_CAST_GROUP.combinations[0],
                  legs: [undefined],
                },
              ],
            },
          });

          expect(isOrderable).toEqual(false);
        });
      });
      describe("when legs has no runners", () => {
        it("should build with isOrderable as false", () => {
          isOrderableCast.mockReturnValue(true);

          const { isOrderable } = setupCastBet({
            castGroup: VALID_CAST_GROUP,
            bettingState: {
              legs: Object.keys(DEFAULT_BETTING_STATE.legs).reduce((accumulator, currentValue) => {
                accumulator[currentValue] = {
                  ...DEFAULT_BETTING_STATE.legs[currentValue],
                  runners: undefined,
                };
                return accumulator;
              }, {}),
            },
          });

          expect(isOrderable).toEqual(false);
        });
      });
      describe("when at least one of the runners has no order", () => {
        it("should build with isOrderable as false", () => {
          isOrderableCast.mockReturnValue(false);

          const { isOrderable } = setupCastBet({
            castGroup: VALID_CAST_GROUP,
            bettingState: {
              ...DEFAULT_BETTING_STATE,
              runners: {
                ...DEFAULT_BETTING_STATE.runners,
                "924.270011329-19450853": { order: null },
              },
            },
          });

          expect(isOrderable).toEqual(false);
        });
      });

      describe("when the cast and runners are orderable", () => {
        it("should build with isOrderable as true", () => {
          isOrderableCast.mockReturnValue(true);

          const { isOrderable } = setupCastBet();

          expect(isOrderable).toEqual(true);
        });
      });
    });
  });

  describe("when there is not a valid cast group", () => {
    const INVALID_CAST_CONTEXT = {
      924.270009212: "FORECAST:[924.270009212-19450112,924.270009212-24174662]",
    };

    it("should return undefined", () => {
      const castBet = setupCastBet({ castContext: INVALID_CAST_CONTEXT });

      expect(castBet).toBeUndefined();
    });
  });
});

describe("createGetCastBetSelector", () => {
  const DEFAULT_CAST_GROUP = {
    id: "924.270009402",
    metadataRunnerId: "924.270009402-18766064",
    combinations: [
      {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legs: ["FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        numLines: 1,
        potentialReturns: 1,
        stake: 1,
        totalStake: 0,
        odds: "ODDS",
      },
      {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legs: ["REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
        numLines: 1,
        stake: 1,
        potentialReturns: 1,
        totalStake: 0,
        odds: "ODDS",
      },
    ],
  };

  const DEFAULT_CAST_CONTEXT = {
    924.270009402: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
  };

  const DEFAULT_BETTING_STATE = {
    legs: {
      "FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
      "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "REVERSE_FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
    },
    runners: {
      "924.270011329-19450853": { order: 1 },
      "924.270011329-24174446": { order: 2 },
    },
  };

  const DEFAULT_METADATA = {
    "924.270011329-19450853": "METADATA:19450853",
    "924.270011329-24174446": "METADATA:24174446",
  };

  const DEFAULT_USER_DETAILS = "userDetails";

  function setupCastBet({
    castGroup = DEFAULT_CAST_GROUP,
    castContext = DEFAULT_CAST_CONTEXT,
    bettingState = DEFAULT_BETTING_STATE,
    metadata = DEFAULT_METADATA,
    userDetails = DEFAULT_USER_DETAILS,
  } = {}) {
    return createGetCastBetSelector()(castGroup, castContext, bettingState, metadata, userDetails);
  }

  describe("when there is not a castContext", () => {
    it("should return undefined", () => {
      const result = setupCastBet({ castContext: {} });

      expect(result).toBe(undefined);
    });
  });

  describe("when there is a cast context", () => {
    it("should return correct values", () => {
      const result = setupCastBet();

      expect(result).toEqual({
        id: DEFAULT_CAST_GROUP.id,
        isOrderable: true,
        selectedCastType: DEFAULT_CAST_CONTEXT[DEFAULT_CAST_GROUP.id],
        title: "racing title",
      });
    });
  });
});

describe("getPriceBoostCount", () => {
  describe("when there's no boostWallet", () => {
    it("should return 0", () => {
      const count = getPriceBoostCount();

      expect(count).toBe(0);
    });
  });

  describe("when there's boostWallet", () => {
    describe("and there are combinations with isPriceBoostSelected as true", () => {
      it("should decrease count", () => {
        const boostWallet = { amount: 42 };
        const combinations = [
          { isPriceBoostSelected: true },
          { isPriceBoostSelected: false },
          { isPriceBoostSelected: true },
        ];
        const count = getPriceBoostCount(combinations, boostWallet);

        expect(count).toBe(40);
      });
    });
  });
});

describe("isAnyPriceBoostAvailable", () => {
  describe("when there's no combinations", () => {
    it("should return false", () => {
      const result = isAnyPriceBoostAvailable([]);

      expect(result).toBe(false);
    });
  });

  describe("when there's no combinations with isPriceBoostAvailable", () => {
    it("should return false", () => {
      const result = isAnyPriceBoostAvailable([{ isPriceBoostAvailable: false }, { isPriceBoostAvailable: false }]);

      expect(result).toBe(false);
    });
  });

  describe("when there's combinations with isPriceBoostAvailable", () => {
    it("should return true", () => {
      const result = isAnyPriceBoostAvailable([{ isPriceBoostAvailable: true }, { isPriceBoostAvailable: false }]);

      expect(result).toBe(true);
    });
  });
});

describe("buildMarketError", () => {
  describe("when market status is SUSPENDED", () => {
    it("should return notification", () => {
      buildMarketNotification.mockReturnValue("buildMarketNotification");
      const result = buildMarketError(ExchangeMarketStatus.Suspended);

      expect(result).toEqual({ notification: "buildMarketNotification" });
      expect(buildMarketNotification).toHaveBeenCalledWith(ExchangeMarketStatus.Suspended);
    });
  });

  describe("when market status is CLOSED", () => {
    it("should return notification", () => {
      buildMarketNotification.mockReturnValue("buildMarketNotification");
      const result = buildMarketError(ExchangeMarketStatus.Closed);

      expect(result).toEqual({ notification: "buildMarketNotification" });
      expect(buildMarketNotification).toHaveBeenCalledWith(ExchangeMarketStatus.Closed);
    });
  });

  describe("when market status is OPEN", () => {
    it("should return undefined", () => {
      const result = buildMarketError(ExchangeMarketStatus.Open);

      expect(result).toEqual(undefined);
    });
  });
});

describe("buildPlaceError", () => {
  describe("when market status is SUSPENDED", () => {
    it("should return undefined", () => {
      const result = buildPlaceError(ExchangeMarketStatus.Suspended);

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is CLOSED", () => {
    it("should return undefined", () => {
      const result = buildPlaceError(ExchangeMarketStatus.Closed);

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is OPEN", () => {
    describe("when exchangePlaceError is not defined", () => {
      it("should return undefined", () => {
        const result = buildPlaceError(ExchangeMarketStatus.Open);

        expect(result).toEqual(undefined);
      });
    });

    describe("when exchangePlaceError is defined", () => {
      it("should return notification", () => {
        buildExchangeTransactionalError.mockReturnValue("buildExchangeTransactionalError");
        const result = buildPlaceError(ExchangeMarketStatus.Open, "exchangePlaceError", "€");

        expect(result).toEqual({ notification: "buildExchangeTransactionalError" });
        expect(buildExchangeTransactionalError).toHaveBeenCalledWith("exchangePlaceError", "€");
      });
    });
  });
});

describe("buildPriceError", () => {
  describe("when market status is SUSPENDED", () => {
    it("should return undefined", () => {
      const result = buildPriceError(ExchangeMarketStatus.Suspended, "somePriceValidation");

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is CLOSED", () => {
    it("should return undefined", () => {
      const result = buildPriceError(ExchangeMarketStatus.Closed, "somePriceValidation");

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is OPEN", () => {
    describe("when there is a new price", () => {
      it("should return notification", () => {
        buildPriceNotification.mockReturnValue("buildPriceNotification");
        const previousStep = 1;
        const currentPrice = 2;
        const nextStep = 10;
        const priceValidation = { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep };
        const result = buildPriceError(ExchangeMarketStatus.Open, priceValidation, currentPrice);

        expect(result).toEqual({
          newPrice: previousStep,
          notification: "buildPriceNotification",
        });
        expect(buildPriceNotification).toHaveBeenCalledWith(priceValidation);
      });
    });

    describe("when a new price does not exist", () => {
      it("should return undefined", () => {
        buildPriceNotification.mockReturnValue("buildPriceNotification");
        const previousStep = 1;
        const currentPrice = undefined;
        const nextStep = 10;
        const priceValidation = { reason: CONST.LADDER.VALIDATIONS_REASONS.INVALID_STEP, previousStep, nextStep };
        const result = buildPriceError(ExchangeMarketStatus.Open, priceValidation, currentPrice);

        expect(result).toEqual(undefined);
      });
    });
  });
});

describe("buildSizeError", () => {
  const userDetails = {
    excSettings: {
      currencyDetails: {
        minStake: 1,
      },
    },
  };

  describe("when market status is SUSPENDED", () => {
    it("should return undefined", () => {
      const result = buildSizeError(ExchangeMarketStatus.Suspended, userDetails, "someSizeValidation");

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is CLOSED", () => {
    it("should return undefined", () => {
      const result = buildSizeError(ExchangeMarketStatus.Closed, userDetails, "someSizeValidation");

      expect(result).toEqual(undefined);
    });
  });

  describe("when market status is OPEN", () => {
    describe("when there is a new price", () => {
      it("should return notification", () => {
        buildSizeNotification.mockReturnValue("buildSizeNotificationMock");
        const result = buildSizeError(ExchangeMarketStatus.Open, userDetails, "someSizeValidation");

        expect(result).toEqual({
          newSize: userDetails.excSettings.currencyDetails.minStake,
          notification: "buildSizeNotificationMock",
        });
      });

      it("should call buildSizeNotification", () => {
        buildSizeError(ExchangeMarketStatus.Open, userDetails, "someSizeValidation");

        expect(buildSizeNotification).toHaveBeenCalledWith("someSizeValidation", "formatted value");
      });

      it("should return LADDER_DEFAULT_MIN_SIZE", () => {
        const result = buildSizeError(ExchangeMarketStatus.Open, { excSettings: {} }, "someSizeValidation");

        expect(result).toEqual(
          expect.objectContaining({
            newSize: LADDER_DEFAULT_MIN_SIZE,
          }),
        );
      });

      describe("when user details doesn't have min stake information", () => {
        it("should return LADDER_DEFAULT_MIN_SIZE", () => {
          const result = buildSizeError(ExchangeMarketStatus.Open, { excSettings: {} }, "someSizeValidation");

          expect(result).toEqual(
            expect.objectContaining({
              newSize: LADDER_DEFAULT_MIN_SIZE,
            }),
          );
        });
      });
    });

    describe("when there's no size validation", () => {
      it("should return undefined", () => {
        const result = buildSizeError(ExchangeMarketStatus.Open, userDetails, undefined);

        expect(result).toEqual(undefined);
      });
    });
  });
});
