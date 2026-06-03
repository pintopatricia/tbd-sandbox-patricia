import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { timeLeftFormatter } from "../../formatters/time-formatters";
import { PebbleFilterOptions } from "../../helpers/generosity-wallets";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getExtraWalletCard = jest.fn();

  return {
    createCardByURNSelector: () => getExtraWalletCard,
  };
});

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => {
  const getExtraWalletEntity = jest.fn(() => ({
    amount: "60",
    walletId: "WALLET_1",
    indexedId: "WALLET_1_INDEXED",
  }));

  return {
    createEntityByURNSelector: () => getExtraWalletEntity,
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCodeBcp47: "en-US",
  })),
}));

const mockGetUserPreferencesWithProductSwitcher = jest.fn(() => ({}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: () => mockGetUserPreferencesWithProductSwitcher,
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetCombinationEligibleGenerosityWalletsSelector: jest.fn(({ value }) => value),
}));

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(() => "4/1"),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => value),
}));

jest.mock("../../formatters/time-formatters", () => ({
  timeLeftFormatter: jest.fn((_, ms) => ms),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const DATE_NOW_MOCK = 1385903520000;

jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);

const mockCardUrn = "ppb:tbd:card:extraWalletCard:22294781090";
const mockEntityUrn = "ppb:tbd:extraWallet:22294781090";
const STATE_MOCK = {
  layouts: {
    cards: {
      extrawallet: {
        [mockCardUrn]: { extraWalletURN: mockEntityUrn },
      },
    },
  },
  entities: {
    extraWallets: {
      [mockEntityUrn]: { amount: "60", expirationDate: "2021-09-01T13:12:00.000Z" },
    },
  },
};

let props;

const setup = (
  expirationDate,
  lostLegs,
  maxReturn,
  badges = [],
  restrictions = {
    single: false,
    acca: false,
    sameGameMulti: false,
  },
  walletType = PebbleFilterOptions.FreeBets,
  maxFinPos,
  ghostLegs,
  fixedOdds,
) => {
  createCardByURNSelector().mockReturnValue({
    typename: "ExtraWalletCard",
    urn: mockCardUrn,
    extraWalletURN: mockEntityUrn,
    restrictions,
    badges,
  });
  createEntityByURNSelector().mockReturnValue({
    amount: "60",
    walletId: "WALLET_1",
    indexedId: "WALLET_1_INDEXED",
    walletType,
    ...(expirationDate ? { expirationDate } : {}),
    ...(lostLegs ? { lostLegs } : {}),
    ...(maxReturn ? { maxReturn } : {}),
    ...(maxFinPos ? { maxFinPos } : {}),
    ...(ghostLegs ? { ghostLegs } : {}),
    ...(fixedOdds ? { fixedOdds } : {}),
  });
  return makeMapStateToProps()(STATE_MOCK, { urn: mockCardUrn });
};

describe("makeMapStateToProps", () => {
  describe("when `getUserDetails` throws error", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });

      props = makeMapStateToProps()(STATE_MOCK, { urn: mockCardUrn });
    });

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(props).toEqual({});
    });
  });

  describe("when extraWalletCard is not defined", () => {
    it("should return props as empty", () => {
      createCardByURNSelector().mockReturnValueOnce(undefined);
      props = makeMapStateToProps()(STATE_MOCK, { urn: mockCardUrn });

      expect(props).toEqual({});
    });
  });

  describe("when extraWallet entity is not defined", () => {
    it("should return props as empty", () => {
      createEntityByURNSelector().mockReturnValueOnce(undefined);
      props = makeMapStateToProps()(STATE_MOCK, { urn: mockCardUrn });

      expect(props).toEqual({});
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    props = setup();
  });

  it("should fetch the card", () => {
    expect(createCardByURNSelector()).toHaveBeenCalledWith(STATE_MOCK.layouts.cards.extrawallet, mockCardUrn);
  });

  it("should fetch the entity", () => {
    expect(createEntityByURNSelector()).toHaveBeenCalledWith(STATE_MOCK.entities.extraWallets, mockEntityUrn);
  });

  describe("when wallet has expiration date", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      props = setup("2021-09-01T13:12:00.000Z");
    });
    it("should translate the free bets card title and time left label", () => {
      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.FREE_BET",
        interpolationValues: {
          value: "60",
        },
      });

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.LABEL.LEFT_TIME",
        interpolationValues: {
          time_left: 244598400000,
        },
      });
    });

    it("should format time left", () => {
      expect(timeLeftFormatter).toHaveBeenCalledWith("en-US", 244598400000);
    });

    it("should return the extra wallet card props", () => {
      expect(props).toEqual({
        countdownType: "default",
        optionId: "WALLET_1_INDEXED",
        title: "I18N.FREE_BET",
        timeLeftText: "I18N.LABEL.LEFT_TIME",
        badges: [],
      });
    });
  });

  describe("when wallet has restrictions and badges", () => {
    it("should return the extra wallet card props with the badges", () => {
      props = setup(undefined, undefined, undefined, ["Badge Mock 1", "Badge Mock 2"]);

      expect(props).toEqual({
        optionId: "WALLET_1_INDEXED",
        title: "I18N.FREE_BET",
        badges: [{ label: "Badge Mock 1" }, { label: "Badge Mock 2" }],
      });
    });

    describe("when sameGameMulti restriction is true", () => {
      it("should return a badge list with bet builder translation", () => {
        props = setup(undefined, undefined, undefined, ["Badge Mock"], {
          acca: true,
          sameGameMulti: true,
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.DESCRIPTION.BET_BUILDER",
        });

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.FREE_BET",
          badges: [{ label: "I18N.DESCRIPTION.BET_BUILDER", taggingLabel: "Bet Builder" }, { label: "Badge Mock" }],
        });
      });
    });

    describe("when acca restriction is true", () => {
      it("should return a badge list with acca translation", () => {
        props = setup(undefined, undefined, undefined, ["Badge Mock"], {
          acca: true,
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.ACCA",
        });

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.FREE_BET",
          badges: [{ label: "I18N.ACCA", taggingLabel: "Acca" }, { label: "Badge Mock" }],
        });
      });
    });

    describe("when single restriction is true and wallet type is money back", () => {
      it("should return a badge list with single translation", () => {
        props = setup(
          undefined,
          undefined,
          undefined,
          ["Badge Mock"],
          {
            single: true,
          },
          PebbleFilterOptions.MoneyBackToken,
        );
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MONEY_BACK_REWARD.SINGLE",
        });

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.MONEY_BACK_ACCA_TOKEN",
          badges: [{ label: "I18N.MONEY_BACK_REWARD.SINGLE", taggingLabel: "Single" }, { label: "Badge Mock" }],
        });
      });
    });
  });

  describe("when wallet type is price boost", () => {
    describe("and fixedOdds isn't available", () => {
      it("should return price boost's title", () => {
        props = setup(undefined, undefined, undefined, [], {}, PebbleFilterOptions.PriceBoostToken);

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.BOOST_VALUE",
          badges: [],
        });
      });
    });

    describe("and fixedOdds is available", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        props = setup(
          undefined,
          undefined,
          undefined,
          [],
          {},
          PebbleFilterOptions.PriceBoostToken,
          undefined,
          undefined,
          5,
        );
      });
      it("should return fixed odds booster title", () => {
        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.BOOST_FIXED_ODDS_VALUE",
          badges: [],
          formattedFixedOdds: "4/1",
          subtitle: undefined,
        });
      });

      it("should format fixed odds value", () => {
        expect(formatOdds).toHaveBeenCalledWith({ decimal: 5 }, OddsDisplayPreference.Fractional, false);
      });

      it("should call i18n with the formattedOdds", () => {
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BOOST_FIXED_ODDS_VALUE",
          interpolationValues: { value: "4/1" },
        });
      });
    });
  });

  describe("when wallet type is acca insurance", () => {
    beforeEach(jest.clearAllMocks);

    it("should return acca insurance's title and subtitle", () => {
      const mockLostLegs = 3;
      const mockMaxReturn = "100";
      props = setup(undefined, mockLostLegs, mockMaxReturn, [], {}, PebbleFilterOptions.AccaInsuranceToken, undefined);

      expect(props).toEqual({
        optionId: "WALLET_1_INDEXED",
        title: "I18N.MONEY_BACK_ACCA_TOKEN",
        subtitle: "I18N.MONEY_BACK_ACCA_CONDITION",
        badges: [],
      });

      expect(i18n).toHaveBeenNthCalledWith(6, {
        key: "I18N.MONEY_BACK_ACCA_CONDITION",
        interpolationValues: {
          numberOfLegs: mockLostLegs,
          value: mockMaxReturn,
        },
      });
    });
  });

  describe("when wallet type is ghost legs", () => {
    beforeEach(jest.clearAllMocks);

    it("should return ghost legs title and subtitle", () => {
      const mockGhostLegs = 2;
      props = setup(
        undefined,
        undefined,
        undefined,
        [],
        {},
        PebbleFilterOptions.GhostLegToken,
        undefined,
        mockGhostLegs,
      );

      expect(props).toEqual({
        optionId: "WALLET_1_INDEXED",
        title: "I18N.GHOST_LEG_TOKEN",
        subtitle: "I18N.GHOST_LEG_CONDITION",
        badges: [],
      });

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.GHOST_LEG_CONDITION",
        interpolationValues: {
          numberOfLegs: mockGhostLegs,
        },
      });
    });
  });

  describe("when wallet type is money back", () => {
    beforeEach(jest.clearAllMocks);
    describe("and maxFinPos is defined", () => {
      it("should return the correct money back's title and subtitle", () => {
        const mockMaxReturn = "100";
        props = setup(undefined, undefined, mockMaxReturn, [], {}, PebbleFilterOptions.MoneyBackToken, undefined);

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.MONEY_BACK_ACCA_TOKEN",
          subtitle: "I18N.MONEY_BACK_REWARD.HORSE_LOSES",
          badges: [],
        });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MONEY_BACK_REWARD.HORSE_LOSES",
          interpolationValues: {
            amount: mockMaxReturn,
          },
        });
      });
    });
    describe("and maxFinPos is not defined", () => {
      it("should return the correct money back's title and subtitle", () => {
        const mockMaxFinPos = 3;
        const mockMaxReturn = "100";
        props = setup(undefined, undefined, mockMaxReturn, [], {}, PebbleFilterOptions.MoneyBackToken, mockMaxFinPos);

        expect(props).toEqual({
          optionId: "WALLET_1_INDEXED",
          title: "I18N.MONEY_BACK_ACCA_TOKEN",
          subtitle: "I18N.MONEY_BACK_REWARD.RUN_PLACES",
          badges: [],
        });

        const mockPlaces =
          "2I18N.MONEY_BACK_REWARD.PLACED_SECOND I18N.MONEY_BACK_REWARD.SEPARATOR 3I18N.MONEY_BACK_REWARD.PLACED_THIRD";

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.MONEY_BACK_REWARD.RUN_PLACES",
          interpolationValues: {
            places: mockPlaces,
            amount: mockMaxReturn,
          },
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("on dispatchToggleWalletClick trigger", () => {
    describe("when firstBadge is selected", () => {
      it("should dispatch the UI__FREE_BETS_WALLET_T_CLICK action with a payload with the correct element text", () => {
        const { dispatchToggleWalletClick } = mapDispatchToProps;

        expect(
          dispatchToggleWalletClick(true, "money back", 1, "10.00", "all", undefined, WalletTypes.MoneyBackToken),
        ).toEqual({
          type: "UI__FREE_BETS_WALLET_TOGGLE_CLICK",
          payload: {
            isSelected: true,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: 1,
            totalAmount: "10.00",
            currentPebble: "all",
          },
        });
      });
    });

    describe("when a MONEY_BACK_TOKEN is selected", () => {
      it("should dispatch the UI__FREE_BETS_WALLET_T_CLICK action with a payload with the correct element text", () => {
        const { dispatchToggleWalletClick } = mapDispatchToProps;

        expect(
          dispatchToggleWalletClick(true, "money back", undefined, "10.00", "all", 3, WalletTypes.MoneyBackToken),
        ).toEqual({
          type: "UI__FREE_BETS_WALLET_TOGGLE_CLICK",
          payload: {
            isSelected: true,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: undefined,
            totalAmount: "10.00",
            currentPebble: "all",
            numberOfPlaces: 3,
          },
        });
      });
    });
  });
});
