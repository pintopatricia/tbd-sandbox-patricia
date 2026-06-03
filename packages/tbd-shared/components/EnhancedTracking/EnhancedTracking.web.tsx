import { FunctionComponent, useEffect, useRef } from "react";

import { TrackingBar, useOnIntersect } from "@ppb/the-wall-web";

import INTERSECTION_CONFIG from "../../config/cards-intersection";

import { ComponentProps } from "./props";
import styles from "./EnhancedTracking.web.css";

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
  const isSubscribedToUpdates = useRef(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);

  useEffect(() => {
    if (urn && typename) {
      if (isIntersecting && !isSubscribedToUpdates.current) {
        dispatchSubscribeFixtureUpdates(urn, typename, subscribeTeamStats, footballPlayerIds, includeSubstitutions);
        isSubscribedToUpdates.current = true;
      }

      return () => {
        if (isSubscribedToUpdates.current) {
          dispatchUnsubscribeFixtureUpdates(urn, typename);
          isSubscribedToUpdates.current = false;
        }
      };
    }

    return () => {};
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    footballPlayerIds,
    isIntersecting,
    includeSubstitutions,
    subscribeTeamStats,
    typename,
    urn,
  ]);

  if (!urn || !typename) {
    return null;
  }

  return (
    <div ref={ref} className={styles.enhancedTrackingContainer}>
      {enhancedTrackingData.map(({ status, currentValue, goal }, index) => (
        <div key={`${urn}-${index}`} className={styles.enhancedTracking}>
          <TrackingBar currentValue={currentValue ?? undefined} goalValue={goal} status={status} />
        </div>
      ))}
    </div>
  );
};

export default EnhancedTracking;
