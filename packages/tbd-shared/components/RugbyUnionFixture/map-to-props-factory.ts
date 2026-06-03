import { MapStateToPropsFactory } from "react-redux";

import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createRugbyUnionFixtureByURNSelector } from "@ppb/tbd-store/state/entities/rugby-union-fixture/rugby-union-fixture-selectors";
import { MatchStatus, ScoreboardViewMode, ScoreData, ScoreStyle, TeamType } from "@ppb/the-wall-common/types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createRugbyUnionFixtureViewModel } from "../../view-model-factories/rugby-union-fixture";
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
  competition?: string;
  event: string;
  date?: string;
  dateTime?: Date;
  matchStatus: MatchStatus;
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
  const getRugbyUnionFixtureByURN = createRugbyUnionFixtureByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getRugbyUnionFixtureViewModel = createRugbyUnionFixtureViewModel();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    const userDetails = <UserDetails>getUserDetailsSelector(state);

    let date;
    let dateTime;
    let time;

    let scoreData: ScoreData[] = [
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
      { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    ];

    const rugbyUnionFixture = getRugbyUnionFixtureByURN(state.entities.rugbyunionfixtures, urn);

    if (!rugbyUnionFixture) return {};

    const { halfTimeScore, score, opponentsNames, isAmericanFormat } = rugbyUnionFixture;

    const competition = getCompetitionByURN(state.entities.competitions, competitionURN);

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const rugbyUnionScoreboard = getRugbyUnionFixtureViewModel({
      userDetails,
      sportEvent,
      score,
      isAmericanFormat,
      halfTimeScore,
    });

    if (rugbyUnionScoreboard) {
      ({ date, dateTime, time, scoreData } = rugbyUnionScoreboard);
    }

    const teamA: TeamType = {};
    const teamB: TeamType = {};

    if (opponentsNames) {
      teamA.name = opponentsNames.teamA;
      teamB.name = opponentsNames.teamB;
    }

    const matchStatus = score || halfTimeScore ? MatchStatus.IN_PLAY : MatchStatus.PRE_MATCH;

    return {
      competition: competition?.name,
      event: sportEvent.name,
      matchStatus,
      date,
      dateTime,
      scoreData,
      teamA,
      teamB,
      time,
      labels,
    };
  };
};
