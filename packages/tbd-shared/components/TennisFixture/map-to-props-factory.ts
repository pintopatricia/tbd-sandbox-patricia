import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { TennisStatusReason } from "@ppb/tbd-store/state/entities/tennis-fixture/TennisFixture";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createTennisScoreboardByURNSelector } from "@ppb/tbd-store/state/entities/tennis-fixture/tennis-fixture-selectors";
import { getCompetitionByURN } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";
import {
  MatchStatus,
  MatchStatusReason,
  TeamType,
  ScoreData,
  TeamSide,
  TennisScoresType,
  TennisScoreboardProps,
  TennisFixtureCommonProps,
  ScoreboardViewMode,
} from "@ppb/the-wall-common/types";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { formatDateWithToday, formatTime } from "../../helpers/dates";
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

// TODO: Change this when Native US is Completed #1006346
export type CardPropsWeb = {
  event: string;
  teamA: TeamType;
  teamB: TeamType;
  teamServing?: TeamSide;
  score?: TennisScoresType;
  scoreData?: ScoreData[];
  date?: string;
  time?: string;
  dateTime?: Date;
  interrupted?: boolean;
  status?: MatchStatus;
  competition?: string;
  surface?: string;
  statusReason?: MatchStatusReason;
  showBottomSeparator?: boolean;
  labels: {
    inplay: string;
  };
};

export type CardProps = Omit<TennisScoreboardProps, "scoreData" | "teamA" | "teamB"> &
  TennisFixtureCommonProps &
  CardPropsWeb;

export type StateProps = CardProps | Record<string, never>;

const MATCH_STATUS_REASON: Partial<Record<TennisStatusReason, MatchStatusReason>> = {
  [TennisStatusReason.DISQUALIFICATION]: MatchStatusReason.DISQUALIFICATION,
  [TennisStatusReason.FINISHED]: MatchStatusReason.FINISHED,
  [TennisStatusReason.HEAT_DELAY]: MatchStatusReason.HEAT_DELAY,
  [TennisStatusReason.RAIN_DELAY]: MatchStatusReason.RAIN_DELAY,
  [TennisStatusReason.RETIREMENT]: MatchStatusReason.RETIREMENT,
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getTennisScoreboardByURN = createTennisScoreboardByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getSportEventByURN = createSportEventByURNSelector();

  const labels = { inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }) };

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, sporteventURN }: ContainerProps,
  ): StateProps {
    const tennisScoreboard = getTennisScoreboardByURN(state.entities.tennisfixtures, urn);
    if (!tennisScoreboard) return {};

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const { localeCodeBcp47, timezone } = <UserDetails>getUserDetailsSelector(state);

    const tennisCompetition = getCompetitionByURN(state.entities.competitions, competitionURN);

    const { scheduledStartTime, score, scoreData, currentSet, status: matchStatus, surface } = tennisScoreboard;

    const date = scheduledStartTime && formatDateWithToday(scheduledStartTime, localeCodeBcp47, timezone);

    const teamServing = currentSet?.currentGame?.teamServing && TeamSide[currentSet.currentGame.teamServing];

    const time = scheduledStartTime && formatTime(scheduledStartTime, localeCodeBcp47, timezone);

    const status = matchStatus?.status && MatchStatus[matchStatus.status];
    const statusReason = matchStatus?.reason ? MATCH_STATUS_REASON[matchStatus.reason] : undefined;

    const interrupted = statusReason === MatchStatusReason.HEAT_DELAY || statusReason === MatchStatusReason.RAIN_DELAY;

    const teamA: TeamType = {};
    const teamB: TeamType = {};

    const opponentsNames = getOpponentsNames(tennisScoreboard);
    if (opponentsNames) {
      teamA.name = opponentsNames.teamA;
      teamB.name = opponentsNames.teamB;
    }

    return {
      event: sportEvent.name,
      teamA,
      teamB,
      teamServing,
      score,
      scoreData,
      date,
      time,
      status,
      surface,
      statusReason,
      interrupted,
      competition: tennisCompetition?.name,
      dateTime: scheduledStartTime,
      labels,
    };
  };
};
