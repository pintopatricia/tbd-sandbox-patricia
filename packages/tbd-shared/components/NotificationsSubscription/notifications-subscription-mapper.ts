import { codecs, eventCodec, raceCodec } from "@ppb/tbd-urn-codecs";
import { createSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getSportsbookReport } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  BettingMetadata,
  BettingRacingMetadata,
  BettingGenericMetadata,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import {
  createSportIdEventTypeMapper,
  EventType,
  Topic,
} from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  createGetNotificationsDeviceSelector,
  createGetSubscribedEventIdsSelector,
  createGetUnsupportedEventIdsSelector,
  createIsEventSubscribedByEventIdSelector,
} from "@ppb/tbd-store/state/entities/notifications/notifications-selectors";
import { getCompetitionByURN } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { getSportByURN } from "@ppb/tbd-store/state/entities/sports/sport-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createSportsbookBetSelector } from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { createSportsbookBetLegsSelector } from "@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { EventViews, RaceViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { getIncidentsByEventType } from "../../helpers/notifications";
import { formatTime } from "../../helpers/dates";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";

export type EventInfo = {
  id: string;
  name: string;
  isSubscribed: boolean;
  sportId?: string;
};

export const createPushNotificationsDataBuilderFromReport = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
  const getSubscribedEventIds = createGetSubscribedEventIdsSelector();
  const getUnsupportedEventIds = createGetUnsupportedEventIdsSelector();
  const getThrottle = createGetThrottleSelector();

  return createSelector(
    [
      getSportsbookReport,
      getUserDetailsSelector,
      (state: ApplicationState) => getNotificationsDeviceSelector(state.notifications),
      (state: ApplicationState) => getSubscribedEventIds(state.notifications),
      (state: ApplicationState) => getUnsupportedEventIds(state.notifications),
      (state: ApplicationState) => getThrottle(state.entities.throttles, "HR_PUSH_NOTIFICATIONS_SUPPORT")?.isActive,
    ],
    (report, userDetails, deviceInfo, subscribedEventIds, unsupportedEventIds, isHRThrottleActive) => {
      if (!report) {
        return null;
      }

      const {
        result: { legs },
        metadata,
      } = report;
      const reportLegs = Object.values(legs);
      const topics: Topic[] = [];
      const unsupportedTopics: string[] = [];
      const receiptSubscribedEventIds: string[] = [];
      const receiptUnsupportedEventIds: string[] = [];
      let showNotificationsToggle = false;

      reportLegs.forEach((leg) => {
        const { runners } = leg;
        const [legRunnerId] = runners;

        const runnerMetadata: BettingMetadata = metadata[legRunnerId];

        const sportIdEventTypeMapper = createSportIdEventTypeMapper(!!isHRThrottleActive);

        const eventType = sportIdEventTypeMapper[runnerMetadata.sportId];

        let eventId;

        // currently we should show push toggle only in HR and Football
        if (eventType === EventType.HORSE_RACE) {
          const { racing } = runnerMetadata as BettingRacingMetadata;
          eventId = codecs.race.decode(racing.urn);
        } else if (eventType === EventType.FOOTBALL) {
          const { eventUrn } = runnerMetadata as BettingGenericMetadata;
          eventId = codecs.fixture.decode(eventUrn);
        } else {
          // handle push toggle for unsupported eventTypes
          const { eventUrn } = runnerMetadata as BettingGenericMetadata;
          if (eventUrn) eventId = codecs.fixture.decode(eventUrn);
          // handle push toggle for racing unsupported eventTypes
          if (!eventId) {
            const { racing } = runnerMetadata as BettingRacingMetadata;
            eventId = codecs.race.decode(racing.urn);
          }
        }

        if (eventId && eventType) {
          showNotificationsToggle = true;

          if (subscribedEventIds.includes(eventId)) {
            receiptSubscribedEventIds.push(eventId);
          } else if (unsupportedEventIds.includes(eventId)) {
            receiptUnsupportedEventIds.push(eventId);
          }

          topics.push({
            topicId: eventId,
            eventType,
            incidentTypes: getIncidentsByEventType(eventType),
          });
        } else if (eventId && !eventType) {
          if (unsupportedEventIds.includes(eventId)) {
            receiptUnsupportedEventIds.push(eventId);
          }
          unsupportedTopics.push(eventId);
        }
      });

      // checks if all events in betreceipt are already subscribed
      const areAllEventsSubscribed =
        reportLegs.length === receiptSubscribedEventIds.length + receiptUnsupportedEventIds.length;

      // checks if all events in betreceipt are unsupported
      const isNotificationsUnavailable = reportLegs.length === receiptUnsupportedEventIds.length;

      const isSystemPushEnabled = deviceInfo?.registerOptions?.notificationPreferences?.globalNotifications;

      const isNotificationsSelected = areAllEventsSubscribed && !isNotificationsUnavailable && isSystemPushEnabled;

      return {
        applicationTypeId: deviceInfo?.applicationTypeId,
        deviceId: deviceInfo?.deviceId,
        isSystemPushEnabled,
        locale: userDetails.localeCode,
        showNotificationsToggle,
        isNotificationsSelected,
        isNotificationsUnavailable,
        areAllEventsSubscribed,
        topics,
        unsupportedTopics,
      };
    },
  );
};

export const createPushNotificationsDataFromUrn = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getRaceByURN = createRaceByURNSelector();
  const isEventSubscribedByEventId = createIsEventSubscribedByEventIdSelector();
  const getViewTypeSelector = createViewTypeSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getSportsbookMarketByHierarchy = createGetSportsbookMarketByHierarchySelector();

  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();

  const getEventViewByURN = createViewByURNSelector<EventViews, URN>();
  const getRaceViewByURN = createViewByURNSelector<RaceViews, URN>();

  return createSelector(
    [
      getUserDetailsSelector,
      (state: ApplicationState) => getNotificationsDeviceSelector(state.notifications),
      (state: ApplicationState) => state,
      (state: ApplicationState) => state.router.currentUrn,
    ],
    (userDetails, deviceInfo, state, viewUrn) => {
      if (!viewUrn) {
        return null;
      }

      const topics: Topic[] = [];
      const unsupportedTopics: string[] = [];

      let currentUrn;

      const sportView = getEventViewByURN(state.layouts.views.event, viewUrn);

      if (sportView) {
        currentUrn = sportView.sportevent;
      }

      const sportEvent = currentUrn ? getSportEventByURN(state.entities.sportevents, currentUrn) : undefined;

      const raceView = getRaceViewByURN(state.layouts.views.race, viewUrn);

      if (raceView) {
        currentUrn = raceView.race;
      }

      const race = currentUrn ? getRaceByURN(state.entities.races, currentUrn) : undefined;
      const { localeCodeBcp47, timezone, localeCode } = userDetails;
      const pageType = getViewTypeSelector(state);

      let moduleName = "";

      const isRacing = !!race;
      const eventType = isRacing ? EventType.HORSE_RACE : EventType.FOOTBALL;

      const eventId = isRacing ? race.raceId : sportEvent?.eventId?.toString();

      let areAllEventsSubscribed = false;

      const events: EventInfo[] = [];

      if (eventId) {
        areAllEventsSubscribed = isEventSubscribedByEventId(state.notifications, eventId);

        if (sportEvent) {
          const competition = getCompetitionByURN(state.entities.competitions, sportEvent.competition);
          if (!competition) {
            return null;
          }

          const sport = getSportByURN(state.entities.sports, competition.sport);

          if (!sport || !sportEvent.competition || !currentUrn) {
            return null;
          }

          const market = getSportsbookMarketByHierarchy(state.entities.sportsbookmarkets, {
            sporteventURN: currentUrn,
            competitionURN: sportEvent.competition,
          });

          const inPlaySuffix = market?.inplay ? "in_play" : "pre_match";

          moduleName = `${pageType} - notifications - ${sport.name} - ${competition.name} - ${sportEvent.name} - ${inPlaySuffix}`;
        }

        if (isRacing) {
          const meeting = getMeetingByURN(state.entities.meetings, race.meeting);
          if (!meeting) {
            return null;
          }

          const sport = getSportByURN(state.entities.sports, meeting.sportUrn);
          if (!sport) {
            return null;
          }

          moduleName = `${pageType} - notifications - ${sport.name} - ${meeting.venue} - ${race.name} ${formatTime(
            race.startTime,
            localeCodeBcp47,
            timezone,
          )}`;
        }

        events.push({
          id: eventId,
          name: "",
          isSubscribed: areAllEventsSubscribed,
        });

        topics.push({
          topicId: eventId,
          eventType,
          incidentTypes: getIncidentsByEventType(eventType),
        });
      }

      return {
        applicationTypeId: deviceInfo?.applicationTypeId,
        deviceId: deviceInfo?.deviceId,
        isSystemPushEnabled: deviceInfo?.registerOptions?.notificationPreferences?.globalNotifications,
        locale: localeCode,
        areAllEventsSubscribed,
        moduleName,
        unsupportedTopics,
        topics,
        events,
      };
    },
  );
};

export const createPushNotificationsDataFromSportsbookBet = () => {
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const getSportsbookBetLegsByURN = createSportsbookBetLegsSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
  const getSubscribedEventIds = createGetSubscribedEventIdsSelector();
  const getUnsupportedEventIds = createGetUnsupportedEventIdsSelector();
  const getThrottle = createGetThrottleSelector();

  return createSelector(
    [
      (state: ApplicationState, betURN: string | undefined) =>
        betURN ? getSportsbookBetByURN(state.betting.sportsbookbets, betURN) : null,
      (state: ApplicationState) => state.entities.sportsbookbetlegs,
      getUserDetailsSelector,
      (state: ApplicationState) => getNotificationsDeviceSelector(state.notifications),
      (state: ApplicationState) => getSubscribedEventIds(state.notifications),
      (state: ApplicationState) => getUnsupportedEventIds(state.notifications),
      (state: ApplicationState) => getThrottle(state.entities.throttles, "HR_PUSH_NOTIFICATIONS_SUPPORT")?.isActive,
      (state: ApplicationState) => getThrottle(state.entities.throttles, "MYBETS_BELL")?.isActive,
    ],
    (
      bet,
      sportsbookbetlegs,
      userDetails,
      deviceInfo,
      subscribedEventIds,
      unsupportedEventIds,
      isHRThrottleActive,
      isMyBetsBellActive,
    ) => {
      if (!bet || bet.isSettled || !isMyBetsBellActive) {
        return null;
      }

      const { legs, betType } = bet;

      const betLegs = getSportsbookBetLegsByURN(sportsbookbetlegs, legs);
      const legParts = betLegs?.flatMap(({ parts }) => parts) || [];

      if (!legParts.length) {
        return null;
      }

      const topics: Topic[] = [];
      const unsupportedTopics: string[] = [];
      const myBetsSubscribedEventIds: string[] = [];
      const myBetsUnsupportedEventIds: string[] = [];
      const sportIdEventTypeMapper = createSportIdEventTypeMapper(!!isHRThrottleActive);

      const events: EventInfo[] = [];

      const uniqueEventsOrRaces = new Set(
        legParts.map((part) => part.raceUrn || part.eventUrn).filter((urn): urn is string => !!urn),
      );

      uniqueEventsOrRaces.forEach((urn) => {
        const { parts } = betLegs?.find(({ parts }) => parts[0].raceUrn === urn || parts[0].eventUrn === urn) ?? {};
        const legPart = parts?.[0];

        if (!legPart) return;

        const isRacing = !!legPart.raceUrn;
        const eventOrRaceId = isRacing ? raceCodec.decode(urn) : eventCodec.decode(urn);

        if (!eventOrRaceId) return;

        const eventType = legPart.sportId && sportIdEventTypeMapper[Number.parseInt(legPart.sportId, 10)];

        if (eventType) {
          const isEventSubscribed = subscribedEventIds.includes(eventOrRaceId);

          if (isEventSubscribed) {
            myBetsSubscribedEventIds.push(eventOrRaceId);
          } else if (unsupportedEventIds.includes(eventOrRaceId)) {
            myBetsUnsupportedEventIds.push(eventOrRaceId);
          }

          events.push({
            id: eventOrRaceId,
            name: legPart.eventDescription,
            isSubscribed: isEventSubscribed,
            sportId: legPart.sportId,
          });
          topics.push({
            topicId: eventOrRaceId,
            eventType,
            incidentTypes: getIncidentsByEventType(eventType),
          });
        } else {
          if (unsupportedEventIds.includes(eventOrRaceId)) {
            myBetsUnsupportedEventIds.push(eventOrRaceId);
          }
          unsupportedTopics.push(eventOrRaceId);
        }
      });

      // checks if all events in my bets are already subscribed
      const areAllEventsSubscribed =
        uniqueEventsOrRaces.size === myBetsSubscribedEventIds.length + myBetsUnsupportedEventIds.length;

      // checks if all events in my bets are unsupported
      const isNotificationsUnavailable = uniqueEventsOrRaces.size === myBetsUnsupportedEventIds.length;

      const isSystemPushEnabled = deviceInfo?.registerOptions?.notificationPreferences?.globalNotifications;

      const isNotificationsSelected = areAllEventsSubscribed && !isNotificationsUnavailable && isSystemPushEnabled;

      // Get sportId from the first supported leg part for analytics
      const sportId = events[0]?.sportId;

      return {
        applicationTypeId: deviceInfo?.applicationTypeId,
        deviceId: deviceInfo?.deviceId,
        isSystemPushEnabled,
        locale: userDetails.localeCode,
        isNotificationsSelected,
        isNotificationsUnavailable,
        areAllEventsSubscribed,
        topics,
        unsupportedTopics,
        events,
        betType,
        sportId,
      };
    },
  );
};

export const createPushNotificationsDataFromRace = () => {
  const isEventSubscribedByEventId = createIsEventSubscribedByEventIdSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();

  return createSelector(
    [
      getUserDetailsSelector,
      (state: ApplicationState) => getNotificationsDeviceSelector(state.notifications),
      (state: ApplicationState) => state.notifications,
      (_: ApplicationState, raceId: string) => raceId,
    ],
    (userDetails, deviceInfo, notifications, raceId) => {
      const topics: Topic[] = [];
      const unsupportedTopics: string[] = [];

      const { localeCode } = userDetails;

      let areAllEventsSubscribed = false;

      const events: EventInfo[] = [];

      areAllEventsSubscribed = isEventSubscribedByEventId(notifications, raceId);

      events.push({
        id: raceId,
        name: "",
        isSubscribed: areAllEventsSubscribed,
      });

      topics.push({
        topicId: raceId,
        eventType: EventType.HORSE_RACE,
        incidentTypes: getIncidentsByEventType(EventType.HORSE_RACE),
      });

      return {
        applicationTypeId: deviceInfo?.applicationTypeId,
        deviceId: deviceInfo?.deviceId,
        isSystemPushEnabled: deviceInfo?.registerOptions?.notificationPreferences?.globalNotifications,
        locale: localeCode,
        areAllEventsSubscribed,
        unsupportedTopics,
        topics,
        events,
      };
    },
  );
};

export const createLiveActivityPayload = () => {
  const getEventViewByURN = createViewByURNSelector<EventViews, URN>();
  const getSportEventByURN = createSportEventByURNSelector();

  return createSelector(
    [(state: ApplicationState) => state, (state: ApplicationState) => state.router.currentUrn],
    (state, viewUrn) => {
      if (!viewUrn) {
        return null;
      }

      let currentUrn;
      const sportView = getEventViewByURN(state.layouts.views.event, viewUrn);
      if (sportView) {
        currentUrn = sportView.sportevent;
      }

      const sportEvent = currentUrn ? getSportEventByURN(state.entities.sportevents, currentUrn) : undefined;
      const eventId = sportEvent?.eventId?.toString();
      const startDate = sportEvent?.openDate;

      if (!eventId || !startDate) {
        return null;
      }

      const fixture = state.entities.footballfixtures["ppb:fixture:" + eventId];

      if (!fixture) {
        return null;
      }

      const homeJerseys = fixture.home?.jerseys;
      const awayJerseys = fixture.away?.jerseys;

      return {
        eventId: eventId,
        startTime: startDate,
        matchStatus: fixture.duration?.status || "PRE_MATCH",
        matchPeriod: fixture.duration?.period || "REGULAR",
        teams: {
          home: {
            name: fixture.home?.name || "-",
            crest: homeJerseys ? homeJerseys[0]?.url : undefined,
          },
          away: {
            name: fixture.away?.name || "-",
            crest: awayJerseys ? awayJerseys[0]?.url : undefined,
          },
        },
        score: fixture.score,
        penaltyScore: undefined,
        clock: {
          minutes: fixture.duration?.clock?.minute || 0,
          seconds: fixture.duration?.clock?.second || 0,
        },
      };
    },
  );
};
