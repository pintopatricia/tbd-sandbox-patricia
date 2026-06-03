import { FunctionComponent, useMemo } from "react";
import classnames from "classnames";
import { SystemIconName } from "@ppb/the-wall-icons";
import { PrimaryButton, SecondaryButton, BottomSheet } from "@ppb/the-wall-web";

import { ScreenshotFrame } from "../ScreenshotFrame/ScreenshotFrame.web";
import { ShareViewModel } from "./Share.types";
import styles from "./Share.web.css";

export const Share: FunctionComponent<ShareViewModel> = ({
  title,
  description,
  screenshotRef,
  children,
  leftButtonText,
  rightButtonText,
  onCloseTap,
  onLeftButtonTap,
  onRightButtonTap,
}) => {
  const descriptionContainer = useMemo(
    () => <div className={classnames(styles.description, "typography-h156")}>{description}</div>,
    [description],
  );

  const buttonsContainer = useMemo(
    () => (
      <div className={styles.buttonsContainer}>
        {!!(leftButtonText && onLeftButtonTap) && (
          <PrimaryButton label={leftButtonText} icon={SystemIconName.SHARE} onTap={onLeftButtonTap} />
        )}
        <SecondaryButton label={rightButtonText} icon={SystemIconName.SHARE} onTap={onRightButtonTap} />
      </div>
    ),
    [leftButtonText, onLeftButtonTap, onRightButtonTap, rightButtonText],
  );
  return (
    <BottomSheet
      title={title}
      onHeaderIconTap={onCloseTap}
      showOverlay={true}
      showContentFullHeight={true}
      headerContent={descriptionContainer}
      footerContent={buttonsContainer}
    >
      <div className={styles.container}>
        <div className={styles.screenshotFrame}>
          <div className={styles.screenshotOverlay} />
          <ScreenshotFrame screenshotRef={screenshotRef}>{children}</ScreenshotFrame>
        </div>
      </div>
    </BottomSheet>
  );
};
