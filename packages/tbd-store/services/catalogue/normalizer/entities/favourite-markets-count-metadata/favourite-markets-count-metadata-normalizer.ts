import type { FavouriteMarketsCountMetadataFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import type { FavouriteMarketsCountMetadata } from "../../../../../state";
import type { TransformedFragment } from "../../Normalizer.types";

const normalizeFavouriteMarketsCountMetadataFragmentIntoFavouriteMarketsCountMetadata = ({
  __typename,
  urn,
  limit,
  currentCount,
}: FavouriteMarketsCountMetadataFragment): TransformedFragment<FavouriteMarketsCountMetadata> => ({
  data: {
    typename: __typename,
    urn,
    limit,
    currentCount,
  },
});

export default normalizeFavouriteMarketsCountMetadataFragmentIntoFavouriteMarketsCountMetadata;
