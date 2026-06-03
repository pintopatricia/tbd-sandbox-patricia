import { View } from "react-native";
import { Alert, BetSelectionDetails, SelectionsBoard, SelectionsBoardSection } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AlertType, HintType, SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback, useState } from "react";
import ConnectedObbBetControls from "../ObbBetControls";
import { ObbBetControls } from "../ObbBetControls/ObbBetControls.native";
import styles from "./ObbMultiple.native.styles";
import { OBB_MULTIPLE, OBB_MULTIPLE_CONTROLS, OBB_MULTIPLE_SELECTIONS_DETAILS } from "./ObbMultiple.native.selectors";
import { ComponentProps } from "./props";
import { SettlementConditionCard } from "./snowflakes/SettlementConditionCard/SettlementConditionCard.native";
import { ObbMultipleDetails } from "../../../helpers/obb";

export const ObbMultiple: FunctionComponent<ComponentProps> = ({
  i18n,
  selectionsTitle,
  potentialBets,
  legs,
  eventName,
  shouldFocusStakeField,
  hasReturnsLabel,
  hasNotCombinableFailure,
  potentialBetWithStake,
  dispatchRemoveSelectionAction,
  dispatchSliderInteraction,
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

  if (!legs || legs.length === 0) {
    return null;
  }

  return (
    <View style={styles.obbMultiple} {...getTestProps(OBB_MULTIPLE, false)}>
      {hasNotCombinableFailure && (
        <View style={styles.alert}>
          <Alert type={AlertType.Warning} message={i18n.notCombinableAlert} />
        </View>
      )}
      <SelectionsBoard title={selectionsTitle} theme={SelectionsBoardTheme.Blue}>
        <SelectionsBoardSection title={eventName}>
          {legs.map((leg) => (
            <View key={leg.legId} {...getTestProps(OBB_MULTIPLE_SELECTIONS_DETAILS, false)}>
              <BetSelectionDetails
                title={leg.participantsDescription}
                subtitle={leg.outcomeDescription}
                onSelectionRemove={() => handleOnSelectionRemove(leg.legId)}
                hintType={hasNotCombinableFailure ? HintType.Warning : undefined}
                hintMessage={hasNotCombinableFailure ? i18n.notCombinableMessage : undefined}
              />
            </View>
          ))}
        </SelectionsBoardSection>
      </SelectionsBoard>
      {potentialBets.length > 1 && (
        <SettlementConditionCard
          potentialBets={potentialBets}
          onChange={handleSliderPositionChange}
          defaultSliderStep={defaultSliderStep}
        />
      )}
      <View {...getTestProps(OBB_MULTIPLE_CONTROLS, false)}>
        <ConnectedObbBetControls
          component={ObbBetControls}
          potentialBetId={selectedPotentialBet.id}
          shouldFocusStakeField={shouldFocusStakeField}
          hasReturnsLabel={hasReturnsLabel}
        />
      </View>
    </View>
  );
};
