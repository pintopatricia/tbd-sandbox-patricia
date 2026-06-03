import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createGetWalletsAvailabilitySelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { FETCH_CARDS } from "@ppb/tbd-store";
import { FETCH_USER_MAIN_WALLET } from "@ppb/tbd-store/actions/user-wallets";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PUSH, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { UI__LOGO_CLICK } from "@ppb/tbd-store/actions/navigation";
import { UI__GENEROSITY_WALLET_BUTTON_CLICK, UI__MY_ACCOUNT_ICON_CLICK } from "@ppb/tbd-store/actions/interface";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { getActiveBetslipType } from "@ppb/tbd-store/state/betting/betting-selectors";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { UI__BETSLIP_COLLAPSE_ACTION } from "@ppb/tbd-store/actions/betslip";

import { getAuthData } from "../../config/endpoints";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { NETWORK__FETCH_UNREAD_NOTIFICATIONS } from "@ppb/tbd-store/actions/notifications-center";

const MAIN_WALLET_STATE = {
  entities: {
    userdetails: {
      currencyCode: "EUR",
      localeCode: "en",
      countryCode: "GB",
      loggedIn: true,
    },
    wallets: {
      MAIN: {
        walletName: "MAIN",
        amount: 123.4567,
      },
    },
    preferences: {
      showBalances: true,
      products: ["sportsbook"],
    },
    throttles: {
      PIN_GAMING_SEARCH: {
        isActive: true,
      },
      PIN_GAMING_RIBBON_NAV: {
        isActive: true,
      },
    },
  },
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:browse": {},
      },
    },
    cards: {
      myaccount: {
        isOpen: false,
      },
    },
  },
  router: {
    currentView: "SomeView",
    currentUrl: "",
    showBackButton: false,
  },
  notificationsCenter: {
    unreadNotificationsCount: 0,
  },
};

const TOKENS_WALLET_STATE = {
  entities: {
    userdetails: {
      currencyCode: "EUR",
      localeCode: "en",
      countryCode: "GB",
      loggedIn: true,
    },
    wallets: {
      TOKENS: {
        walletName: "TOKENS",
        amount: 5,
      },
    },
    preferences: {
      showBalances: true,
      products: [ProductsOption.sportsbook],
    },
    throttles: {
      PIN_GAMING_SEARCH: {
        isActive: true,
      },
      SCROLL_FOR_SEARCH_BAR: {
        isActive: true,
      },
      PIN_GAMING_RIBBON_NAV: {
        isActive: true,
      },
    },
  },
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:browse": {},
      },
    },
    cards: {
      myaccount: {
        isOpen: true,
      },
    },
  },
  router: {
    currentUrl: "",
    currentUrn: "ppb:view",
  },
  notificationsCenter: {
    unreadNotificationsCount: 0,
  },
};

function setupBackButtonState({ currentUrn = "some:urn", showBackButton = false }) {
  return {
    ...MAIN_WALLET_STATE,
    router: {
      ...MAIN_WALLET_STATE.router,
      currentUrn,
      showBackButton,
    },
  };
}

const getUserMainWalletValueMock = jest.fn();
const getWalletsAvailabilityMock = jest.fn(() => ({
  freeBetsBalance: 0,
  areGenerosityTokensAvailable: false,
}));
const getViewByURN = jest.fn();
const getUserPreferencesWithProductSwitcher = jest.fn(() => ({
  showBalances: true,
  products: ["sportsbook"],
}));
const getProductPreferenceWithProductSwitcher = jest.fn(() => ProductsOption.sportsbook);
const getThrottle = jest.fn((throttles, throttleName) => {
  if (throttleName === "PIN_GAMING_SEARCH") {
    return { isActive: true };
  }
  if (throttleName === "SCROLL_FOR_SEARCH_BAR") {
    return { isActive: true };
  }
  return { isActive: false };
});
const getExperiment = jest.fn(() => ({ variant: "" }));

jest.spyOn(console, "warn").mockImplementation();

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    countryCode: "IE",
    localeCode: "en",
    currencyCode: "EUR",
    loggedIn: true,
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
  createProductPreferenceWithProductSwitcherSelector: jest.fn(() => getProductPreferenceWithProductSwitcher),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => getUserMainWalletValueMock),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createGetWalletsAvailabilitySelector: jest.fn(() => getWalletsAvailabilityMock),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() => getViewByURN),
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("@ppb/tbd-store/state/hamburger-menu", () => ({
  getHamburgerMenuState: jest.fn(() => ({
    isOpen: false,
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("@ppb/tbd-store/state/betting/betting-selectors", () => ({
  getActiveBetslipType: jest.fn(() => null),
}));

const authDataWithContentLabel = {
  JOIN_DATA: {
    joinNowLabel: "joinNowLabel",
  },
};

const authDataWithoutContentLabel = {
  JOIN_DATA: {},
};

const logoViewLinkMock = {
  viewUrl: "",
  viewUrn: "ppb:tbd:view:generic:home",
};

jest.mock("../../config/endpoints", () => ({
  getAuthData: jest.fn(() => authDataWithoutContentLabel),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn((obj) => obj.value),
}));

const setupMapStateToProps = ({ state = MAIN_WALLET_STATE } = {}) => makeMapStateToProps()(state);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapStateToProps()).toEqual(expect.any(Function));
  });

  it("should call createGetUserMainWalletValueSelector only 1 time", () => {
    setupMapStateToProps();
    expect(createGetUserMainWalletValueSelector).toHaveBeenCalledTimes(1);
  });

  it("should call createGetWalletsAvailabilitySelector only 1 time", () => {
    setupMapStateToProps();
    expect(createGetWalletsAvailabilitySelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when current view is maintenance", () => {
      it("should isMaintenance as true", () => {
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            router: {
              currentView: EntityType.MaintenanceView,
            },
          },
        });

        expect(props.isMaintenance).toEqual(true);
      });
    });

    describe("when product is exchange", () => {
      it("should set isExchange as true", () => {
        getProductPreferenceWithProductSwitcher.mockReturnValueOnce(ProductsOption.exchange);
        const props = setupMapStateToProps();

        expect(props.isExchange).toEqual(true);
      });
    });

    describe("when state contains MAIN wallet", () => {
      it("should return properly formatted account balance and search state", () => {
        getUserMainWalletValueMock.mockReturnValue(45.72);
        const props = setupMapStateToProps({ state: MAIN_WALLET_STATE });

        expect(props).toEqual({
          urn: "",
          url: "",
          authData: authDataWithoutContentLabel,
          userPreferences: ["sportsbook"],
          isMyAccount: false,
          isSBGJoinNowEnabled: false,
          isLoggedIn: true,
          isMaintenance: false,
          canGoBack: false,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          showBalances: true,
          accountBalance: 45.72,
          shouldAccountForXSellBar: false,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
          },
          isFreeBetsWalletActive: false,
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          hasOverlay: false,
          pinGamingSearch: true,
          scrollForSearchBar: true,
          pinGamingRibbonNav: false,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when state does not contain MAIN wallet", () => {
      it("should return undefined", () => {
        getUserMainWalletValueMock.mockReturnValue(undefined);
        const props = setupMapStateToProps({ state: TOKENS_WALLET_STATE });

        expect(props).toEqual({
          urn: "ppb:view",
          url: "",
          authData: authDataWithoutContentLabel,
          userPreferences: ["sportsbook"],
          isMyAccount: false,
          isSBGJoinNowEnabled: false,
          isLoggedIn: true,
          isMaintenance: false,
          canGoBack: undefined,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          showBalances: true,
          accountBalance: undefined,
          shouldAccountForXSellBar: false,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
          },
          isFreeBetsWalletActive: false,
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          hasOverlay: false,
          pinGamingSearch: true,
          scrollForSearchBar: true,
          pinGamingRibbonNav: false,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when free bets balance is defined", () => {
      it("should return properly formatted header wallet label", () => {
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getWalletsAvailabilityMock.mockReturnValue({
          freeBetsBalance: 20,
          areGenerosityTokensAvailable: false,
        });
        const props = setupMapStateToProps();

        expect(props).toEqual({
          urn: "",
          url: "",
          authData: authDataWithoutContentLabel,
          userPreferences: ["sportsbook"],
          isMyAccount: false,
          isSBGJoinNowEnabled: false,
          isLoggedIn: true,
          isMaintenance: false,
          canGoBack: false,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          showBalances: true,
          accountBalance: 45.72,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
            headerWalletLabel: 20,
          },
          isFreeBetsWalletActive: false,
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          shouldAccountForXSellBar: false,
          hasOverlay: false,
          pinGamingSearch: true,
          scrollForSearchBar: true,
          pinGamingRibbonNav: false,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when free bets balance and token are not defined", () => {
      it("should return headerWalletLabel undefined", () => {
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getWalletsAvailabilityMock.mockReturnValue({
          freeBetsBalance: 0,
          areGenerosityTokensAvailable: false,
        });

        const props = setupMapStateToProps();

        expect(props).toEqual({
          urn: "",
          url: "",
          authData: authDataWithoutContentLabel,
          userPreferences: ["sportsbook"],
          isMyAccount: false,
          isSBGJoinNowEnabled: false,
          isLoggedIn: true,
          isMaintenance: false,
          canGoBack: false,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          showBalances: true,
          accountBalance: 45.72,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
            headerWalletLabel: undefined,
          },
          isFreeBetsWalletActive: false,
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          shouldAccountForXSellBar: false,
          hasOverlay: false,
          pinGamingSearch: true,
          pinGamingRibbonNav: false,
          scrollForSearchBar: true,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when generosity tokens is defined and free bets are not defined", () => {
      it("should return headerWalletLabel with the correct label", () => {
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getWalletsAvailabilityMock.mockReturnValue({
          areGenerosityTokensAvailable: true,
        });

        const props = setupMapStateToProps();

        expect(props).toEqual({
          urn: "",
          url: "",
          authData: authDataWithoutContentLabel,
          userPreferences: ["sportsbook"],
          isMyAccount: false,
          isSBGJoinNowEnabled: false,
          isLoggedIn: true,
          isMaintenance: false,
          canGoBack: false,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          showBalances: true,
          accountBalance: 45.72,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
            headerWalletLabel: "I18N.BONUSES_WALLET",
          },
          isFreeBetsWalletActive: false,
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          shouldAccountForXSellBar: false,
          hasOverlay: false,
          pinGamingSearch: true,
          pinGamingRibbonNav: false,
          scrollForSearchBar: true,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when exists a join now defined from content management", () => {
      it("should return the defined label", () => {
        getViewByURN.mockReturnValue(null);
        getAuthData.mockReturnValue(authDataWithContentLabel);
        const props = setupMapStateToProps({ state: TOKENS_WALLET_STATE });

        expect(props.labels.joinNowButtonLabel).toEqual(authDataWithContentLabel.JOIN_DATA.joinNowLabel);
      });
    });

    describe("when state contains the back button visibility", () => {
      it("should send canGoBack as true", () => {
        const props = setupMapStateToProps({
          state: setupBackButtonState({ showBackButton: true }),
        });

        expect(props.canGoBack).toEqual(true);
      });
    });

    describe("when there is an error", () => {
      it("should return the default values", () => {
        getAuthData.mockReturnValue(authDataWithoutContentLabel);
        getUserDetails.mockImplementationOnce(() => {
          throw new Error();
        });

        const props = setupMapStateToProps();

        expect(console.warn).toHaveBeenCalledWith("Header initialisation error - Error");

        expect(props).toEqual({
          urn: "",
          url: "",
          accountBalance: undefined,
          freeBetsBalance: undefined,
          authData: authDataWithoutContentLabel,
          userPreferences: [],
          isMyAccount: false,
          isLoggedIn: false,
          isMaintenance: false,
          canGoBack: false,
          isExchange: false,
          isGaming: false,
          logoViewLink: logoViewLinkMock,
          title: undefined,
          showBalances: false,
          labels: {
            loginButtonLabel: "I18N.HEADER.LOGIN",
            joinNowButtonLabel: "I18N.HEADER.JOIN_NOW",
            headerWalletLabel: undefined,
          },
          isHamburguerMenuEnabled: false,
          isHamburgerMenuOpen: false,
          shouldAccountForXSellBar: false,
          hasOverlay: false,
          isNotificationsCenterEnabled: false,
          hasUnreadNotifications: false,
        });
      });
    });

    describe("when FREE_BETS_WALLET throttle is active", () => {
      it("should return isFreeBetsWalletActive flag as true", () => {
        getThrottle.mockReturnValue({ isActive: true });

        const props = setupMapStateToProps();

        expect(getThrottle).toHaveBeenCalledWith(MAIN_WALLET_STATE.entities.throttles, "FREE_BETS_WALLET");

        expect(props.isFreeBetsWalletActive).toEqual(true);
      });
    });

    it("should return isFreeBetsWalletActive flag as false", () => {
      getThrottle.mockReturnValue({ isActive: false });

      const props = setupMapStateToProps();

      expect(getThrottle).toHaveBeenCalledWith(MAIN_WALLET_STATE.entities.throttles, "FREE_BETS_WALLET");

      expect(props.isFreeBetsWalletActive).toEqual(false);
    });
  });

  describe("SBG_HAS_JOIN_NOW throttle", () => {
    it("should return isSBGJoinNowEnabled flag as true", () => {
      getThrottle.mockReturnValue({ isActive: true });

      const props = setupMapStateToProps();

      expect(getThrottle).toHaveBeenCalledWith(MAIN_WALLET_STATE.entities.throttles, "SBG_HAS_JOIN_NOW");

      expect(props.isSBGJoinNowEnabled).toEqual(true);
    });

    it("should return isSBGJoinNowEnabled flag as false", () => {
      getThrottle.mockReturnValue({ isActive: false });

      const props = setupMapStateToProps();

      expect(getThrottle).toHaveBeenCalledWith(MAIN_WALLET_STATE.entities.throttles, "SBG_HAS_JOIN_NOW");

      expect(props.isSBGJoinNowEnabled).toEqual(false);
    });

    describe("when hamburger menu is enabled", () => {
      it("should return isHamburguerMenuEnabled as true", () => {
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            entities: {
              ...MAIN_WALLET_STATE.entities,
              brandSettings: {
                ...MAIN_WALLET_STATE.entities.brandSettings,
                HAMBURGER_MENU: true,
              },
            },
          },
        });

        expect(props.isHamburguerMenuEnabled).toBe(true);
      });
    });

    describe("when REDIRECT_TO_GAMING_PAGE is true", () => {
      it("should return is gaming true if there is a gaming urn", () => {
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            entities: {
              ...MAIN_WALLET_STATE.entities,
              brandSettings: {
                ...MAIN_WALLET_STATE.entities.brandSettings,
                REDIRECT_TO_GAMING_PAGE: true,
              },
            },
            router: {
              ...MAIN_WALLET_STATE.router,
              currentView: "ppb:tbd:view:gaming",
              currentUrn: "ppb:tbd:view:gaming:1",
            },
          },
        });

        expect(props.isGaming).toBe(true);
      });

      it("should return is gaming true if there is not a gaming urn", () => {
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            entities: {
              ...MAIN_WALLET_STATE.entities,
              brandSettings: {
                ...MAIN_WALLET_STATE.entities.brandSettings,
                REDIRECT_TO_GAMING_PAGE: true,
              },
            },
            router: {
              ...MAIN_WALLET_STATE.router,
              currentView: "ppb:tbd:view:generic",
              currentUrn: "ppb:tbd:generic:home",
            },
          },
        });

        expect(props.isGaming).toBe(false);
      });
    });

    describe("when brand setting SHOW_X_SELL_BAR is true", () => {
      it("should return shouldAccountForXSellBar as true", () => {
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            entities: {
              ...MAIN_WALLET_STATE.entities,
              brandSettings: {
                ...MAIN_WALLET_STATE.entities.brandSettings,
                SHOW_X_SELL_BAR: true,
              },
            },
          },
        });

        expect(props.shouldAccountForXSellBar).toBe(true);
      });
    });
  });

  describe("hasOverlay", () => {
    describe("when active betslip type is null", () => {
      it("should be false", () => {
        getThrottle.mockReturnValue({ isActive: true });
        getActiveBetslipType.mockReturnValue(null);
        const { hasOverlay } = setupMapStateToProps();

        expect(hasOverlay).toBe(false);
      });
    });
    describe("when active betslip type is SPORTSBOOK", () => {
      describe("and betslip is collapsed", () => {
        it("should be false", () => {
          getThrottle.mockReturnValue({ isActive: true });
          getActiveBetslipType.mockReturnValue(BetslipType.SPORTSBOOK);
          const { hasOverlay } = setupMapStateToProps({
            state: {
              ...MAIN_WALLET_STATE,
              betslip: {
                isCollapsed: true,
              },
            },
          });

          expect(hasOverlay).toBe(false);
        });
      });
      describe("and betslip is not collapsed", () => {
        it("should be true", () => {
          getThrottle.mockReturnValue({ isActive: true });
          getActiveBetslipType.mockReturnValue(BetslipType.SPORTSBOOK);
          const { hasOverlay } = setupMapStateToProps({
            state: {
              ...MAIN_WALLET_STATE,
              betslip: {
                isCollapsed: false,
              },
            },
          });

          expect(hasOverlay).toBe(true);
        });
      });
    });
    describe("when active betslip type is OBB", () => {
      describe("and betslip is collapsed", () => {
        it("should be false", () => {
          getThrottle.mockReturnValue({ isActive: true });
          getActiveBetslipType.mockReturnValue(BetslipType.OBB);
          const { hasOverlay } = setupMapStateToProps({
            state: {
              ...MAIN_WALLET_STATE,
              betslip: {
                isCollapsed: true,
              },
            },
          });

          expect(hasOverlay).toBe(false);
        });
      });
      describe("and betslip is not collapsed", () => {
        it("should be true", () => {
          getThrottle.mockReturnValue({ isActive: true });
          getActiveBetslipType.mockReturnValue(BetslipType.OBB);
          const { hasOverlay } = setupMapStateToProps({
            state: {
              ...MAIN_WALLET_STATE,
              betslip: {
                isCollapsed: false,
              },
            },
          });

          expect(hasOverlay).toBe(true);
        });
      });
    });
  });

  describe("notifications", () => {
    describe("when there are unread notifications", () => {
      it("should return the correct count", () => {
        getThrottle.mockReturnValue({ isActive: true });
        const props = setupMapStateToProps({
          state: {
            ...MAIN_WALLET_STATE,
            notificationsCenter: {
              unreadNotificationsCount: 5,
            },
          },
        });
        expect(props.hasUnreadNotifications).toBe(true);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
    const isOpen = true;

    describe("dispatchFetchUserMainWallet", () => {
      it("should dispatch fetch user main wallet", () => {
        const { dispatchFetchUserMainWallet } = mapDispatchToProps;

        expect(dispatchFetchUserMainWallet()).toEqual({
          type: FETCH_USER_MAIN_WALLET,
        });
      });
    });

    describe("dispatchPushAction", () => {
      it("should dispatch push action", () => {
        const { dispatchPushAction } = mapDispatchToProps;

        expect(dispatchPushAction(viewLinkMock)).toEqual({
          type: PUSH,
          payload: viewLinkMock,
        });
      });
    });

    describe("dispatchLogoClickAction", () => {
      it("should dispatch logo click action", () => {
        const { dispatchLogoClickAction } = mapDispatchToProps;

        expect(dispatchLogoClickAction(viewLinkMock)).toEqual({
          type: UI__LOGO_CLICK,
          payload: {
            path: viewLinkMock.viewUrl,
          },
        });
      });
    });

    describe("dispatchMyAccountIconClickAction", () => {
      it("should dispatch my account icon click action", () => {
        const { dispatchMyAccountIconClickAction } = mapDispatchToProps;

        expect(dispatchMyAccountIconClickAction(isOpen)).toEqual({
          type: PUSH,
          payload: {
            viewUrn: `ppb:tbd:view:myAccountView:true`,
            viewUrl: `/navigation/a-true`,
          },
        });
      });
    });

    describe("dispatchMyAccountClickAction", () => {
      it("should dispatch my account icon click action", () => {
        const { dispatchMyAccountClickAction } = mapDispatchToProps;

        expect(dispatchMyAccountClickAction(isOpen)).toEqual({
          type: UI__MY_ACCOUNT_ICON_CLICK,
          payload: true,
        });
      });
    });

    describe("dispatchFetchGenerosityWalletCardGroupAction", () => {
      it("should dispatch fetch generosity wallet card group", () => {
        const { dispatchFetchGenerosityWalletCardGroupAction } = mapDispatchToProps;

        expect(dispatchFetchGenerosityWalletCardGroupAction()).toEqual({
          type: FETCH_CARDS,
          payload: {
            urns: ["ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets"],
          },
        });
      });
    });

    describe("dispatchGenerosityWalletClickAction", () => {
      it("should dispatch generosity wallet click action", () => {
        const { dispatchGenerosityWalletClickAction } = mapDispatchToProps;

        expect(dispatchGenerosityWalletClickAction()).toEqual({
          type: UI__GENEROSITY_WALLET_BUTTON_CLICK,
          payload: {
            module: "header",
          },
        });
      });
    });

    describe("dispatchExternalPushAction", () => {
      it("should dispatch external push action without URN", () => {
        const { dispatchExternalPushAction } = mapDispatchToProps;

        expect(dispatchExternalPushAction("label", "moduleName", "URL")).toEqual({
          type: EXTERNAL_PUSH,
          payload: {
            viewUrn: "",
            viewUrl: "URL",
            gtmData: {
              label: "label",
              moduleName: "moduleName",
            },
          },
        });
      });
    });

    describe("dispatchHeaderOverlayClickAction", () => {
      it("should dispatch UI__BETSLIP_COLLAPSE_ACTION", () => {
        const { dispatchHeaderOverlayClickAction } = mapDispatchToProps;

        expect(dispatchHeaderOverlayClickAction()).toEqual({
          type: UI__BETSLIP_COLLAPSE_ACTION,
        });
      });
    });

    describe("dispatchFetchNotificationsAction", () => {
      it("should dispatch NETWORK__FETCH_UNREAD_NOTIFICATIONS", () => {
        const { dispatchFetchNotificationsAction } = mapDispatchToProps;

        expect(dispatchFetchNotificationsAction()).toEqual({
          type: NETWORK__FETCH_UNREAD_NOTIFICATIONS,
        });
      });
    });
  });
});
