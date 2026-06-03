import { BetslipState, HandicapMovementState } from "./Betslip.types";
import { BettingUpdateLike } from "../../actions/betting";

const getHandicapMovementState = (state: BetslipState, action: BettingUpdateLike) => {
  const { sportsbookHandicapMovement } = state;
  const { payload } = action;
  const { runners } = payload.state;

  const cleanHandicapMovemented = Object.keys(sportsbookHandicapMovement).reduce<HandicapMovementState>(
    (newState, id) => {
      if (runners[id]) {
        return {
          ...newState,
          [id]: sportsbookHandicapMovement[id],
        };
      }
      return newState;
    },
    {},
  );
  const handicapMovementState = Object.values(runners).reduce<HandicapMovementState>((newState, currentRunner) => {
    const value = currentRunner.handicap || 0;

    const runnerId = `${currentRunner.marketId}-${currentRunner.selectionId}`;
    let handicapTracking = newState[runnerId] || { id: runnerId, value };

    if (!Number.isNaN(value) && !Number.isNaN(handicapTracking.value) && value !== handicapTracking.value) {
      handicapTracking = { ...handicapTracking, value, hasHandicapChanged: true };
    }

    return {
      ...newState,
      [handicapTracking.id]: handicapTracking,
    };
  }, cleanHandicapMovemented);

  return handicapMovementState;
};

export default (state: BetslipState, action: BettingUpdateLike): BetslipState => ({
  ...state,
  sportsbookHandicapMovement: getHandicapMovementState(state, action),
});
