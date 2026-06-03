import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";

import { MatchStatus, ScoreboardViewMode, TeamSide, TeamType } from "@ppb/the-wall-common/types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCricketFixtureByURNSelector } from "@ppb/tbd-store/state/entities/cricket-fixture/cricket-fixture-selectors";
import { createGetExchangeMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { createCricketFixtureViewModel, CricketScoreData } from "../../view-model-factories/cricket-fixture";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  sporteventURN: URN;
  competition?: URN;
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
  event: string;
  competition?: string;
  date?: string;
  dateTime?: Date;
  matchStatus?: MatchStatus;
  cricketScoreData?: CricketScoreData;
  teamA: TeamType;
  teamB: TeamType;
  teamServing?: TeamSide;
  time?: string;
  labels: {
    inplay: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getCricketFixtureByURN = createCricketFixtureByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getExchangeMarketByHierarchy = createGetExchangeMarketByHierarchySelector();
  const getSportsbookMarketByHierarchy = createGetSportsbookMarketByHierarchySelector();
  const getCricketFixtureViewModel = createCricketFixtureViewModel();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    const fixture = getCricketFixtureByURN(state.entities.cricketfixtures, urn);

    if (!fixture) return {};

    const userDetails = <UserDetails>getUserDetailsSelector(state);

    const competition = getCompetitionByURN(state.entities.competitions, competitionURN);
    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);

    if (!sportEvent) {
      return {};
    }

    const exchangeMarket =
      competition &&
      getExchangeMarketByHierarchy(state.entities.exchangemarkets, { sporteventURN, competitionURN: competition.urn });
    const sportsbookMarket =
      competition &&
      getSportsbookMarketByHierarchy(state.entities.sportsbookmarkets, {
        sporteventURN,
        competitionURN: competition.urn,
      });

    const market = sportsbookMarket || exchangeMarket;

    const { matchStatus, cricketScoreData, teamA, teamB, teamServing, date, dateTime, time } =
      getCricketFixtureViewModel({
        fixture,
        userDetails,
        sportEvent,
        marketStatus: market?.status,
        marketInplay: market?.inplay || false,
      });

    return {
      event: sportEvent.name,
      competition: competition?.name,
      date,
      dateTime,
      matchStatus,
      cricketScoreData,
      teamA,
      teamB,
      teamServing,
      time,
      labels,
    };
  };
};
