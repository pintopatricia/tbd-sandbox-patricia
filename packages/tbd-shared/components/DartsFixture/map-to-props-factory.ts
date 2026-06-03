import { MapStateToPropsFactory } from "react-redux";

import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createDartsFixtureByURNSelector } from "@ppb/tbd-store/state/entities/darts-fixture/darts-fixture-selectors";
import { MatchStatus, ScoreboardViewMode, ScoreData, ScoreStyle, TeamType } from "@ppb/the-wall-common/types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { DartsSet } from "@ppb/tbd-store/state/entities/darts-fixture/DartsFixture";

import { createDartsFixtureViewModel } from "../../view-model-factories/darts-fixture";
import { i18n } from "../../helpers/i18n";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

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
  currentSet?: DartsSet;
  isDartsCouponScoreboardEnabled?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getDartsFixtureByURN = createDartsFixtureByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getDartsFixtureViewModel = createDartsFixtureViewModel();

  const getThrottle = createGetThrottleSelector();

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

    let scoreData: ScoreData[] = [{ teamA: "-", teamB: "-", style: ScoreStyle.EMPTY }];

    const dartsFixture = getDartsFixtureByURN(state.entities.dartsfixtures, urn);

    if (!dartsFixture) return {};

    const { score, type, opponentsNames, isAmericanFormat, currentSet } = dartsFixture;

    const competition = getCompetitionByURN(state.entities.competitions, competitionURN);

    const sportEvent = getSportEventByURN(state.entities.sportevents, sporteventURN);
    if (!sportEvent) {
      return {};
    }

    const dartsScoreboard = getDartsFixtureViewModel({
      userDetails,
      sportEvent,
      score,
      type,
      isAmericanFormat,
      currentSet,
    });

    if (dartsScoreboard) {
      ({ date, dateTime, time, scoreData, matchStatus } = dartsScoreboard);
    }

    const teamA: TeamType = {};
    const teamB: TeamType = {};

    if (opponentsNames) {
      teamA.name = opponentsNames.teamA;
      teamB.name = opponentsNames.teamB;
    }

    const dartsThrottle = getThrottle(state.entities.throttles, "DARTS_COUPON_SCOREBOARD");
    const isDartsCouponScoreboardEnabled = !!dartsThrottle?.isActive;

    return {
      competition: competition?.name,
      event: sportEvent.name,
      date,
      dateTime,
      isDartsCouponScoreboardEnabled,
      matchStatus,
      scoreData,
      teamA,
      teamB,
      time,
      labels,
      currentSet,
    };
  };
};
