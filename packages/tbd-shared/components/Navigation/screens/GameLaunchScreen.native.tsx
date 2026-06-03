import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useContext } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BackHandler, DeviceEventEmitter, Platform, useWindowDimensions } from "react-native";
import { CetContext, useLogin, EVENTS } from "@flutter-global/react-native-cet-framework";

import Orientation from "react-native-orientation-locker";
import { RouteProp, StackActions, useRoute } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { getStore } from "@ppb/tbd-store/create-store";
import { FETCH_CARDS } from "@ppb/tbd-store/actions";
import { goBack, navigationRef, ScreenName } from "@ppb/tbd-router/native";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { WebViewNativeConfig } from "react-native-webview/lib/WebViewTypes";

import { Environment } from "../../../config/environments.native";
import { isCurrentEnv } from "../../../config/base-path-utils.native";
import { forwardPYWMessages, sendWrapperEvent } from "../../../helpers/webview-event.native";
import RNCCustomWebView from "../../WebView/RNCCustomWebView";
import NativeWebView from "./NativeWebView.native";
import GamingContext from "../../GamingPage/GamingContext";
import { getHomepagePaths, getHost } from "../../../config/endpoints";
import { findRouteWithUrl } from "@ppb/tbd-routes";
import appConfiguration from "../../../config/app-configuration.native";

const overrideReturnUrlRegex =
  /^(https?:\/\/)(casino|sportsgaming|arcade).betfair.*(\/.*)?$|^(https?:\/\/)launcher.*.(betfair|skybet).*\/?goToOrigin=true$/;

type ParamList = {
  GameLaunchScreen: {
    viewLink: ViewLink;
    params: {
      urn: string;
    };
  };
};

function GameLaunchScreen(): JSX.Element {
  const route = useRoute<RouteProp<ParamList, "GameLaunchScreen">>();
  const webViewRef = useRef<WebView>(null);
  const wasLoginShown = useRef<boolean>(false);
  const store = getStore();
  const { isAuthenticated } = useContext(CetContext);
  const { recentlyPlayedUrn } = useContext(GamingContext);
  const login = useLogin();
  const { viewLink } = route.params;
  const { width, height } = useWindowDimensions();
  const webViewStyle = useMemo(() => ({ width, height }), [width, height]);
  const initial = Orientation.getInitialOrientation();
  const host = getHost();
  const homepagePaths = getHomepagePaths();

  const dispatchRecentlyPlayedRefresh = useCallback(() => {
    if (recentlyPlayedUrn) {
      store.dispatch({
        type: FETCH_CARDS,
        payload: {
          urns: [recentlyPlayedUrn],
          forceRefresh: true,
        },
      });
    }
  }, [store, recentlyPlayedUrn]);

  const androidBackHandler = useCallback(() => {
    dispatchRecentlyPlayedRefresh();
    return undefined;
  }, [dispatchRecentlyPlayedRefresh]);

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return (): void => {
      switch (initial) {
        case "PORTRAIT":
        case "PORTRAIT-UPSIDEDOWN": {
          Orientation.lockToPortrait();
          break;
        }
        case "LANDSCAPE-LEFT":
        case "LANDSCAPE-RIGHT": {
          Orientation.lockToLandscape();
          break;
        }
        default:
          break;
      }
    };
  }, [initial]);

  useEffect(() => {
    SystemNavigationBar.stickyImmersive();
    return (): void => {
      SystemNavigationBar.navigationShow();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !wasLoginShown.current) {
      wasLoginShown.current = true;
      login();
    }
  }, [isAuthenticated, login]);

  useEffect(() => {
    const LoginScreenClosedEvent = DeviceEventEmitter.addListener(EVENTS.ON_LOGIN_CLOSED, () => {
      goBack();
    });
    return () => {
      LoginScreenClosedEvent.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", androidBackHandler);

    return (): void => {
      subscription?.remove();
    };
  }, [androidBackHandler]);

  const checkNavigation = (event: WebViewNavigation): boolean => {
    if (!event) return false;
    const { url } = event;
    const found = findRouteWithUrl(event.url, host, homepagePaths);

    if (url.match(appConfiguration.deeplinkConfiguration.newGameLaunchPattern)) {
      return true;
    }
    if (overrideReturnUrlRegex.test(url) || found) {
      dispatchRecentlyPlayedRefresh();
      goBack();
      return false;
    }
    return true;
  };

  const nativeConfig: WebViewNativeConfig = {};
  if (!isCurrentEnv(Environment.prd) && Platform.OS === "android") {
    nativeConfig.component = RNCCustomWebView;
  }

  useEffect(() => {
    if (isAuthenticated && wasLoginShown.current) {
      navigationRef.current?.dispatch(
        StackActions.replace(ScreenName.GameLaunchScreen, {
          viewLink: {
            viewUrl: viewLink.viewUrl,
          },
        }),
      );
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <NativeWebView
          style={webViewStyle}
          originWhitelist={["http://*", "https://*", "about:*"]}
          cacheEnabled={false}
          sharedCookiesEnabled
          javaScriptEnabled={true}
          geolocationEnabled={true}
          onNavigationStateChange={checkNavigation}
          nativeConfig={nativeConfig}
          ref={webViewRef}
          source={{
            uri: viewLink.viewUrl,
          }}
          onMessage={(event) => {
            // If the message is form Payments(PYW) we inject them back into the WebView since GameWindow is the
            // expected target can interpret them
            forwardPYWMessages(event, webViewRef);

            // listen for GA4 events from web and send them from native to firebase
            sendWrapperEvent(event);
          }}
        />
      )}
    </>
  );
}

export default GameLaunchScreen;
