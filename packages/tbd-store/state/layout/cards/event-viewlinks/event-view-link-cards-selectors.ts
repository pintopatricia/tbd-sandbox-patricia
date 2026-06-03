import { createSelector, ParametricSelector } from "reselect";
import { Competition, SportEvent, TeamDetails, Sport } from "../../../entities";
import { EventViewLinkCard, EventViewLinkCards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";
import { createCardByURNSelector } from "../cards-selectors";
import { getSportEventByURN } from "../../../entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../../entities/competitions/competition-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";
import URN from "../../URN";
import { ViewLink } from "../../views/ViewLink.types";
import { FixtureStatus } from "../../../constants";

export type EventLink = {
  urn: URN;
  eventId: number | undefined;
  eventName: string;
  inplay: boolean;
  home?: TeamDetails;
  away?: TeamDetails;
  scheduledAt?: Date;
  startedAt?: Date;
  fixtureURN?: URN;
  sportEventURN: URN;
  viewLink: ViewLink;
};

export function getEventViewLink(state: ApplicationState, viewlinkURN: URN): EventLink | undefined {
  const getEventViewLinkCardByURN = createCardByURNSelector<EventViewLinkCards, URN>();
  const eventviewlink = getEventViewLinkCardByURN(state.layouts.cards.eventviewlinks, viewlinkURN);

  if (!eventviewlink) {
    return undefined;
  }

  const sportevent = getSportEventByURN(state.entities.sportevents, eventviewlink.sportevent);

  if (!sportevent) {
    return undefined;
  }

  const fixture = eventviewlink.fixture && state.entities.footballfixtures[eventviewlink.fixture];

  return {
    eventId: sportevent.eventId,
    eventName: sportevent.name,
    inplay: false,
    ...(!!fixture && {
      inplay: fixture.fixtureStatus === FixtureStatus.IN_PLAY,
      home: fixture.home,
      away: fixture.away,
      scheduledAt: fixture.scheduledAt,
      startedAt: fixture.startedAt,
      fixtureURN: fixture.urn,
    }),
    urn: eventviewlink.urn,
    sportEventURN: sportevent.urn,
    viewLink: eventviewlink.viewLink,
  };
}

type EventViewLinkCardHydrated = {
  sportEvent: SportEvent;
  competition: Competition;
  sport: Sport;
  card: EventViewLinkCard;
};

export const createEventViewLinkCardHydratedByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  EventViewLinkCardHydrated | undefined
> => {
  const getEventViewLinkCardByURN = createCardByURNSelector<EventViewLinkCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getEventViewLinkCardByURN(state.layouts.cards.eventviewlinks, urn),
      (state: ApplicationState) => state.entities.sports,
      (state: ApplicationState) => state.entities.sportevents,
      (state: ApplicationState) => state.entities.competitions,
    ],
    (eventViewLinkCard, sports, sportevents, competitions) => {
      if (!eventViewLinkCard) return undefined;

      const sportEvent = getSportEventByURN(sportevents, eventViewLinkCard.sportevent ?? "");

      if (!sportEvent) return undefined;

      const competition = getCompetitionByURN(competitions, sportEvent.competition ?? "");

      if (!competition) return undefined;

      const sport = getSportByURN(sports, competition?.sport ?? "");

      if (!sport) return undefined;

      return {
        sportEvent,
        competition,
        sport,
        card: eventViewLinkCard,
      };
    },
  );
};
