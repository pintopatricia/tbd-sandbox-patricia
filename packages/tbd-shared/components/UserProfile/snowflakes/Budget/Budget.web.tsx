import { FunctionComponent } from "react";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Link } from "@ppb/the-wall-web/components/bricks/Link/Link";
import { LinkItem } from "@ppb/the-wall-common/types";
import { LinkOnClick } from "@ppb/the-wall-common/types/web";
import { BudgetStats } from "../BudgetStats/BudgetStats.web";
import styles from "./Budget.web.css";

export type BudgetLimit = {
  amount?: number;
  currencyValue: string;
  remain?: number;
  reset?: string;
  title: string;
  linkText: string;
  remainText: string;
  itemLink: LinkItem;
  statusLabel: string;
};

type BudgetViewModel = {
  budgetLimit: BudgetLimit;
  onBudgetLinkClick: LinkOnClick;
};

export const Budget: FunctionComponent<BudgetViewModel> = ({ budgetLimit, onBudgetLinkClick }) => {
  const { amount, linkText, remainText, remain, currencyValue, itemLink, title, reset, statusLabel } = budgetLimit;
  const budgetAmount = amount || 0;
  const remainAmount = remain || 0;

  return (
    <>
      {amount !== undefined && remain !== undefined && reset && (
        <div className={styles.container}>
          <p className={styles.title}>{title}</p>
          <div className={styles.budgetContent}>
            <BudgetStats
              amount={budgetAmount}
              remain={remainAmount}
              currencyValue={currencyValue}
              remainingText={remainText}
              statusLabel={statusLabel}
            />
            <div className={styles.supportingContent}>
              <div className={styles.reset}>{reset}</div>
              <Link onClick={onBudgetLinkClick} item={itemLink}>
                <div className={styles.linkContent}>
                  <span className={styles.linkText}>{linkText}</span>
                  <div className={styles.linkIcon}>
                    <GenericIcon name={SystemIconName.ARROW_SMALL_RIGHT} color="var(--budget-icon-colour)" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
