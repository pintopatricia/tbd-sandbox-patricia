import { useContext } from "react";
import type { FunctionComponent } from "react";
import { AlertType, SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { Alert, SelectionsBoard, SelectionsBoardSection } from "@ppb/the-wall-web";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ConnectedSelectionMultiBetBuilder } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

import { ComponentProps } from "./props";
import styles from "./MultiBetBuilderCard.web.css";

export const MultiBetBuilderCard: FunctionComponent<ComponentProps> = ({
  id,
  title,
  betControlsExperimentVariant,
  groups,
  i18n,
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
    <div className={styles.multiBetBuilderCard}>
      {betControlsOnTop && betControls}
      {isNotificationVisible && (
        <div className={styles.notificationsListContainer}>
          <Alert
            type={AlertType.Info}
            message={i18n.notification}
            onClose={dispatchBetslipBetBuilderMultisDismissNotification}
            showCloseIcon={true}
          />
        </div>
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
    </div>
  );
};
