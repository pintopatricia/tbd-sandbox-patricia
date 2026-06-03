import { PopularMultiplesBetBuilderCard } from "../../../../../state/layout/cards/Card.types";
import { PopularMultiplesBetBuilderCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePopularMultiplesBetBuilderCardFragmentIntoPopularMultiplesBetBuilderCard = (
  fragment: PopularMultiplesBetBuilderCardFragment,
): TransformedFragment<PopularMultiplesBetBuilderCard> => {
  const { __typename, urn, popularbettingopportunity, cmsConfiguredTitle: title } = fragment;

  return {
    data: {
      typename: __typename,
      urn,
      popularbettingopportunity: popularbettingopportunity.urn,
      title: title && "name" in title ? title.name : undefined,
      fromCmsConfig: !!title && "name" in title,
    },
  };
};

export default normalizePopularMultiplesBetBuilderCardFragmentIntoPopularMultiplesBetBuilderCard;
