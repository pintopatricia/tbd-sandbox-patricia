import { type FunctionComponent, type KeyboardEvent, type SyntheticEvent, useMemo } from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import type { MiniBannerWebProps } from "./MiniBanner.types";
import styles from "./MiniBanner.web.css";

export const MiniBanner: FunctionComponent<MiniBannerWebProps> = ({ brandTitle, title, subText, onMiniBannerTap }) => {
  const ariaLabel = useMemo(
    () => [brandTitle, title, subText].filter((line): line is string => Boolean(line)).join(", "),
    [brandTitle, title, subText],
  );

  const handleBannerActivate = (event: SyntheticEvent): void => {
    onMiniBannerTap?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBannerActivate(event);
    }
  };

  return (
    <div className={styles.miniBanner}>
      <div
        aria-label={ariaLabel || undefined}
        className={classnames(styles.banner, styles.default)}
        role="button"
        tabIndex={0}
        onClick={handleBannerActivate}
        onKeyDown={handleKeyDown}
      >
        <span className={classnames(styles.leftIcon, styles.iconDefault)}>
          <GenericIcon name={SystemIconName.NOTIFICATION_INFO} />
        </span>

        <div className={styles.content}>
          {brandTitle ? <span className={classnames(styles.brandTitle, styles.textDefault)}>{brandTitle}</span> : null}
          {title ? <p className={classnames(styles.title, styles.textDefault)}>{title}</p> : null}
          {subText ? <p className={classnames(styles.subText, styles.textDefault)}>{subText}</p> : null}
        </div>

        <span aria-hidden className={classnames(styles.rightChevron, styles.iconDefault)}>
          <GenericIcon name={SystemIconName.CHEVRON_RIGHT} />
        </span>
      </div>
    </div>
  );
};
