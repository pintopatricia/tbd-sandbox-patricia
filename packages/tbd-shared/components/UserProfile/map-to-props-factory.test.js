import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getUserWallets } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { FETCH_CATALOGUE, UPDATE_CURRENT_BANNER, BANNER_ACTION_REQUEST } from "@ppb/tbd-store/actions/catalogue";
import {
  BETTING__EXC_PLACE_BETS,
  BETTING__EXC_UNMATCHED_UPDATE,
  BETTING__OBB_CLEAR_ACTION,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_PLACE_BETS,
} from "@ppb/tbd-store/actions/betting";
import { FETCH_USER_WALLETS } from "@ppb/tbd-store/actions/user-wallets";
import { UI__USER_LOGOUT_CLICK } from "@ppb/tbd-store/actions/interface";
import {
  UI__USER_PROFILE_EYE_ICON_CLICK,
  UI__USER_PROFILE_MENU_LINK_CLICK,
  UI__USER_PROFILE_QUICK_LINK_CLICK,
  UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
  UI__USER_PROFILE_BUDGET_LINK_CLICK,
} from "@ppb/tbd-store/actions/user-profile";
import { PUSH } from "@ppb/tbd-store/actions/router";
import {
  createLinksSelector,
  createMyAccountInterfaceStateSelector,
  createMyAccountViewItemsSelector,
  createQuickLinksSelector,
  createRewardsCardBySelector,
  createWalletNamesSelector,
  createWalletSectionsSelector,
} from "@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors";
import { createNextBreachableLimitSelector } from "@ppb/tbd-store/state/layout/cards/budget-limits/budget-limits-selectors";
import { DEPOSIT_FLOW, DEPOSIT_SUCCESS, FIRST_DEPOSIT_SUCCESS } from "@ppb/tbd-store/actions/deposit";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { createPropsForCashBalances } from "../../view-model-factories/cash-balances";
import {
  makeMapStateToProps,
  mapDispatchToProps,
  createBasicPlan,
  buildUserProfileMenu,
  createMyRewardsAndRewardsPlus,
  createNoPlanSelected,
  createBudgetCard,
} from "./map-to-props-factory";
import { getEndpoint } from "../../config/endpoints";

const userProfileLinks = {
  applePay: "APPLE_PAY_PROXY_ENDPOINT",
  chooseRewardsLink: "MY_ACCOUNT_ENDPOINT/rewards/my-rewards/choose?prod=PRODUCT_ID&showHeader=0",
  promosLink: "PROMOS_ENDPOINT/sport?prod=PRODUCT_ID",
  rewardsLink: "MY_ACCOUNT_ENDPOINT/rewards/my-rewards?prod=PRODUCT_ID&showHeader=0",
};

const stateMock = {
  entities: {
    userdetails: {
      firstName: "Sebastian",
      loggedIn: true,
    },
    preferences: {
      odds: "random_value",
      showBalances: true,
      exchangeDefaultProduct: "unassigned",
    },
    throttles: {
      EXC_ONBOARDING_JOURNEY: { isActive: false },
    },
  },
  layouts: {
    cards: {
      myaccount: {
        isOpen: false,
      },
      balance: {},
      quicklinks: {
        "ppb:tbd:card:quickLinks:myAccount": {},
      },
    },
    views: { settings: { "ppb:tbd:view:settings:settings": {} } },
  },
  router: {
    currentUrn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
    currentView: "ppb:tbd:view:myAccountView",
    currentUrl: "/betting/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
    locationKey: "d733zm",
  },
  betslip: {
    isDepositRedirect: false,
    activeProduct: "NONE",
    step: "EDIT_UNMATCHED",
    exchangeContext: { market: "exchangeMarket", runner: "exchangeRunner" },
    exchangeEdit: { betId: "betId" },
  },
};

const getMyAccountInterfaceState = jest.fn();
const getUserDetailsSelector = jest.fn().mockReturnValue({
  countryCode: "mock_countryCode",
  localeCodeBcp47: "mock_localeCodeBcp47",
  currencyCode: "mock_currencyCode",
  loggedIn: true,
});

const getUserPreferencesWithProductSwitcher = jest.fn(() => ({
  sportsbookOddsDisplay: "FRACTIONAL",
  quickStakes: [],
  showBalances: true,
  exchangeDefaultProduct: "unassigned",
}));

const getViewByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors");

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserFirstName: jest.fn().mockReturnValue({
    userdetails: {
      firstName: "Sebastian",
    },
  }),
}));

jest.mock("../../view-model-factories/user-profile", () => ({
  getPropsForUserProfile: jest.fn((onClick) => ({
    menuItems: [
      {
        onClick,
      },
    ],
  })),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors", () => ({
  createMyAccountInterfaceStateSelector: jest.fn(),
  createWalletNamesSelector: jest.fn(),
  createWalletSectionsSelector: jest.fn(),
  createQuickLinksSelector: jest.fn(),
  createRewardsCardBySelector: jest.fn(),
  createAccountBannersCardBySelector: jest.fn(),
  createMyAccountViewItemsSelector: jest.fn(),
  createLinksSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() => getViewByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/budget-limits/budget-limits-selectors", () => ({
  createNextBreachableLimitSelector: jest.fn(),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn((tla) => `${tla}_ENDPOINT`),
  getProdIdConfig: jest.fn(() => "PRODUCT_ID"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => (state, urn) => state[urn]),
}));

jest.mock("../../view-model-factories/cash-balances", () => ({
  createPropsForCashBalances: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithoutDecimalPlaces: jest.fn(() => "$10"),
  currencyFormatWithDecimalPlaces: jest.fn(() => "$0.00"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const getPropsForCashBalances = jest.fn().mockReturnValue({
  simpleViewBalances: "mock_simpleViewBalances",
  detailedViewBalance: "mock_detailedViewBalance",
});

function setupMapStateToProps(mainStateMock, firstName = "Sebastian", isOpen = true, jurisdiction = "INTERNATIONAL") {
  getUserWallets.mockImplementation(() => "mocked_getUserWallets");
  createWalletNamesSelector.mockImplementation(() => jest.fn(() => []));
  createWalletSectionsSelector.mockImplementation(() => jest.fn(() => []));
  createLinksSelector.mockImplementation(() => jest.fn(() => []));
  createQuickLinksSelector.mockImplementation(() => jest.fn(() => []));
  createMyAccountViewItemsSelector.mockImplementation(() =>
    jest.fn(() => [
      { urn: "ppb:tbd:card:links:myaccount#menuSection" },
      { urn: "ppb:tbd:card:quickLinks:myAccount" },
      { urn: "ppb:tbd:card:balance:myaccount#balanceCard" },
      { urn: "ppb:tbd:card:rewards" },
      { urn: "ppb:tbd:card:budgetLimitsCard" },
    ]),
  );

  getMyAccountInterfaceState.mockImplementation(() => ({ firstName, isOpen, jurisdiction }));

  createGetCountryLocalCurrencyCodeSelector.mockImplementation(() => getUserDetailsSelector);
  createPropsForCashBalances.mockImplementation(() => getPropsForCashBalances);
  createMyAccountInterfaceStateSelector.mockImplementation(() => getMyAccountInterfaceState);

  getViewByURN.mockImplementation(() => ({ wizardUrl: "https://playerprotection.betfair.com/" }));

  return makeMapStateToProps()(mainStateMock, { urn: "ppb:tbd:view:settings:settings" });
}

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    createRewardsCardBySelector.mockImplementation(() =>
      jest.fn(() => ({
        typename: "RewardsCard",
        benefitsPackages: {
          rewardsStatus: "OPTED_IN",
          lastMonthTradedMarkets: 12,
          currentMonthTradedMarkets: 13,
          currentMonth: 1,
          nextMonth: 2,
          qualifiedBenefitsPackage: null,
          chosenBenefitsPackage: null,
          availablePackages: [
            {
              commissionRate: 5,
              requiredMarketBets: 1,
              packageLevel: "MAX",
              benefits: [
                {
                  hidden: true,
                  type: "benefit 1",
                  valueLookup: {
                    maxAmount: { type: "INTEGER", value: 100 },
                    quantity: { type: "PERCENT", value: 2 },
                    size: 1,
                  },
                  accessLevel: "accessLevel",
                },
                {
                  hidden: false,
                  type: "benefit 2",
                  valueLookup: {
                    maxAmount: { type: "INTEGER", value: 500 },
                    quantity: { type: "PERCENT", value: 10 },
                    size: 3,
                  },
                  accessLevel: "NONE",
                },
              ],
              excludedBenefits: [],
            },
          ],
        },
      })),
    );

    createNextBreachableLimitSelector.mockImplementation(() =>
      jest.fn(() => ({
        amount: 500,
        remain: 400,
        category: "NDL",
        reset: "02.01.2021, 00:00",
        nextBreachable: true,
      })),
    );
  });

  it("should call getMyAccountInterfaceState with correct params", () => {
    setupMapStateToProps(stateMock);

    expect(getMyAccountInterfaceState).toHaveBeenCalledWith(stateMock);
  });

  it("should call getUserDetailsSelector with correct params", () => {
    setupMapStateToProps(stateMock);

    expect(getUserDetailsSelector).toHaveBeenCalledWith(stateMock);
  });

  it("should call getUserWallets with correct params", () => {
    setupMapStateToProps(stateMock);

    expect(getUserWallets).toHaveBeenCalledWith(stateMock);
  });

  it("should call getUserPreferencesWithProductSwitcher with correct params", () => {
    setupMapStateToProps(stateMock);

    expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith({
      odds: "random_value",
      showBalances: true,
      exchangeDefaultProduct: "unassigned",
    });
  });

  it("should call createQuickLinksSelector with correct params", () => {
    setupMapStateToProps(stateMock);
    expect(createQuickLinksSelector).toHaveBeenCalledWith("ppb:tbd:card:quickLinks:myAccount");
  });

  it("should call createLinksSelector with correct params", () => {
    setupMapStateToProps(stateMock);
    expect(createLinksSelector).toHaveBeenCalledWith("ppb:tbd:card:links:myaccount#menuSection");
  });

  it("should call getPropsForCashBalances with correct params", () => {
    setupMapStateToProps(stateMock);

    expect(getPropsForCashBalances).toHaveBeenCalledWith(
      "mock_currencyCode",
      "mock_localeCodeBcp47",
      "mocked_getUserWallets",
      [],
      "INTERNATIONAL",
    );
  });

  it("should return a model with my account interface", () => {
    createRewardsCardBySelector.mockImplementation(() => jest.fn(() => []));
    createNextBreachableLimitSelector.mockImplementation(() => jest.fn(() => null));
    const componentProps = setupMapStateToProps(stateMock);

    expect(componentProps).toEqual({
      firstName: "Sebastian",
      currentViewURN: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
      detailedView: "mock_detailedViewBalance",
      simpleView: "mock_simpleViewBalances",
      showBalances: true,
      walletsToCallWasService: [],
      groupsMenu: [],
      quickMenuItems: [],
      jurisdiction: "INTERNATIONAL",
      currentBanner: null,
      basicPlan: null,
      noPlanSelected: null,
      packageLevelValue: "",
      rewards: null,
      rewardsTitle: null,
      budgetLimit: null,
      accountBannersCardURN: undefined,
      wizardUrl: "https://playerprotection.betfair.com/",
      betslipDepositRedirect: {
        isDepositRedirect: false,
        activeProduct: "NONE",
        step: "EDIT_UNMATCHED",
        betId: "betId",
        exchangeMarket: "exchangeMarket",
        exchangeRunner: "exchangeRunner",
      },
      depositSuccessfulLabels: {
        depositSuccessful: "I18N.DEPOSIT.DEPOSIT_SUCCESSFUL",
        placingBet: "I18N.BETSLIP.PLACING_BET",
      },
      isLoggedIn: true,
      userProfileLinks,
      hasUnreadNotifications: false,
    });
  });

  it("createNoPlanSelected returns the correct value when called", () => {
    const componentProps = setupMapStateToProps(stateMock);

    expect(createRewardsCardBySelector).toHaveBeenCalled();
    expect(currencyFormatWithoutDecimalPlaces).toHaveBeenCalledWith({
      countryCode: "mock_countryCode",
      currencyCode: "mock_currencyCode",
      localeCodeBcp47: "mock_localeCodeBcp47",
      value: 10,
    });
    expect(componentProps.noPlanSelected).toEqual([
      { packageLevel: "MAX", packages: ["10% benefit 2", "5% Commission"] },
    ]);
  });

  it("createBudgetCard returns the correct value when called", () => {
    const componentProps = setupMapStateToProps(stateMock);

    createNextBreachableLimitSelector.mockImplementation(() => {
      jest.fn(() => ({
        amount: 500,
        remain: 400,
        category: "NDL",
        reset: "02/01/2021, 00:00",
        nextBreachable: true,
      }));
    });

    expect(getEndpoint).toHaveBeenCalledWith("SPEND_BUDGET");
    expect(createNextBreachableLimitSelector).toHaveBeenCalled();
    expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
      countryCode: "mock_countryCode",
      currencyCode: "mock_currencyCode",
      localeCodeBcp47: "mock_localeCodeBcp47",
      value: 400,
    });
    expect(componentProps.budgetLimit).toEqual({
      amount: 500,
      category: "NDL",
      currencyValue: "$0.00",
      itemLink: {
        isTextLink: true,
        target: "_self",
        viewLink: {
          viewUrl: "SPEND_BUDGET_ENDPOINT",
          viewUrn: "",
        },
      },
      linkText: "I18N.BUDGET_LINK",
      remain: 400,
      nextBreachable: true,
      remainText: "I18N.BUDGET_REMAIN",
      reset: "I18N.BUDGET_RESETS 02.01.2021, 00:00",
      statusLabel: "I18N.ACCOUNT_BADGE",
      title: "I18N.BUDGET_TITLE",
    });
  });

  describe("when state contains the view wizardUrl", () => {
    it("should return wizardUrl correctly", () => {
      const componentProps = setupMapStateToProps(stateMock);

      expect(componentProps.wizardUrl).toEqual("https://playerprotection.betfair.com/");
    });
  });

  describe("when `createGetCountryLocalCurrencyCodeSelector` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      createGetCountryLocalCurrencyCodeSelector.mockImplementationOnce(() => () => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      setupMapStateToProps(stateMock);

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(setupMapStateToProps(stateMock)).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch fetch catalogue action", () => {
    const dispatchMock = jest.fn();
    const { dispatchFetchCatalogueAction } = mapDispatchToProps(dispatchMock);
    const urn = "fakeSettingURN";

    dispatchFetchCatalogueAction(urn);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        urn,
      },
      type: FETCH_CATALOGUE,
    });
  });
  it("should dispatch fetch dispatchUpdateCurrentBannerAction action", () => {
    const dispatchMock = jest.fn();
    const { dispatchUpdateCurrentBannerAction } = mapDispatchToProps(dispatchMock);
    const urn = "fakeSettingURN";
    const index = 1;

    dispatchUpdateCurrentBannerAction(urn, index);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        urn,
        index,
      },
      type: UPDATE_CURRENT_BANNER,
    });
  });
  it("should dispatch fetch dispatchPushAction action", () => {
    const dispatchMock = jest.fn();
    const { dispatchPushAction } = mapDispatchToProps(dispatchMock);
    const viewUrl = "fakeViewUrl";
    const viewUrn = "fakeViewUrn";

    dispatchPushAction(viewUrn, viewUrl);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        viewUrl,
        viewUrn,
      },
      type: PUSH,
    });
  });
  it("should dispatch fetch dispatchBannerActionRequest action", () => {
    const dispatchMock = jest.fn();
    const { dispatchBannerActionRequest } = mapDispatchToProps(dispatchMock);
    const urn = "fakeUrn";
    const index = 1;
    const bannerAction = {};

    dispatchBannerActionRequest(urn, index, bannerAction);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        urn,
        index,
        bannerAction,
      },
      type: BANNER_ACTION_REQUEST,
    });
  });
  it("should dispatch fetch dispatchOnLogoutClick action", () => {
    const dispatchMock = jest.fn();
    const { dispatchOnLogoutClick } = mapDispatchToProps(dispatchMock);

    dispatchOnLogoutClick();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: UI__USER_LOGOUT_CLICK,
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: BETTING__SBK_CLEAR_ACTION,
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: BETTING__OBB_CLEAR_ACTION,
    });
  });
  it("should dispatch fetch dispatchUserProfileMenuEyeIconClickAction action", () => {
    const dispatchMock = jest.fn();
    const { dispatchUserProfileMenuEyeIconClickAction } = mapDispatchToProps(dispatchMock);
    const toggleMock = false;
    const jurisdiction = "jurisdictionMock";

    dispatchUserProfileMenuEyeIconClickAction(toggleMock, jurisdiction);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        showBalances: toggleMock,
        jurisdiction,
      },
      type: UI__USER_PROFILE_EYE_ICON_CLICK,
    });
  });
  it("should dispatch fetch dispatchOnClickMenuLink action", () => {
    const dispatchMock = jest.fn();
    const { dispatchOnClickMenuLink } = mapDispatchToProps(dispatchMock);
    const menuText = "menuTextMock";
    const jurisdiction = "jurisdictionMock";
    const href = "hrefMock";

    dispatchOnClickMenuLink(jurisdiction, menuText, href);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        menuText,
        jurisdiction,
        href,
      },
      type: UI__USER_PROFILE_MENU_LINK_CLICK,
    });
  });
  it("should dispatch fetch dispatchOnClickQuickMenu action", () => {
    const dispatchMock = jest.fn();
    const { dispatchOnClickQuickMenu } = mapDispatchToProps(dispatchMock);
    const title = "titleMock";
    const jurisdiction = "jurisdictionMock";
    const href = "hrefMock";

    dispatchOnClickQuickMenu(title, jurisdiction, href);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        title,
        jurisdiction,
        href,
      },
      type: UI__USER_PROFILE_QUICK_LINK_CLICK,
    });
  });
  it("should dispatch fetch dispatchOnToggleSimpleDetailedViewClick action", () => {
    const dispatchMock = jest.fn();
    const { dispatchOnToggleSimpleDetailedViewClick } = mapDispatchToProps(dispatchMock);
    const showLessToggle = false;
    const jurisdiction = "jurisdictionMock";

    dispatchOnToggleSimpleDetailedViewClick(showLessToggle, jurisdiction);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        showLessToggle,
        jurisdiction,
      },
      type: UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
    });
  });
  it("should dispatch fetch dispatchFetchUserWalletsAction action", () => {
    const dispatchMock = jest.fn();
    const { dispatchFetchUserWalletsAction } = mapDispatchToProps(dispatchMock);
    const walletNames = [];

    dispatchFetchUserWalletsAction(walletNames);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: walletNames,
      type: FETCH_USER_WALLETS,
    });
  });
  it("should dispatch fetch dispatchOnClickBudget action", () => {
    const dispatchMock = jest.fn();
    const { dispatchOnClickBudget } = mapDispatchToProps(dispatchMock);
    const jurisdiction = "jurisdictionMock";
    const url = "urlMock";

    dispatchOnClickBudget(url, jurisdiction);
    expect(dispatchMock).toHaveBeenCalledWith({
      payload: {
        module: "my account",
        text: "my budget",
        url,
        jurisdiction,
      },
      type: UI__USER_PROFILE_BUDGET_LINK_CLICK,
    });
  });

  describe("dispatchBetPlacement", () => {
    describe("when I have a valid ActiveProduct", () => {
      describe("when ActiveProduct is Exchange", () => {
        describe("when BetslipStep is PLACE_POTENCIAL", () => {
          it("should dispatch fetch BettingExchangePlaceBetsAction", () => {
            const betslipDepositRedirect = {
              activeProduct: "EXCHANGE",
              step: "PLACE_POTENTIAL",
              betId: "betId",
              exchangeMarket: "exchangeMarket",
              exchangeRunner: "exchangeRunner",
            };

            const dispatch = jest.fn();
            const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

            dispatchBetPlacement(betslipDepositRedirect);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__EXC_PLACE_BETS,
              payload: {
                confirmFirst: false,
                runner: "exchangeRunner",
              },
            });
          });
        });

        describe("when BetslipStep is CONFIRM_POTENTIAL", () => {
          it("should dispatch fetch BettingExchangePlaceBetsAction", () => {
            const betslipDepositRedirect = {
              activeProduct: "EXCHANGE",
              step: "CONFIRM_POTENTIAL",
              betId: "betId",
              exchangeMarket: "exchangeMarket",
              exchangeRunner: "exchangeRunner",
            };

            const dispatch = jest.fn();
            const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

            dispatchBetPlacement(betslipDepositRedirect);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__EXC_PLACE_BETS,
              payload: {
                confirmFirst: false,
                runner: "exchangeRunner",
              },
            });
          });
        });

        describe("when BetslipStep is EDIT_UNMATCHED", () => {
          it("should dispatch fetch BettingExchangeUnmatchedUpdate", () => {
            const betslipDepositRedirect = {
              activeProduct: "EXCHANGE",
              step: "EDIT_UNMATCHED",
              betId: "betId",
              exchangeMarket: "exchangeMarket",
              exchangeRunner: "exchangeRunner",
            };

            const dispatch = jest.fn();
            const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

            dispatchBetPlacement(betslipDepositRedirect);

            expect(dispatch).toHaveBeenCalledWith({
              type: BETTING__EXC_UNMATCHED_UPDATE,
              payload: {
                betId: "betId",
                market: "exchangeMarket",
                runner: "exchangeRunner",
                betOriginURL: null,
              },
            });
          });
        });
      });

      describe("when ActiveProduct is Sportsbook", () => {
        it("should dispatch fetch BettingSportsbookPlaceBetsAction", () => {
          const betslipDepositRedirect = { activeProduct: "SPORTSBOOK" };

          const dispatch = jest.fn();
          const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

          dispatchBetPlacement(betslipDepositRedirect);

          expect(dispatch).toHaveBeenCalledWith({ type: BETTING__SBK_PLACE_BETS });
        });
      });

      describe("when ActiveProduct is None", () => {
        it("should not dispatch bet placement action", () => {
          const betslipDepositRedirect = { activeProduct: "NONE" };

          const dispatch = jest.fn();
          const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

          dispatchBetPlacement(betslipDepositRedirect);

          expect(dispatch).not.toHaveBeenCalled();
        });
      });
    });

    describe("when I do not have a valid ActiveProduct", () => {
      it("should not dispatch bet placement action", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = mapDispatchToProps(dispatch);

        dispatchBetPlacement({});

        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("dispatchDepositSuccessfulAction", () => {
    const referrerLocation = "localhost";

    describe("when firstDeposit is true", () => {
      const data = {
        payload: {
          firstDeposit: true,
        },
      };

      it("should dispatch FirstDepositSuccessAction and not DepositSuccessAction", () => {
        const dispatch = jest.fn();
        const { dispatchDepositSuccessfulAction } = mapDispatchToProps(dispatch);

        dispatchDepositSuccessfulAction(data, referrerLocation);

        expect(dispatch).toHaveBeenCalledWith({
          type: FIRST_DEPOSIT_SUCCESS,
          payload: {
            data,
          },
        });
        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: DEPOSIT_SUCCESS,
          }),
        );
      });

      it("should dispatch DepositFlowAction with correct message", () => {
        const dispatch = jest.fn();
        const { dispatchDepositSuccessfulAction } = mapDispatchToProps(dispatch);

        dispatchDepositSuccessfulAction(data, referrerLocation);

        expect(dispatch).toHaveBeenCalledWith({
          type: DEPOSIT_FLOW,
          payload: {
            data,
            referrerLocation,
            message: "made first deposit",
          },
        });
      });
    });

    describe("when firstDeposit is false", () => {
      const data = {
        payload: {
          firstDeposit: false,
        },
      };

      it("should dispatch DepositSuccessAction and not FirstDepositSuccessAction", () => {
        const dispatch = jest.fn();
        const { dispatchDepositSuccessfulAction } = mapDispatchToProps(dispatch);

        dispatchDepositSuccessfulAction(data, referrerLocation);

        expect(dispatch).toHaveBeenCalledWith({
          type: DEPOSIT_SUCCESS,
          payload: {
            data,
          },
        });
        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: FIRST_DEPOSIT_SUCCESS,
          }),
        );
      });

      it("should dispatch DepositFlowAction with correct message", () => {
        const dispatch = jest.fn();
        const { dispatchDepositSuccessfulAction } = mapDispatchToProps(dispatch);

        dispatchDepositSuccessfulAction(data, referrerLocation);

        expect(dispatch).toHaveBeenCalledWith({
          type: DEPOSIT_FLOW,
          payload: {
            data,
            referrerLocation,
            message: "made deposit",
          },
        });
      });
    });
  });
});
describe("createBasicPlan", () => {
  it("createBasicPlan returns the correct value when called", () => {
    expect(createBasicPlan(userProfileLinks)).toEqual({
      target: "_self",
      text: "I18N.BASIC_PLAN",
      viewLink: {
        viewUrl: "MY_ACCOUNT_ENDPOINT/rewards/my-rewards?prod=PRODUCT_ID&showHeader=0",
        viewUrn: "",
      },
    });
  });
});

describe("buildUserProfileMenu", () => {
  it("buildUserProfileMenu returns the correct value when called", () => {
    expect(
      buildUserProfileMenu({ title: "mocked & Title1", sectionType: "GENERIC", sectionLabel: "LABEL", items: [] }),
    ).toEqual({
      groupsMenuItem: {
        items: [],
        sectionLabel: "LABEL",
        sectionType: "GENERIC",
        title: "mocked & Title1",
      },
    });
  });
});

describe("createMyRewardsAndRewardsPlus", () => {
  it("createMyRewardsAndRewardsPlus returns the correct value when called", () => {
    expect(
      createMyRewardsAndRewardsPlus(
        {
          rewardsStatus: "OPTED_IN",
          lastMonthTradedMarkets: 1,
          currentMonthTradedMarkets: 18,
          currentMonth: "SEPTEMBER",
          nextMonth: "OCTOBER",
          availablePackages: [],
          qualifiedBenefitsPackage: {
            commissionRate: null,
            requiredMarketBets: 20,
            packageLevel: "BEST",
            benefits: [],
            criteriaType: "SUM_EXCH_SBK",
          },
          chosenBenefitsPackage: {
            commissionRate: null,
            requiredMarketBets: 20,
            packageLevel: "BEST",
            benefits: [],
            criteriaType: "SUM_EXCH_SBK",
          },
        },
        userProfileLinks,
      ),
    ).toEqual([
      {
        bets: { currentBets: 18, totalBets: 20 },
        month: "OCTOBER",
        monthMessage: "I18N.NEXT_MONTH_MESSAGE.SUM_EXCH_SBK",
        url: "MY_ACCOUNT_ENDPOINT/rewards/my-rewards?prod=PRODUCT_ID&showHeader=0",
      },
      {
        month: "SEPTEMBER",
        monthMessage: "I18N.CURRENT_MONTH_FAILED_MESSAGE.SUM_EXCH_SBK",
      },
    ]);
  });
});

describe("createNoPlanSelected", () => {
  it("createNoPlanSelected returns the correct value when called", () => {
    expect(
      createNoPlanSelected({
        rewardsStatus: "NOT_OPTED_IN",
        lastMonthTradedMarkets: 1,
        currentMonthTradedMarkets: 18,
        currentMonth: "JULY",
        nextMonth: "AUGUST",
        availablePackages: [
          {
            commissionRate: 10,
            requiredMarketBets: 20,
            packageLevel: "GOOD",
            excludedBenefits: [],
            benefits: [
              {
                hidden: false,
                accessLevel: "NONE",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
          {
            commissionRate: 8,
            requiredMarketBets: 20,
            packageLevel: "BETTER",
            excludedBenefits: [],
            benefits: [
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
          {
            commissionRate: 1,
            requiredMarketBets: 20,
            packageLevel: "BEST",
            excludedBenefits: [],
            benefits: [
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
        ],
        qualifiedBenefitsPackage: null,
        chosenBenefitsPackage: null,
      }),
    ).toEqual([
      { packageLevel: "GOOD", packages: ["$10 I18N.NO_FREE_ACCA", "10% Commission"] },
      { packageLevel: "BETTER", packages: ["$10 I18N.FREE_ACCA", "8% Commission"] },
      { packageLevel: "BEST", packages: ["$10 I18N.FREE_ACCA", "1% Commission"] },
    ]);
  });

  it("createNoPlanSelected returns the correct value when called for excluded benefits", () => {
    expect(
      createNoPlanSelected({
        rewardsStatus: "NOT_OPTED_IN",
        lastMonthTradedMarkets: 1,
        currentMonthTradedMarkets: 18,
        currentMonth: "JULY",
        nextMonth: "AUGUST",
        availablePackages: [
          {
            commissionRate: 10,
            requiredMarketBets: 20,
            packageLevel: "GOOD",
            excludedBenefits: [
              {
                type: "FREE_ACCA",
                accessLevel: "STANDARD",
              },
            ],
            benefits: [
              {
                hidden: false,
                accessLevel: "NONE",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
          {
            commissionRate: 8,
            requiredMarketBets: 20,
            packageLevel: "BETTER",
            excludedBenefits: [
              {
                type: "FREE_ACCA",
                accessLevel: "STANDARD",
              },
            ],
            benefits: [
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
          {
            commissionRate: 1,
            requiredMarketBets: 20,
            packageLevel: "BEST",
            excludedBenefits: [
              {
                type: "FREE_ACCA",
                accessLevel: "STANDARD",
              },
            ],
            benefits: [
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "FREE_ACCA",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
              {
                hidden: false,
                accessLevel: "STANDARD",
                type: "CASH_RACE",
                valueLookup: {
                  maxAmount: null,
                  quantity: {
                    type: "CURRENCY",
                    value: "10",
                  },
                  size: null,
                },
              },
            ],
          },
        ],
        qualifiedBenefitsPackage: null,
        chosenBenefitsPackage: null,
      }),
    ).toEqual([
      { packageLevel: "GOOD", packages: ["10% Commission"] },
      { packageLevel: "BETTER", packages: ["8% Commission"] },
      { packageLevel: "BEST", packages: ["$10 I18N.CASH_RACE", "1% Commission"] },
    ]);
  });
});

describe("createBudgetCard", () => {
  it("createBudgetCard returns the correct value when called", () => {
    expect(
      createBudgetCard({
        amount: 500,
        remain: 400,
        category: "NDL",
        reset: "02.03.2021, 00:00",
      }),
    ).toEqual({
      amount: 500,
      category: "NDL",
      currencyValue: "$0.00",
      itemLink: {
        isTextLink: true,
        target: "_self",
        viewLink: {
          viewUrl: "SPEND_BUDGET_ENDPOINT",
          viewUrn: "",
        },
      },
      linkText: "I18N.BUDGET_LINK",
      remain: 400,
      remainText: "I18N.BUDGET_REMAIN",
      reset: "I18N.BUDGET_RESETS 02.03.2021, 00:00",
      statusLabel: "I18N.ACCOUNT_BADGE",
      title: "I18N.BUDGET_TITLE",
    });
  });
});
