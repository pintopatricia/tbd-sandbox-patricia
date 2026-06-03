import { ValueIconName } from "@ppb/the-wall-icons";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { createGetCombinationEligibleGenerosityWalletsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { PRICE_BOOST_MODE } from "@ppb/betslip-core/src/enums/price-boost-mode";
import {
  getPlacesListed,
  buildFreeBetsAlertMessage,
  getGenerosityBetslipAlertData,
  getGenerosityReceiptAlertData,
  createGenerosityCardsURNByTypeSelector,
  updateOptionWallets,
  formatDecimalOdds,
  formatFixedOdds,
} from "./generosity-wallets";
import { i18n } from "./i18n";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";

const i18nMock = jest.fn();

jest.mock("./i18n", () => ({
  i18n: (...args) => i18nMock(...args),
}));

jest.mock("../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `${value}€`),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => {
  const getCombinationEligibleGenerosityWallets = jest.fn();

  return {
    createGetCombinationEligibleGenerosityWalletsSelector: jest.fn(() => getCombinationEligibleGenerosityWallets),
  };
});

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(),
}));

const { formatOdds: formatOddsMock } = require("@ppb/tbd-store/helpers/formatters");

const userDetails = { currency: "EUR", locale: "pt-PT" };

const moneyBackTranslationMock = {
  "I18N.MONEY_BACK_REWARD.HORSE_LOSES": "If your horse loses, get up to {{amount}} in Free Bets",
  "I18N.MONEY_BACK_REWARD.MONEY_BACK_APPLIED": "Money Back Applied",
  "I18N.MONEY_BACK_REWARD.PLACED_OTHER": "th",
  "I18N.MONEY_BACK_REWARD.PLACED_SECOND": "nd",
  "I18N.MONEY_BACK_REWARD.PLACED_THIRD": "rd",
  "I18N.MONEY_BACK_REWARD.RUN_PLACES": "Run {{places}}, get up to {{amount}} in Free Bets",
  "I18N.MONEY_BACK_REWARD.SEPARATOR": "or",
  "I18N.MONEY_BACK_REWARD.SINGLE": "Single",
};

describe("formatDecimalOdds", () => {
  it("should format whole numbers with 1 decimal place", () => {
    expect(formatDecimalOdds(2)).toBe("2.0");
    expect(formatDecimalOdds(4)).toBe("4.0");
  });

  it("should format numbers with 1 decimal place as is", () => {
    expect(formatDecimalOdds(2.5)).toBe("2.5");
    expect(formatDecimalOdds(3.5)).toBe("3.5");
  });

  it("should format numbers with 2 decimal places as is", () => {
    expect(formatDecimalOdds(2.75)).toBe("2.75");
    expect(formatDecimalOdds(3.57)).toBe("3.57");
  });
});

describe("formatFixedOdds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should use formatDecimalOdds for decimal preference", () => {
    expect(formatFixedOdds(4, OddsDisplayPreference.Decimal)).toBe("4.0");
    expect(formatFixedOdds(2.5, OddsDisplayPreference.Decimal)).toBe("2.5");
    expect(formatFixedOdds(2.75, OddsDisplayPreference.Decimal)).toBe("2.75");
  });

  it("should use formatOdds for fractional preference", () => {
    formatOddsMock.mockReturnValue("3/1");
    expect(formatFixedOdds(4, OddsDisplayPreference.Fractional)).toBe("3/1");
    expect(formatOddsMock).toHaveBeenCalledWith({ decimal: 4 }, OddsDisplayPreference.Fractional, false);
  });

  it("should default to fractional when no preference provided", () => {
    formatOddsMock.mockReturnValue("3/1");
    expect(formatFixedOdds(4, undefined)).toBe("3/1");
    expect(formatOddsMock).toHaveBeenCalledWith({ decimal: 4 }, OddsDisplayPreference.Fractional, false);
  });

  it("should default to fractional when not decimal", () => {
    formatOddsMock.mockReturnValue("3/1");
    expect(formatFixedOdds(4, OddsDisplayPreference.American)).toBe("3/1");
    expect(formatOddsMock).toHaveBeenCalledWith({ decimal: 4 }, OddsDisplayPreference.Fractional, false);
  });
});

describe("getPlacesListed", () => {
  beforeEach(() => {
    i18nMock.mockImplementation(({ key }) => moneyBackTranslationMock[key] ?? key);
    jest.clearAllMocks();
  });

  describe("when passed maxFinPos is null or undefined", () => {
    it("should return empty string", () => {
      expect(getPlacesListed()).toBe("");
      expect(getPlacesListed(null)).toBe("");
    });
  });

  describe("when passed maxFinPos is 0", () => {
    it("should return empty string", () => {
      expect(getPlacesListed(0)).toBe("");
    });
  });

  describe("when passed maxFinPos is 1", () => {
    it("should return empty string", () => {
      expect(getPlacesListed(0)).toBe("");
    });
  });

  describe("when max finished position is 2", () => {
    it("should return '2nd'", () => {
      expect(getPlacesListed(2)).toBe("2nd");
    });
  });

  describe("when max finished position is 3", () => {
    it("should return '2nd or 3rd'", () => {
      expect(getPlacesListed(3)).toBe("2nd or 3rd");
    });
  });

  describe("when max finished position is 4", () => {
    it("should return '2nd, 3rd or 4th'", () => {
      expect(getPlacesListed(4)).toBe("2nd, 3rd or 4th");
    });
  });

  describe("when max finished position is 5", () => {
    it("should return '2nd, 3rd, 4th or 5th'", () => {
      expect(getPlacesListed(5)).toBe("2nd, 3rd, 4th or 5th");
    });
  });

  describe("when max finished position is 6", () => {
    it("should return '2nd, 3rd, 4th, 5th or 6th'", () => {
      expect(getPlacesListed(6)).toBe("2nd, 3rd, 4th, 5th or 6th");
    });
  });
});

describe("buildFreeBetsAlertMessage", () => {
  beforeEach(() => {
    i18nMock.mockImplementation(({ key, interpolationValues }) =>
      interpolationValues ? { key, interpolationValues } : key,
    );
    jest.clearAllMocks();
  });

  it("should return undefined if messageAmount is not provided", () => {
    const result = buildFreeBetsAlertMessage({ userDetails });
    expect(result).toBeUndefined();
  });

  it("should return a formatted message for single line", () => {
    const result = buildFreeBetsAlertMessage({
      userDetails,
      combinationAmount: 100,
    });

    expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
      ...userDetails,
      value: 100,
      decimalPlaces: 2,
    });

    expect(i18nMock).toHaveBeenCalledWith({
      key: "I18N.LABEL.BETSLIP_FREEBETS",
      interpolationValues: { bonus: "100€" },
    });

    expect(result).toEqual({
      key: "I18N.LABEL.BETSLIP_FREEBETS",
      interpolationValues: { bonus: "100€" },
    });
  });

  it("should return a formatted message for multi line", () => {
    const result = buildFreeBetsAlertMessage({
      userDetails,
      combinationAmountPerLine: 50,
      numLines: 2,
    });

    expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
      ...userDetails,
      value: 50,
      decimalPlaces: 2,
    });

    expect(i18nMock).toHaveBeenCalledWith({
      key: "I18N.LABEL.BETSLIP_FREEBETS",
      interpolationValues: { bonus: "2 x 50€" },
    });

    expect(result).toEqual({
      key: "I18N.LABEL.BETSLIP_FREEBETS",
      interpolationValues: { bonus: "2 x 50€" },
    });
  });

  it("should return undefined if combinationAmountPerLine is not provided for multi line", () => {
    const result = buildFreeBetsAlertMessage({
      userDetails,
      numLines: 2,
    });

    expect(result).toBeUndefined();
  });
});

describe("getGenerosityBetslipAlertData", () => {
  beforeEach(() => {
    i18nMock.mockImplementation(({ key, interpolationValues }) =>
      interpolationValues ? { key, interpolationValues } : key,
    );
    jest.clearAllMocks();
  });

  describe("when acca insurance token is selected", () => {
    it("should return money back message, icon and type", () => {
      const mockAccaInsuranceNumberOfLegs = 1;
      const mockAccaInsuranceAmountLimit = 10;
      const result = getGenerosityBetslipAlertData({
        combination: {
          accaInsuranceNumberOfLegs: mockAccaInsuranceNumberOfLegs,
          accaInsuranceAmountLimit: mockAccaInsuranceAmountLimit,
        },
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: true,
        isFreeBetsSelected: false,
        isPriceBoostSelected: false,
        isSingleBetBetslip: false,
        isGhostLegTokenSelected: false,
        userDetails,
      });

      expect(result).toEqual({
        message: i18n({
          key: "I18N.MONEY_BACK_ACCA_CONDITION",
          interpolationValues: {
            numberOfLegs: mockAccaInsuranceNumberOfLegs,
            value: "10€",
          },
        }),
        icon: ValueIconName.MONEY_BACK,
        type: WalletTypes.AccaInsuranceToken,
      });
    });
  });

  describe("when money back token is selected", () => {
    beforeEach(() => {
      i18nMock.mockImplementation(({ key }) => moneyBackTranslationMock[key] ?? key);
      jest.clearAllMocks();
    });

    it("should return money back message for max finished position, icon and type", () => {
      const result = getGenerosityBetslipAlertData({
        combination: {
          moneyBackTokenId: "",
          moneyBackNumberOfPlaces: 5,
          moneyBackEventRestricted: false,
          moneyBackCompetitionRestricted: false,
          moneyBackAmountLimit: 20,
          moneyBackMarketRestricted: false,
        },
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: false,
        isFreeBetsSelected: false,
        isPriceBoostSelected: false,
        isSingleBetBetslip: false,
        isMoneyBackTokenSelected: true,
        isGhostLegTokenSelected: false,
        userDetails,
      });

      expect(result).toEqual({
        message: i18nMock({
          key: "I18N.MONEY_BACK_REWARD.RUN_PLACES",
          interpolationValues: { places: "2nd, 3rd, 4th or 5th", amount: "20€" },
        }),
        icon: ValueIconName.MONEY_BACK,
        type: WalletTypes.MoneyBackToken,
      });
    });

    it("should return money back message for all losers, icon and type", () => {
      const result = getGenerosityBetslipAlertData({
        combination: {
          moneyBackTokenId: "",
          moneyBackNumberOfPlaces: undefined,
          moneyBackEventRestricted: false,
          moneyBackCompetitionRestricted: false,
          moneyBackAmountLimit: 20,
          moneyBackMarketRestricted: false,
        },
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: false,
        isFreeBetsSelected: false,
        isPriceBoostSelected: false,
        isSingleBetBetslip: false,
        isMoneyBackTokenSelected: true,
        isGhostLegTokenSelected: false,
        userDetails,
      });

      expect(result).toEqual({
        message: i18nMock({
          key: "I18N.MONEY_BACK_REWARD.HORSE_LOSES",
        }),
        icon: ValueIconName.MONEY_BACK,
        type: WalletTypes.MoneyBackToken,
      });
    });
  });

  describe("when price boost is selected", () => {
    it("should return price boost message and icon", () => {
      const mockPriceBoostTokenId = "1312131213";
      const mockGenerosity = 10;
      const result = getGenerosityBetslipAlertData({
        combination: {
          priceBoostOffers: [
            {
              tokenId: mockPriceBoostTokenId,
              generosity: mockGenerosity,
            },
          ],
          priceBoostTokenId: mockPriceBoostTokenId,
        },
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: false,
        isFreeBetsSelected: false,
        isPriceBoostSelected: true,
        isSingleBetBetslip: false,
        isGhostLegTokenSelected: false,
        userDetails,
      });
      expect(result).toEqual({
        message: i18n({
          key: "I18N.BOOST_VALUE_APPLIED",
          interpolationValues: {
            value: mockGenerosity,
          },
        }),
        icon: ValueIconName.BOOSTER,
        type: WalletTypes.PriceBoostToken,
      });
    });

    describe("when price boost has fixed odds mode", () => {
      const mockPriceBoostTokenId = "fixed-odds-token-123";
      const mockPriceBoostDisplayOdds = {
        decimalOdds: 4.0,
      };

      const getFixedOddsAlertData = (oddsDisplayPreference) =>
        getGenerosityBetslipAlertData({
          combination: {
            priceBoostOffers: [
              {
                tokenId: mockPriceBoostTokenId,
                mode: PRICE_BOOST_MODE.FIXED_ODDS,
                odds: mockPriceBoostDisplayOdds,
                generosity: 0,
              },
            ],
            priceBoostTokenId: mockPriceBoostTokenId,
          },
          numLines: undefined,
          combinationAmountPerLine: undefined,
          combinationAmount: undefined,
          isAccaInsuranceTokenSelected: false,
          isFreeBetsSelected: false,
          isPriceBoostSelected: true,
          isSingleBetBetslip: false,
          userDetails,
          oddsDisplayPreference,
        });

      it("should return fixed odds message with BOOST_FIXED_ODDS_VALUE_APPLIED", () => {
        formatOddsMock.mockReturnValue("3/1");

        const result = getFixedOddsAlertData(undefined);

        expect(formatOddsMock).toHaveBeenCalledWith(
          { decimal: mockPriceBoostDisplayOdds.decimalOdds },
          OddsDisplayPreference.Fractional,
          false,
        );

        expect(result).toEqual({
          message: i18n({
            key: "I18N.BOOST_FIXED_ODDS_VALUE_APPLIED",
            interpolationValues: {
              value: "3/1",
            },
          }),
          icon: ValueIconName.BOOSTER,
          type: WalletTypes.PriceBoostToken,
        });

        formatOddsMock.mockReset();
      });

      it("should display correct value if fractional odds preference is provided", () => {
        formatOddsMock.mockReturnValue("3/1");

        const result = getFixedOddsAlertData(OddsDisplayPreference.Fractional);

        expect(formatOddsMock).toHaveBeenCalledWith(
          { decimal: mockPriceBoostDisplayOdds.decimalOdds },
          OddsDisplayPreference.Fractional,
          false,
        );

        expect(result).toEqual({
          message: i18n({
            key: "I18N.BOOST_FIXED_ODDS_VALUE_APPLIED",
            interpolationValues: {
              value: "3/1",
            },
          }),
          icon: ValueIconName.BOOSTER,
          type: WalletTypes.PriceBoostToken,
        });

        formatOddsMock.mockReset();
      });

      it("should display correct value if decimal odds preference is provided", () => {
        const result = getFixedOddsAlertData(OddsDisplayPreference.Decimal);

        expect(formatOddsMock).not.toHaveBeenCalled();

        expect(result).toEqual({
          message: i18n({
            key: "I18N.BOOST_FIXED_ODDS_VALUE_APPLIED",
            interpolationValues: {
              value: "4.0",
            },
          }),
          icon: ValueIconName.BOOSTER,
          type: WalletTypes.PriceBoostToken,
        });
      });

      describe("when price boost has no generosity or fixed odds", () => {
        it("should return empty object when neither generosity nor fixed odds are available", () => {
          const mockPriceBoostTokenId = "empty-boost-999";

          const result = getGenerosityBetslipAlertData({
            combination: {
              priceBoostOffers: [
                {
                  tokenId: mockPriceBoostTokenId,
                  mode: PRICE_BOOST_MODE.PERCENTAGE,
                  generosity: 0,
                },
              ],
              priceBoostTokenId: mockPriceBoostTokenId,
            },
            numLines: undefined,
            combinationAmountPerLine: undefined,
            combinationAmount: undefined,
            isAccaInsuranceTokenSelected: false,
            isFreeBetsSelected: false,
            isPriceBoostSelected: true,
            isSingleBetBetslip: false,
            userDetails,
          });

          expect(result).toEqual({});
        });
      });
    });
  });

  describe("when ghost leg token is selected", () => {
    it("should return ghost leg message, icon and type", () => {
      const mockGhostLegs = 3;
      const result = getGenerosityBetslipAlertData({
        combination: {},
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: false,
        isFreeBetsSelected: false,
        isPriceBoostSelected: false,
        isMoneyBackTokenSelected: false,
        isGhostLegTokenSelected: true,
        isSingleBetBetslip: false,
        ghostLegs: mockGhostLegs,
        userDetails,
      });

      expect(result).toEqual({
        message: i18n({
          key: "I18N.GHOST_LEG_CONDITION",
          interpolationValues: {
            numberOfLegs: mockGhostLegs,
          },
        }),
        icon: ValueIconName.GHOST_LEG,
        type: WalletTypes.GhostLegToken,
      });
    });

    it("should return empty object when ghostLegs is falsy", () => {
      const result = getGenerosityBetslipAlertData({
        combination: {},
        numLines: undefined,
        combinationAmountPerLine: undefined,
        combinationAmount: undefined,
        isAccaInsuranceTokenSelected: false,
        isFreeBetsSelected: false,
        isPriceBoostSelected: false,
        isMoneyBackTokenSelected: false,
        isGhostLegTokenSelected: true,
        isSingleBetBetslip: false,
        ghostLegs: undefined,
        userDetails,
      });

      expect(result).toEqual({});
    });
  });

  describe("when free bets is selected", () => {
    describe("and betslip is not one single", () => {
      it("should return free bets message, icon and type", () => {
        const mockPriceBoostTokenId = "1312131213";
        const mockGenerosity = 10;
        const mockNumLines = 3;
        const mockCombinationAmountPerLine = 5;
        const result = getGenerosityBetslipAlertData({
          combination: {
            priceBoostOffers: [
              {
                tokenId: mockPriceBoostTokenId,
                generosity: mockGenerosity,
              },
            ],
            priceBoostTokenId: mockPriceBoostTokenId,
          },
          numLines: mockNumLines,
          combinationAmountPerLine: mockCombinationAmountPerLine,
          combinationAmount: 10,
          isAccaInsuranceTokenSelected: false,
          isFreeBetsSelected: true,
          isPriceBoostSelected: false,
          isSingleBetBetslip: false,
          isGhostLegTokenSelected: false,
          userDetails,
        });

        expect(result).toEqual({
          message: i18n({
            key: "I18N.LABEL.BETSLIP_FREEBETS",
            interpolationValues: {
              bonus: `${mockNumLines} x ${mockCombinationAmountPerLine}€`,
            },
          }),
          icon: ValueIconName.FREE_BET,
          type: WalletTypes.BonusCash,
        });
      });
    });

    describe("and betslip is one single", () => {
      it("should not return free bets message and return icon and type", () => {
        const mockPriceBoostTokenId = "1312131213";
        const mockGenerosity = 10;
        const result = getGenerosityBetslipAlertData({
          combination: {
            priceBoostOffers: [
              {
                tokenId: mockPriceBoostTokenId,
                generosity: mockGenerosity,
              },
            ],
            priceBoostTokenId: mockPriceBoostTokenId,
          },
          numLines: 3,
          combinationAmountPerLine: 5,
          combinationAmount: 10,
          isAccaInsuranceTokenSelected: false,
          isFreeBetsSelected: true,
          isPriceBoostSelected: false,
          isSingleBetBetslip: true,
          isGhostLegTokenSelected: false,
          userDetails,
        });

        expect(result).toEqual({
          message: undefined,
          icon: ValueIconName.FREE_BET,
          type: WalletTypes.BonusCash,
        });
      });
    });
  });
});

describe("getGenerosityReceiptAlertData", () => {
  beforeEach(() => {
    i18nMock.mockImplementation(({ key, interpolationValues }) =>
      interpolationValues ? { key, interpolationValues } : key,
    );
    jest.clearAllMocks();
  });

  describe("when free bets is active and hasBonusUsed is true", () => {
    it("should return free bets message and icon with the correct values", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: true,
          totalBonusUsed: 15,
          isAccaInsuredToken: false,
          isPriceBoosted: false,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: true,
      });

      expect(result).toEqual({
        message: i18n({
          key: "I18N.LABEL.BETSLIP_FREEBETS",
          interpolationValues: {
            bonus: `15€`,
          },
        }),
        icon: "Value--Free-Bet",
      });
    });
  });

  describe("when acca insurance token is applied", () => {
    it("should return acca insurance message and icon with the correct values", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: false,
          totalBonusUsed: 15,
          isAccaInsuredToken: true,
          isPriceBoosted: true,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: true,
      });

      expect(result).toEqual({
        message: "I18N.MONEY_BACK_ACCA_APPLIED",
        icon: "Value--Money-Back",
      });
    });
  });

  describe("when price boost token is applied", () => {
    it("should return price boost message and icon with the correct values", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: false,
          totalBonusUsed: 15,
          isAccaInsuredToken: false,
          isPriceBoosted: true,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: false,
      });

      expect(result).toEqual({
        message: "I18N.BOOST_APPLIED",
        icon: "Value--Booster",
      });
    });
  });

  describe("when money back token is applied", () => {
    it("should return money back message and icon with the correct values", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: false,
          isAccaInsuredToken: false,
          isPriceBoosted: false,
          hasMoneyBackUsed: true,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: false,
      });

      expect(result).toEqual({
        message: "I18N.MONEY_BACK_REWARD.MONEY_BACK_APPLIED",
        icon: "Value--Money-Back",
      });
    });
  });

  describe("when ghost leg token is applied", () => {
    it("should return ghost leg message and icon with the correct values", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: false,
          isAccaInsuredToken: false,
          isPriceBoosted: false,
          hasMoneyBackUsed: false,
          hasGhostLeg: true,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: false,
      });

      expect(result).toEqual({
        message: "I18N.GHOST_LEG_APPLIED",
        icon: "Value--Ghost-Leg",
      });
    });
  });

  describe("when no token is applied", () => {
    it("should return an empty object", () => {
      const result = getGenerosityReceiptAlertData({
        combination: {
          hasBonusUsed: false,
          totalBonusUsed: 15,
          isAccaInsuredToken: false,
          isPriceBoosted: false,
          hasMoneyBackUsed: false,
        },
        userDetails: { timezone: "UTC" },
        isFreeBetsWalletsActive: false,
      });

      expect(result).toEqual({});
    });
  });
});

describe("createGenerosityCardsURNByTypeSelector", () => {
  beforeEach(() => {
    i18nMock.mockImplementation(({ key, interpolationValues }) =>
      interpolationValues ? { key, interpolationValues } : key,
    );
  });

  const mockState = {
    entities: {
      extraWallets: {
        "urn:freebet:1": {
          walletType: WalletTypes.BonusCash,
        },
        "urn:freebet:2": {
          walletType: WalletTypes.AccaInsuranceToken,
        },
        "urn:freebet:3": {
          walletType: WalletTypes.MoneyBackToken,
        },
      },
    },
    layouts: {
      cards: {
        extrawallet: {
          "urn:card:freebet:1": {
            urn: "urn:card:freebet:1",
            extraWalletURN: "urn:freebet:1",
          },
          "urn:card:freebet:2": {
            urn: "urn:card:freebet:2",
            extraWalletURN: "urn:freebet:2",
          },
          "urn:card:freebet:3": {
            urn: "urn:card:freebet:3",
            extraWalletURN: "urn:freebet:3",
          },
        },
      },
    },
  };

  describe("when in Betslip mode", () => {
    it("should return the cards sorted by type and filtered by eligible wallets", () => {
      createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({
        "freebet:1": {
          walletId: "freebet:1",
          amount: 20,
          combinationId: "COMB_1",
        },
        "freebet:4": {
          walletId: "freebet:3",
          amount: 21,
          combinationId: "COMB_3",
        },
        "freebet:5": {
          walletId: "freebet:4",
          amount: 22,
          combinationId: "COMB_4",
        },
      });
      const getGenerosityCardsURNByTypeSelector = createGenerosityCardsURNByTypeSelector();
      const result = getGenerosityCardsURNByTypeSelector(mockState);

      expect(result).toEqual({
        BONUS_CASH: ["urn:card:freebet:1"],
      });
    });
  });

  describe("when not in Betslip mode", () => {
    beforeAll(() => {
      createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
    });

    it("should return the cards urn sorted by type", () => {
      const getGenerosityCardsURNByTypeSelector = createGenerosityCardsURNByTypeSelector();
      const result = getGenerosityCardsURNByTypeSelector(mockState);

      expect(result).toEqual({
        BONUS_CASH: ["urn:card:freebet:1"],
        ACCA_INSURANCE_TOKEN: ["urn:card:freebet:2", "urn:card:freebet:3"],
      });
    });

    it("should ignore wallets without wallet type", () => {
      const getGenerosityCardsURNByTypeSelector = createGenerosityCardsURNByTypeSelector();
      const result = getGenerosityCardsURNByTypeSelector({
        ...mockState,
        entities: {
          extraWallets: {
            ...mockState.entities.extraWallets,
            "urn:freebet:3": {},
          },
        },
        layouts: {
          cards: {
            extrawallet: {
              ...mockState.layouts.cards.extrawallet,
              "urn:card:freebet:3": {
                urn: "urn:card:freebet:3",
                extraWalletURN: "urn:freebet:3",
              },
            },
          },
        },
      });

      expect(result).toEqual({
        BONUS_CASH: ["urn:card:freebet:1"],
        ACCA_INSURANCE_TOKEN: ["urn:card:freebet:2"],
      });
    });
  });
});

describe("updateOptionWallets", () => {
  const mockPreviousWallets = {
    WALLET_1: { walletId: "WALLET_1", type: WalletTypes.BonusCash, amount: 10, isSelected: false, isDisabled: false },
    WALLET_2: {
      walletId: "WALLET_2",
      type: WalletTypes.BonusCash,
      amount: 10,
      isSelected: true,
      isDisabled: false,
      combinationId: "COMB_1",
    },
    WALLET_3: {
      walletId: "WALLET_3",
      type: WalletTypes.BonusCash,
      amount: 10,
      isSelected: true,
      isDisabled: true,
      combinationId: "COMB_2",
    },
    WALLET_4: {
      walletId: "WALLET_4",
      type: WalletTypes.AccaInsuranceToken,
      numberOfLegs: 2,
      maxStake: 10,
      isSelected: false,
      isDisabled: false,
    },
    WALLET_5: {
      walletId: "WALLET_5",
      type: WalletTypes.AccaInsuranceToken,
      numberOfLegs: 1,
      maxStake: 15,
      isSelected: true,
      isDisabled: false,
      combinationId: "COMB_1",
    },
    WALLET_6: {
      walletId: "WALLET_6",
      type: WalletTypes.AccaInsuranceToken,
      numberOfLegs: 3,
      maxStake: 20,
      isSelected: true,
      isDisabled: true,
      combinationId: "COMB_2",
    },
    WALLET_7: {
      walletId: "WALLET_7",
      type: WalletTypes.PriceBoostToken,
      generosity: 10,
      isSelected: false,
      isDisabled: false,
    },
    WALLET_8: {
      walletId: "WALLET_8",
      type: WalletTypes.PriceBoostToken,
      generosity: 15,
      isSelected: true,
      isDisabled: false,
      combinationId: "COMB_1",
    },
    WALLET_9: {
      walletId: "WALLET_9",
      type: WalletTypes.PriceBoostToken,
      generosity: 20,
      isSelected: true,
      isDisabled: true,
      combinationId: "COMB_2",
    },
    WALLET_10: {
      walletId: "WALLET_10",
      type: WalletTypes.MoneyBackToken,
      isSelected: true,
      isDisabled: true,
      combinationId: "COMB_3",
    },
  };

  describe("when the user selects a wallet", () => {
    describe("when the selected wallet is of type BONUS_CASH", () => {
      it("should update the wallets object by toggling the selected wallet and keeping all the other BONUS_CASH wallets the same, but unselecting the wallets of other types", () => {
        const result = updateOptionWallets(mockPreviousWallets, "WALLET_1", true, "COMB_1");

        expect(result).toEqual({
          ...mockPreviousWallets,
          WALLET_1: { ...mockPreviousWallets.WALLET_1, isSelected: true, combinationId: "COMB_1" },
          WALLET_5: { ...mockPreviousWallets.WALLET_5, isSelected: false, combinationId: undefined },
          WALLET_7: { ...mockPreviousWallets.WALLET_7, isSelected: false, combinationId: undefined },
          WALLET_8: { ...mockPreviousWallets.WALLET_8, isSelected: false, combinationId: undefined },
        });
      });
    });

    describe("when the selected wallet is of type ACCA_INSURANCE_TOKEN", () => {
      it("should update the wallets object by toggling the selected wallet and unselecting all the other enabled wallets", () => {
        const result = updateOptionWallets(mockPreviousWallets, "WALLET_4", true, "COMB_1");

        expect(result).toEqual({
          ...mockPreviousWallets,
          WALLET_2: { ...mockPreviousWallets.WALLET_2, isSelected: false, combinationId: undefined },
          WALLET_4: { ...mockPreviousWallets.WALLET_4, isSelected: true, combinationId: "COMB_1" },
          WALLET_5: { ...mockPreviousWallets.WALLET_5, isSelected: false, combinationId: undefined },
          WALLET_7: { ...mockPreviousWallets.WALLET_7, isSelected: false, combinationId: undefined },
          WALLET_8: { ...mockPreviousWallets.WALLET_8, isSelected: false, combinationId: undefined },
        });
      });
    });

    describe("when the selected wallet is of type PRICE_BOOST_TOKEN", () => {
      it("should update the wallets object by toggling the selected wallet and unselecting all the other enabled wallets", () => {
        const result = updateOptionWallets(mockPreviousWallets, "WALLET_7", true, "COMB_1");

        expect(result).toEqual({
          ...mockPreviousWallets,
          WALLET_2: { ...mockPreviousWallets.WALLET_2, isSelected: false, combinationId: undefined },
          WALLET_4: { ...mockPreviousWallets.WALLET_4, isSelected: false, combinationId: undefined },
          WALLET_5: { ...mockPreviousWallets.WALLET_5, isSelected: false, combinationId: undefined },
          WALLET_7: { ...mockPreviousWallets.WALLET_7, isSelected: true, combinationId: "COMB_1" },
          WALLET_8: { ...mockPreviousWallets.WALLET_8, isSelected: false, combinationId: undefined },
        });
      });
    });

    describe("when the selected wallet is of type MONEY_BACK_TOKEN", () => {
      it("should update the wallets object by toggling the selected wallet and unselecting all the other enabled wallets", () => {
        const result = updateOptionWallets(mockPreviousWallets, "WALLET_10", true, "COMB_3");

        expect(result).toEqual({
          ...mockPreviousWallets,
          WALLET_2: { ...mockPreviousWallets.WALLET_2, isSelected: false, combinationId: undefined },
          WALLET_4: { ...mockPreviousWallets.WALLET_4, isSelected: false, combinationId: undefined },
          WALLET_5: { ...mockPreviousWallets.WALLET_5, isSelected: false, combinationId: undefined },
          WALLET_7: { ...mockPreviousWallets.WALLET_7, isSelected: false, combinationId: undefined },
          WALLET_8: { ...mockPreviousWallets.WALLET_8, isSelected: false, combinationId: undefined },
          WALLET_10: { ...mockPreviousWallets.WALLET_10, isSelected: true, combinationId: "COMB_3" },
        });
      });
    });
  });

  describe("when the user unselects a wallet", () => {
    it("should desselect that wallet and unselected all the others for that combination", () => {
      const result = updateOptionWallets(mockPreviousWallets, "WALLET_3", false, "COMB_2");

      expect(result).toEqual({
        ...mockPreviousWallets,
        WALLET_3: { ...mockPreviousWallets.WALLET_3, isSelected: false, combinationId: undefined },
      });
    });
  });
});
