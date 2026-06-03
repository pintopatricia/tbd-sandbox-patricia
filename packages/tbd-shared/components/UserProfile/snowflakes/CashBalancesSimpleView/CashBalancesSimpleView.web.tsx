import type { JSX } from "react";
import { FunctionComponent } from "react";
import styles from "./CashBalancesSimpleView.web.css";

export type CashBalancesSimpleViewWallets = {
  title: string;
  subTitle: string;
  amount: string;
};

type CashBalancesSimpleViewProps = {
  hiddenLabel: string;
  showBalances: boolean;
  balances: CashBalancesSimpleViewWallets[];
};

export const CashBalancesSimpleView: FunctionComponent<CashBalancesSimpleViewProps> = ({
  hiddenLabel,
  showBalances,
  balances,
}) => {
  function renderSubtitle(subtitle: string): JSX.Element {
    return <div>{subtitle}</div>;
  }

  return (
    <div className={styles.cashBalanceSimpleViewContainer}>
      {balances.map(({ title, subTitle, amount }) => (
        <div key={title}>
          <div className={styles.title}>
            {title}
            {subTitle && renderSubtitle(subTitle)}
          </div>
          {showBalances ? (
            <div className={styles.amount}>{amount}</div>
          ) : (
            <div className={styles.hiddenContent}>{hiddenLabel}</div>
          )}
        </div>
      ))}
    </div>
  );
};
