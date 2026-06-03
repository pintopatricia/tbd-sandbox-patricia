import type { FunctionComponent } from "react";

import { BetSummary } from "@ppb/the-wall-web/components/rooms/BetSummary/BetSummary";
import { BetBuilderSummaryViewModel } from "./BetBuilderSummary.types";
import styles from "./BetBuilderSummary.web.css";
import { BetSelections } from "../BetSelections/BetSelections.web";
import { SettlementConditionCard } from "../../../../../ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.web";

export const BetBuilderSummary: FunctionComponent<BetBuilderSummaryViewModel> = ({
  bet,
  labels,
  hasShownReceiptIds,
}) => (
  <article className={styles.bet}>
    <section className={styles.description}>
      <h3 className={styles.title}>{bet.title}</h3>
    </section>
    <div className={styles.selections}>
      <BetSelections title={bet.selectionsLabel} selections={bet.selections} />
    </div>
    {bet.selectionsToWin && (
      <SettlementConditionCard
        readOnlyProps={{
          selectionsToWin: bet.selectionsToWin,
          totalSelections: bet.selections.length,
        }}
      />
    )}
    <div className={styles.summary}>
      <BetSummary
        title={bet.type}
        odds={bet.odds}
        previousOdds={bet.previousOdds}
        previousValue={bet.previousValue}
        stake={bet.stake}
        returns={bet.returns}
        hasAccaInsurance={false}
        hasBonusUsed={bet.hasBonusUsed}
        freeBetsLabel={bet.freeBetsLabel}
        generosityAlertMessage={bet.generosityAlertMessage}
        generosityIconName={bet.generosityIconName}
        i18n={{
          oddsLabel: labels.odds,
          returnsLabel: labels.returns,
          stakeLabel: labels.stake,
          eachWayLabel: "",
          linesLabel: "",
          accaInsuranceLabel: "",
        }}
        hasShownReceiptIds={hasShownReceiptIds}
        hasMyOddsBoost={bet.hasMyOddsBoost}
      />
    </div>
  </article>
);
