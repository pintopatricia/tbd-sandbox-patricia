import { createSelector, type ParametricSelector } from "reselect";

import type URN from "../../layout/URN";

import type {
  FavouriteMarketsCountMetadata,
  FavouriteMarketsCountMetadatas,
} from "./FavouriteMarketsCountMetadata.types";

const getFavouriteMarketsCountMetadataByURN = (
  state: FavouriteMarketsCountMetadatas,
  urn: URN,
): FavouriteMarketsCountMetadata | undefined => state[urn];

export const createGetFavouriteMarketsCountMetadataByURNSelector = (): ParametricSelector<
  FavouriteMarketsCountMetadatas,
  URN,
  FavouriteMarketsCountMetadata | undefined
> =>
  createSelector(
    [getFavouriteMarketsCountMetadataByURN],
    (favouriteMarketsCountMetadata): FavouriteMarketsCountMetadata | undefined => favouriteMarketsCountMetadata,
  );
