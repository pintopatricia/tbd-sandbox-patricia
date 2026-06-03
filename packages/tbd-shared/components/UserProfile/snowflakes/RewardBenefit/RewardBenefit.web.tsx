import type { FunctionComponent, JSX } from "react";
import styles from "./RewardBenefit.web.module.css";

export type RewardBenefitProps = {
  icon: JSX.Element;
  title: string;
};

export const RewardBenefit: FunctionComponent<RewardBenefitProps> = ({ icon, title }) => (
  <div className={styles.wrapper}>
    <div className={styles.iconWrapper}>{icon}</div>
    <div className={"typography-h152"}>{title}</div>
  </div>
);
