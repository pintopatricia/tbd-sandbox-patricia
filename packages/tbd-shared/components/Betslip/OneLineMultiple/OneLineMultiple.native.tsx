import { useCallback, useContext } from "react";
import type { FunctionComponent } from "react";
import { View } from "react-native";

import { Alerts } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import styles from "./OneLineMultiple.native.styles";
import type { ComponentProps } from "./props";
import { ConnectedBetLegs } from "../BetLegs";
import { ConnectedSelection } from "../Selection";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ONE_LINE_MULTIPLE } from "./OneLineMultiple.native.selectors";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { Selection } from "../Selection/Selection.native";

export const OneLineMultiple: FunctionComponent<ComponentProps> = ({
  multiplesNotifications = [],
  currentMultiple,
  betControlsExperimentVariant,
  shouldFocusStakeField,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly={isBetConfirmationStep} />,
    [isBetConfirmationStep],
  );
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const betControls = currentMultiple ? (
    <ConnectedBetControls
      component={BetControls}
      combinationId={currentMultiple.id}
      title={currentMultiple.text}
      shouldFocusStakeField={shouldFocusStakeField}
    />
  ) : null;

  return (
    <View {...getTestProps(ONE_LINE_MULTIPLE, false)} style={styles.container}>
      {betControlsOnTop && <View style={styles.controls}>{betControls}</View>}
      {multiplesNotifications?.length ? (
        <View
          style={[styles.notificationsListContainer, betControlsOnTop && styles.notificationsListContainerExperiment]}
        >
          <Alerts alerts={multiplesNotifications} />
        </View>
      ) : null}
      <ConnectedBetLegs component={BetLegs} renderLeg={selection} hasIcon />
      {!betControlsOnTop && <View style={styles.controls}>{betControls}</View>}
    </View>
  );
};
