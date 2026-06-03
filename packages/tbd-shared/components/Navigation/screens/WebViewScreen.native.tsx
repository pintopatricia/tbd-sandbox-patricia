import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { WebView, WebViewMessageEvent, WebViewNavigation } from "react-native-webview";
import type { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { Button, BackHandler, KeyboardAvoidingView, Platform, DeviceEventEmitter } from "react-native";
import { goBack, navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router/native";
import { CetContext, EVENTS, useLogin } from "@flutter-global/react-native-cet-framework";
import { findRouteWithUrl } from "@ppb/tbd-routes";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { getEventRegistry } from "eventemitter3-singleton";
import { i18n } from "../../../helpers/i18n";
import { getCustomWebViewUserAgent } from "../../../helpers/user-agent.native";
import { sendWrapperEvent } from "../../../helpers/webview-event.native";
import { handleWebHardwareBack } from "../game-navigation.native";
import NativeWebView from "./NativeWebView.native";
import appConfiguration from "../../../config/app-configuration.native";
import { getHomepagePaths, getHost } from "../../../config/endpoints";
import { getValidGameLaunchPatterns } from "../../../helpers/gaming.native";
import styles from "./WebViewScreen.native.styles";

const casinoBfUrlRegex = /^https:\/\/casino\.betfair\.(bet\.br|com|es|it|dk)(\.nxt\.ppbdev\.com)?(\/(en-gb))?\/?$/;

function WebViewScreen(): JSX.Element {
  const webViewRef = useRef<WebView>(null);
  // // TODO - Define Generic Param Type for ViewLinks
  const route = useRoute<any>();
  const originalUrl = route.params.viewLink.viewUrl.trim();
  const [currentUrl, setCurrentUrl] = useState(originalUrl);
  const [userAgent, setUserAgent] = useState("");
  const { isAuthenticated } = useContext(CetContext);
  const goBackTitle = i18n({ key: "I18N.LABEL.GO_BACK" });
  const canCloseInAppBrowser = useRef<boolean>(true);
  const login = useLogin();
  const prevUrlRef = useRef<string | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const casinoBfCategoryUrl = "https://casino.betfair.com/p/new";

  const isFocused = useIsFocused();
  const isNavigatingToGame = useRef(false);
  const lastNavigatedUrl = useRef<string | null>(null);
  const [isAwaitingLogin, setIsAwaitingLogin] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const derivedUrl = isAuthenticated && isAwaitingLogin ? originalUrl : currentUrl;

  const navigateToGameScreen = useCallback((url: string) => {
    if (isNavigatingToGame.current && lastNavigatedUrl.current === url) {
      return;
    }
    isNavigatingToGame.current = true;
    lastNavigatedUrl.current = url;
    try {
      goBack(); // Close the webview first
      if (Platform.OS === "android") {
        navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
          viewLink: { viewUrl: url },
        });
      } else {
        navigate({
          isDeepLink: true,
          viewUrn: EntityType.GamingView,
          viewUrl: url,
        });
      }
    } catch (e) {
      isNavigatingToGame.current = false;
      console.error("Navigation error:", e);
      return;
    }
  }, []);

  const handleNavigationStateChange = useCallback(
    async (event: WebViewNavigation): Promise<void> => {
      if (event.url !== currentUrlRef.current) {
        prevUrlRef.current = currentUrlRef.current;
        currentUrlRef.current = event.url;
      }
      // Temp fix for category navigation from prize pinball page
      if (event.url === casinoBfCategoryUrl && Platform.OS === "ios") {
        goBack(); // Close the webview first
        navigate({
          isDeepLink: true,
          viewUrn: EntityType.GamingView,
        });
        return;
      }
      if (prevUrlRef.current?.includes("prize-pinball") && casinoBfUrlRegex.test(currentUrlRef.current)) {
        goBack();
      }

      // Prevent game launch in WebView, launch in Gaming Screen instead
      if (getValidGameLaunchPatterns().some((pattern) => event.url.match(pattern))) {
        navigateToGameScreen(event.url);
        return;
      }

      const host = getHost();
      const homepagePaths = getHomepagePaths();
      const found = findRouteWithUrl(event.url, host, homepagePaths);

      if (found) {
        goBack(); // Close the webview first
        navigate({
          viewUrn: found.uid,
          viewUrl: event.url, // Not 100% correct since this is an absolute URL
        });
      }

      const { url } = event;
      setCurrentUrl(url);
    },
    [navigateToGameScreen],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (event: ShouldStartLoadRequest): boolean => {
      if (event.url.match(appConfiguration.deeplinkConfiguration.cetLoginUrlPattern) && !isAuthenticated) {
        login();
        setIsAwaitingLogin(true);
        return false;
      }
      return true;
    },
    [login, isAuthenticated],
  );

  const androidBackHandler = useCallback(() => {
    if (webViewRef?.current) {
      return handleWebHardwareBack(webViewRef.current, currentUrl, route.params.viewLink.viewUrl.trim());
    }
    return undefined;
  }, [currentUrl, route.params.viewLink.viewUrl]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", androidBackHandler);
    return (): void => {
      subscription?.remove();
    };
  }, [androidBackHandler]);

  useEffect(() => {
    return () => {
      const { emit } = getEventRegistry();
      emit("@@UI/WEBVIEW_SCREEN_CLOSED", undefined);
    };
  }, []);

  // Temporary solution that is used to intercept all the redirects inside webview
  // to exchange, if we find another redirect scenario we should add it here
  const gameLaunchUrlPattern = appConfiguration.deeplinkConfiguration.gameLaunchURLPattern;
  const newGameLaunchPattern = appConfiguration.deeplinkConfiguration.newGameLaunchPattern;
  const webviewUrlInterceptors = `
      const setListeners = () => {
        const closeToBettingButtonEl = document.querySelector(".close-to-betting>a");
        const closeButtonEl = document.querySelector("#close-button");
        const sitemapLogoBack = document.querySelector(".logoContainer")
        const sitemapLogoBackArrow = document.querySelector(".left-arrow")

        document.addEventListener("click", function (e) {
          const el = e.target.closest("[data-game-href], [href]");
          const url = el.dataset.gameHref || el.getAttribute("href");
          if(el && url && (url.match(${gameLaunchUrlPattern}) || url.match(${newGameLaunchPattern}))) {
            e.stopImmediatePropagation();
            e.preventDefault();
            window.ReactNativeWebView.postMessage(JSON.stringify({type:"openGameInApp", url: url}));
          };
        }, true);

        if(sitemapLogoBack)
          sitemapLogoBack.addEventListener("click", function (e) { window.location.href="${route.params.viewLink.viewUrl.trim()}"; e.preventDefault(); });

        if(sitemapLogoBackArrow)
          sitemapLogoBackArrow.addEventListener("click", function (e) { window.location.href="${route.params.viewLink.viewUrl.trim()}"; e.preventDefault(); });

        if(closeButtonEl)
          closeButtonEl.addEventListener("click", function (e) { window.ReactNativeWebView.postMessage("closeInappBrowser"); e.preventDefault(); });

        if(closeToBettingButtonEl)
          closeToBettingButtonEl.addEventListener("click", function (e) { window.ReactNativeWebView.postMessage("closeInappBrowser"); e.preventDefault(); });
      }
      setTimeout(() => {
        document.addEventListener('DOMSubtreeModified', (e) => { setListeners(); })
        setListeners();
      },1000);
      true; // note: this is required, or you'll sometimes get silent failures
      `;

  // After CET login completes, force a full WebView remount by incrementing webViewKey.
  // A simple reload() is not enough: the old WKWebView instance retains stale session/cookie
  // state and renders the pre-login page. Changing the React key unmounts the previous
  // NativeWebView and mounts a fresh one that loads originalUrl with authenticated cookies.
  // State updates are deferred to avoid synchronous setState within the effect causing cascading renders.
  useEffect(() => {
    if (isAuthenticated && isAwaitingLogin) {
      queueMicrotask(() => {
        setIsAwaitingLogin(false);
        setCurrentUrl(originalUrl);
        setWebViewKey((prev) => prev + 1);
      });
    }
  }, [isAuthenticated, isAwaitingLogin, originalUrl]);

  useEffect(() => {
    const setCustomUserAgent = async (): Promise<void> => {
      try {
        setUserAgent(await getCustomWebViewUserAgent());
      } catch (error) {
        console.error(error);
      }
    };
    setCustomUserAgent();
  }, [setUserAgent]);

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return undefined;
    }
  };

  const getGameUrlFromEvent = (event: any): string | undefined => {
    if (!event) return;
    if (event.type === "openGameInApp") return event.url;
    if (event.type === "gameLaunch") return event.gameUrl;
    return;
  };

  useEffect(() => {
    if (isFocused) {
      isNavigatingToGame.current = false;
      lastNavigatedUrl.current = null;
    }
  }, [isFocused]);

  useEffect(() => {
    const loginScreenClosedEvent = DeviceEventEmitter.addListener(EVENTS.ON_LOGIN_CLOSED, () => {
      goBack();
    });
    return () => {
      loginScreenClosedEvent.remove();
    };
  }, []);

  const onMessageHandler = useCallback(
    (event: WebViewMessageEvent) => {
      // TODO: fix the typing here
      const nativeEventData: string | object = event.nativeEvent.data;
      const parsedEvent = typeof nativeEventData === "string" ? parseJSON(nativeEventData) : nativeEventData;
      if (nativeEventData === "closeInappBrowser") {
        // Event is triggered multiple times, causing back to jump too many navigation layers
        if (canCloseInAppBrowser.current) {
          canCloseInAppBrowser.current = false;
          goBack();
        }
      }
      // listen for GA4 events from web and send them from native to firebase
      sendWrapperEvent(event);

      const url = getGameUrlFromEvent(parsedEvent);
      if (!url) return;
      navigateToGameScreen(url);
    },
    [canCloseInAppBrowser],
  );

  return (
    // keyboardVerticalOffset shifts the effective keyboard top up by the suggestion bar height,
    // which Android omits from its keyboard height measurement on the new arch
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "height" : undefined}
      keyboardVerticalOffset={Platform.OS === "android" ? 50 : 0}
    >
      {!route.params?.viewLink.hideBackButton && (
        <Button
          title={goBackTitle}
          onPress={() => {
            goBack();
          }}
        />
      )}

      <NativeWebView
        key={webViewKey}
        ref={webViewRef}
        userAgent={userAgent}
        cacheEnabled={false}
        geolocationEnabled={true}
        sharedCookiesEnabled
        javaScriptEnabled
        source={{ uri: derivedUrl }}
        injectedJavaScriptBeforeContentLoaded={webviewUrlInterceptors}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onMessage={onMessageHandler}
      />
    </KeyboardAvoidingView>
  );
}

export default WebViewScreen;
