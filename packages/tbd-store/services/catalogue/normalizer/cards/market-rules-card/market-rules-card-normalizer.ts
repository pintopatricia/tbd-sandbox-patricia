import { MarketRulesCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketRulesCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketRulesCardFragmentIntoMarketRulesCard = (
  fragment: MarketRulesCardFragment,
): TransformedFragment<MarketRulesCard> => {
  const { __typename, ...marketRulesData } = fragment;

  return {
    data: {
      typename: __typename,
      ...marketRulesData,
    },
  };
};

export default normalizeMarketRulesCardFragmentIntoMarketRulesCard;
