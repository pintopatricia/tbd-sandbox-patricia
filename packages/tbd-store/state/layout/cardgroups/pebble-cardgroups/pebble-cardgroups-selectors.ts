import { createSelector, ParametricSelector, Selector } from "reselect";

import { ApplicationState } from "../../../ApplicationState.types";
import { SportsbookMarket } from "../../../entities";
import URN from "../../URN";
import { createGetGridCardSportsbookMarketsByURNSelector } from "../../cards/grid/grid-cards-selectors";
import { createGetMarketCardSportsbookMarketByURNSelector } from "../../cards/market/market-cards-selectors";
import { PartialPebbleCardGroup, PebbleCardGroup, PebbleCardGroups } from "../CardGroup.types";

export const createGetSelectedPebbleSportsbookMarketsSelector = () => {
  const getMarketCardSportsbookMarketByURN = createGetMarketCardSportsbookMarketByURNSelector();
  const getGridCardSportsbookMarketsByURN = createGetGridCardSportsbookMarketsByURNSelector();

  return createSelector(
    [
      ({ entities, layouts }: ApplicationState, selectedItemUrn: URN): SportsbookMarket | undefined =>
        getMarketCardSportsbookMarketByURN(layouts.cards.markets, selectedItemUrn, entities.sportsbookmarkets),
      ({ entities, layouts }: ApplicationState, selectedItemUrn: URN): SportsbookMarket[] | undefined =>
        getGridCardSportsbookMarketsByURN(layouts.cards.grids, selectedItemUrn, entities.sportsbookmarkets),
    ],
    (
      marketCardSportsbookMarket: SportsbookMarket | undefined,
      gridCardSportsbookMarkets: SportsbookMarket[] | undefined,
    ): SportsbookMarket[] => {
      if (marketCardSportsbookMarket) {
        return [marketCardSportsbookMarket];
      }

      if (gridCardSportsbookMarkets) {
        return gridCardSportsbookMarkets;
      }

      return [];
    },
  );
};

export function isHydratedPebbleCardGroup(
  cardgroup: PebbleCardGroup | PartialPebbleCardGroup,
): cardgroup is PebbleCardGroup {
  return cardgroup && "items" in cardgroup && Array.isArray(cardgroup.items);
}

export function createGetHydratedPebbleCardGroupByURNSelector(): ParametricSelector<
  PebbleCardGroups,
  string,
  PebbleCardGroup | null
> {
  return createSelector(
    [(stateSlice: PebbleCardGroups) => stateSlice, (_: PebbleCardGroups, urn: string) => urn],
    (cardgroups, urn): PebbleCardGroup | null => {
      const cardgroup = cardgroups?.[urn];
      if (isHydratedPebbleCardGroup(cardgroup)) {
        return cardgroup || null;
      }

      return null;
    },
  );
}

export function createPartialPebbleCardGroupByURNSelector(): ParametricSelector<
  PebbleCardGroups,
  string,
  PartialPebbleCardGroup | null
> {
  return createSelector(
    [(stateSlice: PebbleCardGroups) => stateSlice, (_: PebbleCardGroups, urn: string) => urn],
    (cardgroups, urn): PartialPebbleCardGroup | null => {
      const cardgroup = cardgroups?.[urn];
      if (!isHydratedPebbleCardGroup(cardgroup)) {
        return cardgroup || null;
      }

      return null;
    },
  );
}

export type HydratedPebbleCardGroups = { [urn: string]: PebbleCardGroup };

export function createHydratedPebbleCardGroupsSelector(): Selector<PebbleCardGroups, HydratedPebbleCardGroups> {
  return createSelector(
    [(stateSlice: PebbleCardGroups) => stateSlice],
    (cardgroups): HydratedPebbleCardGroups =>
      Object.values(cardgroups).reduce((acc: HydratedPebbleCardGroups, current) => {
        if (isHydratedPebbleCardGroup(current)) {
          acc[current.urn] = current;
        }
        return acc;
      }, {}),
  );
}
