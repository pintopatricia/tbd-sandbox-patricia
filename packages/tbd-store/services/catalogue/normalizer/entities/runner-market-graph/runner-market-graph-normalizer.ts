import { ExchangeRunnerTraded } from "../../../../../state/entities";
import { RunnerMarketGraphFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRunnerMarketGraphFragmentIntoRunnerMarketGraph = (
  fragment: RunnerMarketGraphFragment,
): TransformedFragment<ExchangeRunnerTraded> => {
  const { __typename, runnerURN, liveData } = fragment;

  const { selectionId, traded, totalMatched, lastPriceTraded, availableToLay, availableToBack } = liveData;

  return {
    data: {
      typename: __typename,
      selectionId,
      urn: runnerURN,
      traded: traded.map((trade) => ({
        price: trade.odd,
        liquidity: trade.liquidity,
      })),
      back: availableToBack.map((availability) => ({
        price: availability.odd,
        liquidity: availability.liquidity,
      })),
      lay: availableToLay.map((availability) => ({
        price: availability.odd,
        liquidity: availability.liquidity,
      })),
      totalMatched: totalMatched || undefined,
      lastPriceTraded: lastPriceTraded || undefined,
    },
  };
};

export default normalizeRunnerMarketGraphFragmentIntoRunnerMarketGraph;
