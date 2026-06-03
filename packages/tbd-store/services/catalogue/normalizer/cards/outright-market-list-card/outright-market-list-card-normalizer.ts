import { OutrightMarketListCard } from "../../../../../state/layout/cards/Card.types";
import { OutrightMarketListCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard = (
  outrightMarketListCard: OutrightMarketListCardFragment,
): TransformedFragment<OutrightMarketListCard> => {
  const { urn, __typename, title, numberOfRowsToDisplay, markets, favouriteMarketsState } = outrightMarketListCard;

  return {
    data: {
      typename: __typename,
      urn,
      markets: markets.map((sportsbookMarket) => sportsbookMarket.urn),
      title,
      numberOfRowsToDisplay: numberOfRowsToDisplay || undefined,
      favouriteMarketsStateURN: favouriteMarketsState?.urn,
    },
  };
};

export default normalizeOutrightMarketListCardFragmentIntoOutrightMarketListCard;
