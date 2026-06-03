import { FunctionComponent, useCallback, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { EVENT_STATS_CARD } from "./EventStatsCard.native.selectors";

import { ComponentProps } from "./props";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

const useDimensions = (
  aspectRatio: number,
): {
  height: number;
  width: number;
  hasLoaded: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
  onLoadEnd: () => void;
} => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setWidth(event.nativeEvent.layout.width);
      setHeight(Math.round(event.nativeEvent.layout.width * aspectRatio));
    },
    [aspectRatio],
  );

  const onLoadEnd = useCallback(() => {
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  return {
    height,
    width,
    hasLoaded,
    onLayout,
    onLoadEnd,
  };
};

const getEventStatsUrl = (url: URL, width: number, height: number): string => {
  url.searchParams.set("width", `${width}`);
  url.searchParams.set("height", `${height}`);

  return url.toString();
};

/**
 * sets width and height params to the event stats URL according to the device dimensions
 */
const ConnectedEventStatsCard: FunctionComponent<ComponentProps> = ({ statsUrl, aspectRatio }) => {
  const { height, width, hasLoaded, onLayout, onLoadEnd } = useDimensions(aspectRatio);

  return (
    <View style={{ height }} onLayout={onLayout} {...getTestProps(EVENT_STATS_CARD, false)}>
      <NativeWebView
        allowsInlineMediaPlayback // this is to prevent full screen pop up on load
        sharedCookiesEnabled // share cookies to the live stream
        source={{
          uri: getEventStatsUrl(statsUrl, width, height),
        }}
        onLoadEnd={onLoadEnd}
        style={[!hasLoaded && { flex: 0, opacity: 0 }]}
        bounces={false}
      />
    </View>
  );
};

export default ConnectedEventStatsCard;
