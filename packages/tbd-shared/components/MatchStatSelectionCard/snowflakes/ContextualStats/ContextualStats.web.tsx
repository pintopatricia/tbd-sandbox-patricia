import { FunctionComponent } from "react";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ContextualStatsProps } from "./ContextualStats.types";
import styles from "./ContextualStats.web.css";

export const ContextualStats: FunctionComponent<ContextualStatsProps> = ({ text, showIcon = true }) => (
  <div className={styles.contextualStatsContainer}>
    {showIcon && (
      <div className={styles.icon}>
        <GenericIcon name={SupportingContentIconName.MATCH_STATS} color={"var(--half-time-pulse-stat-icon-colour)"} />
      </div>
    )}
    <p className={styles.contextualStatsText}>{text}</p>
  </div>
);
