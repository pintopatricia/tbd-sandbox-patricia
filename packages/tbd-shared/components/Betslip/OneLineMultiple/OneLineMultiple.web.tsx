import { useCallback, useContext } from "react";
import type { FunctionComponent } from "react";
import { BetslipNotifications } from "@ppb/the-wall-web";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import styles from "./OneLineMultiple.web.css";
import classnames from "classnames";
import type { ComponentProps } from "./props";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";

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

  const notificationsListContainer = classnames(styles.notificationsListContainer, {
    [styles.notificationsListContainerExperiment]: betControlsOnTop,
  });

  const betControls = currentMultiple ? (
    <ConnectedBetControls
      component={BetControls}
      combinationId={currentMultiple.id}
      title={currentMultiple.text}
      shouldFocusStakeField={shouldFocusStakeField}
    />
  ) : null;

  return (
    <div className={styles.container}>
      {betControlsOnTop && betControls}
      {multiplesNotifications.length ? (
        <div className={notificationsListContainer}>
          <BetslipNotifications alerts={multiplesNotifications} />
        </div>
      ) : null}
      <ConnectedBetLegs component={BetLegs} renderLeg={selection} hasIcon />
      {!betControlsOnTop && <section className={styles.controls}>{betControls}</section>}
    </div>
  );
};
