import { FunctionComponent } from "react";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import styles from "./RewardsStats.web.module.css";

export type RewardsStatsProps = {
  totalBets: number;
  currentBets: number;
  rewardsTitle: string;
};

export const RewardsStats: FunctionComponent<RewardsStatsProps> = ({ totalBets, currentBets, rewardsTitle }) => {
  const home = Math.min(currentBets, totalBets);
  const away = currentBets >= totalBets ? 0 : totalBets - currentBets;
  return (
    <div className={`${styles.rewardsBar} typography-h158`}>
      <div className={styles.monthRewards}>
        <h6 className="typography-h158">{rewardsTitle}</h6>
        <span>
          {home}/{totalBets}
        </span>
      </div>
      <ProgressBar home={home} away={away} />
    </div>
  );
};
