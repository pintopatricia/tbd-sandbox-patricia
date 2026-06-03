import { useState, Fragment, FunctionComponent, useEffect, useRef } from "react";

import { Counter, ShowMore, TrackingBar, useOnIntersect } from "@ppb/the-wall-web";
import { CounterColor } from "@ppb/the-wall-common/types";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import INTERSECTION_CONFIG from "../../config/cards-intersection";

import type { ComponentProps } from "./props";

import styles from "./ObbEnhancedTracking.web.css";
import { EnhancedTrackingDataType } from "./ObbEnhancedTracking.types";

const ObbEnhancedTracking: FunctionComponent<ComponentProps> = ({
  urn,
  typename,
  enhancedTrackingData,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
  footballPlayerIds,
  i18nLabels,
  dispatchObbEnhancedTrackingModalAction,
  eventName,
  betLegPartType,
  cardUrn,
}) => {
  const isSubscribedToUpdates = useRef(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);

  const [isOpen, setIsOpen] = useState(false);

  const onClickShowMore = () => {
    const actionType = isOpen ? TaggingAction.CLOSED : TaggingAction.OPENED;
    dispatchObbEnhancedTrackingModalAction(actionType, eventName || "", cardUrn, betLegPartType || undefined);
    setIsOpen(!isOpen);
  };

  const buildShowMoreLabel = (outcomeType: EnhancedTrackingDataType): string => {
    if (isOpen) {
      return outcomeType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING
        ? i18nLabels.hidePlayerProgressLabel
        : i18nLabels.hideSquadsProgressLabel;
    }
    return outcomeType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING
      ? i18nLabels.showPlayerProgressLabel
      : i18nLabels.showSquadsProgressLabel;
  };

  useEffect(() => {
    if (urn && typename) {
      if (isIntersecting && !isSubscribedToUpdates.current) {
        dispatchSubscribeFixtureUpdates(urn, typename, footballPlayerIds);
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
    typename,
    urn,
  ]);

  if (!urn || !typename) {
    return null;
  }

  return (
    <div ref={ref} className={styles.obbEnhancedTrackingContainer}>
      {enhancedTrackingData.map((outcome, index) => (
        <Fragment key={index}>
          {outcome.enhancedTrackingType === EnhancedTrackingDataType.PROGRESS && (
            <div className={styles.trackingBarContainer} key={`tracking-bar-${index}`}>
              <TrackingBar
                currentValue={outcome.currentValue ?? undefined}
                goalValue={outcome.goal}
                status={outcome.status}
              />
            </div>
          )}
          {(outcome.enhancedTrackingType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING ||
            outcome.enhancedTrackingType === EnhancedTrackingDataType.SQUAD_TRACKING) &&
            outcome.statsListTrackingData.length > 0 && (
              <>
                {isOpen && (
                  <div className={styles.statsListTrackingContainer} key={`stats-list-tracking-${index}`}>
                    <span className={styles.playerProgressTitle}>
                      {outcome.enhancedTrackingType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING
                        ? i18nLabels.playerProgressTitleLabel
                        : i18nLabels.squadsProgressTitleLabel}
                    </span>
                    {outcome.statsListTrackingData.map((statsListData, idx) => (
                      <div key={idx} className={styles.statsListTrackingLineContainer}>
                        <Counter value={statsListData.stat || 0} color={CounterColor.Yellow} />
                        <span data-testid="player-name" className={styles.playerNameStyle}>
                          {statsListData.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <ShowMore
                  text={buildShowMoreLabel(outcome.enhancedTrackingType)}
                  opened={isOpen}
                  hasBorderTop={false}
                  onClick={onClickShowMore}
                />
              </>
            )}
        </Fragment>
      ))}
    </div>
  );
};

export default ObbEnhancedTracking;
