/**
 * The router service deals with logic about the navigation system of the app.
 * It exposes a simple API by wrapping React Navigation with additional behaviour
 * like `ViewLink` routing support. Its core responsibilities are to navigate forward
 * and backward across internal screens, to launch external screens containing sites
 * and to update the application store with a focused "ppb:tbd:view" screen route
 * as navigation changes occur.
 *
 * React Navigation exposes hooks to trigger navigation actions directly at component
 * level with the `useNavigation` hook. To move this logic away from components
 * we have taken the following approach as per the official docs:
 * https://reactnavigation.org/docs/navigating-without-navigation-prop
 */
import { Linking, NativeModules, Platform } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import InAppBrowser from "react-native-inappbrowser-reborn";
import {
  createNavigationContainerRef,
  ParamListBase,
  StackActions,
  useScrollToTop as scrollToTop,
} from "@react-navigation/native";

import URN from "@ppb/tbd-store/state/layout/URN";
import { DisplayMode, ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { codecs, EntityType, getEntityType } from "@ppb/tbd-urn-codecs";

// matches "/", "casino/gm-1", "casino/gm-1/", or "/casino/gm-1/"
const IGNORE_VIEW_URLS_REGEX = /^\/?(?:casino\/gm-1)?\/?$/;

export type NativeViewLink = {
  viewUrn: ViewLink["viewUrn"];
  viewUrl?: ViewLink["viewUrl"];
  viewDisplayMode?: DisplayMode | null;
  isDeepLink?: boolean;
  fallbackViewUrl?: ViewLink["viewUrl"];
};

export enum NativeEntityTypes {
  // `Main` required on Android to have `<MainNavigator/>` as Screen wrapped by the Settings Drawer
  Main = "ppb:tbd:view:main",
  BottomBar = "ppb:tbd:view:bottombar",
  Home = "ppb:tbd:view:generic:home",
  Error = "ppb:tbd:view:error",
}

type ScreenParams = {
  params: { viewLink: NativeViewLink };
  screen?: EntityType | NativeEntityTypes;
};

// Hold screen names based on view entity type values that coexist in web and
// native or are native specific
const EntityTypeScreenName = {
  ...EntityType,
  Main: NativeEntityTypes.Main,
  BottomBar: NativeEntityTypes.BottomBar,
  ExternalView: EntityType.ExternalView,
  MyBets: EntityType.MyBetsView,
};

export const BottomTypeScreenName = {
  HomeTab: "HOME",
  BrowseTab: "BROWSE",
  MyBetsTab: "MY_BETS",
  GamingTab: "GAMING",
};
export const GamesLobbyObject = NativeModules?.GamesLobbyObject;
// Hold third party screen names not following the view entity type standard
export const ThirdPartyScreenName = {
  CetStackNavigator: "CetStackNavigator",
  CetMyAccountScreen: "MyAccountScreen",
  CetWebViewScreen: "WebViewScreen",
  CetSettingsScreen: "SettingsScreen",
  CetLogin: "LoginWithEmailAndPasswordScreen",
  CetRecoverPasswordScreen: "RecoverPasswordScreen",
  CetRecoverUserNameScreen: "RecoverUserNameScreen",
  CetIndirectionPointScreen: "IndirectionPointScreen",
  CetAuthWebViewScreen: "AuthWebViewScreen",
  CetDepositScreen: "DepositScreen",
  GamingLobbyScreen: "GamingLobbyScreen",
  GamingGamesCollectionScreen: "GamingGamesCollectionScreen",
  GamingSubGamesCollectionScreen: "GamingSubGamesCollectionScreen",
  GamingMySelectionsScreen: "GamingMySelectionsScreen",
  GamingWebViewScreen: "GamingWebViewScreen",
  GameLaunchScreen: "GameLaunchScreen",
  GameInfoScreen: "GameInfoScreen",
  RootMaintenanceScreen: "RootMaintenanceScreen",
  TerritoryBlockingScreen: "TerritoryBlockingScreen",
  ErrorScreen: "ErrorScreen",
  RootErrorScreen: "RootErrorScreen",
  PredictsScreen: "PredictsScreen",
} as const; // TS to provide the values themselves

// Type union for 3rd party screen names
export type ThirdPartyScreenNameType = (typeof ThirdPartyScreenName)[keyof typeof ThirdPartyScreenName];
type ThirdPartyParams =
  | {
      screen: ThirdPartyScreenNameType;
      params?: Record<string, unknown>;
    }
  | ParamListBase;

// Hold every React Navigation screen name accepted in the app
export const ScreenName = {
  ...EntityTypeScreenName,
  ...ThirdPartyScreenName,
  ...BottomTypeScreenName,
};

// Infer a list type for screen names to pass with React Navigation
export type ScreenNameListType = {
  [K in (typeof ScreenName)[keyof typeof ScreenName]]: ScreenParams | ThirdPartyParams;
};

// Hold React Navigation `<NavigationContainer/>` component instance
export const navigationRef = createNavigationContainerRef<ScreenNameListType>();

/**
 * Temporary logging - To explore options for cloud logging with Firebase.
 */
const log = (message: string, details = ""): void => {
  if (__DEV__) {
    console.log(message, details);
  }
};

/**
 * Given a `viewUrn` infer a valid native view entity type.
 * @param viewUrn The internal screen route as view entity type
 */
function getNativeEntityType(viewUrn: string): NativeEntityTypes | undefined {
  const values: URN[] = Object.values(NativeEntityTypes);
  return values.includes(viewUrn) ? (viewUrn as NativeEntityTypes) : undefined;
}

const QUERY_PARAMS_BLACKLIST = ["bets"];

/**
 * Remove any blacklisted query param from the URL, e.g., the "bets" query param that might reopen the betslip with
 * previously removed selections when navigating backwards or to the homepage via bottom bar.
 *
 * @param viewUrl The Native view URL
 * @returns viewUrl without blacklisted query params or undefined if it doesn't have any
 */
const getBlacklistedRedirectURL = (viewUrl: NativeViewLink["viewUrl"]): string | undefined => {
  if (!viewUrl) {
    return undefined;
  }

  const [basePath, queryParams] = viewUrl.split("?");

  if (!queryParams) {
    return undefined;
  }

  const searchParams = new URLSearchParams(queryParams);
  const hasBlacklistedParam = QUERY_PARAMS_BLACKLIST.some((param) => searchParams.has(param));

  if (!hasBlacklistedParam) {
    return undefined;
  }

  QUERY_PARAMS_BLACKLIST.forEach((param) => searchParams.delete(param));

  return Array.from(searchParams).length ? `${basePath}?${searchParams}` : basePath;
};

/**
 * Determine if app finished mounting and navigate to screens with miscelaneous
 * screen names like third parties as dependencies. This method does not require
 * to infer the screen name from an entity type provided by the backend. The argument
 * `screenName` will hold already the destination screen identifier.
 * @param screenName The screen identifier.
 */
export const navigateWithThirdPartyScreenName = (
  screenName: ThirdPartyScreenNameType,
  params: ThirdPartyParams = {},
): void => {
  // Perform navigation if the app has mounted
  if (navigationRef.isReady()) {
    if (screenName === ScreenName.GamingLobbyScreen) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: BottomTypeScreenName.GamingTab, state: { routes: [{ name: screenName, params }] } }],
      });
    } else {
      navigationRef.navigate(screenName, params);
    }
  } else {
    log("Unable to navigate as app hasn't finished mounting");
  }
};

/**
 * Resolve screen name from a base or id suffix entity type view.
 * Base entity type view: "ppb:tbd:view:settings"
 * ID Suffix entity type view: "ppb:tbd:view:sport:1"
 * @param viewURN The internal screen route as view entity type
 */
const resolveScreenName = (viewUrn: URN): EntityType | NativeEntityTypes =>
  getEntityType(viewUrn) || getNativeEntityType(viewUrn) || (codecs.parse(viewUrn)?.type as EntityType);
/**
 * Resolve tab name for a specific screen name
 * if it does not correspond to any bottom bar tile type returns null
 * Example of a screen name: "ppb:tbd:view:browse"
 * Example of a tab name: "BROWSE"
 * @param screenName the entity type to be resolved
 * @returns the tab name from the bottom bar tile types (BottomBarTileTypes)
 */
const resolveTabName = (screenName: EntityType | NativeEntityTypes): string | null => {
  const HomeStack = [
    NativeEntityTypes.Home,
    EntityType.GenericView,
    EntityType.AllCompetitionsView,
    EntityType.AllMatchesRacesView,
    EntityType.AllMarketsView,
    EntityType.SportView,
    EntityType.EventView,
    EntityType.RaceMeetingView,
    EntityType.RaceView,
    EntityType.MarketView,
    EntityType.CompetitionView,
    EntityType.VirtualsView,
    EntityType.CouponView,
    EntityType.ObbLandingPageView,
    EntityType.CouponsByDayView,
    EntityType.PlayerView,
  ];

  const GamingStack = [
    EntityType.GamingView,
    EntityType.GamingCategoryView,
    EntityType.GamingSegmentationView,
    EntityType.GameView,
    ScreenName.GameInfoScreen,
  ];

  if (GamingStack.includes(screenName as EntityType)) {
    return BottomTypeScreenName.GamingTab;
  }

  if (screenName === EntityType.MyBetsView) {
    return BottomTypeScreenName.MyBetsTab;
  }

  if (screenName === EntityType.BrowseView) {
    return BottomTypeScreenName.BrowseTab;
  }

  if (HomeStack.includes(screenName)) {
    return BottomTypeScreenName.HomeTab;
  }

  return null;
};

const secondDeeplinkNavigation = (
  viewUrlWithoutQueryParams: string | undefined,
  screenName: EntityType | NativeEntityTypes,
  viewLink: NativeViewLink,
  tabName: string | null,
): void => {
  if (viewUrlWithoutQueryParams) {
    // This second navigation recreates what `history.replace()` does in Web, in the file `url-middleware.ts`
    navigationRef.navigate(tabName || BottomTypeScreenName.HomeTab, {
      screen: screenName,
      params: {
        viewLink: {
          ...viewLink,
          viewUrl: viewUrlWithoutQueryParams,
          isDeepLink: false,
        },
      },
    });
  }
};

/**
 * Navigates to the desired screen, in the navigation tab that the screen belongs to
 * @param screenName The requested screen name (must be an EntityType)
 * @param viewLink The NativeViewLink
 * @returns void
 */
const tabNavigation = (screenName: EntityType | NativeEntityTypes, viewLink: NativeViewLink): void => {
  // When deep linking, we have a set of screen names that we want to open on specific tabs.
  const tabName = resolveTabName(screenName);
  const isMyAccount = navigationRef.getCurrentRoute()?.name === ScreenName.CetMyAccountScreen;
  const hasViewUrl = !!(
    viewLink.viewUrl &&
    viewLink.viewUrl.length > 0 &&
    !IGNORE_VIEW_URLS_REGEX.test(viewLink.viewUrl)
  );

  // These views are *special* because they use deep linking but should ignore deep linking specific logic
  const deepLinkingExceptions: EntityType[] = [EntityType.SettingsView];
  const isDeepLink = viewLink.isDeepLink && !deepLinkingExceptions.includes(screenName as EntityType);

  const viewUrlWithoutQueryParams = isDeepLink ? getBlacklistedRedirectURL(viewLink.viewUrl) : undefined;

  if (!tabName) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef.navigate(screenName as any, { viewLink });
    secondDeeplinkNavigation(viewUrlWithoutQueryParams, screenName, viewLink, tabName);
    return;
  }

  const args = {
    params: { viewLink },
    screen: screenName,
  };

  // due to changes in react-navigation 7 behaviour (https://reactnavigation.org/docs/upgrading-from-6.x) we are now
  // reseting the navigation state when navigating to root screens from a different stack (e.g. root navigations from SBG's Hamburger menu, MyAccount)
  if (
    (!hasViewUrl &&
      [NativeEntityTypes.Home, EntityTypeScreenName.GamingView, EntityTypeScreenName.MyBets].includes(screenName)) ||
    isMyAccount
  ) {
    resetNavigation(tabName, screenName, args, isMyAccount);
  } else {
    navigationRef.navigate(tabName, args);
  }

  secondDeeplinkNavigation(viewUrlWithoutQueryParams, screenName, viewLink, tabName);
};

type NavigationArgs = {
  params: { viewLink: NativeViewLink };
  screen: EntityType | NativeEntityTypes | ThirdPartyScreenNameType;
};

/**
 * Reset the navigation stack to the given tab and screen name
 * @param tabName the tab name where the screen is located
 * @param screenName the screen name to navigate to
 * @param args  the navigation params
 */
const resetNavigation = (tabName: string, screenName: string, args: NavigationArgs, resetBottomBar: boolean): void => {
  const rootState = navigationRef.getRootState();
  const resetState = {
    index: 0,
    routes: [{ name: tabName, state: { routes: [{ name: screenName, params: args.params }] } }],
  };

  // workaround for Android internal apps (internal apps are wrapped in the SettingsView Drawer.Navigator)
  if (resetBottomBar || (Platform.OS === "android" && rootState?.type === "drawer")) {
    navigationRef.reset({
      routes: [{ name: NativeEntityTypes.BottomBar, state: resetState }],
    });
  } else {
    navigationRef.reset(resetState);
  }
};

/**
 * Determine if the given urn is of external type.
 * @param viewURN The internal screen route as view entity type
 */
const isExternalURN = (viewURN: URN): boolean =>
  [EntityType.ExternalView].includes(resolveScreenName(viewURN) as EntityType);

/**
 * Determine if the given viewLink is of MyAccount type and has an URL.
 * @param viewLink The native view link object.
 */
const isMyAccountViewLink = (viewLink: NativeViewLink): boolean => {
  const viewUrn = codecs.parse(viewLink.viewUrn);
  if (!viewUrn) {
    return false;
  }

  const isMyAccountView = codecs.myAccountView.isValid(viewUrn);

  return isMyAccountView && !!viewLink?.viewUrl;
};

/**
 * Manage different types of navigation to url sites. The navigation can be
 * triggered in three different forms: WebView Modal, InApp Browser Modal
 * (SafariViewController) and the native browser (Safari).
 * @param viewLink The native view link object.
 */
const handleExternalNavigation = (viewLink: NativeViewLink): void => {
  if (!viewLink.viewUrl) {
    log("Invalid `viewUrl`");
  } else {
    switch (viewLink.viewDisplayMode) {
      case DisplayMode.BlankWebview:
        // TODO: Move partial url to external links on chef config
        if (viewLink.viewUrl.includes("support.betfair") || viewLink.viewUrl.includes("support.skybet")) {
          const customViewLink = viewLink;
          if (viewLink.viewUrl.includes("?")) {
            customViewLink.viewUrl = viewLink.viewUrl.concat("&showBackButton=false");
          } else {
            customViewLink.viewUrl = viewLink.viewUrl.concat("?showBackButton=false");
          }
        }
        navigationRef.navigate(EntityType.ExternalView, { viewLink });
        break;
      case DisplayMode.BlankInapp:
        InAppBrowser.open(viewLink.viewUrl);
        break;
      default:
        Linking.canOpenURL(viewLink.viewUrl)
          .then((supported) => {
            if (supported && viewLink.viewUrl) {
              Linking.openURL(viewLink.viewUrl);
            } else if (viewLink.fallbackViewUrl) {
              Linking.openURL(viewLink.fallbackViewUrl);
            }
          })
          .catch((e) => {
            log(`Unsupported link ${viewLink.viewUrl}`, e);
          });

        break;
    }
  }
};

/**
 * Navigate to any WebView Cet Framework
 * @param viewLink The native view link object.
 * @param linkName The native web view link name.
 */
export const navigateMyAccountWebView = (viewLink: NativeViewLink, linkName = ""): void => {
  const encodedURL = viewLink.viewUrn.split(":")[4];
  const url = Buffer.from(encodedURL, "base64").toString("utf8");

  navigateWithThirdPartyScreenName(ScreenName.CetStackNavigator, {
    screen: ScreenName.CetWebViewScreen,
    params: {
      hideBalances: false,
      isBiometricSupported: true,
      link: {
        linkName,
        url,
      },
      showNativeHeader: true,
      showRegulatoryHeader: false,
    },
  });
};

/**
 * Attempt to resolve a valid entity type i.e. a screen name, and trigger an
 * internal navigation action.
 * @param nativeViewLink The native view link object.
 */
const handleInternalNavigation = (viewLink: NativeViewLink): void => {
  const screenName = resolveScreenName(viewLink.viewUrn);

  if (screenName) {
    tabNavigation(screenName, viewLink);
  } else {
    log("Invalid entity type");
  }
};

/**
 * Validate incoming `viewLink` and handle internal and external navigation actions.
 * @param viewLink The native view link object.
 * @param linkName The native web view link name.
 */
const handleNavigation = (viewLink: NativeViewLink, linkName?: string): void => {
  // Check if is a valid viewLink and contains an urn
  if (isExternalURN(viewLink.viewUrn)) {
    handleExternalNavigation(viewLink);
    return;
  }

  if (isMyAccountViewLink(viewLink)) {
    navigateMyAccountWebView(viewLink, linkName);
    return;
  }

  handleInternalNavigation(viewLink);
};

/**
 * Determine if app finished mounting and navigate to given screen view link.
 * @param viewLink The native view link object.
 */
export const navigate = (viewLink: NativeViewLink, linkName?: string): void => {
  // Perform navigation if the app has mounted
  if (navigationRef.isReady()) {
    handleNavigation(viewLink, linkName);
  } else {
    log("Unable to navigate as app hasn't finished mounting");
  }
};

/**
 * Navigate to the My Account Cet Framework
 */
export const navigateMyAccount = (): void => {
  navigateWithThirdPartyScreenName(ScreenName.CetStackNavigator, {
    screen: ScreenName.CetMyAccountScreen,
  });
};

/**
 * Navigate to the Deposit Cet Framework
 */
export const navigateDeposit = (url: string): void => {
  navigateWithThirdPartyScreenName(ScreenName.CetStackNavigator, {
    screen: ScreenName.CetDepositScreen,
    params: {
      link: {
        url,
      },
    },
  });
};

/**
 * Go back to the previous screen route in the stack.
 */
export const goBack = (): void => {
  if (navigationRef.canGoBack()) {
    if (navigationRef.getCurrentRoute()?.name === ScreenName.GamingMySelectionsScreen) {
      GamesLobbyObject?.triggerConfirmationPopUp(true);
    } else {
      navigationRef.goBack();
    }
  } else {
    log("Unable to navigate to back");
  }
};

export const popLastFromStack = (): void => {
  if (navigationRef.canGoBack()) {
    navigationRef.dispatch(StackActions.pop(1));
  }
};

/**
 * Resets the current navigation stack.
 * Forces a navigation to the bottom bar screen.
 */
export const resetNavigationStack = (): void => {
  // Perform reset and navigation if the app has mounted
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: NativeEntityTypes.BottomBar,
        },
      ],
    });
  } else {
    log("Unable to reset stack as app hasn't finished mounting");
  }
};

/**
 * Navigate to the Maintenance Screen
 */
export const navigateMaintenanceScreen = (isFullSplash: boolean): void => {
  const currentOptions = navigationRef.getCurrentOptions() as {
    presentation: string;
  };

  // if we have any modal opened we should first close it
  if (currentOptions?.presentation === "modal") {
    goBack();
  }

  requestAnimationFrame(() => {
    // when is a full splash (every product is splashed) we navigate to the root's
    // maintenance screen so that the Header and BottomBar are not rendered.
    if (isFullSplash) {
      navigateWithThirdPartyScreenName(ScreenName.RootMaintenanceScreen);
    } else {
      navigate({ viewUrn: `${EntityType.MaintenanceView}:maintenance` });
    }
  });
};

/**
 * Navigate to the Territory Blocking Screen
 */
export const navigateTerritoryBlockingScreen = (): void => {
  navigateWithThirdPartyScreenName(ScreenName.TerritoryBlockingScreen, {
    screen: ScreenName.TerritoryBlockingScreen,
  });
};

/**
 * Scroll to top when tapping on the active tab bar.
 */
export function useScrollToTop<T extends Parameters<typeof scrollToTop>[0]>(ref: T | undefined): void {
  if (!ref) {
    return;
  }

  scrollToTop(ref);
}
