import { FunctionComponent, MouseEvent } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import styles from "./UserProfileHeader.web.css";

export type UserProfileHeaderI18N = {
  title: string;
  freeBetsLabel: string;
};

export type UserProfileHeaderOnCloseClick = () => void;

export type UserProfileHeaderBackClick = (event: MouseEvent) => void;

export type UserProfileHeaderProps = {
  showBack: boolean;
  accountBalance?: string;
  freeBetsBalance?: string;
  onCloseClick: UserProfileHeaderOnCloseClick;
  onBackClick: UserProfileHeaderBackClick;
  showBalances?: boolean;
} & UserProfileHeaderI18N;

export const UserProfileHeader: FunctionComponent<UserProfileHeaderProps> = ({
  showBack,
  accountBalance,
  freeBetsBalance,
  freeBetsLabel,
  title,
  onCloseClick,
  onBackClick,
  showBalances = true,
}) => {
  const balanceLabel = accountBalance || "NA";
  const freeBetsBalanceLabel = `${freeBetsLabel}: ${freeBetsBalance}`;

  return (
    <header className={styles.header}>
      {showBack && (
        <button onClick={onBackClick} className={styles.backIconContainer}>
          <GenericIcon name={SystemIconName.CHEVRON_LEFT} />
        </button>
      )}
      <h5 className={styles.title}>{title}</h5>
      <div className={styles.balanceContainer}>
        {showBalances && <span className={styles.balanceLabel}>{balanceLabel}</span>}
        {showBalances && freeBetsBalance && <span className={styles.freeBetsBalanceLabel}>{freeBetsBalanceLabel}</span>}
      </div>
      <button onClick={onCloseClick} className={styles.closeIconContainer}>
        <GenericIcon name={SystemIconName.CLOSE} />
      </button>
    </header>
  );
};
