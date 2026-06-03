import { buildBetPlacedFailEvent, BetPlacedFailEvent } from "tagging-library";
import { PlaceExchangeBetFailureAction, UpdateExchangeBetFailureAction } from "../../actions/betslip";
import { ApplicationState } from "../../state";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import { getSbkDisplayTransactionalError } from "../../helpers/sportsbook-betting";
import { BetDirection } from "../tagging-resolvers/AnalyticsConstants";
import { BettingObbPlaceFailedUpdateAction, BettingSportsbookPlaceFailedUpdateAction } from "../../actions/betting";
import { getObbFailureError } from "../../helpers/obb-betting";

export const getUpdateBetFailureEvent = (
  action: UpdateExchangeBetFailureAction,
  state: ApplicationState,
): BetPlacedFailEvent | null => {
  const { errorCode } = action.payload.error;

  const betslipContext = getBetslipExchangeContext(state);
  const error = errorCode.toLowerCase();

  if (!betslipContext) {
    return null;
  }

  return buildBetPlacedFailEvent({
    betDirection: betslipContext.side,
    error,
  });
};

export const getExchangeFailedPlaceBetEvent = (action: PlaceExchangeBetFailureAction): BetPlacedFailEvent | null => {
  const { error, side } = action.payload;

  return buildBetPlacedFailEvent({
    betDirection: side,
    error: error.errorCode,
  });
};

export const getSportsbookFailedPlaceBetEvent = (
  action: BettingSportsbookPlaceFailedUpdateAction,
): BetPlacedFailEvent | null => {
  const err = getSbkDisplayTransactionalError(action.payload.state.failures.place);
  if (!err) {
    return null;
  }

  return buildBetPlacedFailEvent({ betDirection: BetDirection.Back, error: err });
};

export const getObbFailedPlaceBetEvent = (action: BettingObbPlaceFailedUpdateAction): BetPlacedFailEvent | null => {
  const err = getObbFailureError(action.payload.state);
  if (!err) {
    return null;
  }

  return buildBetPlacedFailEvent({ betDirection: BetDirection.Back, error: err });
};
