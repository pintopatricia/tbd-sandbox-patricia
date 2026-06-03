import { VirtualMarketFragment } from "../../clients/catalogue/catalogue-response-types";
import { normalizerEngine } from "./normalizer/normalizer-engine";
import { TransformedLayout } from "./catalogue-types";

export const buildVirtualMarketsEntities = (virtualMarkets: (VirtualMarketFragment | null)[]): TransformedLayout => {
  const initialMappedEntities = {};
  return {
    data: virtualMarkets.reduce(
      (mappedEntities, virtualMarket) =>
        virtualMarket ? normalizerEngine(virtualMarket, mappedEntities) : mappedEntities,
      initialMappedEntities,
    ),
  };
};
