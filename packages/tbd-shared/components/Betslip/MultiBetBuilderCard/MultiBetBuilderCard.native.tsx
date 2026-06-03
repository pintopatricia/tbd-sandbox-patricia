import { useContext } from "react";
import type { FunctionComponent } from "react";
import { View } from "react-native";

import { AlertType, SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { Alert, SelectionsBoard, SelectionsBoardSection } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";

import { ConnectedSelectionMultiBetBuilder } from "../Selection";
import { Selection } from "../Selection/Selection.native";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

import { MULTI_BET_BUILDER_CARD } from "./MultiBetBuilderCard.native.selectors";
import styles from "./MultiBetBuilderCard.native.styles";
import type { ComponentProps } from "./props";

export const MultiBetBuilderCard: FunctionComponent<ComponentProps> = ({
  id,
  title,
  groups,
  i18n,
  betControlsExperimentVariant,
  isNotificationVisible,
  shouldFocusStakeField,
  dispatchBetslipBetBuilderMultisDismissNotification,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const betControls = (
    <ConnectedBetControls component={BetControls} combinationId={id} shouldFocusStakeField={shouldFocusStakeField} />
  );

  if (!id) {
    return null;
  }

  return (
    <View {...getTestProps(MULTI_BET_BUILDER_CARD, false)} style={styles.container}>
      {betControlsOnTop && betControls}
      {isNotificationVisible && (
        <Alert
          type={AlertType.Info}
          message={i18n.notification}
          onClose={dispatchBetslipBetBuilderMultisDismissNotification}
          showCloseIcon={true}
        />
      )}
      <SelectionsBoard title={title} theme={SelectionsBoardTheme.Blue}>
        {Object.values(groups).map(({ legIds, title: eventTitle, urn }) => (
          <SelectionsBoardSection key={urn} title={eventTitle}>
            {legIds.map((legId) => (
              <ConnectedSelectionMultiBetBuilder
                key={legId}
                component={Selection}
                id={legId}
                isReadOnly={isBetConfirmationStep}
              />
            ))}
          </SelectionsBoardSection>
        ))}
      </SelectionsBoard>
      {!betControlsOnTop && betControls}
    </View>
  );
};
