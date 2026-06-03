import { createSelector, type Selector } from "reselect";

import type { FavouriteMarkets } from "./FavouriteMarkets.types";

const getFavouriteMarketsIsMutationInProgress = (favouriteMarkets: FavouriteMarkets): boolean =>
  !!favouriteMarkets.isMutationInProgress;

export const createGetFavouriteMarketsIsMutationInProgressSelector = (): Selector<FavouriteMarkets, boolean> =>
  createSelector([getFavouriteMarketsIsMutationInProgress], (isMutationInProgress): boolean => isMutationInProgress);
