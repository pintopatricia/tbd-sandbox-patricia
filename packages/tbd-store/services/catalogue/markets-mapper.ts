import {
  ExchangeMarketBettingFragment,
  SportsbookMarketBettingFragment,
} from "../../clients/catalogue/catalogue-response-types";
import { normalizerEngine } from "./normalizer/normalizer-engine";
import { TransformedLayout } from "./catalogue-types";

type MarketFragment = ExchangeMarketBettingFragment | SportsbookMarketBettingFragment;

export const buildMarketsEntities = (markets: (MarketFragment | null)[] | null): TransformedLayout => {
  const initialMappedEntities = {};

  if (!markets) {
    return {
      data: {},
    };
  }

  return {
    data: markets.reduce(
      (mappedEntities, market) => (market ? normalizerEngine(market, mappedEntities) : mappedEntities),
      initialMappedEntities,
    ),
  };
};
