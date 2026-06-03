import type { FunctionComponent } from "react";
import { useContext } from "react";

import { PriceBoostMultiple } from "../PriceBoostMultiple/PriceBoostMultiple.web";
import ConnectedPriceBoostMultiple from "../PriceBoostMultiple";
import { PriceBoostMultipleFailure } from "../PriceBoostMultipleFailure/PriceBoostMultipleFailure.web";
import ConnectedPriceBoostMultipleFailure from "../PriceBoostMultipleFailure";

import styles from "./PriceBoostSection.web.css";
import type { ComponentProps } from "./props";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

export const PriceBoostSection: FunctionComponent<ComponentProps> = ({
  boostedCombinationIds,
  failedCombinationGroupIds,
  shouldFocusStakeField,
  betControlsExperimentVariant,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  if (isBetConfirmationStep) {
    return <></>;
  }

  return (
    <div className={styles.priceBoostMultisCard}>
      {failedCombinationGroupIds.map((groupId) => (
        <div key={groupId} className={styles.priceBoostMultis}>
          <ConnectedPriceBoostMultipleFailure component={PriceBoostMultipleFailure} id={groupId} />
        </div>
      ))}
      {boostedCombinationIds.map((id, index) => (
        <div key={id} className={styles.priceBoostMultis}>
          <ConnectedPriceBoostMultiple
            component={PriceBoostMultiple}
            id={id}
            shouldFocusStakeField={shouldFocusStakeField && !index}
            betControlsExperimentVariant={betControlsExperimentVariant}
          />
        </div>
      ))}
    </div>
  );
};
