import { useRoute, useTheme, RouteProp, useFocusEffect } from "@react-navigation/native";
import type { JSX } from "react";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import * as React from "react";
import { NativeEventEmitter, NativeModules, Platform, View } from "react-native";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { CetContext, useLogin } from "@flutter-global/react-native-cet-framework";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import {
  navigateWithThirdPartyScreenName,
  ScreenName,
  navigate,
  NativeViewLink,
  navigateWithDeepLinking,
  GamesLobbyObject,
} from "@ppb/tbd-router/native";
import { ThemeContext } from "@ppb/the-wall-theme";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { Text } from "@ppb/the-wall-native";
import ConnectedGamesPage from "../../GamingPage";
import { GamesFrameworkConfigProps } from "../../GamingPage/GamingPage.ios.types";
import GamingPageIos from "../../GamingPage/GamingPage.ios";
import GamingContext from "../../GamingPage/GamingContext";
import config from "../../../config/app-configuration.native";
import { CATEGORIES } from "../../../helpers/cookies.native";
import styles from "./GamingScreen.native.styles";
import ConnectedBackNavigationItem from "../../BackNavigationItem";
import BackNavigationItem from "../../BackNavigationItem/BackNavigationItem.native";
import { getHost, getHomepagePaths } from "../../../config/endpoints";
import { getValidGameLaunchPatterns } from "../../../helpers/gaming.native";

type ParamList = {
  GamingScreen: {
    viewLink: ViewLink;
    params: {
      showBackButton: boolean;
      backNavigationTitle: string;
      isSuperSpinsUrl: boolean;
    };
  };
};

type GameCollectionScreenParams = {
  backNavigationTitle?: string;
  urlDeepLinking?: string;
  isSuperSpinsUrl?: boolean;
};

type URLDeepLinkingType = {
  urlDeepLinking: string;
};

function GamingScreen(): JSX.Element {
  const { colors: themeColors } = useTheme();
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated, authorizationToken, gameInfo, logOut, setGameInfo } = React.useContext(CetContext);
  const login = useLogin();
  const route = useRoute<RouteProp<ParamList, "GamingScreen">>();
  const [performanceCookiesStatus, setPerformanceCookiesStatus] = useState(-1);
  const [currentRoute, setCurrentRoute] = useState<NativeViewLink>();
  const [openedLoginScreen, setOpenedLoginScreen] = useState(false);
  const { deepLinkUrl, deepLinkUrn } = useContext(GamingContext);
  const [otpConsent, setOtpConsent] = useState("");
  const soundWasStopped = useRef(false);

  /**
   * onSSOIDRequired event is dispatched by GamesView component when an authorizationToken is required.
   * Will navigate to CET login screen in order to obtain an authorizationToken
   */

  const onSSOIDRequired = (): void => {
    setOpenedLoginScreen((prev) => !prev);
    if (authorizationToken !== undefined && !isAuthenticated) {
      login();
    }
  };

  /**
   * onNeedsAppLogout event is dispatched by GamesView component when the authorizationToken is invalid or
   * a logout is requested. Will navigate to CET logOut screen in order to properly invalidate the session
   */
  const onNeedsAppLogout = (): void => {
    logOut();
  };

  /**
   * onOpenGameCollectionScreen event is dispatched by GamesView component when navigation to a
   * games collection screen is requested.
   */
  const onOpenGameCollectionScreen = ({ backNavigationTitle = "" }: GameCollectionScreenParams = {}): void => {
    if (backNavigationTitle) {
      navigateWithThirdPartyScreenName(ScreenName.GamingGamesCollectionScreen, {
        params: { showBackButton: true, backNavigationTitle: backNavigationTitle ?? "" },
      });
    } else {
      navigateWithThirdPartyScreenName(ScreenName.GamingGamesCollectionScreen);
    }
  };

  /**
   * onOpenSubGameCollectionScreen event is dispatched by GamesView component when navigation to the
   * `SubGamesCollection` screen is requested
   */
  const onOpenSubGameCollectionScreen = (): void => {
    navigateWithThirdPartyScreenName(ScreenName.GamingSubGamesCollectionScreen);
  };

  /**
   * onOpenMySelectionsScreen event is dispatched by GamesView component when navigation to the
   * `My Selections` screen is requested
   */
  const onOpenMySelectionsScreen = (): void => {
    navigateWithThirdPartyScreenName(ScreenName.GamingMySelectionsScreen);
  };

  /**
   * onShowWebView event is dispatched by GamesView component when navigation to a WebView screen inside
   * the GamesFramework is requested.
   */
  const onShowWebView = ({ backNavigationTitle, isSuperSpinsUrl }: GameCollectionScreenParams = {}): void => {
    navigateWithThirdPartyScreenName(ScreenName.GamingWebViewScreen, {
      params: {
        showBackButton: backNavigationTitle !== undefined,
        backNavigationTitle: backNavigationTitle ?? "",
        isSuperSpinsUrl: isSuperSpinsUrl ?? false,
      },
    });
  };

  /**
   * onDismissGameContainer event is dispatched by GamesView component when  a GameContainer is dismissed.
   */
  const onDismissGameContainer = (): void => {
    setGameInfo(null);
  };

  const onOpenPreferenceCenter = (): void => {
    OTPublishersNativeSDK.showPreferenceCenterUI({
      enableDarkMode: "false",
    });
  };
  /**
   * onDismissMySelectionsScreen event is dispatched by GamesView component when the user pressed close button from
   * My Selection screen
   */
  const onDismissMySelectionsScreen = (): void => {
    // We check if the current viewUrn has "gaming" string in it, if route names will change we also need to make a change here
    if (currentRoute != null && !currentRoute.viewUrn?.includes("gaming")) {
      navigate(currentRoute);
    } else navigateWithThirdPartyScreenName(ScreenName.GamingLobbyScreen);
  };

  const onGoToHomeTabScreen = (urlDeepLinking: URLDeepLinkingType): void => {
    navigateWithDeepLinking(urlDeepLinking.urlDeepLinking, getHost(), getHomepagePaths(), config.deeplinkConfiguration);
  };

  const handleCurrentRoute = (routeObj: NativeViewLink) => {
    setCurrentRoute(routeObj);
  };
  const eventEmitter = new NativeEventEmitter(NativeModules.GamesLobbyEventEmitter);

  useEffect(() => {
    let cancelled = false;
    OTPublishersNativeSDK.getOTConsentJSForWebView()
      .then((consentJS) => {
        if (cancelled) return;
        setOtpConsent(`window.OTExternalConsent${consentJS.substring(21)}`);
      })
      .catch((err) => console.error("Failed to load OneTrust consent", err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onSSOIDRequiredSubscription = eventEmitter.addListener("onSSOIDRequired", onSSOIDRequired);
    const onNeedsAppLogoutSubscription = eventEmitter.addListener("onNeedsAppLogout", onNeedsAppLogout);
    const onShowWebViewSubscription = eventEmitter.addListener("onShowWebView", onShowWebView);
    const onDismissGameContainerSubscription = eventEmitter.addListener(
      "onDismissGameContainer",
      onDismissGameContainer,
    );
    const onOpenSubGameCollectionScreenSubscription = eventEmitter.addListener(
      "onOpenSubGameCollectionScreen",
      onOpenSubGameCollectionScreen,
    );
    const onOpenGameCollectionScreenSubscription = eventEmitter.addListener(
      "onOpenGameCollectionScreen",
      onOpenGameCollectionScreen,
    );
    const onOpenMySelectionsScreenSubscription = eventEmitter.addListener(
      "onOpenMySelectionsScreen",
      onOpenMySelectionsScreen,
    );
    const onDismissMySelectionsScreenSubscription = eventEmitter.addListener(
      "onDismissMySelectionsScreen",
      onDismissMySelectionsScreen,
    );

    const onOpenPrivacyPreferenceCenter = eventEmitter.addListener("onOpenPreferenceCenter", onOpenPreferenceCenter);

    const onGoToHomeTabScreenSubscription = eventEmitter.addListener("onGoToHomeTabScreen", onGoToHomeTabScreen);

    return function cleanup() {
      onSSOIDRequiredSubscription.remove();
      onOpenSubGameCollectionScreenSubscription.remove();
      onNeedsAppLogoutSubscription.remove();
      onOpenGameCollectionScreenSubscription.remove();
      onOpenMySelectionsScreenSubscription.remove();
      onDismissMySelectionsScreenSubscription.remove();
      onGoToHomeTabScreenSubscription.remove();
      onShowWebViewSubscription.remove();
      onDismissGameContainerSubscription.remove();
      onOpenPrivacyPreferenceCenter.remove();
    };
  });

  useEffect(() => {
    // get user consent for Performance category to be passed to native GamingFramework integration in order to
    // decide if it sends or not data to Google Analytics
    OTPublishersNativeSDK.getConsentStatusForCategory(CATEGORIES.PERFORMANCE)
      .then((userConsent) => setPerformanceCookiesStatus(userConsent))
      .catch(() => {
        // set the performanceCookiesStatus to -1 (unknown)
        setPerformanceCookiesStatus(-1);
      });
  }, []);

  function getLinkUrl() {
    if (deepLinkUrl) {
      const isGameLaunchUrl = !!getValidGameLaunchPatterns().some((pattern) => deepLinkUrl.match(pattern));

      if ((isAuthenticated && isGameLaunchUrl) || (!isAuthenticated && !isGameLaunchUrl)) {
        return deepLinkUrl;
      }
    }

    return undefined;
  }

  const configs: GamesFrameworkConfigProps = {
    ssoId: authorizationToken,
    loggedIn: isAuthenticated,
    applicationKey: config.appConfig?.APP_KEYS.ios,
    performanceCookiesStatus,
    screen: route.name,
    deepLinkUrl: getLinkUrl(),
    deepLinkUrn,
    gameLaunchInfo: gameInfo,
    openedLoginScreen,
    theme,
    otpConsent,
  };

  const params = route.params?.params;

  useFocusEffect(
    useCallback(() => {
      if (params?.isSuperSpinsUrl && soundWasStopped.current) {
        GamesLobbyObject?.stopFTPSound();
        soundWasStopped.current = false;
      }

      return () => {
        if (params?.isSuperSpinsUrl) {
          GamesLobbyObject?.stopFTPSound();
          soundWasStopped.current = true;
        }
      };
    }, [params?.isSuperSpinsUrl]),
  );

  return (
    <>
      {params?.showBackButton && !params?.isSuperSpinsUrl && (
        <ConnectedBackNavigationItem component={BackNavigationItem} urn={""} iosTitle={params?.backNavigationTitle} />
      )}
      <View {...getTestProps("gaming-screen", false)} style={styles.gamingScreen}>
        {Platform.OS === "ios" ? (
          <ConnectedGamesPage handleCurrentRoute={handleCurrentRoute} component={GamingPageIos} configs={configs} />
        ) : (
          <Text style={{ color: themeColors.text }} {...getTestProps("gaming-placeholder")}>
            Gaming Screen Placeholder
          </Text>
        )}
      </View>
    </>
  );
}

export default GamingScreen;
