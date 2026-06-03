import { codecs, URN as CodecURN } from "@ppb/tbd-urn-codecs";
import { BroadcastsMediaEvent, MediaEvent } from "../../state/tagging/Media.types";
import URN from "../../state/layout/URN";
import { Entities } from "../../state/entities";
import { ApplicationState } from "../../state";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { createSportsbookMarketByURNSelector } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { isRaceHierarchy } from "../../helpers/markets";
import {
  BroadcastsAndStatisticsCards,
  BroadcastsCards,
  TimeFormBroadCastsCards,
} from "../../state/layout/cards/Card.types";
import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { LiveStreamBroadcastsOptions } from "../../state/constants";

const buildMediaEvent = (entities: Entities, urn: CodecURN): MediaEvent | null => {
  // event BroadcastsCard
  if (codecs.card.eventBroadcasts.isValid(urn)) {
    const event = getSportEventByURN(entities.sportevents, codecs.event.encode(urn.referenceId).uid);

    const competition = event ? getCompetitionByURN(entities.competitions, event.competition) : null;

    const sport = competition ? getSportByURN(entities.sports, competition.sport) : null;

    return {
      [BUSINESS.SPORT_ID]: sport ? sport.sportId : null,
      [BUSINESS.SPORT_NAME]: sport ? sport.name : null,
      [BUSINESS.EVENT_ID]: event?.eventId ?? null,
      [BUSINESS.EVENT_NAME]: event ? event.name : null,
    };
  }

  // race BroadcastsCard
  if (codecs.card.raceBroadcasts.isValid(urn)) {
    const getRaceByURN = createRaceByURNSelector();
    const getMeetingByURN = createMeetingByURNSelector();

    const race = getRaceByURN(entities.races, codecs.race.encode(urn.referenceId).uid);

    const meeting = getMeetingByURN(entities.meetings, race?.meeting);

    const sport = getSportByURN(entities.sports, meeting?.sportUrn);

    const meetingId = meeting ? codecs.meeting.decode(meeting.urn) : null;

    return {
      [BUSINESS.SPORT_ID]: sport ? sport.sportId : null,
      [BUSINESS.SPORT_NAME]: sport ? sport.name : null,
      [BUSINESS.EVENT_ID]: meetingId ? parseInt(meetingId, 10) : null,
      [BUSINESS.EVENT_NAME]: race && meeting ? `${meeting.entityName} - ${race.name}` : null,
    };
  }

  return null;
};

const buildRaceEvent = (entities: Entities, raceUrn: URN): MediaEvent => {
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const race = getRaceByURN(entities.races, raceUrn);
  const meeting = getMeetingByURN(entities.meetings, race?.meeting);
  const sport = getSportByURN(entities.sports, meeting?.sportUrn);

  return {
    [BUSINESS.SPORT_ID]: sport ? sport.sportId : null,
    [BUSINESS.SPORT_NAME]: sport ? sport.name : null,
    [BUSINESS.EVENT_ID]: meeting?.meetingId ? parseInt(meeting?.meetingId, 10) : null,
    [BUSINESS.EVENT_NAME]: race && meeting ? `${meeting.entityName} - ${race.name}` : null,
  };
};

const buildEvent = (entities: Entities, sportEventURN: URN): MediaEvent => {
  const sportEvent = getSportEventByURN(entities.sportevents, sportEventURN);
  const competition = sportEvent ? getCompetitionByURN(entities.competitions, sportEvent.competition) : null;
  const sport = competition ? getSportByURN(entities.sports, competition.sport) : null;

  return {
    [BUSINESS.SPORT_ID]: sport ? sport.sportId : null,
    [BUSINESS.SPORT_NAME]: sport ? sport.name : null,
    [BUSINESS.EVENT_ID]: sportEvent?.eventId ?? null,
    [BUSINESS.EVENT_NAME]: sportEvent ? sportEvent.name : null,
  };
};

// Fix: We shouldn't be treating urn's in the FE
export const getBroadcastsToggleEvent = (
  state: ApplicationState,
  isExpanded: boolean,
  cardUrn: string,
): BroadcastsMediaEvent | null => {
  const getBroadcastsCard = createCardByURNSelector<BroadcastsCards, URN>();

  const broadcastsCard = getBroadcastsCard(state.layouts.cards.broadcasts, cardUrn);
  if (!broadcastsCard) return null;

  const urn = codecs.parse(broadcastsCard.urn);
  if (!urn) return null;

  const mediaEvent = buildMediaEvent(state.entities, urn);

  if (!mediaEvent) return null;
  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    label: broadcastsCard.broadcasts.liveVideoUrl
      ? LiveStreamBroadcastsOptions.LiveVideo
      : LiveStreamBroadcastsOptions.DataViz,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getMediaPlayerLoadedEvent = (
  state: ApplicationState,
  label: string,
  cardUrn: string,
): BroadcastsMediaEvent | null => {
  const getBroadcastsCard = createCardByURNSelector<BroadcastsCards, URN>();

  const broadcastsCard = getBroadcastsCard(state.layouts.cards.broadcasts, cardUrn);
  if (!broadcastsCard) return null;

  const urn = codecs.parse(broadcastsCard.urn);
  if (!urn) return null;

  const mediaEvent = buildMediaEvent(state.entities, urn);

  if (!mediaEvent) return null;
  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: TaggingAction.SAW_VIDEO,
    label,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getTimeFormBroadCastsToggleEvent = (
  state: ApplicationState,
  isExpanded: boolean,
  cardUrn: string,
  raceUrn: string,
): BroadcastsMediaEvent | null => {
  const getTimeFormBroadCastsCard = createCardByURNSelector<TimeFormBroadCastsCards, URN>();
  const timeFormBroadCastsCard = getTimeFormBroadCastsCard(state.layouts.cards.timeformbroadcasts, cardUrn);

  if (!timeFormBroadCastsCard) return null;

  const mediaEvent = buildRaceEvent(state.entities, raceUrn);

  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    label: timeFormBroadCastsCard.broadcasts?.liveVideoUrl
      ? LiveStreamBroadcastsOptions.LiveVideo
      : LiveStreamBroadcastsOptions.DataViz,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getTimeFormBroadCastsMediaPlayerEvent = (
  state: ApplicationState,
  label: string,
  raceUrn: string,
): BroadcastsMediaEvent | null => {
  const mediaEvent = buildRaceEvent(state.entities, raceUrn);

  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: TaggingAction.SAW_VIDEO,
    label,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getBroadcastsAndStatisticsToggleEvent = (
  state: ApplicationState,
  isExpanded: boolean,
  cardUrn: string,
): BroadcastsMediaEvent | null => {
  const getBroadCastsAndStatisticsCard = createCardByURNSelector<BroadcastsAndStatisticsCards, URN>();
  const card = getBroadCastsAndStatisticsCard(state.layouts.cards.broadcastsandstatistics, cardUrn);

  if (!card) return null;

  const mediaEvent = buildEvent(state.entities, card.sportevent);

  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: isExpanded ? TaggingAction.SHOW : TaggingAction.HIDE,
    label: card.broadcasts?.liveVideoUrl ? LiveStreamBroadcastsOptions.LiveVideo : LiveStreamBroadcastsOptions.DataViz,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getBroadcastsAndStatisticsCardMediaPlayerEvent = (
  state: ApplicationState,
  label: string,
  cardUrn: string,
): BroadcastsMediaEvent | null => {
  const getBroadCastsAndStatisticsCard = createCardByURNSelector<BroadcastsAndStatisticsCards, URN>();
  const card = getBroadCastsAndStatisticsCard(state.layouts.cards.broadcastsandstatistics, cardUrn);

  if (!card) return null;
  const mediaEvent = buildEvent(state.entities, card.sportevent);

  if (!mediaEvent) return null;
  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: TaggingAction.SAW_VIDEO,
    label,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};

export const getRaceReplaysMediaPlayerEvent = (
  state: ApplicationState,
  label: string,
  marketUrn: string,
): BroadcastsMediaEvent | null => {
  const getSpbMarket = createSportsbookMarketByURNSelector();
  const getExcMarket = createExchangeMarketSelector();

  const market =
    getSpbMarket(state.entities.sportsbookmarkets, marketUrn) ??
    getExcMarket(state.entities.exchangemarkets, marketUrn);

  if (!market) return null;

  let mediaEvent;
  if (isRaceHierarchy(market.hierarchy)) {
    mediaEvent = buildRaceEvent(state.entities, market.hierarchy.race);
  }

  if (!mediaEvent) return null;
  return {
    event: "ga_event",
    category: TaggingCategory.MEDIA,
    action: TaggingAction.SAW_VIDEO,
    label,
    [APPLICATION.MODULE]: "media player",
    ...mediaEvent,
  };
};
