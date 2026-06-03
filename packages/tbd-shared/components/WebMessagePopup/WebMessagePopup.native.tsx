import { isMovableInkSubdomain, navigateWithDeepLinking } from "@ppb/tbd-router";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import { CustomModal, Loader } from "@ppb/the-wall-native";
import { firebase } from "@react-native-firebase/crashlytics";
import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { getMovableInkPromoRedirectUrl } from "../../helpers/promotion-helper";
import styles from "./WebMessagePopUp.native.styles";
import { ComponentProps } from "./props";
import appConfiguration from "../../config/app-configuration.native";
import { getHomepagePaths, getHost } from "../../config/endpoints";

const WebMessagePopup: FunctionComponent<ComponentProps> = ({
  webMessage,
  loggedIn,
  dispatchFetchWebMessages,
  dispatchReadWebMessage,
}) => {
  const [loading, setLoading] = useState(true);
  const [redirection, setRedirection] = useState<{ urn: string; url: string } | null>(null);
  const webViewRef = useRef<WebView>(null);
  const source = useMemo(() => ({ uri: `${webMessage?.templateUrl}` }), [webMessage?.templateUrl]);

  useEffect(() => {
    dispatchFetchWebMessages(loggedIn);
  }, [dispatchFetchWebMessages, loggedIn]);

  const onDismiss = useCallback(() => {
    if (webMessage?.urn) {
      dispatchReadWebMessage(webMessage?.urn);
    }
  }, [dispatchReadWebMessage, webMessage?.urn]);
  const onLoadEnd = useCallback(() => setLoading(false), []);

  const handleNavigationStateChange = useCallback(
    async (event: WebViewNavigation): Promise<string | undefined> => {
      if (!webMessage?.urn || !webMessage?.templateUrl || event.url === webMessage?.templateUrl) {
        return undefined;
      }

      webViewRef?.current?.stopLoading();

      if (isMovableInkSubdomain(event.url)) {
        try {
          dispatchReadWebMessage(webMessage.urn);

          const url = await getMovableInkPromoRedirectUrl(event.url);

          setRedirection({ urn: webMessage.urn, url });

          return undefined;
        } catch (error) {
          firebase.crashlytics().recordError(error as Error, "MovableInk");

          return undefined;
        }
      }

      dispatchReadWebMessage(webMessage.urn);

      setRedirection({ urn: webMessage.urn, url: event.url });

      return undefined;
    },
    [webMessage, dispatchReadWebMessage],
  );

  // <Modal>'s by limitation of react-native and/or iOS guidelines cannot have more than one open at a time
  // This makes sure we are opening one or the other at worst
  // It's bad UX to have multiple modals at best
  // https://github.com/facebook/react-native/issues/36226
  useLayoutEffect(() => {
    if (redirection && !webMessage?.urn) {
      const host = getHost();
      const homepagePaths = getHomepagePaths();
      navigateWithDeepLinking(redirection.url, host, homepagePaths, appConfiguration.deeplinkConfiguration);
    }
  }, [webMessage?.urn, redirection]);

  return (
    <>
      {webMessage && (!redirection || redirection.urn !== webMessage.urn) && (
        <CustomModal
          title={""}
          height={webMessage.templateHeight}
          width={webMessage.templateWidth}
          dismissOnOutsideTap={false}
          onDismiss={onDismiss}
        >
          <View style={[styles.childContainer, { height: webMessage.templateHeight, width: webMessage.templateWidth }]}>
            {loading && <Loader theme={ComponentTheme.Light} />}
            <WebView
              ref={webViewRef}
              cacheEnabled={false}
              onLoadEnd={onLoadEnd}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              sharedCookiesEnabled
              javaScriptEnabled
              style={styles.webView}
              onNavigationStateChange={handleNavigationStateChange}
              source={source}
            />
          </View>
        </CustomModal>
      )}
    </>
  );
};

export default WebMessagePopup;
