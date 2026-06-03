import type { FunctionComponent } from "react";
import { useCallback, useContext } from "react";
import { View } from "react-native";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Divider } from "@ppb/the-wall-native";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.native";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import ConnectedPreview from "../Preview";
import { MULTI_LINES_MULTIPLES, MULTIPLE } from "./MultiLinesMultiples.native.selectors";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { Preview } from "../Preview/Preview.native";

import styles from "./MultiLinesMultiples.native.styles";
import type { ComponentProps } from "./props";

const JurisdictionalConnectedPreview = withJurisdiction(ConnectedPreview, {
  jurisdictions: [Jurisdiction.ITALY],
});

export const MultiLinesMultiples: FunctionComponent<ComponentProps> = ({
  multiples,
  shouldFocusStakeField,
  shouldRenderBetLegs = false,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly={isBetConfirmationStep} />,
    [isBetConfirmationStep],
  );

  return (
    <View {...getTestProps(MULTI_LINES_MULTIPLES, false)} style={styles.container}>
      {shouldRenderBetLegs && <ConnectedBetLegs component={BetLegs} renderLeg={selection} hasIcon />}
      {multiples.map((multiple, index) => (
        <View key={multiple.id} {...getTestProps(MULTIPLE, false)}>
          <Divider />
          <View style={styles.controls}>
            <ConnectedBetControls
              component={BetControls}
              combinationId={multiple.id}
              shouldFocusStakeField={shouldFocusStakeField && !index}
            />
          </View>
          <JurisdictionalConnectedPreview id={multiple.id} component={Preview} />
        </View>
      ))}
    </View>
  );
};
