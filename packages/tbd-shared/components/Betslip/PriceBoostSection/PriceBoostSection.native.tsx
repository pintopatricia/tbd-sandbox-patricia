import type { FunctionComponent } from "react";
import { useContext } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { PriceBoostMultiple } from "../PriceBoostMultiple/PriceBoostMultiple.native";
import ConnectedPriceBoostMultiple from "../PriceBoostMultiple";
import { PriceBoostMultipleFailure } from "../PriceBoostMultipleFailure/PriceBoostMultipleFailure.native";
import ConnectedPriceBoostMultipleFailure from "../PriceBoostMultipleFailure";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import styles from "./PriceBoostSection.native.styles";
import type { ComponentProps } from "./props";
import { PRICE_BOOST_SECTION } from "./PriceBoostSection.native.selectors";

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
    <View {...getTestProps(PRICE_BOOST_SECTION, false)} style={styles.container}>
      {failedCombinationGroupIds.map((groupId) => (
        <View key={groupId} style={styles.container}>
          <ConnectedPriceBoostMultipleFailure component={PriceBoostMultipleFailure} id={groupId} />
        </View>
      ))}
      {boostedCombinationIds.map((id, index) => (
        <View key={id} style={styles.container}>
          <ConnectedPriceBoostMultiple
            component={PriceBoostMultiple}
            id={id}
            shouldFocusStakeField={shouldFocusStakeField && !index}
            betControlsExperimentVariant={betControlsExperimentVariant}
          />
        </View>
      ))}
    </View>
  );
};
