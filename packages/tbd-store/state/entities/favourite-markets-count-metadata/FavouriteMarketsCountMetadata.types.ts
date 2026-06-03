import type URN from "../../layout/URN";

export type FavouriteMarketsCountMetadata = {
  typename: "FavouriteMarketsCountMetadata";
  urn: URN;
  limit: number;
  currentCount: number;
};

export type FavouriteMarketsCountMetadatas = Record<URN, FavouriteMarketsCountMetadata | undefined>;
