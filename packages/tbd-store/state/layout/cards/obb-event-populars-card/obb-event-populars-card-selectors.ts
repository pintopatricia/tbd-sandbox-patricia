import { createSelector, ParametricSelector } from "reselect";
import { createCardByURNSelector } from "../cards-selectors";
import { ApplicationState } from "../../../ApplicationState.types";
import URN from "../../URN";
import { ObbParticipants } from "../../../entities/obb-participants/ObbParticipants.types";
import { FootballFixture, FootballFixtures, SportEvents } from "../../../entities";
import { fixtureCodec } from "@ppb/tbd-urn-codecs";

import {
  ObbEventPopularsCard,
  ObbEventPopularsCards,
  RawPopularObbBettingOpportunity,
  SelectorObbEventPopularsCard,
} from "./ObbEventPopularsCard.types";

const buildObbEventPopularsCard = (
  obbEventPopularsCard: ObbEventPopularsCard | null,
  participants: ObbParticipants,
  sportEvents: SportEvents,
  footballFixtures: FootballFixtures,
): SelectorObbEventPopularsCard | undefined => {
  if (!obbEventPopularsCard) {
    return undefined;
  }

  const sportEvent = sportEvents[obbEventPopularsCard.sportEvent];
  const eventId = sportEvent?.eventId;

  if (!eventId) {
    return undefined;
  }

  const fixtureUrn = fixtureCodec.encode(eventId.toString()).uid;
  const fixture: FootballFixture | undefined = fixtureUrn ? footballFixtures[fixtureUrn] : undefined;

  return {
    ...obbEventPopularsCard,
    sportEvent: {
      urn: sportEvent.urn,
      name: sportEvent.name,
    },
    fixture,
    popularBettingOpportunities: obbEventPopularsCard.popularBettingOpportunities.map(
      (opportunity: RawPopularObbBettingOpportunity) => ({
        betCount: opportunity.betCount,
        participants: opportunity.participants.map((participantId) => participants[participantId]),
        legId: opportunity.legId,
      }),
    ),
  };
};

export const createObbEventPopularsCardByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorObbEventPopularsCard | undefined
> => {
  const getObbEventPopularsCardByUrn = createCardByURNSelector<ObbEventPopularsCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) =>
        getObbEventPopularsCardByUrn(state.layouts.cards.obbeventpopularscards, urn),
      (state: ApplicationState) => state.entities.obbParticipants,
      (state: ApplicationState) => state.entities.sportevents,
      (state: ApplicationState) => state.entities.footballfixtures,
    ],
    (obbEventPopularsCard, participants, sportEvents, footballFixtures) =>
      buildObbEventPopularsCard(obbEventPopularsCard, participants, sportEvents, footballFixtures),
  );
};
