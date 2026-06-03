import { FunctionComponent, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import { BROADCASTS_CARD, LIVE_STREAM_CONTAINER } from "./BroadcastsCard.native.selectors";
import styles from "./BroadcastsCard.native.styles";

const BroadcastsCard: FunctionComponent<ComponentProps> = ({
  dataVizUrl,
  liveVideoUrl,
  statusTitle,
  isCollapsed,
  aspectRatio,
  urn,
  dispatchBroadcastsCardToggle,
  dispatchMediaPlayerLoaded,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(isCollapsed);
  // To prevent sending the GTM event every time the user scrolls vertically and the card is visible - intersecting with the viewport
  const lastSentBroadcast = useRef<string | null>(null);

  const handleBroadcastsCardToggle = useCallback(
    (isExpanded: boolean) => {
      dispatchBroadcastsCardToggle(isExpanded, urn);
      lastSentBroadcast.current = null;
      setCollapsed(!collapsed);
    },
    [collapsed, dispatchBroadcastsCardToggle, urn],
  );

  const onBroadcastChangeCallback = useCallback(
    (currentBroadcast: string): void => {
      if (lastSentBroadcast.current !== currentBroadcast) {
        dispatchMediaPlayerLoaded(currentBroadcast, urn);
        lastSentBroadcast.current = currentBroadcast;
      }
    },
    [dispatchMediaPlayerLoaded, urn],
  );

  return (
    <View style={styles.container} {...getTestProps(BROADCASTS_CARD, false)}>
      <SupportingContentButton
        icon={SupportingContentIconName.LIVE_VIDEO}
        title={statusTitle}
        showExpandIcon={true}
        isOpen={!collapsed}
        onPress={handleBroadcastsCardToggle}
      />
      {!collapsed && (
        <View style={styles.liveStreamContainer} {...getTestProps(LIVE_STREAM_CONTAINER, false)}>
          <LiveStream
            liveVideoUrl={liveVideoUrl}
            dataVizUrl={dataVizUrl}
            aspectRatio={aspectRatio}
            onBroadcastChangeCallback={onBroadcastChangeCallback}
          />
        </View>
      )}
    </View>
  );
};

export default BroadcastsCard;
