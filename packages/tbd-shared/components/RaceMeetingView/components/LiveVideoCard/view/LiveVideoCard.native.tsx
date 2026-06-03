import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { LiveStreamAspectRatio } from "@ppb/the-wall-common/types";
import { AssetsIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { TimeformCard } from "../../../../TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.native";
import type { Broadcasts, ExpertViewData } from "../../RaceMeetingView/viewmodel/RaceMeetingView.viewmodel";
import { i18n } from "../../../../../helpers/i18n";
import styles from "./LiveVideoCard.native.styles";

enum SelectedOption {
  LIVE_VIDEO = "LIVE_VIDEO",
  EXPERT_VIEW = "EXPERT_VIEW",
}

export type LiveVideoCardProps = {
  race: {
    broadcasts: Broadcasts | null;
    expertView: ExpertViewData | null;
  };
  isHighlighted: boolean;
};

const LiveVideoCard: React.FunctionComponent<LiveVideoCardProps> = ({
  race: { broadcasts, expertView },
  isHighlighted,
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);

  const hasLiveVideo = !!(broadcasts?.liveVideoUrl || broadcasts?.dataVizUrl);
  const hasExpertView = !!expertView && expertView.runnerRatings.length > 0;

  const onToggle = useCallback((option: SelectedOption) => {
    setSelectedOption((prev) => (prev === option ? null : option));
  }, []);

  const onLiveVideoPress = useCallback(() => onToggle(SelectedOption.LIVE_VIDEO), [onToggle]);
  const onExpertViewPress = useCallback(() => onToggle(SelectedOption.EXPERT_VIEW), [onToggle]);

  if (!hasLiveVideo && !hasExpertView) {
    return null;
  }

  const liveVideoTitle = broadcasts?.liveVideoUrl
    ? i18n({ key: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO" })
    : i18n({ key: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW" });

  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {hasLiveVideo && (
          <SupportingContentButton
            icon={SupportingContentIconName.LIVE_VIDEO}
            title={liveVideoTitle}
            showExpandIcon={true}
            isOpen={selectedOption === SelectedOption.LIVE_VIDEO}
            onPress={onLiveVideoPress}
            isHighlighted={isHighlighted}
          />
        )}
        {hasExpertView && (
          <SupportingContentButton
            icon={AssetsIconName.TIMEFORM}
            title={i18n({ key: "I18N.RACE.TIMEFORM_TITLE" })}
            showExpandIcon={true}
            isOpen={selectedOption === SelectedOption.EXPERT_VIEW}
            onPress={onExpertViewPress}
            isHighlighted={isHighlighted}
          />
        )}
      </View>
      {selectedOption === SelectedOption.LIVE_VIDEO && hasLiveVideo && broadcasts && (
        <View style={styles.content}>
          <LiveStream
            liveVideoUrl={broadcasts.liveVideoUrl}
            dataVizUrl={broadcasts.dataVizUrl}
            aspectRatio={LiveStreamAspectRatio.RACE}
          />
        </View>
      )}
      {selectedOption === SelectedOption.EXPERT_VIEW && hasExpertView && expertView && (
        <View style={styles.content}>
          <TimeformCard
            runnerRatings={expertView.runnerRatings}
            verdictLabel={expertView.verdict ? i18n({ key: "I18N.RACE.TIMEFORM_VIEW" }) : undefined}
            verdict={expertView.verdict ?? undefined}
          />
        </View>
      )}
    </View>
  );
};

export default LiveVideoCard;
