import type URN from "../../layout/URN";

export type FavouriteMarketsState = {
  typename: "FavouriteMarketsState";
  urn: URN;
  isFavourite: boolean;
  metadataSportURN?: URN;
  metadataTotalURN?: URN;
};

export type FavouriteMarketsStates = Record<URN, FavouriteMarketsState>;
