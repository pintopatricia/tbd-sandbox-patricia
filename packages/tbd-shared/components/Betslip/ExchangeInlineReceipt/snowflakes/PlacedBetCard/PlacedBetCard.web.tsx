import { FunctionComponent } from "react";

import { Alert, BetSegments, FreeBets } from "@ppb/the-wall-web";

import { PlacedBetCardViewModel } from "./PlacedBetCard.types";
import styles from "./PlacedBetCard.web.css";
import { AlertType } from "@ppb/the-wall-common/types";

const typeMap: Record<string, AlertType> = {
  MATCHED: AlertType.Success,
  UNMATCHED: AlertType.Error,
};

export const PlacedBetCard: FunctionComponent<PlacedBetCardViewModel> = ({
  price,
  stake,
  liability,
  profit,
  type,
  bonus,
  hasFreeBets,
  labels,
  children,
}) => {
  return (
    <section className={styles.card}>
      {!!labels.name && (
        <div className={styles.header}>
          <Alert type={typeMap[type]} message={labels.name} />
        </div>
      )}
      <div className={styles.results}>
        <BetSegments
          leftLabel={labels.price}
          leftValue={price}
          midLabel={labels.stake}
          midValue={stake}
          midRightLabel={labels.liability}
          midRightValue={liability}
          rightLabel={labels.profit}
          rightValue={profit}
        />
      </div>
      {hasFreeBets && (
        <div className={styles.freeBets}>
          <FreeBets label={bonus} isSelected={hasFreeBets} isReadOnly={true} />
        </div>
      )}
      {children}
    </section>
  );
};
