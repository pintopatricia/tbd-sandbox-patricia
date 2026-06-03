import { MapStateToPropsFactory } from "react-redux";

import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createVolleyballFixtureByURNSelector } from "@ppb/tbd-store/state/entities/volleyball-fixture/volleyball-fixture-selectors";
import { createGetExchangeMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { MatchStatus, ScoreData, TeamType, TeamSide, ScoreStyle, ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { VolleyballSet } from "@ppb/tbd-store/state/entities/volleyball-fixture/VolleyballFixture";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  UserDetails,
  OfflineUserDetails,
  isOnlineUserDetails,
} from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import URN from "@ppb/tbd-store/state/layout/URN";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createVolleyballScoreboardByURNSelector } from "../../view-model-factories/volleyball-fixture";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  competition?: URN;
  sporteventURN: URN;
  availableToSubscribe?: boolean;
  icon?: Icons;
  showBottomSeparator?: boolean;
  showEventDateBelow?: boolean;
  showHorizontalDuration?: boolean;
  viewMode: ScoreboardViewMode;
  notificationsSubscription?: boolean;
  videoAvailable?: boolean;
};

export type CardProps = {
  competition?: string;
  event: string;
  currentSet?: VolleyballSet;
  date?: string;
  dateTime?: Date;
  matchStatus?: MatchStatus;
  scoreData: ScoreData[];
  teamServing?: TeamSide;
  teamA: TeamType;
  teamB: TeamType;
  time?: string;
  labels: {
    inplay: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getVolleyballFixtureByURN = createVolleyballFixtureByURNSelector();
  const getSportEventByURN = createSportEventByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getExchangeMarketByHierarchy = createGetExchangeMarketByHierarchySelector();
  const getSportsbookMarketByHierarchy = createGetSportsbookMarketByHierarchySelector();
  const getVolleyballFixtureScoreboardByURN = createVolleyballScoreboardByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    let currentSet;
    let matchStatus;
    let teamServing;
    let date;
    let dateTime;
    let time;
    let teamA: TeamType = {};
    let teamB: TeamType = {};
    let scoreData: ScoreData[] = [{ teamA: "", teamB: "", style: ScoreStyle.FINISHED }];

    const fixture = getVolleyballFixtureByURN(state.entities.volleyballfixtures, urn);
    if (!fixture) return {};

    let userOnlineOrOffline: UserDetails | OfflineUserDetails;
    try {
      userOnlineOrOffline = getUserDetailsSelector(state);
    } catch (e) {
      console.error(e);
      return {};
    }
    if (!isOnlineUserDetails(userOnlineOrOffline)) return {};

    const userDetails = userOnlineOrOffline;

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const volleyballCompetition = getCompetitionByURN(state.entities.competitions, competitionURN);
    const exchangeMarket =
      volleyballCompetition &&
      getExchangeMarketByHierarchy(state.entities.exchangemarkets, {
        sporteventURN: sportEvent.urn,
        competitionURN: volleyballCompetition.urn,
      });
    const sportsbookMarket =
      volleyballCompetition &&
      getSportsbookMarketByHierarchy(state.entities.sportsbookmarkets, {
        sporteventURN: sportEvent.urn,
        competitionURN: volleyballCompetition.urn,
      });

    const market = sportsbookMarket || exchangeMarket;
    const volleyballScoreboard = getVolleyballFixtureScoreboardByURN({
      fixture,
      sportEvent,
      userDetails,
      marketStatus: market?.status,
      inplay: market?.inplay,
    });

    if (volleyballScoreboard) {
      ({ scoreData, teamA, teamB, currentSet, matchStatus, teamServing, date, dateTime, time } = volleyballScoreboard);
    }

    return {
      event: sportEvent.name,
      currentSet,
      scoreData,
      matchStatus,
      teamA,
      teamB,
      teamServing,
      competition: volleyballCompetition?.name,
      date,
      dateTime,
      time,
      labels,
    };
  };
};
