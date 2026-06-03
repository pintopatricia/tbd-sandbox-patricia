import { FunctionComponent } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { MatchStatSelectionProps } from "./MatchStatSelection.types";
import styles from "./MatchStatSelection.web.css";
import { ContextualStats } from "../ContextualStats/ContextualStats.web";

export const MatchStatSelection: FunctionComponent<MatchStatSelectionProps> = ({
  title,
  subtitle,
  stats,
  children,
  icon,
}) => (
  <div className={styles.matchStatSelectionCardContainer}>
    <div className={styles.marketDetailsContainer}>
      {icon && (
        <div className={styles.icon}>
          <GenericIcon name={icon} color={"var(--half-time-pulse-market-card-icon-colour)"} />
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subtitle}>{subtitle}</h2>
      </div>
      <div>{children}</div>
    </div>
    {stats && <ContextualStats text={stats} showIcon={true} />}
  </div>
);
