import { createSelector, ParametricSelector } from "reselect";
import { Competition, Sport } from "../../../entities";
import { CompetitionViewLinkCard, CompetitionViewLinkCards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";

import { createCardByURNSelector } from "../cards-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";
import { getCompetitionByURN } from "../../../entities/competitions/competition-selectors";
import URN from "../../URN";

export type CompetitionViewLinkCardHydrated = {
  competition: Competition;
  sport: Sport;
  card: CompetitionViewLinkCard;
};

export const createCompetitionViewLinkCardHydratedByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  CompetitionViewLinkCardHydrated | undefined
> => {
  const getCompetitionViewLinkCardByURN = createCardByURNSelector<CompetitionViewLinkCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) =>
        getCompetitionViewLinkCardByURN(state.layouts.cards.competitionviewlinks, urn),
      (state: ApplicationState) => state.entities.sports,
      (state: ApplicationState) => state.entities.competitions,
    ],
    (competitionViewLinkCard, sports, competitions) => {
      if (!competitionViewLinkCard) return undefined;

      const competition = getCompetitionByURN(competitions, competitionViewLinkCard?.competition);

      if (!competition) return undefined;

      const sport = getSportByURN(sports, competition?.sport ?? "");

      if (!sport) return undefined;

      return {
        competition,
        sport,
        card: competitionViewLinkCard,
      };
    },
  );
};
