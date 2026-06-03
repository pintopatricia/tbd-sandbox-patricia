import { BetDetails } from "@ppb/the-wall-web";
import { BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback, useContext } from "react";

import { ComponentProps } from "./props";
import ConnectedObbBetControls from "../ObbBetControls";
import { ObbBetControls } from "../ObbBetControls/ObbBetControls.web";
import styles from "./ObbSingle.web.css";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

export const ObbSingle: FunctionComponent<ComponentProps> = ({
  potentialBetId,
  legId,
  outcomeDescription,
  shouldFocusStakeField,
  hasAvailabilityHints,
  hasReturnsLabel,
  dispatchRemoveSelectionAction,
  participant,
  isPlacing,
}) => {
  const handleOnSelectionRemove = useCallback(() => {
    dispatchRemoveSelectionAction(legId);
  }, [dispatchRemoveSelectionAction, legId]);

  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  return (
    <article className={styles.obbSingle}>
      <BetDetails
        displayAllSubtitleText={true}
        title={participant}
        subtitle={outcomeDescription}
        action={!isBetConfirmationStep ? BetDetailsAction.Remove : BetDetailsAction.None}
        onAction={!isBetConfirmationStep ? handleOnSelectionRemove : undefined}
        color={BetDetailsColor.Teal}
        isPlacing={isPlacing}
      />
      <section>
        <ConnectedObbBetControls
          component={ObbBetControls}
          potentialBetId={potentialBetId}
          shouldFocusStakeField={shouldFocusStakeField}
          hasAvailabilityHints={hasAvailabilityHints}
          hasReturnsLabel={hasReturnsLabel}
        />
      </section>
    </article>
  );
};
