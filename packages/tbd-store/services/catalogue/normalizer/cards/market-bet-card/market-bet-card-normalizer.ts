import { MarketBetCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketBetCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketBetCardFragmentIntoMarketBetCard = (
  marketBetCardFragment: MarketBetCardFragment,
): TransformedFragment<MarketBetCard> => {
  const { urn, __typename, marketBet, betCardGroupURN, marketBetCardGroupURN, matchedStatus } = marketBetCardFragment;

  return {
    data: {
      typename: __typename,
      urn,
      betCardGroupURN,
      marketBetCardGroupURN,
      numberOfBets: marketBet.numOfOrders,
      numberOfUnmatched: marketBet.numOfUnmatched,
      matchedStatus: matchedStatus || undefined,
      marketBetURN: marketBet.urn,
      liability: marketBet.liability !== null ? marketBet.liability : undefined,
      commission: marketBet.commission !== null ? marketBet.commission : undefined,
      profit: marketBet.profit !== null ? marketBet.profit : undefined,
      netProfit: marketBet.netProfit !== null ? marketBet.netProfit : undefined,
    },
  };
};

export default normalizeMarketBetCardFragmentIntoMarketBetCard;
