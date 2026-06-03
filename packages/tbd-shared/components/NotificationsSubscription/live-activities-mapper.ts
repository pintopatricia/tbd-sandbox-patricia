import { createSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { EventViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { FixtureTeamSide, FootballMatchPeriod, FootballMatchStatus, PenaltyStatus } from "@ppb/tbd-store";
import { createGetNotificationsDeviceSelector } from "@ppb/tbd-store/state/entities/notifications/notifications-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

export type EventInfo = {
  id: string;
  name: string;
  isSubscribed: boolean;
  sportId?: string;
};

export type LiveActivityViewModelProps = {
  applicationTypeId: string;
  deviceId: string;
  locale: string;
  eventId: string;
  startTime: string;
  matchStatus: string;
  matchPeriod: string;
  teams: liveActivityViewModelTeams;
  score?: liveActivityViewModelScore;
  penaltyScore?: liveActivityViewModelScore;
  clock?: liveActivityViewModelClock;
};

export type liveActivityViewModelTeams = {
  home: liveActivityViewModelTeam;
  away: liveActivityViewModelTeam;
};

export type liveActivityViewModelTeam = {
  name: string;
  crest?: string;
};

export type liveActivityViewModelScore = {
  home: number;
  away: number;
};

export type liveActivityViewModelClock = {
  minutes: number;
  seconds: number;
};

export const createLiveActivityViewModel = () => {
  const getEventViewByURN = createViewByURNSelector<EventViews, URN>();
  const getSportEventByURN = createSportEventByURNSelector();
  const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  const getEventView = (state: ApplicationState) => {
    if (!state.router.currentUrn) {
      return undefined;
    }

    return getEventViewByURN(state.layouts.views.event, state.router.currentUrn);
  };

  return createSelector(
    [
      (state: ApplicationState) => {
        const eventView = getEventView(state);

        if (!eventView) {
          return undefined;
        }

        const event = getSportEventByURN(state.entities.sportevents, eventView.sportevent);
        return event;
      },
      (state: ApplicationState) => {
        const eventView = getEventView(state);

        if (!eventView) {
          return undefined;
        }

        const eventViewFixtureURN = eventView.items.find((item) => item.typename === "FixtureCard")?.urn;

        if (!eventViewFixtureURN) {
          return undefined;
        }

        const fixtureEntity = state.layouts.cards.fixtures[eventViewFixtureURN]?.fixture;

        if (!fixtureEntity || typeof fixtureEntity !== "string") {
          return undefined;
        }

        return state.entities.footballfixtures[fixtureEntity];
      },
      (state: ApplicationState) => getNotificationsDeviceSelector(state.notifications),
      getUserDetailsSelector,
    ],
    (event, footballFixture, deviceInfo, userDetails) => {
      if (
        !event ||
        !footballFixture ||
        !deviceInfo?.applicationTypeId ||
        !deviceInfo?.deviceId ||
        !userDetails?.localeCode
      ) {
        return null;
      }

      const eventId = event?.eventId?.toString();
      const startDate = event?.openDate;

      const { home, away, duration } = footballFixture;

      if (!eventId || !startDate) {
        return null;
      }

      const homeJersey = home?.crest?.small;
      const awayJersey = away?.crest?.small;

      const penaltyScore: liveActivityViewModelScore | undefined =
        footballFixture.penaltyShootout?.penaltyScores?.reduce(
          (acc, penaltyScore) => {
            if (penaltyScore.shotResult === PenaltyStatus.SCORE) {
              const home = penaltyScore.side === FixtureTeamSide.HOME ? acc.home + 1 : acc.home;
              const away = penaltyScore.side === FixtureTeamSide.AWAY ? acc.away + 1 : acc.away;

              return {
                home,
                away,
              };
            }
            return acc;
          },
          { home: 0, away: 0 } as liveActivityViewModelScore,
        );

      const liveActivityViewModel: LiveActivityViewModelProps = {
        applicationTypeId: deviceInfo.applicationTypeId,
        deviceId: deviceInfo.deviceId,
        locale: userDetails.localeCode,
        eventId: eventId,
        startTime: startDate,
        matchStatus: duration?.status ?? FootballMatchStatus.PRE_MATCH,
        matchPeriod: duration?.period ?? FootballMatchPeriod.REGULAR,
        teams: {
          home: {
            name: home?.name ?? "-",
            crest: homeJersey,
          },
          away: {
            name: away?.name ?? "-",
            crest: awayJersey,
          },
        },
        score: footballFixture.score,
        penaltyScore,
        clock: {
          minutes: duration?.clock?.minute ?? 0,
          seconds: duration?.clock?.second ?? 0,
        },
      };

      return liveActivityViewModel;
    },
  );
};
