/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { FunctionComponent, JSX } from "react";

import { ReactNode } from "react";
import styles from "./Rewards.web.module.css";
import { RewardsStats } from "../RewardStats/RewardsStats.web";

export type RewardsLinkOnClick = () => void;

type Bets = {
  totalBets: number;
  currentBets: number;
};

export type RewardsMonthType = {
  month?: string;
  monthMessage: ReactNode;
  bets?: Bets;
  url?: string;
  target?: string;
};

export type RewardsProps = {
  monthRewards: RewardsMonthType[];
};

export type RewardsViewModel = {
  onClick: RewardsLinkOnClick;
} & RewardsProps;

function renderMonth(monthRewards: RewardsMonthType, rewardsLinkOnClick: RewardsLinkOnClick): JSX.Element {
  const { month, monthMessage, bets, url } = monthRewards;
  const totalBets = bets?.totalBets ?? 0;
  const currentBets = bets?.currentBets ?? 0;
  return (
    <div className={styles.rewardsContainer} onClick={() => url && rewardsLinkOnClick()}>
      {bets && month && <RewardsStats totalBets={totalBets} currentBets={currentBets} rewardsTitle={month} />}
      {!bets && <h6 className={"typography-h158"}>{month}</h6>}
      <div className={styles.rewardsMessageComplete}>
        <div className={`typography-h152 ${styles.rewardsMessageValue}`}>{monthMessage}</div>
      </div>
    </div>
  );
}

export const Rewards: FunctionComponent<RewardsViewModel> = ({ ...rewardsProps }) => {
  const { monthRewards } = rewardsProps;
  const { onClick } = rewardsProps;
  return (
    <div className={styles.rewardsCard}>
      {monthRewards.map((monthRewardsProps, index) => (
        <div key={`${index}`} className={styles.rewardsWrapper}>
          {renderMonth(monthRewardsProps, onClick)}
        </div>
      ))}
    </div>
  );
};
