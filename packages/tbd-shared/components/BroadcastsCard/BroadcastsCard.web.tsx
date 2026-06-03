import { FunctionComponent, useCallback, useContext, useRef, useState } from "react";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-web";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import styles from "./BroadcastsCard.web.css";
import { ConfigContext } from "../Config/ConfigContext";

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

  const { isDesktopLayout } = useContext(ConfigContext);

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
    <div className={styles.container}>
      <SupportingContentButton
        icon={SupportingContentIconName.LIVE_VIDEO}
        title={statusTitle}
        showExpandIcon={true}
        isOpen={!collapsed}
        onPress={handleBroadcastsCardToggle}
      />
      {!collapsed && (
        <div className={styles.liveStreamContainer}>
          <LiveStream
            liveVideoUrl={liveVideoUrl}
            dataVizUrl={dataVizUrl}
            aspectRatio={aspectRatio}
            onBroadcastChangeCallback={onBroadcastChangeCallback}
            isDesktop={isDesktopLayout}
          />
        </div>
      )}
    </div>
  );
};

export default BroadcastsCard;
