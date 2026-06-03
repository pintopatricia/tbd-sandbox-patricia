import { BetSelectionDetails, Alert, SelectionsBoard, SelectionsBoardSection } from "@ppb/the-wall-web";
import { AlertType, HintType, SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";

import { ComponentProps, Leg } from "./props";
import ConnectedObbBetControls from "../ObbBetControls";
import { ObbBetControls } from "../ObbBetControls/ObbBetControls.web";
import styles from "./ObbMultiple.web.css";
import { SettlementConditionCard } from "./snowflakes/SettlementConditionCard/SettlementConditionCard.web";
import { ObbMultipleDetails } from "../../../helpers/obb";

export const ObbMultiple: FunctionComponent<ComponentProps> = ({
  i18n,
  selectionsTitle,
  potentialBets,
  legs,
  eventName,
  shouldFocusStakeField,
  hasAvailabilityHints,
  hasReturnsLabel,
  hasNotCombinableFailure,
  potentialBetWithStake,
  dispatchRemoveSelectionAction,
  dispatchSliderInteraction,
  dispatchSliderDisplayed,
}) => {
  const defaultPotentialBet = potentialBetWithStake ? potentialBetWithStake : potentialBets[potentialBets.length - 1];

  const [selectedPotentialBet, setSelectedPotentialBet] = useState<ObbMultipleDetails>(defaultPotentialBet);

  const [prevPotentialBetIds, setPrevPotentialBetIds] = useState(() => potentialBets.map((bet) => bet.id));

  const currentPotentialBetIds = potentialBets.map((bet) => bet.id);
  const havePotentialBetsChanged =
    prevPotentialBetIds.length !== currentPotentialBetIds.length ||
    prevPotentialBetIds.some((id, index) => id !== currentPotentialBetIds[index]);

  if (havePotentialBetsChanged) {
    setPrevPotentialBetIds(currentPotentialBetIds);
    setSelectedPotentialBet(potentialBets[potentialBets.length - 1]);
  }

  const defaultSliderStep = selectedPotentialBet.x - 1;

  const handleOnSelectionRemove = useCallback(
    (legId: string) => {
      dispatchRemoveSelectionAction(legId);
    },
    [dispatchRemoveSelectionAction],
  );

  const handleSliderPositionChange = useCallback(
    (potentialBetId: string, direction?: "increase" | "decrease", source?: "button" | "selector") => {
      const potentialBet = potentialBets.find((bet) => bet.id === potentialBetId);

      potentialBet && setSelectedPotentialBet(potentialBet);

      if (direction && source) {
        dispatchSliderInteraction(eventName, direction, source);
      }
    },
    [eventName, dispatchSliderInteraction, setSelectedPotentialBet, potentialBets],
  );

  const hasTagTriggeredRef = useRef(false);
  useEffect(() => {
    if (potentialBets.length > 1) {
      if (!hasTagTriggeredRef.current) {
        dispatchSliderDisplayed(eventName);
        hasTagTriggeredRef.current = true;
      }
    } else {
      // Reset the ref when condition was reverted, which means, slider wasn't be rendered.
      hasTagTriggeredRef.current = false;
    }
  }, [potentialBets, eventName, dispatchSliderDisplayed]);

  if (!legs || legs.length === 0) {
    return null;
  }

  return (
    <article className={styles.obbMultiple}>
      {hasNotCombinableFailure && (
        <div className={styles.alert}>
          <Alert type={AlertType.Warning} message={i18n.notCombinableAlert} />
        </div>
      )}
      <SelectionsBoard title={selectionsTitle} theme={SelectionsBoardTheme.Blue}>
        <SelectionsBoardSection title={eventName}>
          {legs.map((leg: Leg) => (
            <div key={leg.legId}>
              <BetSelectionDetails
                title={leg.participantsDescription}
                subtitle={leg.outcomeDescription}
                onSelectionRemove={() => handleOnSelectionRemove(leg.legId)}
                hintType={hasNotCombinableFailure ? HintType.Warning : undefined}
                hintMessage={hasNotCombinableFailure ? i18n.notCombinableMessage : undefined}
              />
            </div>
          ))}
        </SelectionsBoardSection>
      </SelectionsBoard>
      {potentialBets?.length > 1 && (
        <SettlementConditionCard
          potentialBets={potentialBets}
          onChange={handleSliderPositionChange}
          defaultSliderStep={defaultSliderStep}
        />
      )}
      <section>
        <ConnectedObbBetControls
          component={ObbBetControls}
          potentialBetId={selectedPotentialBet.id}
          shouldFocusStakeField={shouldFocusStakeField}
          hasAvailabilityHints={hasAvailabilityHints}
          hasReturnsLabel={hasReturnsLabel}
        />
      </section>
    </article>
  );
};
