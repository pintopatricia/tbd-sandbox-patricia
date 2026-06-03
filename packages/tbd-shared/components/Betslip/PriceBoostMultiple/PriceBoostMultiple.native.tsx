import type { FunctionComponent } from "react";
import { useCallback } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";

import styles from "./PriceBoostMultiple.native.styles";
import type { ComponentProps } from "./props";
import { ConnectedBetLegs } from "../BetLegs";
import { ConnectedSelection } from "../Selection";
import { PRICE_BOOST_MULTIPLE } from "./PriceBoostMultiple.native.selectors";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { Selection } from "../Selection/Selection.native";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";

export const PriceBoostMultiple: FunctionComponent<ComponentProps> = ({
  id,
  legIds,
  title,
  betControlsExperimentVariant,
  dispatchRemove,
  shouldFocusStakeField,
}) => {
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly />,
    [],
  );
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const onRemove = useCallback(() => {
    dispatchRemove(legIds);
  }, [legIds, dispatchRemove]);

  const betControls = (
    <ConnectedBetControls
      component={BetControls}
      title={title}
      combinationId={id}
      shouldFocusStakeField={shouldFocusStakeField}
    />
  );

  return (
    <View {...getTestProps(PRICE_BOOST_MULTIPLE, false)} style={styles.container}>
      {betControlsOnTop && betControls}
      <View style={[styles.header, betControlsOnTop && styles.headerExperiment]}>
        <View style={styles.headerIcon}>
          <GenericIcon
            name={ValueIconName.ODDBOOST}
            preserveAspectRatio="preserveAspectRatio"
            color={tokens.SportsbookPlacePanelIconColour}
          />
        </View>
      </View>
      <ConnectedBetLegs component={BetLegs} legIds={legIds} renderLeg={selection} onRemove={onRemove} hasIcon />
      {!betControlsOnTop && <View style={styles.controls}>{betControls}</View>}
    </View>
  );
};
