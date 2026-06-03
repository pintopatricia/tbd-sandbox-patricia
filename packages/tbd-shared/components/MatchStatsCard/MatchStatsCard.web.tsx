import { FunctionComponent, useEffect } from "react";
import { MatchStats } from "@ppb/the-wall-web";

import { ComponentProps } from "./props";
import styles from "./MatchStatsCard.web.css";

const ConnectedMatchStatsCard: FunctionComponent<ComponentProps> = ({
  matchStats,
  fixtureURN,
  typename,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  useEffect(() => {
    dispatchSubscribeFixtureUpdates(fixtureURN, typename);

    return () => {
      dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
    };
  }, []); // eslint-disable-line

  if (!matchStats) return null;

  return (
    <div className={styles.matchStatsCard}>
      <div className={styles.content}>
        <MatchStats barStats={matchStats.barStats} cardStats={matchStats.cardStats} stats={matchStats.stats} />
      </div>
    </div>
  );
};

export default ConnectedMatchStatsCard;
