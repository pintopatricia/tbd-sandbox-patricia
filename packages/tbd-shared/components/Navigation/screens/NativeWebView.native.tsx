import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";
import { StyleProp, StyleSheet, ViewStyle, Platform, PixelRatio } from "react-native";
import { WebView, WebViewMessageEvent, WebViewNavigation } from "react-native-webview";
import { SplunkWebView } from "@splunk/otel-react-native";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import {
  ShouldStartLoadRequest,
  WebViewNativeConfig,
  WebViewScrollEvent,
  WebViewSource,
} from "react-native-webview/lib/WebViewTypes";

import { useRefreshEnabled } from "../../../hooks/useRefreshEnabled.native";

type NativeWebViewProps = {
  source: WebViewSource;
  ref?: React.RefObject<WebView | null>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  userAgent?: string;
  injectedJavaScript?: string;
  injectedJavaScriptBeforeContentLoaded?: string;
  originWhitelist?: string[];
  textZoom?: number;
  cacheEnabled?: boolean;
  geolocationEnabled?: boolean;
  sharedCookiesEnabled?: boolean;
  javaScriptEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  automaticallyAdjustContentInsets?: boolean;
  allowsInlineMediaPlayback?: boolean;
  allowsFullscreenVideo?: boolean;
  bounces?: boolean;
  nativeConfig?: WebViewNativeConfig;
  webviewDebuggingEnabled?: boolean;
  onLoadEnd?: () => void;
  onMessage?: (event: WebViewMessageEvent) => void;
  onNavigationStateChange?: (event: WebViewNavigation) => void;
  onShouldStartLoadWithRequest?: (event: ShouldStartLoadRequest) => boolean;
};

const NativeWebView = forwardRef<WebView, NativeWebViewProps>(
  (
    {
      source,
      style,
      testID,
      userAgent,
      injectedJavaScript,
      injectedJavaScriptBeforeContentLoaded = "",
      originWhitelist,
      textZoom,
      cacheEnabled,
      geolocationEnabled,
      sharedCookiesEnabled,
      javaScriptEnabled,
      showsVerticalScrollIndicator,
      showsHorizontalScrollIndicator,
      automaticallyAdjustContentInsets,
      allowsInlineMediaPlayback,
      allowsFullscreenVideo,
      bounces,
      nativeConfig,
      webviewDebuggingEnabled = __DEV__,
      onLoadEnd,
      onMessage,
      onNavigationStateChange,
      onShouldStartLoadWithRequest,
    },
    ref,
  ) => {
    const [cookieConsentValue, setCookieConsentValue] = useState("");
    const { setRefreshEnabled } = useRefreshEnabled();

    // Disable refresh with web view scroll position, otherwise the main view
    // always assumes we're at position 0 and will trigger refresh on pull
    const onScrollCall = useCallback(
      ({ nativeEvent }: WebViewScrollEvent) => {
        setRefreshEnabled(nativeEvent.contentOffset.y === 0);
      },
      [setRefreshEnabled],
    );

    // This piece of code is needed for the OneTrust CMP to work properly in the WebView
    // More info here: https://developer.onetrust.com/onetrust/docs/react-native#passing-consent-to-webviews
    useEffect(() => {
      const fetchConsentJS = async () => {
        const consentJSForWebView = await OTPublishersNativeSDK.getOTConsentJSForWebView();
        setCookieConsentValue(`window.OTExternalConsent${consentJSForWebView.substring(21)}`);
      };

      fetchConsentJS();
    }, []);

    // Maximum safe WebView height for Android devices accounting for device pixel ratio
    // Mali GPUs (and some other Android drivers) cap texture dimensions at 16383 physical pixels
    // The limit applies to physical pixels: logical_pixels × device_scale = physical_pixels
    // Caller-provided maxHeight is respected only if it's already at or below the safe limit
    const webViewStyle: StyleProp<ViewStyle> = useMemo(() => {
      if (Platform.OS !== "android") {
        return style;
      }

      const ANDROID_GPU_LAYER_SAFE_LIMIT = 16000;
      const DEVICE_SCALE = PixelRatio.get();
      const GPU_TEXTURE_LIMIT = Math.floor(ANDROID_GPU_LAYER_SAFE_LIMIT / DEVICE_SCALE);

      if (!style) {
        return { maxHeight: GPU_TEXTURE_LIMIT };
      }

      const flattened = StyleSheet.flatten(style);
      const safeMaxHeight =
        typeof flattened?.maxHeight === "number"
          ? Math.min(flattened?.maxHeight, GPU_TEXTURE_LIMIT)
          : GPU_TEXTURE_LIMIT;

      return [style, { maxHeight: safeMaxHeight }];
    }, [style]);

    // In RN new architecture, invalid URIs are not dropped by the JSI bridge.
    // Instead, they reach native as hostless URLs, causing WKWebView.loadFileURL to throw on iOS.
    if (source && "uri" in (source as object)) {
      const uri = (source as { uri?: string }).uri;
      try {
        if (!uri || !new URL(uri).host) return null;
      } catch {
        return null;
      }
    }

    return (
      <SplunkWebView
        WebViewComponent={WebView}
        source={source}
        ref={ref}
        style={webViewStyle}
        testID={testID}
        userAgent={userAgent}
        injectedJavaScript={injectedJavaScript}
        injectedJavaScriptBeforeContentLoaded={`${cookieConsentValue} ${injectedJavaScriptBeforeContentLoaded}`}
        originWhitelist={originWhitelist}
        textZoom={textZoom}
        cacheEnabled={cacheEnabled}
        geolocationEnabled={geolocationEnabled}
        sharedCookiesEnabled={sharedCookiesEnabled}
        javaScriptEnabled={javaScriptEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        automaticallyAdjustContentInsets={automaticallyAdjustContentInsets}
        allowsInlineMediaPlayback={allowsInlineMediaPlayback}
        allowsFullscreenVideo={allowsFullscreenVideo}
        bounces={bounces}
        nativeConfig={nativeConfig}
        webviewDebuggingEnabled={webviewDebuggingEnabled}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onScroll={onScrollCall}
      />
    );
  },
);

NativeWebView.displayName = "NativeWebView";

export default NativeWebView;
