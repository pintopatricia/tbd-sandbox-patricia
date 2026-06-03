import { FunctionComponent, MouseEvent, useCallback, useState } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ShowMore } from "@ppb/the-wall-web/components/bricks/ShowMore/ShowMore";

import { DetailedSummaryGroups } from "../../../MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.types";
import { DetailedSummary } from "../../../MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.web";
import styles from "./CashBalances.web.css";
import {
  CashBalancesSimpleView,
  CashBalancesSimpleViewWallets,
} from "../CashBalancesSimpleView/CashBalancesSimpleView.web";

export type CashBalancesEyeIconClick = (event: MouseEvent) => void;

export type CashBalancesToggleSimpleDetailedViewClick = (toggleOn: boolean) => void;

export type CashBalancesViewModel = {
  onEyeIconClick: CashBalancesEyeIconClick;
  onToggleSimpleDetailedViewClick?: CashBalancesToggleSimpleDetailedViewClick;
} & CashBalancesProps;

export type CashBalancesI18N = {
  cashBalancesTitleLabel: string;
  hiddenLabel: string;
  showMoreLabel: string;
  showLessLabel: string;
};

type CashBalancesProps = {
  i18n: CashBalancesI18N;
  showBalances: boolean;
  simpleViewBalances: CashBalancesSimpleViewWallets[];
  detailedViewBalance: DetailedSummaryGroups[];
  balanceToggle: boolean;
};

export const CashBalances: FunctionComponent<CashBalancesViewModel> = ({
  i18n,
  showBalances = true,
  simpleViewBalances,
  detailedViewBalance,
  balanceToggle,
  onEyeIconClick,
  onToggleSimpleDetailedViewClick = () => null,
}) => {
  const [isCashBalanceDetailedVisible, setIsCashBalanceDetailedVisible] = useState(false);

  const toggleCashBalanceDetailedView = useCallback(() => {
    setIsCashBalanceDetailedVisible(!isCashBalanceDetailedVisible);
    onToggleSimpleDetailedViewClick(isCashBalanceDetailedVisible);
  }, [isCashBalanceDetailedVisible, onToggleSimpleDetailedViewClick]);

  const toggleText = isCashBalanceDetailedVisible ? i18n.showLessLabel : i18n.showMoreLabel;

  return (
    <div className={styles.cashBalances}>
      <div className={styles.title}>
        <span id="balanceToggle">{i18n.cashBalancesTitleLabel}</span>
        {balanceToggle && (
          <button type="button" aria-labelledby="balanceToggle" className={styles.eyeIcon} onClick={onEyeIconClick}>
            {showBalances ? <GenericIcon name={SystemIconName.SHOW} /> : <GenericIcon name={SystemIconName.HIDE} />}
          </button>
        )}
      </div>

      <div className={styles.content}>
        <CashBalancesSimpleView
          balances={simpleViewBalances}
          hiddenLabel={i18n.hiddenLabel}
          showBalances={showBalances}
        />

        {showBalances && isCashBalanceDetailedVisible && (
          <DetailedSummary details={detailedViewBalance} showHorizontalRule={true} />
        )}

        {showBalances && (
          <ShowMore text={toggleText} opened={isCashBalanceDetailedVisible} onClick={toggleCashBalanceDetailedView} />
        )}
      </div>
    </div>
  );
};
