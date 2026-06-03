import { ExchangeMarketBetFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ExchangeMarketBet } from "../../../../../state/betting/exchange-market-bets/ExchangeMarketBet.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeExchangeMarketBetFragmentIntoExchangeMarketBet = (
  exchangeMarketBet: ExchangeMarketBetFragment,
): TransformedFragment<ExchangeMarketBet> => {
  const {
    urn,
    id,
    description,
    numOfOrders,
    numOfUnmatched,
    cashoutQuotes,
    liability,
    betDelay,
    __typename,
    marketViewLink,
    exchangeLightMarketViewLink,
  } = exchangeMarketBet;

  return {
    data: {
      urn,
      typename: __typename,
      marketId: id,
      description,
      numOfOrders,
      numOfUnmatched,
      cashoutQuotesURNs: cashoutQuotes.map((quote) => quote.urn),
      liability: liability ?? undefined,
      betDelay: betDelay ?? undefined,
      marketViewLink: marketViewLink ?? undefined,
      exchangeLightMarketViewLink: exchangeLightMarketViewLink ?? undefined,
    },
  };
};

export default normalizeExchangeMarketBetFragmentIntoExchangeMarketBet;
