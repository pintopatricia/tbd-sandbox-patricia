import type { FavouriteMarketsStateFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import type { FavouriteMarketsState } from "../../../../../state";
import type { TransformedFragment } from "../../Normalizer.types";

const normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState = ({
  __typename,
  urn,
  isFavourite,
  metadata,
}: FavouriteMarketsStateFragment): TransformedFragment<FavouriteMarketsState> => ({
  data: {
    typename: __typename,
    urn,
    isFavourite,
    metadataSportURN: metadata?.sport.urn,
    metadataTotalURN: metadata?.total.urn,
  },
});

export default normalizeFavouriteMarketsStateFragmentIntoFavouriteMarketsState;
