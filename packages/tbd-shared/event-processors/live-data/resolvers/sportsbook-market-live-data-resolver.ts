import { SportsbookServiceGetPricesResult } from "@ppb/tbd-store/services/sportsbook-market-service";
import { getApolloClient } from "../../../apollo-client/client";
import type {
  SportsbookMarketLiveDataEventProcessorFragment,
  SportsbookMarketStatus,
} from "../../../types/__generated__/graphql";

export function updateMarketLiveData(payload: SportsbookServiceGetPricesResult) {
  if (payload) {
    const { cache } = getApolloClient();

    payload.markets.forEach((market) => {
      if (!market.urn) {
        return;
      }

      const id = cache.identify({
        __typename: "SportsbookMarketLiveData",
        urn: market.urn,
      });

      cache.modify<SportsbookMarketLiveDataEventProcessorFragment>({
        id,
        fields: {
          sportsbookMarketStatus: (cachedValue) => {
            if (market.status) {
              return market.status as SportsbookMarketStatus;
            }
            return cachedValue;
          },
        },
      });
    });
  }
}
