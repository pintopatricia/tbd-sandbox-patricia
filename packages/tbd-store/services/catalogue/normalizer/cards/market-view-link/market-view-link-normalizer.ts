// TODO: to add typename after engine is implemented
// type MarketViewLinkCardWithTypename = MarketViewLinkCard & { typename: "MarketViewLinkCard" };

import { MarketViewLinkCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketViewLinkCardFragmentIntoMarketViewLinkCard = (
  marketLinkCard: MarketViewLinkCardFragment,
): TransformedFragment<MarketViewLinkCard> => {
  const { urn, market, viewLink, badge, __typename } = marketLinkCard;

  return {
    data: {
      typename: __typename,
      urn,
      viewLink,
      marketName: market.name,
      badge,
    },
  };
};

export default normalizeMarketViewLinkCardFragmentIntoMarketViewLinkCard;
