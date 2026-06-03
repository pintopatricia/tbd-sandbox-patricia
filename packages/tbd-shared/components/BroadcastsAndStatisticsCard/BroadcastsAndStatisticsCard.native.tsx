import { FunctionComponent, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import styles from "./BroadcastsAndStatisticsCard.native.styles";
import { BROADCASTS_AND_STATISTICS, LIVE_VIDEO_SECTION } from "./BroadcastsAndStatisticsCard.native.selectors";

const BroadcastsAndStatisticsCard: FunctionComponent<ComponentProps> = ({
  urn,
  dataVizUrl,
  liveVideoUrl,
  statusTitle,
  broadcastsIsCollapsedByDefault,
  statisticsButtonLabel,
  statisticsViewLink,
  dispatchBroadcastsCardToggle,
  dispatchMediaPlayerLoaded,
  dispatchToggleStatisticsView,
}) => {
  // To prevent sending the GTM event every time the user scrolls vertically and the card is visible - intersecting with the viewport
  const lastSentBroadcast = useRef<string | null>(null);
  const [isBroadcastsExpanded, setIsBroadcastsExpanded] = useState<boolean>(!broadcastsIsCollapsedByDefault);

  const onBroadcastsToggle = useCallback(() => {
    dispatchBroadcastsCardToggle(!isBroadcastsExpanded, urn);
    setIsBroadcastsExpanded(!isBroadcastsExpanded);
    lastSentBroadcast.current = null;
  }, [dispatchBroadcastsCardToggle, isBroadcastsExpanded, urn]);

  const onBroadcastChangeCallback = useCallback(
    (currentBroadcast: string): void => {
      if (lastSentBroadcast.current !== currentBroadcast) {
        dispatchMediaPlayerLoaded(currentBroadcast, urn);
        lastSentBroadcast.current = currentBroadcast;
      }
    },
    [dispatchMediaPlayerLoaded, urn],
  );

  const onStatisticsViewOpen = useCallback(() => {
    const { viewUrn } = statisticsViewLink || {};

    if (viewUrn) {
      dispatchToggleStatisticsView(statisticsButtonLabel, urn, true);
      navigate({ viewUrn });
    }
  }, [dispatchToggleStatisticsView, statisticsButtonLabel, statisticsViewLink, urn]);

  const containsDataVizAndLiveVideo = !!(dataVizUrl || liveVideoUrl);

  return (
    <View {...getTestProps(BROADCASTS_AND_STATISTICS, false)} style={styles.container}>
      <View style={styles.supportingContentContainer}>
        {containsDataVizAndLiveVideo && (
          <SupportingContentButton
            icon={SupportingContentIconName.LIVE_VIDEO}
            title={statusTitle}
            showExpandIcon={true}
            isOpen={isBroadcastsExpanded}
            onPress={onBroadcastsToggle}
            isHighlighted={true}
          />
        )}
        <View style={containsDataVizAndLiveVideo && !!statisticsViewLink ? styles.gap : {}} />
        {!!statisticsViewLink && (
          <SupportingContentButton
            icon={SupportingContentIconName.TEAM_FORM}
            title={statisticsButtonLabel}
            onPress={onStatisticsViewOpen}
            isHighlighted={true}
          />
        )}
      </View>
      {isBroadcastsExpanded && (
        <View style={styles.liveStreamContainer} {...getTestProps(LIVE_VIDEO_SECTION, false)}>
          <LiveStream
            liveVideoUrl={liveVideoUrl}
            dataVizUrl={dataVizUrl}
            onBroadcastChangeCallback={onBroadcastChangeCallback}
          />
        </View>
      )}
    </View>
  );
};

export default BroadcastsAndStatisticsCard;
