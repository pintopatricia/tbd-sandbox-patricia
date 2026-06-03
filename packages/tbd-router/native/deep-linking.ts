/**
 * The deep linking service is responsible for handling deep links into the app.
 * Two forms of deep linking are supported.
 *  - Deep links with protocol https:// e.g. hyperlinks from web pages (Universal Links)
 *  - Custom protocol deeplinks:
 *    - Betfair: Deep links with protocol bfe:// e.g. non-HTTP channels like Push messages
 *    - Sky Bet: Deep links with protocol skybet:// e.g. non-HTTP channels like Push messages
 */

import { EmitterSubscription, Linking, Platform, NativeModules } from "react-native";
import { Notification, Notifications } from "react-native-notifications";
import { EventType, UrbanAirship } from "urbanairship-react-native";
import { findRouteWithUrl } from "@ppb/tbd-routes";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { DisplayMode, ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { CampaignMeasurementEvent } from "@ppb/tbd-store/middlewares/tagging-resolvers/CampaignMeasurement.types";
import { MetaDataEvent } from "@ppb/tbd-store/state/tagging/PageLoad.types";
import { TaggingTypes } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/Tagging.types";
import { PlatformType, TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { buildNotificationEvent } from "tagging-library";
import { UANotification, getInfoFromPush } from "./helpers/get-url-from-push";
import {
  navigate,
  navigateWithThirdPartyScreenName,
  ScreenName,
  ThirdPartyScreenNameType,
  GamesLobbyObject,
  navigationRef,
  BottomTypeScreenName,
} from "./router";
import { notificationReceivedHandler, notificationSawHandler } from "./helpers/airship-listener-handlers";

const { ShortcutModule } = NativeModules;

let eventListenerResult: EmitterSubscription;

type LaunchGameFromPNHandler = (launchGameViewLink: ViewLink, gameId: string, platformType: PlatformType) => void;

/**
 *
 * This method checks that the 'url' parameter is a valid subdomain for the given configuration.
 * Please note that it is mandatory that the url has a 'https|http' protocol
 */
const isSubDomain = (url: string, pattern: string): boolean => !!url.match(/^http(s)?/) && !!url.match(pattern);

const extractViewUrl = (url: string, pattern: string): string => url.replace(pattern, "");

const isExternalUrl = (url: string, subdomainPattern: string, extractViewUrlPattern: string): boolean =>
  isSubDomain(url, subdomainPattern) || url === extractViewUrl(url, extractViewUrlPattern);

const getViewUrnFromUrl = (url: string, host: string, homepagePaths: string | null): string => {
  const home = codecs.genericView.home.encode();

  return (findRouteWithUrl(url, host, homepagePaths) || home).uid;
};

const getCetStackNavigatorScreen = (viewUrl: string): ThirdPartyScreenNameType | null => {
  const cetNavigator = "CetStackNavigator";

  if (viewUrl?.includes(cetNavigator)) {
    const splittedUrl = viewUrl.split("/");
    // the screen name comes after the navigator name (CetStackNavigator)
    const index = splittedUrl.findIndex((section) => section === cetNavigator);

    if (splittedUrl.length > index) {
      return splittedUrl[index + 1] as ThirdPartyScreenNameType;
    }
  }

  return null;
};

/**
 *
 * For now this will be hardcoded in the code and it will not consider any jurisdiction.
 * In the future, it is expected this to change. It will be configured a throttle that will
 * retrieve the valid subdomains available.
 *
 */
const isSubDomainWhitelisted = (url: string, pattern: string): boolean => !!url.match(pattern);

export const isMovableInkSubdomain = (url: string): boolean => !!url.match(/^https:\/\/movableink\.betfair\..*/);

/*
 * This is being used as the returnAppURL on ZignSec's end.
 * No navigation should occur and the user should be redirected
 * to the screen where they left off during the authentication process.
 */
export const EXTERNAL_AUTH_RETURN_PATH = "/authexternal";

const SKIP_NAVIGATION_DEEPLINK_PATHS = [EXTERNAL_AUTH_RETURN_PATH];
const extractGameId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("gameId");
  } catch {
    return null;
  }
};

/**
 * Handle incoming deep links when app is backgrounded and navigate to screen urn.
 * @param url The url that may have deep linking.
 */
export const navigateWithDeepLinking = (
  url: string,
  host: string,
  homepagePaths: string | null,
  deeplinkConfig: DeeplinkConfiguration,
  dispatchLaunchGameFromPN?: LaunchGameFromPNHandler,
): void => {
  if (SKIP_NAVIGATION_DEEPLINK_PATHS.some((deeplinkPath) => url.includes(deeplinkPath))) {
    return;
  }

  const isLaunchGameUrl =
    isSubDomainWhitelisted(url, deeplinkConfig.gameLaunchURLPattern) ||
    isSubDomainWhitelisted(url, deeplinkConfig.newGameLaunchPattern);
  const isWhitelistedUrl = isSubDomainWhitelisted(url, deeplinkConfig.subdomainWhitelistPattern);
  const isCasinoWhitelistedUrl =
    (!!deeplinkConfig.casinoWhitelistPattern && isSubDomainWhitelisted(url, deeplinkConfig.casinoWhitelistPattern)) ||
    (!!deeplinkConfig.gameCollectionUrnPattern && isSubDomainWhitelisted(url, deeplinkConfig.gameCollectionUrnPattern));
  const isCasinoAndroidGameCollectionUrl =
    !!deeplinkConfig.gameCollectionUrnPattern &&
    isSubDomainWhitelisted(url, deeplinkConfig.gameCollectionUrnPattern) &&
    Platform.OS === "android";
  const isIosCasinoWhitelistedUrl = isCasinoWhitelistedUrl && Platform.OS === "ios";
  const isIosPrizePinballUrl = isIosCasinoWhitelistedUrl && url.includes("prize-pinball");
  const isSuperSpinsUrl =
    !!deeplinkConfig.superSpinPattern && isSubDomainWhitelisted(url, deeplinkConfig.superSpinPattern);

  const handleExternalUrl = async () => {
    // this is for IOS to close the current modal opened inside GF
    if (Platform.OS === "ios") {
      await GamesLobbyObject.closeModalView();
    }
    navigate({
      viewUrn: codecs.externalView.encode().uid,
      viewUrl: url,
      viewDisplayMode:
        isWhitelistedUrl || isCasinoWhitelistedUrl || isSuperSpinsUrl ? DisplayMode.BlankWebview : undefined,
    });
  };

  if (
    isExternalUrl(url, deeplinkConfig.subdomainPattern, deeplinkConfig.extractViewURLPattern) &&
    !isLaunchGameUrl &&
    !isIosCasinoWhitelistedUrl &&
    !isCasinoAndroidGameCollectionUrl
  ) {
    handleExternalUrl();
    return;
  }

  const viewUrl = extractViewUrl(url, deeplinkConfig.extractViewURLPattern);
  const cetStackNavigatorScreen = getCetStackNavigatorScreen(viewUrl);

  const handleIosCasinoUrl = async () => {
    try {
      await GamesLobbyObject.closeModalView();
      if (isIosPrizePinballUrl) {
        await GamesLobbyObject.openWebView(url);
      } else {
        navigate({
          isDeepLink: true,
          viewUrn: EntityType.GamingView,
          viewUrl: url,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (cetStackNavigatorScreen) {
    navigateWithThirdPartyScreenName(ScreenName.CetStackNavigator, {
      screen: cetStackNavigatorScreen,
    });

    return;
  }

  if (isLaunchGameUrl) {
    const gameId = extractGameId(url) ?? "";
    if (dispatchLaunchGameFromPN) {
      dispatchLaunchGameFromPN({ viewUrl: url, viewUrn: "" }, gameId, PlatformType.Native);
    }
    if (Platform.OS === "android") {
      navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, { viewLink: { viewUrl: url, viewUrn: "" } });
      return;
    }
    handleIosCasinoUrl();
    return;
  }

  if (isIosCasinoWhitelistedUrl) {
    handleIosCasinoUrl();
    return;
  }

  if (isCasinoAndroidGameCollectionUrl) {
    // Added double navigation to have the Casino page the first screen in the stack
    navigationRef.current?.navigate(BottomTypeScreenName.GamingTab, {});
    navigate({ viewUrn: getViewUrnFromUrl(url, host, homepagePaths), viewUrl });
    return;
  }

  navigate({
    isDeepLink: true,
    viewUrn: getViewUrnFromUrl(url, host, homepagePaths),
    viewUrl,
  });
};

/**
 * Clean up attached event listeners.
 */
export const removeDeepLinkingEventListeners = (): void => {
  eventListenerResult?.remove();
};

type AnalyticsEvent = TaggingTypes | MetaDataEvent | CampaignMeasurementEvent;

const deeplinkNavigationHandler = (
  notification: Notification | UANotification,
  appBrand: Brand,
  deeplinkConfig: DeeplinkConfiguration,
  host: string,
  homepagePaths: string | null,
  sendEvent: (event: AnalyticsEvent) => void,
  dispatchLaunchGameFromPN?: LaunchGameFromPNHandler,
): void => {
  const { url, body, pushMessagePlatform } = getInfoFromPush(notification, appBrand);
  const event = buildNotificationEvent({
    action: TaggingAction.CLICKED,
    elementText: body || "null",
    pushMessagePlatform: pushMessagePlatform || "null",
    destinationUrl: url || "null",
  });

  sendEvent(event);

  if (url) {
    navigateWithDeepLinking(url, host, homepagePaths, deeplinkConfig, dispatchLaunchGameFromPN);
  }
};

/**
 * Initialize the deep linking service and listen for deep link actions when the app
 * is in the background or launched from fresh.
 */
export const initDeepLinking = async (
  appBrand: Brand,
  deeplinkConfig: DeeplinkConfiguration,
  host: string,
  homepagePaths: string | null,
  sendEvent: (event: AnalyticsEvent) => void,
  dispatchLaunchGameFromPN: (launchGameViewLink: ViewLink, gameId: string, platformType: PlatformType) => void,
): Promise<void> => {
  // If there is an iOS shortcut that needs to be handled from cold start, we should handle it
  if (Platform.OS === "ios" && ShortcutModule?.getShortcut) {
    const shortcutUrl = await ShortcutModule.getShortcut();
    if (shortcutUrl) {
      navigateWithDeepLinking(shortcutUrl, host, homepagePaths, deeplinkConfig, dispatchLaunchGameFromPN);
    }
  }

  // Determines if the app was launched from fresh start with an initial url and
  // handles the deep link action accordingly
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    navigateWithDeepLinking(initialUrl, host, homepagePaths, deeplinkConfig, dispatchLaunchGameFromPN);
  }

  const initialNotification = await Notifications.getInitialNotification();
  if (initialNotification) {
    deeplinkNavigationHandler(
      initialNotification,
      appBrand,
      deeplinkConfig,
      host,
      homepagePaths,
      sendEvent,
      dispatchLaunchGameFromPN,
    );
  }

  // Allows the app to listen for deep links actions while it runs in the background
  // Executes the callback only when the deep linking event before is executed
  requestAnimationFrame(() => {
    eventListenerResult = Linking.addEventListener("url", ({ url }) =>
      navigateWithDeepLinking(url, host, homepagePaths, deeplinkConfig, dispatchLaunchGameFromPN),
    );
  });

  // register listener for when the user clicks a push notification with the app in background

  if (Platform.OS === "android") {
    UrbanAirship.addListener(EventType.NotificationResponse, (response) => {
      deeplinkNavigationHandler(
        { payload: response.notification.extras },
        appBrand,
        deeplinkConfig,
        host,
        homepagePaths,
        sendEvent,
        dispatchLaunchGameFromPN,
      );
    });
  }

  UrbanAirship.addListener(EventType.PushReceived, (response) => {
    const { extras, alert } = response;
    notificationReceivedHandler({ payload: extras }, alert, appBrand, sendEvent);
    notificationSawHandler({ payload: extras }, alert, appBrand, sendEvent);
  });

  Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void) => {
    deeplinkNavigationHandler(
      notification,
      appBrand,
      deeplinkConfig,
      host,
      homepagePaths,
      sendEvent,
      dispatchLaunchGameFromPN,
    );

    completion();
  });
};

/**
 * Type used to configure the multiple partern matching mechanisms on the deep linking service
 */
export type DeeplinkConfiguration = {
  subdomainPattern: string;
  subdomainWhitelistPattern: string;
  extractViewURLPattern: string;
  gameLaunchURLPattern: string;
  casinoWhitelistPattern?: string;
  prizePinballPattern?: string;
  gameCollectionUrnPattern: string;
  cetLoginUrlPattern: string;
  superSpinPattern?: string;
  newGameLaunchPattern: string;
};
