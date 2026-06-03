import { FunctionComponent, useEffect } from "react";
import { View } from "react-native";

import { TrackingBar } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { ComponentProps } from "./props";
import styles from "./EnhancedTracking.native.styles";
import { TEST_ID, TRACKING_BARS } from "./EnhancedTracking.native.selectors";

const EnhancedTracking: FunctionComponent<ComponentProps> = ({
  urn,
  typename,
  enhancedTrackingData,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
  subscribeTeamStats,
  footballPlayerIds,
  includeSubstitutions,
}) => {
  useEffect(() => {
    if (urn && typename) {
      dispatchSubscribeFixtureUpdates(urn, typename, subscribeTeamStats, footballPlayerIds, includeSubstitutions);
    }
    return () => {
      if (urn && typename) {
        dispatchUnsubscribeFixtureUpdates(urn, typename);
      }
    };
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    footballPlayerIds,
    includeSubstitutions,
    subscribeTeamStats,
    typename,
    urn,
  ]);

  if (!urn || !typename) {
    return null;
  }

  return (
    <View style={styles.enhancedTrackingContainer} {...getTestProps(TEST_ID, false)}>
      {enhancedTrackingData.map(({ status, currentValue, goal }, index) => (
        <View key={`${urn}-${index}`} style={styles.enhancedTracking} {...getTestProps(TRACKING_BARS, false)}>
          <TrackingBar currentValue={currentValue} goalValue={goal} status={status} />
        </View>
      ))}
    </View>
  );
};

export default EnhancedTracking;
