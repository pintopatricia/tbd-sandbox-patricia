import { createSelectorCreator, defaultMemoize, Selector } from "reselect";
import { OddsMovementState } from "./Betslip.types";

const isOddsMovementStateEqual = (previousState: OddsMovementState, currentState: OddsMovementState): boolean => {
  const prevValues = Object.values(previousState);
  const currValues = Object.values(currentState);

  if (prevValues.length !== currValues.length) {
    return false;
  }

  return prevValues.every((oddsMovementValue, index) => {
    const currValue = currValues[index];
    return (
      oddsMovementValue.id === currValue.id &&
      oddsMovementValue.value === currValue.value &&
      oddsMovementValue.movement === currValue.movement
    );
  });
};

const createOddsMovementSelectorCreator = createSelectorCreator(defaultMemoize, isOddsMovementStateEqual);

export const createOddsMovementSelector = (): Selector<OddsMovementState, OddsMovementState> =>
  createOddsMovementSelectorCreator(
    (oddsMovementState: OddsMovementState) => oddsMovementState,
    (oddsMovementState: OddsMovementState) => oddsMovementState,
  );
