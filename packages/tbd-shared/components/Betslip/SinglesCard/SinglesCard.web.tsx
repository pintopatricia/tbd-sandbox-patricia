import { FunctionComponent } from "react";

import ConnectedOneLineBet from "../OneLineBet";
import { OneLineBet } from "../OneLineBet/OneLineBet.web";
import ConnectedSingle from "../Single";
import { Single } from "../Single/Single.web";

import { ComponentProps } from "./props";
import styles from "./SinglesCard.web.css";

export const SinglesCard: FunctionComponent<ComponentProps> = ({
  combinations,
  hasAvailabilityHints,
  shouldFocusStakeField = true,
}) => {
  if (!combinations.length) {
    return null;
  }

  return (
    <div className={styles.betslipSinglesCard}>
      {combinations.map(({ combinationId, isOneLineBet }, index) => (
        <div key={combinationId} className={styles.singlesCard}>
          {isOneLineBet ? (
            <ConnectedOneLineBet
              component={OneLineBet}
              id={combinationId}
              shouldFocusStakeField={shouldFocusStakeField && !index}
              hasAvailabilityHints={hasAvailabilityHints}
            />
          ) : (
            <ConnectedSingle
              component={Single}
              id={combinationId}
              shouldFocusStakeField={shouldFocusStakeField && !index}
              hasAvailabilityHints={hasAvailabilityHints}
            />
          )}
        </div>
      ))}
    </div>
  );
};
