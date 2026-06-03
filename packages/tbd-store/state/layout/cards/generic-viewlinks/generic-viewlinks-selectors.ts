import { createSelector, ParametricSelector } from "reselect";
import { GenericViewLinkCards, GenericViewLinkCard } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";

import { createCardByURNSelector } from "../cards-selectors";
import URN from "../../URN";

export type GenericViewLinkCardHydrated = {
  card: GenericViewLinkCard;
};

export const createGenericViewLinkCardHydratedByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  GenericViewLinkCardHydrated | undefined
> => {
  const getGenericViewLinkCardByURN = createCardByURNSelector<GenericViewLinkCards, URN>();

  return createSelector(
    [(state: ApplicationState, urn: URN) => getGenericViewLinkCardByURN(state.layouts.cards.genericviewlinks, urn)],
    (genericViewLinkCard) => {
      if (!genericViewLinkCard) return undefined;

      return {
        card: genericViewLinkCard,
      };
    },
  );
};
