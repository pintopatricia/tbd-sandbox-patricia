import { FunctionComponent } from "react";
import { MarketRulesSectionProps } from "./MarketRulesSection.types";
import styles from "./MarketRulesSection.web.css";

export const MarketRulesSection: FunctionComponent<MarketRulesSectionProps> = ({ name, children }) => (
  <div className={styles.container}>
    <div className={styles.title}>{name}</div>
    {children}
  </div>
);
