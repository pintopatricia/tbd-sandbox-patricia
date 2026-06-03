import { MapStateToPropsFactory } from "react-redux";

import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createTableTennisFixtureByURNSelector } from "@ppb/tbd-store/state/entities/table-tennis-fixture/table-tennis-fixture-selectors";
import { createGetExchangeMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { MatchStatus, ScoreData, TeamType, TeamSide, ScoreStyle, ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { TableTennisSet } from "@ppb/tbd-store/state/entities/table-tennis-fixture/TableTennisFixture.types";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import URN from "@ppb/tbd-store/state/layout/URN";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createTableTennisScoreboardByURNSelector } from "../../view-model-factories/table-tennis-fixture";
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
  currentSet?: TableTennisSet;
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
  const getTableTennisFixtureByURN = createTableTennisFixtureByURNSelector();
  const getSportEventByURN = createSportEventByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getExchangeMarketByHierarchy = createGetExchangeMarketByHierarchySelector();
  const getSportsbookMarketByHierarchy = createGetSportsbookMarketByHierarchySelector();
  const getTableTennisFixtureScoreboardByURN = createTableTennisScoreboardByURNSelector();
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    let currentSet;
    let matchStatus;
    let tableTennisScoreboard;
    let teamServing;
    let date;
    let dateTime;
    let time;
    let teamA: TeamType = {};
    let teamB: TeamType = {};
    let scoreData: ScoreData[] = [{ teamA: "", teamB: "", style: ScoreStyle.FINISHED }];

    const fixture = getTableTennisFixtureByURN(state.entities.tabletennisfixtures, urn);

    if (!fixture) return {};
    const userDetails = <UserDetails>getUserDetails(state);

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const tableTennisCompetition = sportEvent && getCompetitionByURN(state.entities.competitions, competitionURN);
    const exchangeMarket =
      sportEvent &&
      tableTennisCompetition &&
      getExchangeMarketByHierarchy(state.entities.exchangemarkets, {
        sporteventURN: sportEvent.urn,
        competitionURN: tableTennisCompetition.urn,
      });
    const sportsbookMarket =
      sportEvent &&
      tableTennisCompetition &&
      getSportsbookMarketByHierarchy(state.entities.sportsbookmarkets, {
        sporteventURN: sportEvent.urn,
        competitionURN: tableTennisCompetition.urn,
      });

    const market = sportsbookMarket || exchangeMarket;
    if (sportEvent) {
      tableTennisScoreboard = getTableTennisFixtureScoreboardByURN({
        fixture,
        sportEvent,
        userDetails,
        marketStatus: market?.status,
        inplay: market?.inplay,
      });

      if (tableTennisScoreboard) {
        ({ scoreData, teamA, teamB, currentSet, matchStatus, teamServing, date, dateTime, time } =
          tableTennisScoreboard);
      }
    }

    return {
      event: sportEvent.name,
      currentSet,
      scoreData,
      matchStatus,
      teamA,
      teamB,
      teamServing,
      competition: tableTennisCompetition?.name,
      date,
      dateTime,
      time,
      labels,
    };
  };
};
