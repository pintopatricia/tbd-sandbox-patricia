import { SeoStructuredDataFAQProperties, SeoStructuredDataSportEventProperties } from "./SeoStructuredData.types";
import {
  ContentSummaryCards,
  EventMarketCard,
  EventMarketCards,
  RaceMarketCards,
  RaceViewLinksCards,
} from "../../state/layout/cards/Card.types";
import URN from "../../state/layout/URN";
import { ApplicationState } from "../../state/ApplicationState.types";

import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createSportEventByURNSelector } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { TextItem } from "../../state/layout/cards/regulatory-sections/RegulatorySections.types";
import { createViewByURNSelector } from "../../state/layout/views/view-selectors";
import { EventViews } from "../../state/layout/views/View.types";
import { SportEvent } from "../../state/entities/sport-events/SportEvent.types";

/**
 * A map between sport id and event duration in hours
 */
const EVENT_DURATION_BY_SPORT_ID: Record<any, number> = {
  1: 3, // Football
  2: 6, // Tennis
  7: 1, // Horse-Racing
  6423: 3, // American Football
  61420: 3, // Australian Rules
  627555: 1.5, // Badminton
  7511: 3, // Baseball
  7522: 3, // Basketball
  998918: 2, // Bowls
  6: 1, // Boxing
  4: 120, // Cricket 24 hours * 5 days
  3503: 3, // Darts
  27454571: 3, // E-Sports
  2152880: 2, // Gaelic-Games
  4339: 1, // Greyhound Racing
  468328: 2, // Handball
  7523: 3, // Hockey
  7524: 3, // Ice Hockey
  26420387: 3, // Mixed Martial Arts
  1477: 2, // Rugby League
  5: 2, // Rugby Union
  6422: 12, // Snooker
  998917: 2, // Volleyball
  default: 3,
};

const getEventDuration = (sportId: number) => EVENT_DURATION_BY_SPORT_ID[sportId] || EVENT_DURATION_BY_SPORT_ID.default;

const getEndDate = (sportId: number, startDate: string) => {
  const startTime = new Date(startDate).getTime();

  return new Date(startTime + getEventDuration(sportId) * 3600000).toISOString();
};

type EventCommonStructuredData = {
  name: string;
  competitionName: string;
  startDate: string;
  endDate: string;
};

const getCommonEventData = (card: EventMarketCard, state: ApplicationState): EventCommonStructuredData | undefined => {
  let sportevent: SportEvent | undefined;

  const getSportEventByURN = createSportEventByURNSelector();

  if ("sportevent" in card) {
    const urn = card.sportevent;
    sportevent = getSportEventByURN(state.entities.sportevents, urn);
  }

  if (!sportevent) {
    return undefined;
  }

  const competition = getCompetitionByURN(state.entities.competitions, sportevent.competition);
  if (sportevent.openDate && competition) {
    const sport = getSportByURN(state.entities.sports, competition.sport);

    const startDate = sportevent.openDate;

    if (!sport?.sportId) {
      return undefined;
    }

    const endDate = getEndDate(sport.sportId, startDate);

    return {
      name: sportevent.name,
      competitionName: competition.name,
      startDate,
      endDate,
    };
  }

  return undefined;
};

const getDataByEventMarketCard = (
  urn: string,
  state: ApplicationState,
): SeoStructuredDataSportEventProperties | undefined => {
  const getCardByURN = createCardByURNSelector<EventMarketCards, URN>();
  const card = getCardByURN(state.layouts.cards.eventmarkets, urn);

  if (!card) {
    return undefined;
  }

  const eventURL = card.eventViewLink.viewUrl;
  const eventCommonData = getCommonEventData(card, state);

  if (!eventURL || !eventCommonData) {
    return undefined;
  }

  return {
    eventURL,
    ...eventCommonData,
  };
};

const getDataByEventSwitcherCard = (
  urn: string,
  state: ApplicationState,
): SeoStructuredDataSportEventProperties | undefined => {
  const getEventViewByUrn = createViewByURNSelector<EventViews, URN>();
  const getSportEventByURN = createSportEventByURNSelector();

  if (!state.router.currentUrn || !state.router.currentUrl) {
    return undefined;
  }

  const eventView = getEventViewByUrn(state.layouts.views.event, state.router.currentUrn);

  if (eventView) {
    const sportevent = getSportEventByURN(state.entities.sportevents, eventView.sportevent);

    if (!sportevent || !sportevent.openDate) {
      return undefined;
    }

    const competition = getCompetitionByURN(state.entities.competitions, sportevent.competition);

    if (!competition) {
      return undefined;
    }

    const sport = getSportByURN(state.entities.sports, competition.sport);

    if (!sport) {
      return undefined;
    }

    return {
      name: sportevent.name,
      competitionName: competition.name,
      startDate: sportevent.openDate,
      endDate: getEndDate(sport.sportId, sportevent.openDate),
      eventURL: state.router.currentUrl,
    };
  }

  return undefined;
};

/**
 * Logic to extract subset SeoStructuredDataSportEventProperties that is shared between
 * {@link getDataByRaceViewLinksCard} and {@link getDataByRaceMarketCard}.
 *
 * @param card RaceMarketCard or RaceViewLinksCard
 * @param state application state
 * @returns subset of SeoStructuredDataSportEventProperties
 */
const getCommonRacingData = (raceUrn: string, state: ApplicationState): RacingCommonStructuredData | undefined => {
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const race = getRaceByURN(state.entities.races, raceUrn);

  if (!race) {
    return undefined;
  }

  const meeting = getMeetingByURN(state.entities.meetings, race.meeting);

  if (meeting) {
    const { startTime } = race;
    const sport = getSportByURN(state.entities.sports, meeting.sportUrn);

    if (!sport?.sportId || !startTime) {
      return undefined;
    }

    const endDate = getEndDate(sport?.sportId, startTime);

    return {
      startDate: startTime,
      endDate,
      competitionName: meeting.venue,
      name: `${meeting.venue} ${race.name}`,
    };
  }

  return undefined;
};

type RacingCommonStructuredData = {
  startDate: string;
  endDate: string;
  competitionName: string;
  name: string;
};

const getDataByRaceViewLinksCard = (
  urn: string,
  state: ApplicationState,
): SeoStructuredDataSportEventProperties | undefined => {
  const getCardByURN = createCardByURNSelector<RaceViewLinksCards, URN>();
  const card = getCardByURN(state.layouts.cards.raceviewlinks, urn);

  if (!card) {
    return undefined;
  }

  const eventURL = card.raceViewLinks?.filter((raceView) => card.race === raceView.race)[0]?.viewLink?.viewUrl;

  if (!eventURL) {
    return undefined;
  }

  const racingCommonData = getCommonRacingData(card.race, state);

  let data;
  if (racingCommonData) {
    data = {
      ...racingCommonData,
      eventURL,
    };
  }

  return data;
};

const getDataByRaceMarketCard = (
  urn: string,
  state: ApplicationState,
): SeoStructuredDataSportEventProperties | undefined => {
  const getCardByURN = createCardByURNSelector<RaceMarketCards, URN>();
  const card = getCardByURN(state.layouts.cards.racemarkets, urn);

  if (!card) {
    return undefined;
  }

  const eventURL = card.raceViewLink?.viewUrl;

  if (!eventURL) {
    return undefined;
  }

  const racingCommonData = getCommonRacingData(card.race, state);

  if (racingCommonData) {
    return {
      ...racingCommonData,
      eventURL,
    };
  }

  return undefined;
};

export const getFAQDataByContentSummaryCard = (
  urn: string,
  state: ApplicationState,
): SeoStructuredDataFAQProperties[] | undefined => {
  const getContentSummaryCardByURN = createCardByURNSelector<ContentSummaryCards, URN>();

  const contentSummaryCard = getContentSummaryCardByURN(state.layouts.cards.contentsummary, urn);

  if (!contentSummaryCard) {
    return undefined;
  }

  const { sections } = contentSummaryCard;

  if (!sections?.length) {
    return undefined;
  }

  return sections
    .filter((section) => section.includeToFaq)
    .map((section) => ({
      name: section.title,
      text: (section.items[0] as TextItem).text,
    })) as SeoStructuredDataFAQProperties[];
};

export const dataBuildersByCardType = {
  EventMarketCard: getDataByEventMarketCard,
  GenericSwitcherCard: getDataByEventSwitcherCard,
  RaceMarketCard: getDataByRaceMarketCard,
  RaceViewLinksCard: getDataByRaceViewLinksCard,
};
