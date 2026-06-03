import { FunctionComponent, useCallback, useContext, useRef, useState } from "react";
import { FullScreenModal, LiveStream, SupportingContentButton } from "@ppb/the-wall-web";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import styles from "./BroadcastsAndStatisticsCard.web.css";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import { ConfigContext } from "../Config/ConfigContext";

const BroadcastsAndStatisticsCard: FunctionComponent<ComponentProps> = ({
  urn,
  dataVizUrl,
  liveVideoUrl,
  statusTitle,
  broadcastsIsCollapsedByDefault,
  statisticsButtonLabel,
  statisticsViewLink,
  statisticsViewTitle,
  dispatchBroadcastsCardToggle,
  dispatchMediaPlayerLoaded,
  dispatchFetchCatalogue,
  dispatchToggleStatisticsView,
  dispatchDeleteView,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
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

  const [statisticsViewUrn, setStatisticsViewUrn] = useState<string | null>(null);

  const onStatisticsViewOpen = useCallback(() => {
    const { viewUrn } = statisticsViewLink || {};

    if (viewUrn) {
      dispatchFetchCatalogue(viewUrn);
      setStatisticsViewUrn(viewUrn);
      dispatchToggleStatisticsView(statisticsButtonLabel, urn, true);
    }
  }, [dispatchFetchCatalogue, dispatchToggleStatisticsView, statisticsButtonLabel, statisticsViewLink, urn]);

  const onStatisticsViewDismiss = useCallback(() => {
    if (statisticsViewUrn) {
      dispatchDeleteView(statisticsViewUrn);
    }
    setStatisticsViewUrn(null);
    dispatchToggleStatisticsView(statisticsButtonLabel, urn, false);
  }, [dispatchDeleteView, dispatchToggleStatisticsView, statisticsButtonLabel, statisticsViewUrn, urn]);

  return (
    <div className={styles.container}>
      <div className={styles.supportingContentContainer}>
        {!!(dataVizUrl || liveVideoUrl) && (
          <SupportingContentButton
            icon={SupportingContentIconName.LIVE_VIDEO}
            title={statusTitle}
            showExpandIcon={true}
            isOpen={isBroadcastsExpanded}
            onPress={onBroadcastsToggle}
            isHighlighted={true}
          />
        )}
        {!!statisticsViewLink && (
          <SupportingContentButton
            icon={SupportingContentIconName.TEAM_FORM}
            title={statisticsButtonLabel}
            onPress={onStatisticsViewOpen}
            isHighlighted={true}
          />
        )}
      </div>
      {isBroadcastsExpanded && (
        <div className={styles.liveStreamContainer}>
          <LiveStream
            liveVideoUrl={liveVideoUrl}
            dataVizUrl={dataVizUrl}
            onBroadcastChangeCallback={onBroadcastChangeCallback}
            isDesktop={isDesktopLayout}
          />
        </div>
      )}
      {!!statisticsViewUrn && (
        <FullScreenModal
          title={statisticsViewTitle || ""}
          onDismiss={onStatisticsViewDismiss}
          isDesktop={isDesktopLayout}
        >
          {/*
 // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest */}
          <ConnectedGenericView urn={statisticsViewUrn} component={GenericView} placeholder={GenericViewPlaceholder} />
        </FullScreenModal>
      )}
    </div>
  );
};

export default BroadcastsAndStatisticsCard;
