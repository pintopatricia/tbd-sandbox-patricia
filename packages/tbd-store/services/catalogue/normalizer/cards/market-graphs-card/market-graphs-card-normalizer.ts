import { MarketGraphsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketGraphsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketCardFragmentIntoMarketCard = (
  fragment: MarketGraphsCardFragment,
): TransformedFragment<MarketGraphsCard> => {
  const { __typename, urn, market, runner } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      market: market.urn,
      runner: runner.runnerURN,
      graphParams: runner.graphParams,
    },
  };
};

export default normalizeMarketCardFragmentIntoMarketCard;
