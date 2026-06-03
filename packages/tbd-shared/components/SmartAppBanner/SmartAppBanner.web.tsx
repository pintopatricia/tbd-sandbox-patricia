import type { FunctionComponent, JSX } from "react";
import { useCallback, useState, useEffect } from "react";

import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { PrimaryButton } from "@ppb/the-wall-web";

import type { ComponentProps } from "./props";
import styles from "./SmartAppBanner.web.css";

const SmartAppBanner: FunctionComponent<ComponentProps> = ({
  title,
  subtitle,
  downloadButtonLabel,
  downloadUrl,
  dispatchExternalPush,
  dispatchSmartAppBannerClick,
  dispatchSmartAppBannerClose,
  dispatchSmartAppBannerDisplay,
}): JSX.Element | null => {
  const [isVisible, setIsVisible] = useState(true);
  const shouldDisplay = downloadUrl && isVisible;

  useEffect((): void => {
    if (shouldDisplay) {
      dispatchSmartAppBannerDisplay();
    }
  }, [dispatchSmartAppBannerDisplay, shouldDisplay]);

  const onCloseButtonTap = useCallback((): void => {
    setIsVisible(false);
    dispatchSmartAppBannerClose();
  }, [dispatchSmartAppBannerClose]);

  const onDownloadButtonTap = useCallback((): void => {
    if (downloadUrl) {
      dispatchExternalPush(downloadUrl);
      dispatchSmartAppBannerClick(downloadUrl);
    }
  }, [downloadUrl, dispatchSmartAppBannerClick, dispatchExternalPush]);

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={onCloseButtonTap}>
        <GenericIcon name={IconsList.CLOSE} />
      </button>
      <span className={styles.brandLogoIcon}>
        <GenericIcon name={IconsList.BRAND_FAVICON} />
      </span>
      <div className={styles.textContainer}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
      <span className={styles.downloadButton}>
        <PrimaryButton label={downloadButtonLabel} onTap={onDownloadButtonTap} stopAnimation={true} />
      </span>
    </div>
  );
};

export default SmartAppBanner;
