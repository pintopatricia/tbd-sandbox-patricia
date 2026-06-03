import {
  SET_FAVOURITE_MARKET_MUTATION_FAILURE,
  SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
  SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
  UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE,
  type FavouriteMarketsTooltipCloseAction,
  type SetFavouriteMarketMutationFailureAction,
  type SetFavouriteMarketMutationInProgressAction,
  type SetFavouriteMarketMutationSuccessAction,
} from "../../actions/favourite-markets";

import type { FavouriteMarkets } from "./FavouriteMarkets.types";

type ActionTypes =
  | FavouriteMarketsTooltipCloseAction
  | SetFavouriteMarketMutationInProgressAction
  | SetFavouriteMarketMutationFailureAction
  | SetFavouriteMarketMutationSuccessAction;

const INITIAL_STATE: FavouriteMarkets = {
  tooltipClosedCounter: 0,
  isTooltipClosed: false,
  isMutationInProgress: false,
};

export default (currentState: FavouriteMarkets, action: ActionTypes): FavouriteMarkets => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE:
      return {
        ...state,
        tooltipClosedCounter: state.tooltipClosedCounter + 1,
        isTooltipClosed: true,
      };
    case SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS:
      return {
        ...state,
        isMutationInProgress: true,
      };
    case SET_FAVOURITE_MARKET_MUTATION_SUCCESS:
    case SET_FAVOURITE_MARKET_MUTATION_FAILURE:
      return {
        ...state,
        isMutationInProgress: false,
      };
    default:
      return state;
  }
};
