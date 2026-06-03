import { codecs, URN as CodecURN } from "@ppb/tbd-urn-codecs";
import { VideoSawEvent, buildVideoSawEvent } from "tagging-library";
import { ApplicationState, Entities } from "../../state";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { isRaceHierarchy } from "../../helpers/markets";
import URN from "../../state/layout/URN";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { createSportsbookMarketByURNSelector } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { BroadcastsAndStatisticsCards, BroadcastsCards } from "../../state/layout/cards/Card.types";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import {
  BroadcastsAndStatisticsCardMediaPlayerLoadedAction,
  MediaPlayerLoadedAction,
  TimeFormBroadCastsCardMediaPlayerAction,
  RaceReplaysMediaPlayerLoadedAction,
} from "../../actions/media";
import { formatTime } from "../../helpers/dates";

type MediaEvent = {
  sportId: string;
  sport: string;
  eventId: string;
  eventName: string;
};

const buildMediaEvent = (entities: Entities, urn: CodecURN): MediaEvent | null => {
  // event BroadcastsCard
  if (codecs.card.eventBroadcasts.isValid(urn)) {
    const event = getSportEventByURN(entities.sportevents, codecs.event.encode(urn.referenceId).uid);
    const competition = event ? getCompetitionByURN(entities.competitions, event.competition) : null;
    const sport = competition ? getSportByURN(entities.sports, competition.sport) : null;

    return {
      sportId: sport?.sportId?.toString() || "null",
      sport: sport?.name || "null",
      eventId: event?.eventId?.toString() || "null",
      eventName: event?.name || "null",
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
      sportId: sport?.sportId?.toString() || "",
      sport: sport?.name || "",
      eventId: meetingId || "",
      eventName: `${formatTime(race.startTime)} ${meeting.venue}`,
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
    sportId: sport ? `${sport.sportId}` : "null",
    sport: sport ? `${sport.name}` : "null",
    eventId: meeting?.meetingId ? meeting.meetingId : "null",
    eventName: race && meeting ? `${formatTime(race?.startTime)} ${meeting?.venue}` : "null",
  };
};

const buildEvent = (entities: Entities, sportEventURN: URN): MediaEvent => {
  const sportEvent = getSportEventByURN(entities.sportevents, sportEventURN);
  const competition = sportEvent ? getCompetitionByURN(entities.competitions, sportEvent.competition) : null;
  const sport = competition ? getSportByURN(entities.sports, competition.sport) : null;

  return {
    sportId: sport?.sportId?.toString() || "null",
    sport: sport?.name || "null",
    eventId: sportEvent?.eventId?.toString() || "null",
    eventName: sportEvent?.name || "null",
  };
};

export const getMediaPlayerLoadedEvent = (
  action: MediaPlayerLoadedAction,
  state: ApplicationState,
): VideoSawEvent | null => {
  const { label, cardUrn } = action.payload;
  const getBroadcastsCard = createCardByURNSelector<BroadcastsCards, URN>();
  const broadcastsCard = getBroadcastsCard(state.layouts.cards.broadcasts, cardUrn);
  if (!broadcastsCard) return null;

  const urn = codecs.parse(broadcastsCard.urn);
  if (!urn) return null;

  const mediaEvent = buildMediaEvent(state.entities, urn);
  if (!mediaEvent) return null;

  return buildVideoSawEvent({
    action: TaggingAction.SAW_VIDEO,
    elementText: label,
    module: "media player",
    error: "null",
    videoProviderId: "null",
    videoStreamId: "null",
    videoStreamName: "null",
    ...mediaEvent,
  });
};

export const getTimeFormBroadCastsMediaPlayerEvent = (
  action: TimeFormBroadCastsCardMediaPlayerAction,
  state: ApplicationState,
): VideoSawEvent | null => {
  const { label, raceUrn } = action.payload;
  const mediaEvent = buildRaceEvent(state.entities, raceUrn);

  return buildVideoSawEvent({
    action: TaggingAction.SAW_VIDEO,
    elementText: label,
    module: "media player",
    error: "null",
    videoProviderId: "null",
    videoStreamId: "null",
    videoStreamName: "null",
    ...mediaEvent,
  });
};

export const getBroadcastsAndStatisticsCardMediaPlayerEvent = (
  action: BroadcastsAndStatisticsCardMediaPlayerLoadedAction,
  state: ApplicationState,
): VideoSawEvent | null => {
  const { label, cardUrn } = action.payload;
  const getBroadCastsAndStatisticsCard = createCardByURNSelector<BroadcastsAndStatisticsCards, URN>();
  const card = getBroadCastsAndStatisticsCard(state.layouts.cards.broadcastsandstatistics, cardUrn);
  if (!card) return null;

  const mediaEvent = buildEvent(state.entities, card.sportevent);
  if (!mediaEvent) return null;

  return buildVideoSawEvent({
    action: TaggingAction.SAW_VIDEO,
    elementText: label,
    module: "media player",
    error: "null",
    videoProviderId: "null",
    videoStreamId: "null",
    videoStreamName: "null",
    ...mediaEvent,
  });
};

export const getRaceReplaysMediaPlayerEvent = (
  action: RaceReplaysMediaPlayerLoadedAction,
  state: ApplicationState,
): VideoSawEvent | null => {
  const { marketUrn } = action.payload;

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

  return buildVideoSawEvent({
    action: TaggingAction.SAW_VIDEO,
    elementText: "race replay",
    module: "media player",
    error: "null",
    videoProviderId: "null",
    videoStreamId: "null",
    videoStreamName: "null",
    ...mediaEvent,
  });
};
