import { FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import NativeWebView from "../Navigation/screens/NativeWebView.native";
import styles from "./Predicts.native.styles";
import PredictsLoading from "./PredictsLoading/PredictsLoading.native";
import { ComponentProps } from "./props";
import { PREDICTS_URL, PredictsMessageType } from "./Predicts.types";
import { isPredictsMessage } from "./Predicts.helpers";

const Predicts: FunctionComponent<ComponentProps> = ({ dispatchClosePredicts }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const handleLoadingDismiss = useCallback(() => {
    setShowLoadingScreen(false);
  }, []);

  const handleExit = useCallback(() => {
    dispatchClosePredicts();
    if (navigation.canGoBack()) navigation.goBack();
  }, [dispatchClosePredicts, navigation]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(event.nativeEvent.data);
    } catch (error) {
      console.warn("[Predicts] Failed to parse message", {
        error,
        data: event.nativeEvent.data,
      });
      return;
    }
    if (!isPredictsMessage(parsed)) return;

    if (parsed.type === PredictsMessageType.Ready) setLoading(false);
    if (parsed.type === PredictsMessageType.Exit) handleExit();
  };

  return (
    <View style={[styles.container]}>
      <NativeWebView
        source={{ uri: PREDICTS_URL }}
        style={styles.webView}
        onMessage={handleMessage}
        cacheEnabled={false}
        sharedCookiesEnabled
        javaScriptEnabled
      />

      {showLoadingScreen && <PredictsLoading isLoading={loading} onDismiss={handleLoadingDismiss} />}
    </View>
  );
};

export default Predicts;
