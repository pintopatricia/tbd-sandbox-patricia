import { createSelector } from "reselect";

import { SportsbookMarket, SportsbookMarkets } from "../../../entities";
import { createSportsbookMarketByURNSelector } from "../../../entities/sportsbook-markets/sportsbook-market-selectors";
import URN from "../../URN";
import { MarketCard, MarketCards } from "../Card.types";
import { createCardByURNSelector } from "../cards-selectors";

export const createGetMarketCardSportsbookMarketByURNSelector = () => {
  const getMarketCardByURN = createCardByURNSelector<MarketCards, URN>();
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();

  return createSelector(
    [
      getMarketCardByURN,
      (_marketCards: MarketCards, _urn: URN, sportsbookMarkets: SportsbookMarkets): SportsbookMarkets =>
        sportsbookMarkets,
    ],
    (marketCard: MarketCard | null, sportsbookMarkets: SportsbookMarkets): SportsbookMarket | undefined => {
      const marketUrn = marketCard?.displayRunners.sportsbook?.market;

      return marketUrn ? getSportsbookMarketByURN(sportsbookMarkets, marketUrn) : undefined;
    },
  );
};
