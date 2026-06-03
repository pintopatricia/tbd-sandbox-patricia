import { MapStateToPropsFactory } from "react-redux";

import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createBasketballFixtureByURNSelector } from "@ppb/tbd-store/state/entities/basketball-fixture/basketball-fixture-selectors";
import { MatchStatus, ScoreboardViewMode, ScoreData, ScoreStyle, TeamType } from "@ppb/the-wall-common/types";
import { BasketballClock } from "@ppb/tbd-store/state/entities/basketball-fixture/BasketballFixture";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createBasketballFixtureViewModel } from "../../view-model-factories/basketball-fixture";
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
  clock?: BasketballClock;
  competition?: string;
  event: string;
  date?: string;
  dateTime?: Date;
  matchStatus: MatchStatus;
  prefixLabel: string;
  scoreData: ScoreData[];
  teamA: TeamType;
  teamB: TeamType;
  time?: string;
  labels: {
    inplay: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getBasketballFixtureByURN = createBasketballFixtureByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getBasketballFixtureViewModel = createBasketballFixtureViewModel();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    const userDetails = <UserDetails>getUserDetailsSelector(state);

    let date;
    let dateTime;
    let time;
    let matchStatus: MatchStatus = MatchStatus.END;
    let prefixLabel = "";

    let scoreData: ScoreData[] = [
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    ];

    const basketballFixture = getBasketballFixtureByURN(state.entities.basketballfixtures, urn);

    if (!basketballFixture) return {};

    const { clock, periodScores, score, opponentsNames, isAmericanFormat } = basketballFixture;

    const competition = getCompetitionByURN(state.entities.competitions, competitionURN);

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const basketballScoreboard = getBasketballFixtureViewModel({
      userDetails,
      sportEvent,
      periodScores,
      score,
      isAmericanFormat,
      clock,
    });

    if (basketballScoreboard) {
      ({ date, dateTime, time, scoreData, matchStatus, prefixLabel } = basketballScoreboard);
    }

    const teamA: TeamType = {};
    const teamB: TeamType = {};

    if (opponentsNames) {
      teamA.name = opponentsNames.teamA;
      teamB.name = opponentsNames.teamB;
    }

    return {
      clock,
      competition: competition?.name,
      event: sportEvent.name,
      date,
      dateTime,
      matchStatus,
      prefixLabel,
      scoreData,
      teamA,
      teamB,
      time,
      labels,
    };
  };
};
