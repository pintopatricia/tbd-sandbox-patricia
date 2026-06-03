import { FunctionComponent, useCallback, useMemo } from "react";
import { Pressable, View, GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { ViewLink } from "@ppb/the-wall-common/types/ViewLink.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import {
  START_TIME_SELECTOR,
  SECONDARY_EVENT_CARD,
  SECONDARY_EVENT_CARD_VIEW,
  RUNNER_HOME_NAME,
  RUNNER_AWAY_NAME,
} from "./SecondaryEventCard.native.selectors";
import styles from "./SecondaryEventCard.native.styles";

import { SecondaryEventCardProps as SecondaryEventCardCommonProps } from "./SecondaryEventCard.types";

type SecondaryEventCardOnTap = (event: GestureResponderEvent | null, viewLink: ViewLink, urn: string) => void;

type SecondaryEventCardViewModel = {
  onTap?: SecondaryEventCardOnTap;
};

type SecondaryEventCardNativeProps = {
  style?: StyleProp<ViewStyle>;
};

type SecondaryEventCardProps = SecondaryEventCardCommonProps &
  SecondaryEventCardNativeProps &
  SecondaryEventCardViewModel;

export const SecondaryEventCard: FunctionComponent<SecondaryEventCardProps> = ({
  style,
  date,
  inplay,
  onTap,
  runnerNameAway,
  runnerNameHome,
  startTime,
  urn,
  viewLink,
}) => {
  const pressableChildren = useMemo(
    () => (
      <View {...getTestProps(SECONDARY_EVENT_CARD_VIEW, false)} style={[styles.secondaryEventCard, style]}>
        <Text {...getTestProps(RUNNER_HOME_NAME, false)} style={styles.runnerNameHome}>
          {runnerNameHome}
        </Text>
        <Text {...getTestProps(RUNNER_AWAY_NAME, false)} style={styles.runnerNameAway}>
          {runnerNameAway}
        </Text>
        <View style={styles.startTimeContainer}>
          {inplay ? <Text style={styles.inplay}>{inplay}</Text> : <Text style={styles.date}>{date}</Text>}
          {startTime && startTime.length > 0 && (
            <Text {...getTestProps(START_TIME_SELECTOR)} style={styles.startTime}>
              , {startTime}
            </Text>
          )}
        </View>
      </View>
    ),
    [runnerNameHome, runnerNameAway, startTime, style, inplay, date],
  );

  const onPressFn = useCallback(() => {
    if (onTap) {
      onTap(null, viewLink, urn);
    }
  }, [onTap, viewLink, urn]);

  return (
    <Pressable {...getTestProps(SECONDARY_EVENT_CARD, false)} onPress={onPressFn}>
      {pressableChildren}
    </Pressable>
  );
};
