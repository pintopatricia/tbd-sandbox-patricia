import { useState, FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Counter, ShowMore, Text, TrackingBar } from "@ppb/the-wall-native";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import { CounterColor } from "@ppb/the-wall-common/types";
import type { ComponentProps } from "./props";
import { TEST_ID, TRACKING_BAR, INDIVIDUAL_TRACKING, PLAYER_NAME } from "./ObbEnhancedTracking.native.selectors";
import styles from "./ObbEnhancedTracking.native.styles";
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
      dispatchSubscribeFixtureUpdates(urn, typename, footballPlayerIds);
    }
    return () => {
      if (urn && typename) {
        dispatchUnsubscribeFixtureUpdates(urn, typename);
      }
    };
  }, [dispatchSubscribeFixtureUpdates, dispatchUnsubscribeFixtureUpdates, footballPlayerIds, typename, urn]);

  if (!urn || !typename) {
    return null;
  }

  return (
    <View style={styles.obbEnhancedTrackingContainer} {...getTestProps(TEST_ID, false)}>
      {enhancedTrackingData.map((outcome, index) => (
        <>
          {outcome.enhancedTrackingType === EnhancedTrackingDataType.PROGRESS && (
            <View
              style={styles.trackingBarContainer}
              key={`tracking-bar-${index}`}
              {...getTestProps(TRACKING_BAR, false)}
            >
              <TrackingBar
                currentValue={outcome.currentValue ?? undefined}
                goalValue={outcome.goal}
                status={outcome.status}
              />
            </View>
          )}
          {(outcome.enhancedTrackingType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING ||
            outcome.enhancedTrackingType === EnhancedTrackingDataType.SQUAD_TRACKING) &&
            outcome.statsListTrackingData.length > 0 && (
              <>
                {isOpen && (
                  <View style={styles.statsListTrackingContainer} key={`stats-list-tracking-${index}`}>
                    <Text style={styles.playerProgressTitle}>
                      {outcome.enhancedTrackingType === EnhancedTrackingDataType.INDIVIDUAL_TRACKING
                        ? i18nLabels.playerProgressTitleLabel
                        : i18nLabels.squadsProgressTitleLabel}
                    </Text>
                    {outcome.statsListTrackingData.map((statsListData, idx) => (
                      <View
                        key={idx}
                        style={styles.statsListTrackingLineContainer}
                        {...getTestProps(INDIVIDUAL_TRACKING, false)}
                      >
                        <Counter value={statsListData.stat || 0} color={CounterColor.Yellow} />
                        <Text style={styles.playerNameStyle} {...getTestProps(PLAYER_NAME, false)}>
                          {statsListData.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                <ShowMore
                  text={buildShowMoreLabel(outcome.enhancedTrackingType)}
                  opened={isOpen}
                  hasBorderTop={false}
                  onClick={onClickShowMore}
                />
              </>
            )}
        </>
      ))}
    </View>
  );
};

export default ObbEnhancedTracking;
