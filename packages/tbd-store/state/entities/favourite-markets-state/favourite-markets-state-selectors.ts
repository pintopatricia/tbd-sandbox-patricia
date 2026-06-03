import { createSelector, type ParametricSelector } from "reselect";

import type URN from "../../layout/URN";

import type { FavouriteMarketsState, FavouriteMarketsStates } from "./FavouriteMarketsState.types";

const getFavouriteMarketsStateByURN = (state: FavouriteMarketsStates, urn: URN): FavouriteMarketsState | undefined =>
  state[urn];

export const createGetFavouriteMarketsStateByURNSelector = (): ParametricSelector<
  FavouriteMarketsStates,
  URN,
  FavouriteMarketsState | undefined
> =>
  createSelector(
    [getFavouriteMarketsStateByURN],
    (favouriteMarketsState): FavouriteMarketsState | undefined => favouriteMarketsState,
  );
