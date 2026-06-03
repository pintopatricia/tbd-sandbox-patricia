import { BettingObbUpdateOddsMovementAction, BettingUpdateLike } from "../../actions/betting";
import { BetslipState, OddsMovementDirection, OddsMovementState } from "./Betslip.types";

export const sbkOddsMovementReducer = (state: BetslipState, action: BettingUpdateLike): BetslipState => {
  const { sportsbookOddsMovement } = state;
  const { payload } = action;
  const { combinations } = payload.state;

  // remove
  const cleanOddsMovement = Object.keys(sportsbookOddsMovement).reduce<OddsMovementState>((newState, id) => {
    if (combinations[id]) {
      return {
        ...newState,
        [id]: sportsbookOddsMovement[id],
      };
    }
    return newState;
  }, {});

  // add/update
  const oddsMovementState = Object.values(combinations).reduce<OddsMovementState>((newState, currentCombination) => {
    const value = currentCombination.displayOdds?.decimalOdds ? currentCombination.displayOdds?.decimalOdds : null;

    let oddsTracking = newState[currentCombination.id] || { id: currentCombination.id, value, movement: null };

    if (value && oddsTracking.value && value !== oddsTracking.value) {
      const movement: OddsMovementDirection = value > oddsTracking.value ? "UP" : "DOWN";
      oddsTracking = { ...oddsTracking, value, movement };
    }

    return {
      ...newState,
      [oddsTracking.id]: oddsTracking,
    };
  }, cleanOddsMovement);

  return {
    ...state,
    sportsbookOddsMovement: oddsMovementState,
  };
};

export const obbOddsMovementReducer = (
  state: BetslipState,
  action: BettingObbUpdateOddsMovementAction,
): BetslipState => {
  const { obbOddsMovement } = state;
  const { payload } = action;
  const { potentialBets } = payload.state;

  // remove
  const cleanOddsMovement = Object.keys(obbOddsMovement).reduce<OddsMovementState>((newState, id) => {
    if (potentialBets[id]) {
      return {
        ...newState,
        [id]: obbOddsMovement[id],
      };
    }
    return newState;
  }, {});

  // add/update
  const oddsMovementState = Object.values(potentialBets).reduce<OddsMovementState>((newState, currentBet) => {
    if (!currentBet.quote) {
      return newState;
    }

    const { decimal: value } = currentBet.quote.price;

    let oddsTracking = newState[currentBet.id] || { id: currentBet.id, value, movement: null };

    if (value && oddsTracking.value && value !== oddsTracking.value) {
      const movement: OddsMovementDirection = value > oddsTracking.value ? "UP" : "DOWN";
      oddsTracking = { ...oddsTracking, value, movement };
    }

    return {
      ...newState,
      [oddsTracking.id]: oddsTracking,
    };
  }, cleanOddsMovement);

  return {
    ...state,
    obbOddsMovement: oddsMovementState,
  };
};
