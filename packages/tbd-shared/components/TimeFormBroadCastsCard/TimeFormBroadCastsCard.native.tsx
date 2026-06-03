import { FunctionComponent, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { LiveStreamAspectRatio } from "@ppb/the-wall-common/types";
import { AssetsIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TimeformCard as TimeFormCardComponent } from "./snowflakes/TimeformCard/TimeformCard.native";
import { ComponentProps } from "./props";
import styles from "./TimeFormBroadCastsCard.native.styles";
import { TIME_FORM_BROAD_CASTS } from "./TimeFormBroadCastsCard.native.selectors";

enum TIME_FORM_BROADCASTS_OPTIONS {
  LIVE_VIDEO = "LIVE_VIDEO",
  TIME_FORM = "TIME_FORM",
}

const TimeFormBroadCastsCard: FunctionComponent<ComponentProps> = ({
  runnerRatings,
  verdictLabel,
  verdict,
  collapsed,
  dataVizUrl,
  liveVideoUrl,
  statusTitle,
  timeFormTitle,
  raceUrn,
  cardUrn,
  dispatchUpdateTimeFormCollapsePreference,
  dispatchToggleTimeForm,
  dispatchTimeFormBroadCastsCardToggle,
  dispatchMediaPlayerLoaded,
}) => {
  // Set TimeForm as the selected option depending on the preference
  const [selectedOption, setSelectedOption] = useState<TIME_FORM_BROADCASTS_OPTIONS | null>(
    !collapsed && collapsed !== undefined ? TIME_FORM_BROADCASTS_OPTIONS.TIME_FORM : null,
  );
  // To prevent sending the GTM event every time the user scrolls vertically and the card is visible - intersecting with the viewport
  const lastSentBroadcast = useRef<string | null>(null);

  const onTimeFormButtonClick = useCallback(
    (isExpanded: boolean) => {
      dispatchUpdateTimeFormCollapsePreference(isExpanded);
      if (raceUrn) {
        dispatchToggleTimeForm(isExpanded, raceUrn);
      }
    },
    [dispatchToggleTimeForm, dispatchUpdateTimeFormCollapsePreference, raceUrn],
  );

  const handleBroadcastsCardToggle = useCallback(
    (isExpanded: boolean) => {
      if (raceUrn) {
        dispatchTimeFormBroadCastsCardToggle(isExpanded, cardUrn, raceUrn);
        lastSentBroadcast.current = null;
      }
    },
    [dispatchTimeFormBroadCastsCardToggle, cardUrn, raceUrn],
  );

  const onBroadcastChangeCallback = useCallback(
    (currentBroadcast: string): void => {
      if (lastSentBroadcast.current !== currentBroadcast && raceUrn) {
        dispatchMediaPlayerLoaded(currentBroadcast, raceUrn);
        lastSentBroadcast.current = currentBroadcast;
      }
    },
    [dispatchMediaPlayerLoaded, raceUrn],
  );

  const onClickCallback = useCallback(
    (option: TIME_FORM_BROADCASTS_OPTIONS) => {
      if (option === TIME_FORM_BROADCASTS_OPTIONS.TIME_FORM) {
        onTimeFormButtonClick(selectedOption !== option);
      }
      if (option === TIME_FORM_BROADCASTS_OPTIONS.LIVE_VIDEO) {
        handleBroadcastsCardToggle(selectedOption !== option);
      }
      if (selectedOption !== option) {
        setSelectedOption(option);
      } else {
        setSelectedOption(null);
      }
    },
    [selectedOption, onTimeFormButtonClick, handleBroadcastsCardToggle],
  );

  const hasLiveVideo = !!(dataVizUrl || liveVideoUrl);
  const onLiveVideoButtonPress = useCallback(() => {
    onClickCallback(TIME_FORM_BROADCASTS_OPTIONS.LIVE_VIDEO);
  }, [onClickCallback]);

  const hasTimeform = !!runnerRatings.length;
  const onTimeformButtonPress = useCallback(() => {
    onClickCallback(TIME_FORM_BROADCASTS_OPTIONS.TIME_FORM);
  }, [onClickCallback]);

  return (
    <View {...getTestProps(TIME_FORM_BROAD_CASTS, false)} style={styles.card}>
      <View style={styles.cardOptions}>
        {hasLiveVideo && (
          <SupportingContentButton
            icon={SupportingContentIconName.LIVE_VIDEO}
            title={statusTitle}
            showExpandIcon={true}
            isOpen={selectedOption === TIME_FORM_BROADCASTS_OPTIONS.LIVE_VIDEO}
            onPress={onLiveVideoButtonPress}
            isHighlighted={true}
          />
        )}
        <View style={hasLiveVideo && hasTimeform ? styles.gap : {}}></View>
        {hasTimeform && (
          <SupportingContentButton
            icon={AssetsIconName.TIMEFORM}
            title={timeFormTitle}
            showExpandIcon={true}
            isOpen={selectedOption === TIME_FORM_BROADCASTS_OPTIONS.TIME_FORM}
            onPress={onTimeformButtonPress}
            isHighlighted={true}
          />
        )}
      </View>
      {selectedOption === TIME_FORM_BROADCASTS_OPTIONS.TIME_FORM && hasTimeform && (
        <View style={styles.container}>
          <TimeFormCardComponent runnerRatings={runnerRatings} verdictLabel={verdictLabel} verdict={verdict} />
        </View>
      )}
      {selectedOption === TIME_FORM_BROADCASTS_OPTIONS.LIVE_VIDEO && hasLiveVideo && (
        <View style={styles.container}>
          <LiveStream
            liveVideoUrl={liveVideoUrl}
            dataVizUrl={dataVizUrl}
            aspectRatio={LiveStreamAspectRatio.RACE}
            onBroadcastChangeCallback={onBroadcastChangeCallback}
          />
        </View>
      )}
    </View>
  );
};

export default TimeFormBroadCastsCard;
