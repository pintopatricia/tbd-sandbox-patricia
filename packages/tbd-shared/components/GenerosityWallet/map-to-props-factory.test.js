import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  createGetCombinationEligibleGenerosityWalletsSelector,
  isGenerosityContextEqual,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
} from "@ppb/tbd-store/actions/betting";
import { UI__GENEROSITY_WALLET_CLOSE_CLICK } from "@ppb/tbd-store/actions/interface";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { createGenerosityCardsURNByTypeSelector, PebbleFilterOptions } from "../../helpers/generosity-wallets";

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
    isGenerosityContextEqual: jest.fn().mockReturnValue(false),
  };
});

jest.mock("../../helpers/generosity-wallets", () => {
  const getGenerosityCardsURNByTypeSelector = jest.fn({});

  return {
    ...jest.requireActual("../../helpers/generosity-wallets"),
    createGenerosityCardsURNByTypeSelector: jest.fn(() => getGenerosityCardsURNByTypeSelector),
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ localeCode: "en-GB" })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const mockUrn = "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets";

const STATE_MOCK = {
  layouts: { cardgroups: { extrawalletcardgroups: { [mockUrn]: "extraWallet" } } },
};

let props;

describe("makeMapStateToProps", () => {
  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeAll(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
      props = makeMapStateToProps()(STATE_MOCK);
    });

    it("should call console.error with the error thrown from `getUserDetails`", () => {
      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return an empty object", () => {
      expect(props).toEqual({});
    });
  });

  it("should translate all labels", () => {
    makeMapStateToProps();

    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.BONUSES_TITLE",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.FILTERS.APPLY",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.MY_BONUS_PAGE",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.ALERT_BONUS_APPLIED",
    });
    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.ALERT_REMOVE_SELECTION",
    });
  });

  it("should create the get selectors", () => {
    makeMapStateToProps();

    expect(createCardGroupByURNSelector).toHaveBeenCalled();
    expect(createGetCombinationEligibleGenerosityWalletsSelector).toHaveBeenCalled();
  });

  describe("mapStateToProps", () => {
    let mapStateToProps;

    beforeAll(() => {
      createGenerosityCardsURNByTypeSelector().mockReturnValue({
        [PebbleFilterOptions.GhostLegToken]: ["ppb:tbd:card:extraWalletCard:WALLET_5"],
        [PebbleFilterOptions.AccaInsuranceToken]: [
          "ppb:tbd:card:extraWalletCard:WALLET_1",
          "ppb:tbd:card:extraWalletCard:WALLET_2",
        ],
        [PebbleFilterOptions.FreeBets]: ["ppb:tbd:card:extraWalletCard:WALLET_3"],
        [PebbleFilterOptions.PriceBoostToken]: ["ppb:tbd:card:extraWalletCard:WALLET_4"],
      });
      mapStateToProps = makeMapStateToProps();
    });

    it("should fetch the card group", () => {
      mapStateToProps(STATE_MOCK);

      expect(createCardGroupByURNSelector()).toHaveBeenCalledWith(
        STATE_MOCK.layouts.cardgroups.extrawalletcardgroups,
        mockUrn,
      );
    });

    it("should return the Free Bets Wallet data", () => {
      expect(mapStateToProps(STATE_MOCK)).toEqual({
        optionWallets: {},
        userDetails: { localeCode: "en-GB" },
        bonusPageUrl: undefined,
        selectedCombinationId: undefined,
        generosityFilterOptions: [
          {
            count: 5,
            id: "ALL",
            text: "I18N.OBB.FILTERTAGS.ALL",
          },
          {
            count: 1,
            id: "BONUS_CASH",
            text: "I18N.FREE_BETS",
          },
          {
            count: 1,
            id: "GHOST_LEG_TOKEN",
            text: "I18N.GHOST_LEG_PEBBLE",
          },
          {
            count: 1,
            id: "PRICE_BOOST_TOKEN",
            text: "I18N.BET_BOOST_TOKEN",
          },
          {
            count: 2,
            id: "ACCA_INSURANCE_TOKEN",
            text: "I18N.MONEY_BACK_PEBBLE",
          },
        ],
        i18nLabels: {
          bonusPageMessage: "I18N.MY_BONUS_PAGE",
          defaultApplyButtonLabel: "I18N.FILTERS.APPLY",
          title: "I18N.BONUSES_TITLE",
          alertMessage: "I18N.ALERT_BONUS_APPLIED",
          alertDetail: "I18N.ALERT_REMOVE_SELECTION",
        },
        shouldShowAlert: false,
      });
    });

    describe("when in betslip mode and combination has eligible wallets", () => {
      let mapStateToPropsResult;

      beforeAll(() => {
        createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValue({
          WALLET_1: {
            walletId: "WALLET_1",
            type: WalletTypes.BonusCash,
            combinationId: "COMB_1",
          },
          WALLET_2: {
            walletId: "WALLET_2",
            type: WalletTypes.BonusCash,
            combinationId: "COMB_2",
          },
          WALLET_3: {
            walletId: "WALLET_3",
            type: WalletTypes.BonusCash,
          },
          WALLET_4: {
            walletId: "WALLET_4",
            type: WalletTypes.AccaInsuranceToken,
          },
          WALLET_5: {
            walletId: "WALLET_5",
            type: WalletTypes.AccaInsuranceToken,
          },
          WALLET_6: {
            walletId: "WALLET_6",
            type: WalletTypes.PriceBoostToken,
          },
          WALLET_7: {
            walletId: "WALLET_7",
            type: WalletTypes.PriceBoostToken,
          },
          WALLET_8: {
            walletId: "WALLET_8",
            type: WalletTypes.MoneyBackToken,
          },
        });
      });

      it("should return the Free Bets Wallet with hydrated optionWallets", () => {
        mapStateToPropsResult = mapStateToProps({
          ...STATE_MOCK,
          betslip: {
            selectedCombinationId: "COMB_1",
          },
          betting: {
            sportsbookBetting: {
              combinations: {
                COMB_1: { id: "COMB_1", accaInsuranceTokenId: "WALLET_4", isPriceBoostAvailable: true },
                COMB_2: { id: "COMB_2", priceBoostTokenId: "WALLET_6", isPriceBoostAvailable: true },
              },
            },
          },
        });

        expect(mapStateToPropsResult).toEqual({
          selectedCombinationId: "COMB_1",
          userDetails: { localeCode: "en-GB" },
          bonusPageUrl: undefined,
          optionWallets: {
            WALLET_1: {
              walletId: "WALLET_1",
              combinationId: "COMB_1",
              type: WalletTypes.BonusCash,
              isSelected: true,
              isDisabled: false,
            },
            WALLET_2: {
              walletId: "WALLET_2",
              combinationId: "COMB_2",
              type: WalletTypes.BonusCash,
              isSelected: true,
              isDisabled: true,
            },
            WALLET_3: {
              walletId: "WALLET_3",
              type: WalletTypes.BonusCash,
              isSelected: false,
              isDisabled: false,
            },
            WALLET_4: {
              walletId: "WALLET_4",
              type: WalletTypes.AccaInsuranceToken,
              isSelected: true,
              isDisabled: false,
              combinationId: "COMB_1",
            },
            WALLET_5: {
              walletId: "WALLET_5",
              type: WalletTypes.AccaInsuranceToken,
              isSelected: false,
              isDisabled: false,
              combinationId: undefined,
            },
            WALLET_6: {
              walletId: "WALLET_6",
              type: WalletTypes.PriceBoostToken,
              isSelected: true,
              isDisabled: true,
              combinationId: "COMB_2",
            },
            WALLET_7: {
              walletId: "WALLET_7",
              type: WalletTypes.PriceBoostToken,
              isSelected: false,
              isDisabled: false,
              combinationId: undefined,
            },
            WALLET_8: {
              walletId: "WALLET_8",
              type: WalletTypes.MoneyBackToken,
              isSelected: false,
              isDisabled: false,
              combinationId: undefined,
            },
          },
          generosityFilterOptions: [
            {
              count: 5,
              id: "ALL",
              text: "I18N.OBB.FILTERTAGS.ALL",
            },
            {
              count: 1,
              id: "BONUS_CASH",
              text: "I18N.FREE_BETS",
            },
            {
              count: 1,
              id: "GHOST_LEG_TOKEN",
              text: "I18N.GHOST_LEG_PEBBLE",
            },
            {
              count: 1,
              id: "PRICE_BOOST_TOKEN",
              text: "I18N.BET_BOOST_TOKEN",
            },
            {
              count: 2,
              id: "ACCA_INSURANCE_TOKEN",
              text: "I18N.MONEY_BACK_PEBBLE",
            },
          ],
          i18nLabels: {
            bonusPageMessage: "I18N.MY_BONUS_PAGE",
            defaultApplyButtonLabel: "I18N.FILTERS.APPLY",
            title: "I18N.BONUSES_TITLE",
            alertMessage: "I18N.ALERT_BONUS_APPLIED",
            alertDetail: "I18N.ALERT_REMOVE_SELECTION",
          },
          shouldShowAlert: true,
        });
      });

      describe("and the selected combinations is not price boost token available (SP enabled)", () => {
        it("should return the Free Bets Wallet with hydrated optionWallets with all disabled price boost", () => {
          mapStateToPropsResult = mapStateToProps({
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_1",
            },
            betting: {
              sportsbookBetting: {
                combinations: {
                  COMB_1: { id: "COMB_1", accaInsuranceTokenId: "WALLET_4", isPriceBoostAvailable: false },
                  COMB_2: { id: "COMB_2", priceBoostTokenId: "WALLET_6", isPriceBoostAvailable: true },
                },
              },
            },
          });

          expect(mapStateToPropsResult).toEqual({
            selectedCombinationId: "COMB_1",
            userDetails: { localeCode: "en-GB" },
            bonusPageUrl: undefined,
            optionWallets: {
              WALLET_1: {
                walletId: "WALLET_1",
                combinationId: "COMB_1",
                type: WalletTypes.BonusCash,
                isSelected: true,
                isDisabled: false,
              },
              WALLET_2: {
                walletId: "WALLET_2",
                combinationId: "COMB_2",
                type: WalletTypes.BonusCash,
                isSelected: true,
                isDisabled: true,
              },
              WALLET_3: {
                walletId: "WALLET_3",
                type: WalletTypes.BonusCash,
                isSelected: false,
                isDisabled: false,
              },
              WALLET_4: {
                walletId: "WALLET_4",
                type: WalletTypes.AccaInsuranceToken,
                isSelected: true,
                isDisabled: false,
                combinationId: "COMB_1",
              },
              WALLET_5: {
                walletId: "WALLET_5",
                type: WalletTypes.AccaInsuranceToken,
                isSelected: false,
                isDisabled: false,
                combinationId: undefined,
              },
              WALLET_6: {
                walletId: "WALLET_6",
                type: WalletTypes.PriceBoostToken,
                isSelected: true,
                isDisabled: true,
                combinationId: "COMB_2",
              },
              WALLET_7: {
                walletId: "WALLET_7",
                type: WalletTypes.PriceBoostToken,
                isSelected: false,
                isDisabled: true,
                combinationId: undefined,
              },
              WALLET_8: {
                walletId: "WALLET_8",
                type: WalletTypes.MoneyBackToken,
                isSelected: false,
                isDisabled: false,
                combinationId: undefined,
              },
            },
            generosityFilterOptions: [
              {
                count: 5,
                id: "ALL",
                text: "I18N.OBB.FILTERTAGS.ALL",
              },
              {
                count: 1,
                id: "BONUS_CASH",
                text: "I18N.FREE_BETS",
              },
              {
                count: 1,
                id: "GHOST_LEG_TOKEN",
                text: "I18N.GHOST_LEG_PEBBLE",
              },
              {
                count: 1,
                id: "PRICE_BOOST_TOKEN",
                text: "I18N.BET_BOOST_TOKEN",
              },
              {
                count: 2,
                id: "ACCA_INSURANCE_TOKEN",
                text: "I18N.MONEY_BACK_PEBBLE",
              },
            ],
            i18nLabels: {
              bonusPageMessage: "I18N.MY_BONUS_PAGE",
              defaultApplyButtonLabel: "I18N.FILTERS.APPLY",
              title: "I18N.BONUSES_TITLE",
              alertMessage: "I18N.ALERT_BONUS_APPLIED",
              alertDetail: "I18N.ALERT_REMOVE_SELECTION",
            },
            shouldShowAlert: true,
          });
        });
      });

      describe("and there are wallets/tokens disabled and selected", () => {
        it("should return a true shouldShowAlert", () => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValueOnce({
            WALLET_1: {
              walletId: "WALLET_1",
              type: WalletTypes.AccaInsuranceToken,
              combinationId: "COMB_1",
            },
            WALLET_2: {
              walletId: "WALLET_2",
              type: WalletTypes.PriceBoostToken,
              combinationId: "COMB_2",
            },
            WALLET_3: {
              walletId: "WALLET_3",
              type: WalletTypes.MoneyBackToken,
              combinationId: "COMB_3",
            },
          });

          mapStateToPropsResult = mapStateToProps({
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_1",
            },
            betting: {
              sportsbookBetting: {
                combinations: {
                  COMB_1: { id: "COMB_1", accaInsuranceTokenId: "WALLET_1" },
                  COMB_2: { id: "COMB_2", priceBoostTokenId: "WALLET_2" },
                  COMB_3: { id: "COMB_3", moneyBackTokenId: "WALLET_3" },
                },
              },
            },
          });

          expect(mapStateToPropsResult.shouldShowAlert).toEqual(true);
        });
      });

      describe("and there are wallets/tokens disabled and not selected", () => {
        it("should return a true shouldShowAlert", () => {
          createGetCombinationEligibleGenerosityWalletsSelector().mockReturnValueOnce({
            WALLET_1: {
              walletId: "WALLET_1",
              type: WalletTypes.PriceBoostToken,
              combinationId: "COMB_1",
            },
            WALLET_2: {
              walletId: "WALLET_2",
              type: WalletTypes.PriceBoostToken,
            },
          });

          mapStateToPropsResult = mapStateToProps({
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_1",
            },
            betting: {
              sportsbookBetting: {
                combinations: {
                  COMB_1: { id: "COMB_1", isPriceBoostAvailable: false },
                },
              },
            },
          });

          expect(mapStateToPropsResult.shouldShowAlert).toEqual(false);
        });
      });

      it("should return a memoized value of optionWallets", () => {
        isGenerosityContextEqual.mockReturnValue(true);
        expect(
          mapStateToProps({
            ...STATE_MOCK,
            betslip: {
              selectedCombinationId: "COMB_1",
            },
            betting: {
              sportsbookBetting: {
                combinations: {
                  COMB_1: { id: "COMB_1", accaInsuranceTokenId: "WALLET_4" },
                  COMB_2: { id: "COMB_2", priceBoostTokenId: "WALLET_6" },
                },
              },
            },
          }).optionWallets,
        ).toBe(mapStateToPropsResult.optionWallets);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("on dispatchCloseBottomSheetAction trigger", () => {
    it("should dispatch the correct actions when is from betslip", () => {
      const dispatch = jest.fn();
      const { dispatchCloseBottomSheetAction } = mapDispatchToProps(dispatch);
      const currentPebble = "all";

      dispatchCloseBottomSheetAction(true, currentPebble);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: UI__GENEROSITY_WALLET_CLOSE_CLICK,
        payload: { isFromBetslip: true, currentPebble },
      });
    });

    it("should dispatch the correct actions when is from anywhere else", () => {
      const dispatch = jest.fn();
      const { dispatchCloseBottomSheetAction } = mapDispatchToProps(dispatch);
      const currentPebble = "all";

      dispatchCloseBottomSheetAction(false, currentPebble);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: UI__GENEROSITY_WALLET_CLOSE_CLICK,
        payload: { isFromBetslip: false, currentPebble },
      });
    });
  });

  describe("on dispatchApplyButtonAction trigger", () => {
    describe.each([
      { type: WalletTypes.BonusCash, action: BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION },
      { type: WalletTypes.AccaInsuranceToken, action: BETTING__SBK_ACCA_INSURANCE_TOGGLE },
      { type: WalletTypes.PriceBoostToken, action: BETTING__SBK_PRICE_BOOST_TOGGLE },
      { type: WalletTypes.MoneyBackToken, action: BETTING__SBK_MONEY_BACK_TOGGLE },
      { type: WalletTypes.GhostLegToken, action: BETTING__SBK_GHOST_LEG_TOGGLE },
    ])("if type is $type", ({ type, action }) => {
      it(`should dispatch ${action}`, () => {
        const dispatch = jest.fn();
        const mockAmount = "10.00";
        const expectedPayload =
          type === WalletTypes.BonusCash
            ? {
                combinationId: "combinationIdMock",
                selectedWallets: [1, 2],
                amount: mockAmount,
              }
            : {
                combinationId: "combinationIdMock",
                selectedTokenId: "1",
              };

        const { dispatchApplyButtonAction } = mapDispatchToProps(dispatch);
        dispatchApplyButtonAction("combinationIdMock", ["1", "2"], type, undefined, mockAmount);

        expect(dispatch).toHaveBeenCalledWith({
          type: action,
          payload: expectedPayload,
        });
      });
    });

    describe("if type is not passed", () => {
      describe.each([
        {
          previousType: WalletTypes.BonusCash,
          action: BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
        },
        { previousType: WalletTypes.AccaInsuranceToken, action: BETTING__SBK_ACCA_INSURANCE_TOGGLE },
        { previousType: WalletTypes.PriceBoostToken, action: BETTING__SBK_PRICE_BOOST_TOGGLE },
        { previousType: WalletTypes.MoneyBackToken, action: BETTING__SBK_MONEY_BACK_TOGGLE },
        { previousType: WalletTypes.GhostLegToken, action: BETTING__SBK_GHOST_LEG_TOGGLE },
      ])("and previousType is $previousType", ({ previousType, action }) => {
        it(`should dispatch ${action}`, () => {
          const dispatch = jest.fn();

          const { dispatchApplyButtonAction } = mapDispatchToProps(dispatch);
          dispatchApplyButtonAction("combinationIdMock", undefined, undefined, previousType, undefined);

          expect(dispatch).toHaveBeenCalledWith({
            type: action,
            payload: { combinationId: "combinationIdMock" },
          });
        });
      });
    });
  });

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

  describe("on dispatchGenerosityPageNavigationAction trigger", () => {
    it("should dispatch the right type", () => {
      const dispatch = jest.fn();
      const { dispatchGenerosityPageNavigationAction } = mapDispatchToProps(dispatch);

      dispatchGenerosityPageNavigationAction("destination_url", "current_pebble");

      expect(dispatch).toHaveBeenCalledWith({
        type: "UI__NAVIGATE_GENEROSITY_PAGE",
        payload: {
          destinationUrl: "destination_url",
          currentPebble: "current_pebble",
        },
      });
    });
  });

  describe("on dispatchGenerosityWalletPebbleClick trigger", () => {
    it("should dispatch the right type", () => {
      const dispatch = jest.fn();
      const { dispatchGenerosityWalletPebbleClick } = mapDispatchToProps(dispatch);

      dispatchGenerosityWalletPebbleClick(true, "current_pebble", "to_pebble");

      expect(dispatch).toHaveBeenCalledWith({
        type: "UI__GENEROSITY_WALLET_PEBBLE_CLICK",
        payload: {
          isFromBetslip: true,
          currentPebble: "current_pebble",
          toPebble: "to_pebble",
        },
      });
    });
  });

  describe("on dispatchGenerosityWalletApplyButtonClick trigger", () => {
    it("should dispatch the right type", () => {
      const dispatch = jest.fn();
      const { dispatchGenerosityWalletApplyButtonClick } = mapDispatchToProps(dispatch);

      dispatchGenerosityWalletApplyButtonClick("money back", 0, 10, "all", undefined, WalletTypes.MoneyBackToken);

      expect(dispatch).toHaveBeenCalledWith({
        type: "UI__GENEROSITY_WALLET_APPLY_BUTTON_CLICK",
        payload: {
          walletDescription: "money back",
          numberOfPlaces: undefined,
          value: 0,
          totalAmount: 10,
          currentPebble: "all",
          walletType: WalletTypes.MoneyBackToken,
        },
      });
    });
  });
});
