import type { FunctionComponent } from "react";
import { useMemo } from "react";
import { Appearance, Modal, Pressable, SafeAreaView, View } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ComponentProps } from "./props";
import styles from "./MarketGraph.native.styles";
import {
  MARKET_GRAPH,
  MARKET_GRAPH_HEADER,
  MARKET_GRAPH_HEADER_TITLE,
  MARKET_GRAPH_HEADER_BUTTON,
  MARKET_GRAPH_WEBVIEW,
  MARKET_GRAPH_EVENT_INFO,
  MARKET_GRAPH_MARKET_INFO,
} from "./MarketGraph.native.selectors";

import NativeWebView from "../Navigation/screens/NativeWebView.native";

const Header: FunctionComponent<Pick<ComponentProps, "title" | "onMarketGraphDismiss">> = ({
  title,
  onMarketGraphDismiss,
}) => (
  <View {...getTestProps(MARKET_GRAPH_HEADER, false)} style={styles.headerContainer}>
    <Text {...getTestProps(MARKET_GRAPH_HEADER_TITLE, false)} style={styles.headerTitle}>
      {title}
    </Text>
    <Pressable
      {...getTestProps(MARKET_GRAPH_HEADER_BUTTON, false)}
      style={styles.headerButton}
      onPress={onMarketGraphDismiss}
    >
      <GenericIcon name={SystemIconName.CLOSE} color={tokens.BottomSheetIconColour} />
    </Pressable>
  </View>
);

const EventMarketInfo: FunctionComponent<Pick<ComponentProps, "eventName" | "marketName">> = ({
  eventName = "",
  marketName = "",
}) => (
  <View style={styles.eventMarketInfo}>
    <Text style={styles.eventInfo} {...getTestProps(MARKET_GRAPH_EVENT_INFO, false)}>
      {eventName}
    </Text>
    <Text style={styles.marketInfo} {...getTestProps(MARKET_GRAPH_MARKET_INFO, false)}>
      {marketName}
    </Text>
  </View>
);

const MarketGraph: FunctionComponent<ComponentProps> = ({
  title,
  baseUrl,
  eventName,
  marketName,
  onMarketGraphDismiss,
}) => {
  /*
   * STSIER-882 - EGA query params for TBD
   * - product ("tbd")
   * - theme (1 - dark theme; - 2 - light theme; defaults to 1)
   *
   * See https://flutteruki.atlassian.net/wiki/x/CYGkkQ
   */
  const theme = Appearance.getColorScheme() === "light" ? 2 : 1;
  const egaUrl = `${baseUrl}?product=tbd&theme=${theme}`;

  const modalData = useMemo(
    () => (
      <SafeAreaView style={styles.modalContainer} {...getTestProps(MARKET_GRAPH, false)}>
        <Header title={title} onMarketGraphDismiss={onMarketGraphDismiss} />
        <EventMarketInfo eventName={eventName} marketName={marketName} />
        <View {...getTestProps(MARKET_GRAPH_WEBVIEW, false)} style={styles.body}>
          <NativeWebView
            style={styles.marketGraphsWebView}
            source={{ uri: egaUrl }}
            cacheEnabled={false}
            sharedCookiesEnabled
            javaScriptEnabled
            showsVerticalScrollIndicator
          />
        </View>
      </SafeAreaView>
    ),
    [onMarketGraphDismiss, eventName, marketName, title, egaUrl],
  );

  return baseUrl && eventName && marketName ? (
    <GestureHandlerRootView>
      <Modal animationType="fade" transparent hardwareAccelerated onRequestClose={onMarketGraphDismiss}>
        {modalData}
      </Modal>
    </GestureHandlerRootView>
  ) : null;
};

export default MarketGraph;
