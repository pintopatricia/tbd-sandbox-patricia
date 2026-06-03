import { FunctionComponent } from "react";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ContextualStatsComparisonProps } from "./ContextualStatsComparison.types";
import styles from "./ContextualStatsComparison.web.css";

export const ContextualStatsComparison: FunctionComponent<ContextualStatsComparisonProps> = ({
  text,
  leftValue,
  rightValue,
}) => (
  <div className={styles.contextualStatsComparisonContainer}>
    <div className={styles.statsContainer}>
      <div className={styles.iconContainer}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={"var(--half-time-pulse-stat-icon-colour)"} />
      </div>
      <span className={styles.text}>{leftValue}</span>
    </div>
    <div className={styles.contextualTextContainer}>
      <p className={styles.text}>{text}</p>
    </div>
    <div className={styles.statsContainer}>
      <span className={styles.text}>{rightValue}</span>
      <div className={styles.iconContainer}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={"var(--half-time-pulse-stat-icon-colour)"} />
      </div>
    </div>
  </div>
);
