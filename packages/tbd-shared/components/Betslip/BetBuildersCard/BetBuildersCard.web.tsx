import { FunctionComponent } from "react";

import { ConnectedBetBuilderCombination, ConnectedBetBuilderFailure } from "../BetBuilder";
import { BetBuilder } from "../BetBuilder/BetBuilder.web";

import { ComponentProps } from "./props";
import styles from "./BetBuildersCard.web.css";

export const BetBuildersCard: FunctionComponent<ComponentProps> = ({
  combinationIds,
  failedCombinationGroups,
  shouldFocusStakeField,
  betControlsExperimentVariant,
}) => (
  <div className={styles.betBuildersCard}>
    {failedCombinationGroups.map((failedGroup) => (
      <div key={failedGroup} className={styles.betBuilder}>
        <ConnectedBetBuilderFailure
          component={BetBuilder}
          combinationGroup={failedGroup}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      </div>
    ))}
    {combinationIds.map((id, index) => (
      <div key={id} className={styles.betBuilder}>
        <ConnectedBetBuilderCombination
          component={BetBuilder}
          id={id}
          shouldFocusStakeField={shouldFocusStakeField && !index}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      </div>
    ))}
  </div>
);
