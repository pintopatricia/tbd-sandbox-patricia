import { createSelector, ParametricSelector } from "reselect";
import { createCardByURNSelector } from "../cards-selectors";
import { ApplicationState } from "../../../ApplicationState.types";
import URN from "../../URN";
import { ObbParticipants } from "../../../entities/obb-participants/ObbParticipants.types";

import {
  ObbCreatedBetsCard,
  ObbCreatedBetsCards,
  RawObbBettingOpportunity,
  SelectorObbCreatedBetsCard,
} from "./ObbCreatedBetsCard.types";
import { FootballFixtures, SportEvents } from "../../../entities";

const buildObbCreatedBetsCard = (
  obbCreatedBetsCard: ObbCreatedBetsCard | null,
  participants: ObbParticipants,
  fixtures: FootballFixtures,
  sportEvents: SportEvents,
): SelectorObbCreatedBetsCard | undefined => {
  if (!obbCreatedBetsCard) {
    return undefined;
  }

  const fixture = fixtures[obbCreatedBetsCard.fixture];
  const sportEvent = sportEvents[obbCreatedBetsCard.sportEvent];

  if (!fixture || !sportEvent) {
    return undefined;
  }

  return {
    urn: obbCreatedBetsCard.urn,
    typename: obbCreatedBetsCard.typename,
    fixture: {
      urn: fixture.urn,
      status: fixture.duration?.status,
      scheduledAt: fixture.scheduledAt,
    },
    sportEvent: {
      urn: sportEvent.urn,
      name: sportEvent.name,
    },
    eventViewLink: obbCreatedBetsCard.eventViewLink,
    footerViewLink: obbCreatedBetsCard.footerViewLink,
    bettingOpportunities: obbCreatedBetsCard.bettingOpportunities.map((opportunity: RawObbBettingOpportunity) => ({
      participants: opportunity.participants.map((participantId) => participants[participantId]),
      legId: opportunity.legId,
    })),
  };
};

export const createObbCreatedBetsCardByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorObbCreatedBetsCard | undefined
> => {
  const getObbCreatedBetsCardByUrn = createCardByURNSelector<ObbCreatedBetsCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getObbCreatedBetsCardByUrn(state.layouts.cards.obbcreatedbetscards, urn),
      (state: ApplicationState) => state.entities.obbParticipants,
      (state: ApplicationState) => state.entities.footballfixtures,
      (state: ApplicationState) => state.entities.sportevents,
    ],
    (obbCreatedBetsCard, participants, fixtures, sportEvents) =>
      buildObbCreatedBetsCard(obbCreatedBetsCard, participants, fixtures, sportEvents),
  );
};
