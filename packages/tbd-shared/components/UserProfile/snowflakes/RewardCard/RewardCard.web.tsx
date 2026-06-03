import type { JSX } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { RewardBenefit } from "../RewardBenefit/RewardBenefit.web";
import styles from "./RewardCard.web.module.css";

export type RewardCardProps = {
  icon: JSX.Element;
  title: string;
  benefits: string[];
};

export const RewardCard = ({ icon, title, benefits }: RewardCardProps): JSX.Element => (
  <div className={styles.box}>
    <div className={styles.titleWrapper}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h5 className={`typography-h280 ${styles.title}`}>{title}</h5>
    </div>
    <div>
      {benefits.map((benefit, key) => (
        <RewardBenefit key={key} title={benefit} icon={<GenericIcon name={SystemIconName.CHECK} />} />
      ))}
    </div>
  </div>
);
