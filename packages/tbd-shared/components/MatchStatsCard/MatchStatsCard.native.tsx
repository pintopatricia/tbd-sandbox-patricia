import { FunctionComponent, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { MatchStats } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { MATCH_STATS, MATCH_STATS_CONTAINER, MATCH_STATS_CONTENT } from "./MatchStatsCard.native.selectors";

import { ComponentProps } from "./props";
import styles from "./MatchStatsCard.native.styles";

const MatchStatsCard: FunctionComponent<ComponentProps> = ({
  matchStats,
  fixtureURN,
  typename,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  useEffect(() => {
    dispatchSubscribeFixtureUpdates(fixtureURN, typename);

    return function unmount() {
      dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
    };
  }, []); // eslint-disable-line

  if (!matchStats) return null;

  return (
    <View {...getTestProps(MATCH_STATS, false)}>
      <ScrollView {...getTestProps(MATCH_STATS_CONTENT, false)}>
        <View style={styles.matchStatsContainer} {...getTestProps(MATCH_STATS_CONTAINER, false)}>
          <MatchStats barStats={matchStats.barStats} cardStats={matchStats.cardStats} stats={matchStats.stats} />
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchStatsCard;
