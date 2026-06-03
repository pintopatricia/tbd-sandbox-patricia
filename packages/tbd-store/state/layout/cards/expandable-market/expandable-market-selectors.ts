import { createSelector, ParametricSelector } from "reselect";
import { ExpandableMarketCard, ExpandableMarketCards, PartialExpandableMarketCard } from "../Card.types";

export function isHydratedExpandableMarketCard(
  cardgroup: PartialExpandableMarketCard | ExpandableMarketCard,
): cardgroup is ExpandableMarketCard {
  return Boolean(cardgroup && typeof cardgroup === "object" && "marketCardURN" in cardgroup);
}

export function createPartialExpandableMarketCardByURNSelector(): ParametricSelector<
  ExpandableMarketCards,
  string,
  PartialExpandableMarketCard | null
> {
  return createSelector(
    [(stateSlice: ExpandableMarketCards) => stateSlice, (_: ExpandableMarketCards, urn: string) => urn],
    (cards, urn): PartialExpandableMarketCard | null => {
      const card = cards[urn];

      if (!isHydratedExpandableMarketCard(card)) {
        return card || null;
      }

      return null;
    },
  );
}

export function createGetHydratedExpandableMarketCardByURNSelector(): ParametricSelector<
  ExpandableMarketCards,
  string,
  ExpandableMarketCard | null
> {
  return createSelector(
    [(stateSlice: ExpandableMarketCards) => stateSlice, (_: ExpandableMarketCards, urn: string) => urn],
    (cards, urn): ExpandableMarketCard | null => {
      const card = cards?.[urn];

      if (isHydratedExpandableMarketCard(card)) {
        return card || null;
      }

      return null;
    },
  );
}
