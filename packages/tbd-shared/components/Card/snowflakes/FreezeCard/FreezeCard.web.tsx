import { FunctionComponent, memo } from "react";

import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import { StatusLabel } from "@ppb/the-wall-web";

import classnames from "classnames";
import styles from "./FreezeCard.web.css";
import { FreezeCardProps, FreezeCardStates, FreezeCardStatuses, getStatusLabelData } from "./shared";

export const FreezeCard: FunctionComponent<FreezeCardProps> = memo(
  ({ status, state, statusLabel, text, contentText, children, onClick }) => {
    const freezeCardStyle = classnames(styles.freezeCard, {
      [styles.freezeCardSuspended]: state === FreezeCardStates.SUSPENDED,
      [styles.freezeCardActive]: state === FreezeCardStates.ACTIVE,
      [styles.freezeCardSelected]: state === FreezeCardStates.SELECTED,
      [styles.freezeCardIneligible]: state === FreezeCardStates.INELIGIBLE,
      [styles.freezeCardFinished]: status === FreezeCardStatuses.FINISHED,
    });

    const iconStyle = classnames(styles.icon, {
      [styles.iconSuspended]: state === FreezeCardStates.SUSPENDED,
      [styles.iconActive]: state === FreezeCardStates.ACTIVE,
      [styles.iconSelected]: state === FreezeCardStates.SELECTED,
      [styles.iconIneligible]: state === FreezeCardStates.INELIGIBLE,
      [styles.iconFinished]: status === FreezeCardStatuses.FINISHED,
    });

    const labelStyle = classnames(styles.label, {
      [styles.labelSuspended]: state === FreezeCardStates.SUSPENDED,
      [styles.labelActive]: state === FreezeCardStates.ACTIVE,
      [styles.labelSelected]: state === FreezeCardStates.SELECTED,
      [styles.labelIneligible]: state === FreezeCardStates.INELIGIBLE,
      [styles.labelFinished]: status === FreezeCardStatuses.FINISHED,
    });

    const contentTextStyle = classnames(styles.contentText, {
      [styles.contentTextSuspended]: state === FreezeCardStates.SUSPENDED,
      [styles.contentTextActive]: state === FreezeCardStates.ACTIVE,
      [styles.contentTextSelected]: state === FreezeCardStates.SELECTED,
      [styles.contentTextIneligible]: state === FreezeCardStates.INELIGIBLE,
      [styles.contentTextFinished]: status === FreezeCardStatuses.FINISHED,
    });

    const statusLabelData = getStatusLabelData(state, status);

    return (
      <button className={freezeCardStyle} onClick={onClick}>
        <div className={styles.top}>{children}</div>
        <div className={styles.bottom}>
          <hr className={styles.divider} />

          <div className={styles.content}>
            <div className={styles.dynamic}>
              <span className={iconStyle}>
                <SportIcon sportId="1" />
              </span>
              <span className={labelStyle}>{text}</span>
              <span className={contentTextStyle}>{contentText}</span>
            </div>

            {statusLabel && (
              <div className={styles.statusLabel}>{statusLabelData && <StatusLabel {...statusLabelData} />}</div>
            )}
          </div>
        </div>
      </button>
    );
  },
  (prev, next) =>
    prev.contentText === next.contentText &&
    prev.state === next.state &&
    prev.status === next.status &&
    prev.statusLabel === next.statusLabel &&
    prev.text === next.text,
);
FreezeCard.displayName = "FreezeCard";
