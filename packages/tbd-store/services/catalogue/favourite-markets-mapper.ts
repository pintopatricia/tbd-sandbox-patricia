import type { SetFavouriteMarketMutation } from "../../clients/catalogue/catalogue-response-types";

import type { TransformedLayout } from "./catalogue-types";
import { normalizeFavouriteMarketsNavigationTabLiteFragmentIntoFavouriteMarketsNavigationTabLite as normalizeFavouriteMarketsNavigationTabLiteFragment } from "./normalizer/navigation-tabs/favourite-markets-navigation-tab-normalizer";
import { normalizerEngine } from "./normalizer/normalizer-engine";

export type SetFavouriteMarketMutationResult = TransformedLayout & {
  softError: SetFavouriteMarketMutation["setFavouriteMarket"]["error"];
};

export const buildFavouriteMarkets = ({
  setFavouriteMarket,
}: SetFavouriteMarketMutation): SetFavouriteMarketMutationResult => {
  if (!setFavouriteMarket.result) {
    throw new Error(`Set favourite market failed with error: ${setFavouriteMarket.error}`);
  }

  const { favouriteMarketsNavigationTab, favouriteMarketsState } = setFavouriteMarket.result;

  return {
    data: {
      FavouriteMarketsNavigationTab: [
        normalizeFavouriteMarketsNavigationTabLiteFragment(favouriteMarketsNavigationTab).data,
      ],
      ...normalizerEngine(favouriteMarketsState),
    },
    softError: setFavouriteMarket.error,
  };
};
