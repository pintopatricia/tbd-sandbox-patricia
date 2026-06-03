import { FunctionComponent, useCallback, useRef } from "react";

import { Divider } from "@ppb/the-wall-web";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.web";

import { takeElementScreenshot } from "../../helpers/screenshot.web";
import { share } from "../../helpers/share.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";

import { ComponentProps } from "./props";
import styles from "./BetSharingCardGroup.web.css";
import { Share } from "./snowflakes/Share/Share.web";

/*
 * This is a non-breaking space. It's a workaround due to a bug on the html-to-image library that
 * breaks the text style on the captured screenshot for some browsers.
 * For more info, check here: https://github.com/bubkoo/html-to-image/issues/132
 */
const NBSP = String.fromCharCode(160);

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
    dispatchDeleteViewItems(urn);
    dispatchShareBetTap();

    try {
      await share({
        text: shareMessage,
      });
    } catch (error) {
      console.error(error);
    }
  }, [dispatchDeleteViewItems, dispatchShareBetTap, shareMessage, urn]);

  const onImageShareTap = useCallback(async (): Promise<void> => {
    dispatchShareImageTap();

    if (!screenshotRef.current) {
      return;
    }

    let elementScreenshot;

    try {
      elementScreenshot = await takeElementScreenshot(screenshotRef.current);
    } catch (error) {
      console.error(error);
    }

    dispatchDeleteViewItems(urn);

    if (elementScreenshot) {
      try {
        await share({
          files: [elementScreenshot],
        });
      } catch {} // eslint-disable-line no-empty
    }
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
      <div className={styles.container}>
        <SportsbookBetPanel
          title={betTitle.replace(/ /g, NBSP)}
          supportingText={betSupportingText}
          statusLabelText={betStatusLabel?.text}
          statusLabelType={betStatusLabel?.type}
          statusLabelIcon={betStatusLabel?.icon}
          onOpenExternalUrl={dispatchExternalPushAction}
        />
        <Divider />
        {items.map(({ urn: cardUrn, typename }) => (
          <div className={styles.legCard} key={cardUrn}>
            <ConnectedCard key={cardUrn} urn={cardUrn} component={Card} typename={typename} />
          </div>
        ))}
      </div>
    </Share>
  );
};

export default BetSharingCardGroup;
