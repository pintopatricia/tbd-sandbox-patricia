import type URN from "../state/layout/URN";

export const DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS = "DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS";

export const UI__FAVOURITE_MARKETS_LIMIT_REACHED = "UI/FAVOURITE_MARKETS_LIMIT_REACHED";
export const UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE = "UI/FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE";
export const UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE = "UI/FAVOURITE_MARKETS_TOGGLE_FAVOURITE";
export const UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE = "UI/FAVOURITE_MARKETS_TOOLTIP_CLOSE";

export const SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS = "SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS";
export const SET_FAVOURITE_MARKET_MUTATION_SUCCESS = "SET_FAVOURITE_MARKET_MUTATION_SUCCESS";
export const SET_FAVOURITE_MARKET_MUTATION_FAILURE = "SET_FAVOURITE_MARKET_MUTATION_FAILURE";

export type DeleteFavouriteMarketsNavigationTabsAction = {
  type: typeof DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS;
};

export type FavouriteMarketsLimitReachedAction = {
  type: typeof UI__FAVOURITE_MARKETS_LIMIT_REACHED;
};

export type FavouriteMarketsLimitReachedMessageCloseAction = {
  type: typeof UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE;
};

export type FavouriteMarketsToggleFavouriteAction = {
  type: typeof UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE;
  payload: {
    contentSectionURN: URN;
    isFavourite: boolean;
    favouriteMarketsURN: URN;
  };
};

export type FavouriteMarketsTooltipCloseAction = {
  type: typeof UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE;
};

export type SetFavouriteMarketMutationInProgressAction = {
  type: typeof SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS;
};

export type SetFavouriteMarketMutationSuccessAction = {
  type: typeof SET_FAVOURITE_MARKET_MUTATION_SUCCESS;
};

export type SetFavouriteMarketMutationFailureAction = {
  type: typeof SET_FAVOURITE_MARKET_MUTATION_FAILURE;
  payload: {
    error: string;
  };
};
