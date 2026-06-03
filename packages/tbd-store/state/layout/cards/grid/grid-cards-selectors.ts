import { createSelector } from "reselect";

import { SportsbookMarket, SportsbookMarkets } from "../../../entities";
import { createSportsbookMarketByURNSelector } from "../../../entities/sportsbook-markets/sportsbook-market-selectors";
import URN from "../../URN";
import { GridCard, GridCards } from "../Card.types";
import { createCardByURNSelector } from "../cards-selectors";

export const createGetGridCardSportsbookMarketsSelector = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();

  return createSelector(
    [
      (gridCard: GridCard | null): GridCard | null => gridCard,
      (_gridCard: GridCard | null, sportsbookMarkets: SportsbookMarkets): SportsbookMarkets => sportsbookMarkets,
    ],
    (gridCard: GridCard | null, sportsbookMarkets: SportsbookMarkets): SportsbookMarket[] | undefined => {
      const marketURNs = gridCard?.markets.map(({ urn }): URN => urn);

      return marketURNs?.reduce<SportsbookMarket[]>((acc, urn) => {
        const sportsbookMarket = getSportsbookMarketByURN(sportsbookMarkets, urn);

        if (sportsbookMarket) {
          acc.push(sportsbookMarket);
        }

        return acc;
      }, []);
    },
  );
};

export const createGetGridCardSportsbookMarketsByURNSelector = () => {
  const getGridCardByURN = createCardByURNSelector<GridCards, URN>();
  const getGridCardSportsbookMarkets = createGetGridCardSportsbookMarketsSelector();

  return createSelector(
    [
      getGridCardByURN,
      (_gridCards: GridCards, _urn: URN, sportsbookMarkets: SportsbookMarkets): SportsbookMarkets => sportsbookMarkets,
    ],
    (gridCard: GridCard | null, sportsbookMarkets: SportsbookMarkets): SportsbookMarket[] | undefined =>
      getGridCardSportsbookMarkets(gridCard, sportsbookMarkets),
  );
};
