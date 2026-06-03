import { FunctionComponent } from "react";
import classnames from "classnames";

import { Placeholder, ProgressBar } from "@ppb/the-wall-web";
import { ProgressBarVariant } from "@ppb/the-wall-common/types";
import styles from "./StatsGroup.web.css";
import { StatsGroupProps } from "./StatsGroup.types";
import { getProgressBarProps } from "./StatsGroup.helper";

export const StatsGroup: FunctionComponent<StatsGroupProps> = ({
  label,
  secondaryLabel,
  left,
  right,
  maxValue,
  disabled = false,
  placeholder = false,
}) => {
  if (placeholder) {
    return (
      <div className={styles.container}>
        <div className={classnames([styles.statZone, styles.statZonePlaceholder])}>
          <div className={styles.progressBar}>
            <ProgressBar variant={ProgressBarVariant.PLACEHOLDER} />
          </div>
          <div className={styles.statZoneLabelPlaceholder}>
            <Placeholder />
          </div>
        </div>
        <div className={classnames([styles.textZone, styles.textZonePlaceholder])}>
          <div className={styles.mainLabelPlaceholder}>
            <Placeholder />
          </div>
          {secondaryLabel && (
            <div className={styles.secondaryLabelPlaceholder}>
              <Placeholder />
            </div>
          )}
        </div>
        <div className={classnames([styles.statZone, styles.statZonePlaceholder])}>
          <div className={styles.statZoneLabelPlaceholder}>
            <Placeholder />
          </div>
          <div className={styles.progressBar}>
            <ProgressBar variant={ProgressBarVariant.PLACEHOLDER} />
          </div>
        </div>
      </div>
    );
  }

  const leftValue = left.value !== null ? left.value.toFixed(2) : "-";
  const rightValue = right.value !== null ? right.value.toFixed(2) : "-";

  return (
    <div className={styles.container}>
      <div className={styles.statZone}>
        {/* Left Side */}
        <div className={styles.progressBar}>
          <ProgressBar barStat {...getProgressBarProps(left, maxValue, "left", disabled)} />
        </div>
        <span className={classnames([styles.statZoneLabel, styles.inverted, { [styles.disabled]: disabled }])}>
          {leftValue}
        </span>
      </div>
      <div className={styles.textZone}>
        {/* Group title */}
        <span className={classnames([styles.mainLabel, { [styles.disabled]: disabled }])}>{label}</span>
        {secondaryLabel && (
          <span className={classnames([styles.secondaryLabel, { [styles.disabled]: disabled }])}>{secondaryLabel}</span>
        )}
      </div>
      <div className={styles.statZone}>
        {/* Right Side */}
        <span className={classnames([styles.statZoneLabel, { [styles.disabled]: disabled }])}>{rightValue}</span>
        <div className={styles.progressBar}>
          <ProgressBar barStat {...getProgressBarProps(right, maxValue, "right", disabled)} />
        </div>
      </div>
    </div>
  );
};
