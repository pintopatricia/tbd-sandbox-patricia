import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { createGetCombinationEligibleGenerosityWalletsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ValueIconName } from "@ppb/the-wall-icons";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { PebbleFilterOptions, createGenerosityCardsURNByTypeSelector } from "../../helpers/generosity-wallets";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => {
  const getExtraWalletCardGroupSelector = jest.fn(() => ({
    urn: "ppb:tbd:cardgroup:extraWalletCardGroup",
    typename: "ExtraWalletCardGroup",
  }));

  return {
    createCardGroupByURNSelector: jest.fn(() => getExtraWalletCardGroupSelector),
  };
});

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => {
  const getCombinationEligibleGenerosityWallets = jest.fn(() => ({}));

  return {
    createGetCombinationEligibleGenerosityWalletsSelector: jest.fn(() => getCombinationEligibleGenerosityWallets),
  };
});

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation(({ value }) => `${value}.00€`),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ localeCode: "en-GB" })),
}));

jest.mock("../../helpers/generosity-wallets", () => {
  const getGenerosityCardsURNByTypeSelector = jest.fn({});

  return {
    ...jest.requireActual("../../helpers/generosity-wallets"),
    createGenerosityCardsURNByTypeSelector: jest.fn(() => getGenerosityCardsURNByTypeSelector),
  };
});

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const mockI18nLabels = {
  helpButtonLabel: "I18N.HELP_LABEL",
  helpMessage: "I18N.BONUSES_HELP_MSG",
};
const mockUrn = "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets";
const STATE_MOCK = {
  layouts: {
    cardgroups: {
      extrawalletcardgroups: {
        [mockUrn]: "ExtraWalletCardGroup",
      },
    },
    cards: {
      extrawallet: {
        "ppb:tbd:card:extraWalletCard:WALLET_1": {
          urn: "ppb:tbd:card:extraWalletCard:WALLET_1",
        },
        "ppb:tbd:card:extraWalletCard:WALLET_2": {
          urn: "ppb:tbd:card:extraWalletCard:WALLET_2",
        },
        "ppb:tbd:card:extraWalletCard:WALLET_3": {
          urn: "ppb:tbd:card:extraWalletCard:WALLET_3",
        },
        "ppb:tbd:card:extraWalletCard:WALLET_4": {
          urn: "ppb:tbd:card:extraWalletCard:WALLET_4",
        },
      },
    },
  },
};

let props;

describe("makeMapStateToProps", () => {
  it("should create the get selectors", () => {
    makeMapStateToProps();

    expect(createCardGroupByURNSelector).toHaveBeenCalled();
    expect(createGetCombinationEligibleGenerosityWalletsSelector).toHaveBeenCalled();
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeAll(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
      props = makeMapStateToProps()(STATE_MOCK, {});
    });

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return an empty object", () => {
      expect(props).toEqual({});
    });
  });

  describe("when 'getUserDetails' returns correctly", () => {
    beforeAll(() => {
      createCardGroupByURNSelector().mockReturnValue({
        urn: "ppb:tbd:cardgroup:extraWalletCardGroup",
        typename: "ExtraWalletCardGroup",
        amount: 249,
        helpUrl: "helpUrl_mock",
        items: [
          { urn: "ppb:tbd:card:extraWalletCard:WALLET_1", typename: "ExtraWalletCard" },
          { urn: "ppb:tbd:card:extraWalletCard:WALLET_2", typename: "ExtraWalletCard" },
          { urn: "ppb:tbd:card:extraWalletCard:WALLET_3", typename: "ExtraWalletCard" },
          { urn: "ppb:tbd:card:extraWalletCard:WALLET_4", typename: "ExtraWalletCard" },
        ],
      });
      createGenerosityCardsURNByTypeSelector().mockReturnValue({
        [PebbleFilterOptions.FreeBets]: [
          "ppb:tbd:card:extraWalletCard:WALLET_1",
          "ppb:tbd:card:extraWalletCard:WALLET_2",
          "ppb:tbd:card:extraWalletCard:WALLET_3",
          "ppb:tbd:card:extraWalletCard:WALLET_4",
        ],
      });
    });

    describe("and itemsFilter do not exist", () => {
      it("should return an empty object", () => {
        props = makeMapStateToProps()(STATE_MOCK, { itemsFilter: undefined });

        expect(props).toEqual({});
      });
    });

    it("should try to fetch the card group", () => {
      props = makeMapStateToProps()(STATE_MOCK, { itemsFilter: PebbleFilterOptions.FreeBets });

      expect(createCardGroupByURNSelector()).toHaveBeenCalledWith(
        STATE_MOCK.layouts.cardgroups.extrawalletcardgroups,
        mockUrn,
      );
    });

    describe("when not in betslip mode", () => {
      describe("and itemsFilter is All", () => {
        beforeAll(() => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
          props = makeMapStateToProps()(STATE_MOCK, { itemsFilter: PebbleFilterOptions.All });
        });

        it("should return the original list of items", () => {
          expect(props).toEqual({
            items: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
            showAlert: true,
            helpUrl: "helpUrl_mock",
            optionTitle: undefined,
            optionIcon: undefined,
            i18nLabels: mockI18nLabels,
            currentPebble: "all",
            isFromBetslip: false,
          });
        });
      });

      describe("and itemsFilter is Free Bets", () => {
        beforeAll(() => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
          createGenerosityCardsURNByTypeSelector().mockReturnValue({
            [PebbleFilterOptions.FreeBets]: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
          });
          props = makeMapStateToProps()(STATE_MOCK, {
            itemsFilter: PebbleFilterOptions.FreeBets,
          });
        });

        it("should call currencyFormatWithDecimalPlaces with the user details and the free bets amount", () => {
          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            localeCode: "en-GB",
            value: 249,
          });
        });

        it("should translate the free bets amount title", () => {
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.FREE_BET_BALANCE",
            interpolationValues: { bonus: "249.00€" },
          });
        });

        it("should render all the Free Bets items", () => {
          expect(props).toEqual({
            items: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
            optionTitle: "I18N.FREE_BET_BALANCE",
            optionIcon: ValueIconName.FREE_BET,
            i18nLabels: mockI18nLabels,
            helpUrl: "helpUrl_mock",
            showAlert: true,
            currentPebble: "free bets",
            isFromBetslip: false,
          });
        });
      });

      describe("and itemsFilter is Acca Insurance", () => {
        beforeAll(() => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
          createGenerosityCardsURNByTypeSelector().mockReturnValue({
            [PebbleFilterOptions.AccaInsuranceToken]: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
          });
          props = makeMapStateToProps()(STATE_MOCK, {
            itemsFilter: PebbleFilterOptions.AccaInsuranceToken,
          });
        });

        it("should translate the acca insurance title", () => {
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.MONEY_BACK_ACCA_AVAILABLE",
            interpolationValues: { value: 4 },
          });
        });

        it("should render all the Acca Insurance items", () => {
          expect(props).toEqual({
            items: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
            optionTitle: "I18N.MONEY_BACK_ACCA_AVAILABLE",
            optionIcon: ValueIconName.MONEY_BACK,
            i18nLabels: mockI18nLabels,
            helpUrl: "helpUrl_mock",
            showAlert: true,
            currentPebble: "money back",
            isFromBetslip: false,
          });
        });
      });

      describe("and itemsFilter is Price Boost", () => {
        beforeAll(() => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
          createGenerosityCardsURNByTypeSelector().mockReturnValue({
            [PebbleFilterOptions.PriceBoostToken]: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
          });
          props = makeMapStateToProps()(STATE_MOCK, {
            itemsFilter: PebbleFilterOptions.PriceBoostToken,
          });
        });

        it("should translate the price boost title", () => {
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.BOOST_AVAILABLE",
            interpolationValues: { value: 4 },
          });
        });

        it("should render all the Price Boost items", () => {
          expect(props).toEqual({
            items: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
              "ppb:tbd:card:extraWalletCard:WALLET_3",
              "ppb:tbd:card:extraWalletCard:WALLET_4",
            ],
            optionTitle: "I18N.BOOST_AVAILABLE",
            optionIcon: ValueIconName.BOOSTER,
            i18nLabels: mockI18nLabels,
            helpUrl: "helpUrl_mock",
            showAlert: true,
            currentPebble: "boost",
            isFromBetslip: false,
          });
        });
      });

      describe("and itemsFilter is Ghost Legs", () => {
        beforeAll(() => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
          createGenerosityCardsURNByTypeSelector().mockReturnValue({
            [PebbleFilterOptions.GhostLegToken]: [
              "ppb:tbd:card:extraWalletCard:WALLET_1",
              "ppb:tbd:card:extraWalletCard:WALLET_2",
            ],
          });
          props = makeMapStateToProps()(STATE_MOCK, {
            itemsFilter: PebbleFilterOptions.GhostLegToken,
          });
        });

        it("should translate the ghost legs title", () => {
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.GHOST_LEG_AVAILABLE",
            interpolationValues: { value: 2 },
          });
        });

        it("should render all the Ghost Legs items", () => {
          expect(props).toEqual({
            items: ["ppb:tbd:card:extraWalletCard:WALLET_1", "ppb:tbd:card:extraWalletCard:WALLET_2"],
            optionTitle: "I18N.GHOST_LEG_AVAILABLE",
            optionIcon: ValueIconName.GHOST_LEG,
            i18nLabels: mockI18nLabels,
            helpUrl: "helpUrl_mock",
            showAlert: true,
            currentPebble: "ghost leg",
            isFromBetslip: false,
          });
        });
      });
    });

    describe("when in betslip mode and combination has eligible wallets", () => {
      beforeAll(() => {
        createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({
          WALLET_1: {
            walletId: "WALLET_1",
            amount: 20,
            type: WalletTypes.AccaInsuranceToken,
            combinationId: "COMB_1",
          },
          WALLET_2: {
            walletId: "WALLET_2",
            amount: 21,
            type: WalletTypes.BonusCash,
            combinationId: "COMB_2",
          },
          WALLET_3: {
            walletId: "WALLET_3",
            amount: 22,
            type: WalletTypes.PriceBoostToken,
            combinationId: "COMB_3",
          },
        });
        createGenerosityCardsURNByTypeSelector().mockReturnValueOnce({
          [PebbleFilterOptions.FreeBets]: [
            "ppb:tbd:card:extraWalletCard:WALLET_2",
            "ppb:tbd:card:extraWalletCard:WALLET_3",
            "ppb:tbd:card:extraWalletCard:WALLET_4",
          ],
        });
        props = makeMapStateToProps()(
          {
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_2",
            },
          },
          { itemsFilter: PebbleFilterOptions.FreeBets },
        );
      });

      it("should call currencyFormatWithDecimalPlaces with the user details and the filtered eligible free bets amount", () => {
        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          localeCode: "en-GB",
          value: 21,
        });
      });

      it("should translate the free bets amount title", () => {
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.FREE_BET_BALANCE",
          interpolationValues: { bonus: "21.00€" },
        });
      });

      it("should filter the items to return only the ones that are eligible for that combinationId", () => {
        expect(props).toEqual({
          items: ["ppb:tbd:card:extraWalletCard:WALLET_2", "ppb:tbd:card:extraWalletCard:WALLET_3"],
          optionTitle: "I18N.FREE_BET_BALANCE",
          optionIcon: ValueIconName.FREE_BET,
          i18nLabels: mockI18nLabels,
          helpUrl: "helpUrl_mock",
          showAlert: true,
          currentPebble: "free bets",
          isFromBetslip: true,
        });
      });
    });

    describe("when in betslip mode and combination has no eligible wallets", () => {
      beforeAll(() => {
        createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({});
        createGenerosityCardsURNByTypeSelector().mockReturnValueOnce({
          [PebbleFilterOptions.FreeBets]: [
            "ppb:tbd:card:extraWalletCard:WALLET_1",
            "ppb:tbd:card:extraWalletCard:WALLET_2",
            "ppb:tbd:card:extraWalletCard:WALLET_3",
            "ppb:tbd:card:extraWalletCard:WALLET_4",
          ],
        });
        props = makeMapStateToProps()(
          {
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_MISMATCH",
            },
          },
          { itemsFilter: PebbleFilterOptions.All },
        );
      });

      it("should return an empty items list and flag the view as coming from the betslip", () => {
        expect(props).toEqual({
          items: [],
          optionTitle: undefined,
          optionIcon: undefined,
          i18nLabels: mockI18nLabels,
          helpUrl: "helpUrl_mock",
          showAlert: true,
          currentPebble: "all",
          isFromBetslip: true,
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("on dispatchPushExternalBlankAction trigger", () => {
      it("should dispatch the right type", () => {
        const dispatch = jest.fn();
        const { dispatchPushExternalBlankAction } = mapDispatchToProps(dispatch);

        dispatchPushExternalBlankAction("viewurl_mock");

        expect(dispatch).toHaveBeenCalledWith({
          type: "ROUTER/EXTERNAL_PUSH_BLANK",
          payload: {
            viewUrl: "viewurl_mock",
            viewUrn: EntityType.ExternalView,
          },
        });
      });
    });

    describe("on dispatchHelpNavigationAction trigger", () => {
      it("should dispatch the right type, currentPebble is all and isFromBetslip is false", () => {
        const dispatch = jest.fn();
        const { dispatchHelpNavigationAction } = mapDispatchToProps(dispatch);
        const currentPebble = "all";
        const isFromBetslip = false;

        dispatchHelpNavigationAction("destinationUrl_mock", currentPebble, isFromBetslip);

        expect(dispatch).toHaveBeenCalledWith({
          type: "UI__NAVIGATE_GENEROSITY_WALLET_HELP",
          payload: {
            destinationUrl: "destinationUrl_mock",
            currentPebble: "all",
            isFromBetslip: false,
          },
        });
      });
    });
  });
});
