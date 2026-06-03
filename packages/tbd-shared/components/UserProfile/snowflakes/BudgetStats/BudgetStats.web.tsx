import { FunctionComponent } from "react";
import { ProgressBarVariant, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { StatusLabel } from "@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel";
import styles from "./BudgetStats.web.css";

type BudgetStatsViewModel = {
  amount: number;
  remain: number;
  currencyValue: string;
  remainingText: string;
  statusLabel: string;
};

const LEGACY_COLORS = {
  Transparent: "transparent",
};

export const BudgetStats: FunctionComponent<BudgetStatsViewModel> = ({
  amount,
  remain,
  currencyValue,
  remainingText,
  statusLabel,
}) => {
  let amountWidths;
  let remainWidths;

  if (remain >= amount) {
    remainWidths = 0;
    amountWidths = 100;
  } else if (remain === 0) {
    remainWidths = 100;
    amountWidths = 0;
  } else {
    remainWidths = ((amount - remain) * 100) / amount;
    amountWidths = (remain * 100) / amount;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statusContent}>
        <p className={styles.statusText}>
          <span className={styles.statusCurrencyValue}>{currencyValue}</span>
          <span className={styles.statusRemainingText}>{remainingText}</span>
        </p>
        <StatusLabel
          text={statusLabel}
          iconName={SystemIconName.SAFER_GAMBLING}
          statusLabelSize={StatusLabelSizeType.SMALL}
          statusLabelType={StatusLabelType.BRANDED}
        />
      </div>
      <ProgressBar
        home={remainWidths}
        away={amountWidths}
        homeColor={LEGACY_COLORS.Transparent}
        awayColor={"var(--neutrals-background-elevation5)"}
        variant={ProgressBarVariant.BUDGET_STATS}
      />
    </div>
  );
};
