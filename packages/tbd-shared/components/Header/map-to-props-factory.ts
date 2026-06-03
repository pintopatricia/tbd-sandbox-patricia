import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import { FETCH_CARDS, FetchCardsAction, createGetThrottleSelector } from "@ppb/tbd-store";
import { LogoClickAction, UI__LOGO_CLICK } from "@ppb/tbd-store/actions/navigation";
import {
  GenerosityWalletButtonAction,
  MyAccountIconClickAction,
  UI__GENEROSITY_WALLET_BUTTON_CLICK,
  UI__MY_ACCOUNT_ICON_CLICK,
} from "@ppb/tbd-store/actions/interface";
import { PUSH, PushAction, EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store/actions/router";
import {
  getHamburgerMenuState,
  open as openHamburgerMenu,
  close as closeHamburgerMenu,
} from "@ppb/tbd-store/state/hamburger-menu";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getUnreadNotificationsCount } from "@ppb/tbd-store/state/notifications-center/notifications-center-selectors";
import {
  createProductPreferenceWithProductSwitcherSelector,
  createUserPreferencesWithProductSwitcherSelector,
} from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { FetchUserMainWalletAction, FETCH_USER_MAIN_WALLET } from "@ppb/tbd-store/actions/user-wallets";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createGetWalletsAvailabilitySelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { BetslipCollapseAction, UI__BETSLIP_COLLAPSE_ACTION } from "@ppb/tbd-store/actions/betslip";
import { getActiveBetslipType } from "@ppb/tbd-store/state/betting/betting-selectors";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { HeaderCommonProps } from "./snowflakes/Header/Header.types";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import { getAuthData } from "../../config/endpoints";
import {
  FetchUnreadNotificationsAction,
  NETWORK__FETCH_UNREAD_NOTIFICATIONS,
} from "@ppb/tbd-store/actions/notifications-center";

export type ContainerProps = {
  removeStickyElement?: boolean;
  hideHeader?: boolean;
  onPortalContainerResize?: (px: number) => void;
};

export type StateProps = {
  urn: string;
  url: string;
  authData?: AuthData;
  userPreferences: ProductsOption[];
  isMyAccount?: boolean;
  isLoggedIn: HeaderCommonProps["isLoggedIn"];
  isMaintenance: HeaderCommonProps["isMaintenance"];
  canGoBack: boolean;
  isExchange?: boolean;
  isGaming?: boolean;
  logoViewLink: ViewLink;
  showBalances: HeaderCommonProps["showBalances"];
  accountBalance?: HeaderCommonProps["accountBalance"];
  isFreeBetsWalletActive?: boolean;
  labels: {
    loginButtonLabel: NonNullable<HeaderCommonProps["labels"]>["loginButtonLabel"];
    joinNowButtonLabel: NonNullable<HeaderCommonProps["labels"]>["joinNowButtonLabel"];
    headerWalletLabel?: HeaderCommonProps["labels"]["headerWalletLabel"];
  };
  isHamburguerMenuEnabled?: boolean;
  isHamburgerMenuOpen: boolean;
  shouldAccountForXSellBar?: boolean;
  isNotificationsCenterEnabled: boolean;
  hasUnreadNotifications: boolean;
  isSBGJoinNowEnabled?: boolean;
  hasOverlay: boolean;
  pinGamingSearch?: boolean;
  scrollForSearchBar?: boolean;
  pinGamingRibbonNav?: boolean;
};

const EXTRA_WALLET_CARD_GROUP_URN = codecs.cardGroup.extraWallet.encode().uid;

const gamesViewCodecs = [
  codecs.gameView,
  codecs.gamingView,
  codecs.gamingCategoryView,
  codecs.gamingSegmentationView,
  codecs.externalView,
];

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getWalletsAvailability = createGetWalletsAvailabilitySelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getProductPreferenceWithProductSwitcher = createProductPreferenceWithProductSwitcherSelector();
  const getThrottle = createGetThrottleSelector();

  const authData = getAuthData();

  const translations = {
    login: i18n({ key: "I18N.HEADER.LOGIN" }),
    joinNow: i18n({ key: "I18N.HEADER.JOIN_NOW" }),
    bonuses: i18n({ key: "I18N.BONUSES_WALLET" }),
  };

  const logoViewLink: ViewLink = { viewUrl: "", viewUrn: "ppb:tbd:view:generic:home" };
  const emptyUserPreferences: ProductsOption[] = [];
  const baseLabels: StateProps["labels"] = {
    loginButtonLabel: translations.login,
    joinNowButtonLabel: authData?.JOIN_DATA.joinNowLabel || translations.joinNow,
  };

  const getLabelsWithWallet = createSelector(
    [(headerWalletLabel: string | undefined) => headerWalletLabel],
    (headerWalletLabel): StateProps["labels"] => ({ ...baseLabels, headerWalletLabel }),
  );

  return function mapStateToProps(state: ApplicationState): StateProps {
    const { showBackButton, currentUrn: viewUrn, currentView: viewType, currentUrl } = state.router;
    const { brandSettings } = state.entities;
    const pinGamingSearch = !!getThrottle(state.entities.throttles, "PIN_GAMING_SEARCH")?.isActive;
    const scrollForSearchBar = !!getThrottle(state.entities.throttles, "SCROLL_FOR_SEARCH_BAR")?.isActive;
    const pinGamingRibbonNav = !!getThrottle(state.entities.throttles, "PIN_GAMING_RIBBON_NAV")?.isActive;

    const { freeBetsBalance, areGenerosityTokensAvailable } = getWalletsAvailability(state);
    const isHamburgerMenuState = getHamburgerMenuState(state);

    const isExchange = getProductPreferenceWithProductSwitcher(state.entities.preferences) === ProductsOption.exchange;
    const parsedUrn = codecs.parse(viewUrn || "");
    let isGaming = false;
    if (parsedUrn) {
      isGaming =
        (brandSettings?.REDIRECT_TO_GAMING_PAGE || false) &&
        parsedUrn &&
        gamesViewCodecs.some((codec) => codec.isValid(parsedUrn));
    }
    const isFreeBetsWalletActive = getThrottle(state.entities.throttles, "FREE_BETS_WALLET")?.isActive;
    const isSBGJoinNowEnabled = getThrottle(state.entities.throttles, "SBG_HAS_JOIN_NOW")?.isActive;
    const isNotificationsCenterEnabled = !!getThrottle(state.entities.throttles, "ENABLE_NOTIFICATION_CENTER")
      ?.isActive;
    const hasUnreadNotifications =
      isNotificationsCenterEnabled && getUnreadNotificationsCount(state.notificationsCenter) > 0;

    const isMyAccountView = viewType === EntityType.MyAccountView;
    const isMaintenanceView = viewType === EntityType.MaintenanceView;
    const isHamburguerMenuEnabled = !!state.entities?.brandSettings?.HAMBURGER_MENU;
    const isHamburgerMenuOpen = isHamburgerMenuState.isOpen;

    // Still used to calculate header height on layout
    const shouldAccountForXSellBar = state.entities.brandSettings?.SHOW_X_SELL_BAR || false;

    const baseProps = {
      urn: viewUrn ?? "",
      url: currentUrl ?? "",
      authData,
      userPreferences: emptyUserPreferences,
      isMyAccount: isMyAccountView,
      isLoggedIn: false,
      isMaintenance: isMaintenanceView,
      canGoBack: showBackButton,
      isExchange,
      isGaming,
      logoViewLink,
      showBalances: false,
      labels: baseLabels,
      isHamburguerMenuEnabled,
      isHamburgerMenuOpen,
      shouldAccountForXSellBar,
      hasOverlay: false,
      isNotificationsCenterEnabled: false,
      hasUnreadNotifications: false,
    };

    try {
      const userDetails = <UserDetails>getUserDetails(state);
      const { showBalances, products } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
      const accountBalance = getUserMainWalletValue(state);
      const activeBetslipType = getActiveBetslipType(state);
      const hasOverlay =
        (activeBetslipType === BetslipType.SPORTSBOOK || activeBetslipType === BetslipType.OBB) &&
        state.betslip?.isCollapsed === false;

      const freebestWalletsBalance = freeBetsBalance
        ? currencyFormatWithDecimalPlaces({
            ...userDetails,
            value: freeBetsBalance,
          })
        : undefined;

      const headerWalletLabel =
        freebestWalletsBalance ?? (areGenerosityTokensAvailable ? translations.bonuses : undefined);

      return {
        ...baseProps,
        userPreferences: products,
        isLoggedIn: userDetails.loggedIn,
        showBalances,
        accountBalance:
          accountBalance !== undefined && accountBalance !== null
            ? currencyFormatWithDecimalPlaces({
                ...userDetails,
                value: accountBalance,
              })
            : undefined,
        isFreeBetsWalletActive,
        isSBGJoinNowEnabled,
        isNotificationsCenterEnabled,
        hasUnreadNotifications,
        hasOverlay,
        pinGamingSearch,
        scrollForSearchBar,
        pinGamingRibbonNav,
        labels: getLabelsWithWallet(headerWalletLabel),
      };
    } catch (e) {
      console.warn(`Header initialisation error - ${e}`);

      return baseProps;
    }
  };
};

const dispatchFetchUserMainWallet = (): FetchUserMainWalletAction => ({
  type: FETCH_USER_MAIN_WALLET,
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchLogoClickAction = (viewLink: ViewLink): LogoClickAction => ({
  type: UI__LOGO_CLICK,
  payload: {
    path: viewLink.viewUrl,
  },
});

const dispatchHeaderOverlayClickAction = (): BetslipCollapseAction => ({
  type: UI__BETSLIP_COLLAPSE_ACTION,
});

const dispatchMyAccountClickAction = (isOpen: boolean): MyAccountIconClickAction => ({
  type: UI__MY_ACCOUNT_ICON_CLICK,
  payload: isOpen,
});

const dispatchMyAccountIconClickAction = (closeUrl: string): PushAction => ({
  type: PUSH,
  payload: {
    viewUrn: `ppb:tbd:view:myAccountView:${closeUrl}`,
    viewUrl: `/navigation/a-${closeUrl}`,
  },
});

const dispatchGenerosityWalletClickAction = (): GenerosityWalletButtonAction => ({
  type: UI__GENEROSITY_WALLET_BUTTON_CLICK,
  payload: {
    module: "header",
  },
});

const dispatchFetchGenerosityWalletCardGroupAction = (): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [EXTRA_WALLET_CARD_GROUP_URN],
  },
});

const dispatchExternalPushAction = (label: string, moduleName: string, url: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl: url,
    gtmData: {
      label,
      moduleName,
    },
  },
});

const dispatchHamburgerMenuOpenAction = (): ReturnType<typeof openHamburgerMenu> => openHamburgerMenu();

const dispatchHamburgerMenuCloseAction = (): ReturnType<typeof closeHamburgerMenu> => closeHamburgerMenu();

const dispatchFetchNotificationsAction = (): FetchUnreadNotificationsAction => ({
  type: NETWORK__FETCH_UNREAD_NOTIFICATIONS,
});

export type DispatchProps = {
  dispatchFetchUserMainWallet: typeof dispatchFetchUserMainWallet;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchLogoClickAction: typeof dispatchLogoClickAction;
  dispatchMyAccountIconClickAction: typeof dispatchMyAccountIconClickAction;
  dispatchMyAccountClickAction: typeof dispatchMyAccountClickAction;
  dispatchGenerosityWalletClickAction: typeof dispatchGenerosityWalletClickAction;
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
  dispatchFetchGenerosityWalletCardGroupAction: typeof dispatchFetchGenerosityWalletCardGroupAction;
  dispatchHamburgerMenuOpenAction: typeof dispatchHamburgerMenuOpenAction;
  dispatchHamburgerMenuCloseAction: typeof dispatchHamburgerMenuCloseAction;
  dispatchHeaderOverlayClickAction: typeof dispatchHeaderOverlayClickAction;
  dispatchFetchNotificationsAction: typeof dispatchFetchNotificationsAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchUserMainWallet,
  dispatchPushAction,
  dispatchLogoClickAction,
  dispatchMyAccountIconClickAction,
  dispatchMyAccountClickAction,
  dispatchGenerosityWalletClickAction,
  dispatchExternalPushAction,
  dispatchFetchGenerosityWalletCardGroupAction,
  dispatchHamburgerMenuOpenAction,
  dispatchHamburgerMenuCloseAction,
  dispatchHeaderOverlayClickAction,
  dispatchFetchNotificationsAction,
};
