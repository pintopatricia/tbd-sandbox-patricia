import { FunctionComponent, useCallback, useRef } from "react";
import { View } from "react-native";

import { Divider } from "@ppb/the-wall-native";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.native";

import { takeElementScreenshot } from "../../helpers/screenshot.native";
import { share } from "../../helpers/share.native";
import { Share } from "./snowflakes/Share/Share.native";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedCardGroup from "../CardGroup";

import { ComponentProps } from "./props";
import styles from "./BetSharingCardGroup.native.styles";

const BetSharingCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  description,
  betTitle,
  betSupportingText,
  betStatusLabel,
  items,
  betShareButtonText,
  imageShareButtonText,
  shareMessage,
  dispatchDeleteViewItems,
  dispatchDismissTap,
  dispatchShareBetTap,
  dispatchShareImageTap,
  dispatchExternalPushAction,
}) => {
  const screenshotRef = useRef(null);

  const onCloseTap = useCallback((): void => {
    dispatchDeleteViewItems(urn);
    dispatchDismissTap();
  }, [dispatchDeleteViewItems, dispatchDismissTap, urn]);

  const onBetShareTap = useCallback(async (): Promise<void> => {
    dispatchShareBetTap();

    try {
      await share({
        message: shareMessage,
      });
    } catch {} // eslint-disable-line no-empty

    dispatchDeleteViewItems(urn);
  }, [dispatchDeleteViewItems, dispatchShareBetTap, shareMessage, urn]);

  const onImageShareTap = useCallback(async (): Promise<void> => {
    dispatchShareImageTap();

    if (!screenshotRef.current) {
      return;
    }

    let elementScreenshot;

    try {
      elementScreenshot = await takeElementScreenshot(screenshotRef.current);
      if (elementScreenshot) {
        await share({
          url: elementScreenshot,
        });
      }
    } catch {} // eslint-disable-line no-empty

    dispatchDeleteViewItems(urn);
  }, [dispatchDeleteViewItems, dispatchShareImageTap, urn]);

  return (
    <Share
      title={title}
      description={description}
      screenshotRef={screenshotRef}
      leftButtonText={betShareButtonText}
      rightButtonText={imageShareButtonText}
      onCloseTap={onCloseTap}
      onLeftButtonTap={betShareButtonText ? onBetShareTap : undefined}
      onRightButtonTap={onImageShareTap}
    >
      <View style={styles.container}>
        <SportsbookBetPanel
          title={betTitle}
          supportingText={betSupportingText}
          statusLabelText={betStatusLabel?.text}
          statusLabelType={betStatusLabel?.type}
          statusLabelIcon={betStatusLabel?.icon}
          onOpenExternalUrl={dispatchExternalPushAction}
        />
        <Divider />
        {items.map(({ urn: cardUrn, typename }) => (
          <View style={styles.legCard} key={cardUrn}>
            <ConnectedCardGroup key={cardUrn} urn={cardUrn} component={CardGroup} typename={typename} />
          </View>
        ))}
      </View>
    </Share>
  );
};

export default BetSharingCardGroup;
