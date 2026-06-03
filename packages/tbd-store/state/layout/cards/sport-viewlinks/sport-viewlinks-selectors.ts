import { createSelector, ParametricSelector } from "reselect";
import { Sport } from "../../../entities";
import { SportViewLinkCard, SportViewLinkCards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";

import { createCardByURNSelector } from "../cards-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";
import URN from "../../URN";

type SportViewLinkCardHydrated = {
  sport: Sport;
  card: SportViewLinkCard;
};

export const createSportViewLinkCardHydratedByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SportViewLinkCardHydrated | undefined
> => {
  const getSportViewLinkCardByURN = createCardByURNSelector<SportViewLinkCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getSportViewLinkCardByURN(state.layouts.cards.sportviewlinks, urn),
      (state: ApplicationState) => state.entities.sports,
    ],
    (sportViewLinksCard, sports) => {
      if (!sportViewLinksCard) return undefined;

      const sport = getSportByURN(sports, sportViewLinksCard?.sport ?? "");

      if (!sport) return undefined;

      return {
        sport,
        card: sportViewLinksCard,
      };
    },
  );
};
