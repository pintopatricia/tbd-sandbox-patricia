import { TransformedFragment } from "../../Normalizer.types";
import { PromotionsHubCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PromotionsHubCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";

const normalizePromotionsHubCardGroupFragmentIntoPromotionsHubCardGroup = (
  fragment: PromotionsHubCardGroupFragment,
): TransformedFragment<PromotionsHubCardGroup> => {
  const { __typename, urn } = fragment;

  return {
    data: {
      typename: __typename,
      urn,
      items: [],
    },
  };
};

export default normalizePromotionsHubCardGroupFragmentIntoPromotionsHubCardGroup;
