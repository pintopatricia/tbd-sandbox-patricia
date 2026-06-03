import { FunctionComponent, useCallback, useMemo, useState } from "react";
import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { readMessagesInjetedJavascript } from "../../helpers/webview-event.native";
import { Red7ScoreboardData } from "./types";

type Props = {
  red7Scoreboard: Red7ScoreboardData;
  setShowRed7Scoreboard: React.Dispatch<React.SetStateAction<boolean>>;
};

const Red7Scoreboard: FunctionComponent<Props> = ({ red7Scoreboard, setShowRed7Scoreboard }) => {
  // Quick hack - remove referrer from URL to avoid issues with the webview
  const iframeURL = red7Scoreboard?.fullURL?.split("&referer")[0] || "";
  const webViewRef = React.useRef<WebView>(null);
  const [webViewHeight, setWebViewHeight] = useState(0);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent): void => {
      const { data: unparsedData } = event.nativeEvent;

      let parsed;
      try {
        parsed = JSON.parse(unparsedData);
      } catch {
        return;
      }

      const { origin, data, type } = parsed;

      if (origin !== red7Scoreboard?.origin) {
        return;
      }

      if (!data || data.status === "error" || (data.status === "success" && data.message === "pre")) {
        setShowRed7Scoreboard(false);
        return;
      }

      if (type === "heightChange" && data.height) {
        setWebViewHeight(data.height);
      }
    },
    [red7Scoreboard?.origin, setShowRed7Scoreboard],
  );

  const webViewStyle = useMemo(
    () => ({
      height: webViewHeight,
      width: "100%",
    }),
    [webViewHeight],
  );

  return (
    <WebView
      ref={webViewRef}
      style={webViewStyle as StyleProp<ViewStyle>}
      source={{ uri: iframeURL }}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={readMessagesInjetedJavascript}
      onMessage={handleMessage}
    />
  );
};

export default Red7Scoreboard;
