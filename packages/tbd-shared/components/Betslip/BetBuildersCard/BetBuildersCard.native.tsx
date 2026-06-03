import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import styles from "./BetBuildersCard.native.styles";
import { BET_BUILDERS_CARD, BET_BUILDER_ITEM } from "./BetBuildersCard.native.selectors";
import { ConnectedBetBuilderCombination, ConnectedBetBuilderFailure } from "../BetBuilder";
import { BetBuilder } from "../BetBuilder/BetBuilder.native";

export const BetBuildersCard: FunctionComponent<ComponentProps> = ({
  combinationIds,
  failedCombinationGroups,
  shouldFocusStakeField,
  betControlsExperimentVariant,
}) => (
  <View {...getTestProps(BET_BUILDERS_CARD, false)} style={styles.betBuildersCard}>
    {failedCombinationGroups.map((failedGroup) => (
      <View
        key={failedGroup}
        style={combinationIds.length > 0 ? styles.betBuilderNotLastChild : null}
        {...getTestProps(BET_BUILDER_ITEM, false)}
      >
        <ConnectedBetBuilderFailure
          component={BetBuilder}
          combinationGroup={failedGroup}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      </View>
    ))}
    {combinationIds.map((id, index) => (
      <View
        key={id}
        style={index < combinationIds.length - 1 ? styles.betBuilderNotLastChild : null}
        {...getTestProps(BET_BUILDER_ITEM, false)}
      >
        <ConnectedBetBuilderCombination
          component={BetBuilder}
          id={id}
          shouldFocusStakeField={shouldFocusStakeField && !index}
          betControlsExperimentVariant={betControlsExperimentVariant}
        />
      </View>
    ))}
  </View>
);
