import { getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";
import {
  AvBScore,
  FixtureTeamSide,
  FootballFixture,
  FootballMatchDuration,
  FootballMatchStatus,
  PenaltyShootout,
  PenaltyStatus,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  FootballScoreboardI18N,
  FootballScoreboardProps,
  PenaltiesKick,
  PenaltiesShootout,
} from "@ppb/the-wall-common/types";
import { createSelector } from "reselect";

import { formatDateWithToday, formatTime } from "../helpers/dates";
import { i18n } from "../helpers/i18n";

const PENALTIES_TO_DISPLAY = 5;

type PenaltiesToDisplay = {
  [FixtureTeamSide.HOME]: PenaltiesShootout;
  [FixtureTeamSide.AWAY]: PenaltiesShootout;
};

function isPenaltyShootoutStatus(matchDuration: FootballMatchDuration | undefined): boolean {
  return matchDuration?.status === FootballMatchStatus.PENALTY_SHOOTOUT;
}

function getPenaltyShootoutProps(
  penaltyShootout?: PenaltyShootout,
  duration?: FootballMatchDuration,
): {
  penaltyScore: AvBScore | undefined;
  penaltiesToDisplay: [PenaltiesShootout, PenaltiesShootout] | undefined;
} {
  let penaltyScore: AvBScore | undefined;
  let penaltiesToBeDisplayed: PenaltiesToDisplay | undefined;
  if (isPenaltyShootoutStatus(duration) || penaltyShootout) {
    penaltyScore = { home: 0, away: 0 };
    penaltiesToBeDisplayed = {
      [FixtureTeamSide.HOME]: [
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
      ],
      [FixtureTeamSide.AWAY]: [
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
        PenaltiesKick.PREPLAY,
      ],
    };
    if (penaltyShootout?.penaltyScores) {
      const allPenalties: {
        [FixtureTeamSide.HOME]: PenaltiesKick[];
        [FixtureTeamSide.AWAY]: PenaltiesKick[];
      } = {
        [FixtureTeamSide.HOME]: [],
        [FixtureTeamSide.AWAY]: [],
      };
      penaltyShootout.penaltyScores
        .slice() // SCA returns penalties ordered descending by kick order
        .reverse()
        .forEach((penaltyKick) => {
          allPenalties[penaltyKick.side].push(
            penaltyKick.shotResult === PenaltyStatus.SCORE ? PenaltiesKick.GOAL : PenaltiesKick.MISS,
          );
        });
      penaltyScore = {
        home: allPenalties[FixtureTeamSide.HOME].filter((kick) => kick === PenaltiesKick.GOAL).length,
        away: allPenalties[FixtureTeamSide.AWAY].filter((kick) => kick === PenaltiesKick.GOAL).length,
      };

      // we display only group of 5 penalties
      // for example: if we have 12 penalties, we want to display only the last 2 penalties
      const penaltiesCount = Math.max(
        allPenalties[FixtureTeamSide.HOME].length,
        allPenalties[FixtureTeamSide.AWAY].length,
      );
      allPenalties[FixtureTeamSide.HOME] = allPenalties[FixtureTeamSide.HOME].slice(
        penaltiesCount - (penaltiesCount % PENALTIES_TO_DISPLAY || PENALTIES_TO_DISPLAY),
      );
      allPenalties[FixtureTeamSide.AWAY] = allPenalties[FixtureTeamSide.AWAY].slice(
        penaltiesCount - (penaltiesCount % PENALTIES_TO_DISPLAY || PENALTIES_TO_DISPLAY),
      );
      for (let i = 0; i < PENALTIES_TO_DISPLAY; i += 1) {
        penaltiesToBeDisplayed[FixtureTeamSide.HOME][i] =
          allPenalties[FixtureTeamSide.HOME][i] || PenaltiesKick.PREPLAY;
        penaltiesToBeDisplayed[FixtureTeamSide.AWAY][i] =
          allPenalties[FixtureTeamSide.AWAY][i] || PenaltiesKick.PREPLAY;
      }
      if (isPenaltyShootoutStatus(duration) && penaltyShootout.nextTeamToShoot) {
        const nextPenaltyIndex = penaltiesToBeDisplayed[penaltyShootout.nextTeamToShoot].findIndex(
          (item: PenaltiesKick): boolean => item === PenaltiesKick.PREPLAY,
        );
        penaltiesToBeDisplayed[penaltyShootout.nextTeamToShoot][nextPenaltyIndex] = PenaltiesKick.INPLAY;
      }
    }
  }
  return {
    penaltyScore,
    penaltiesToDisplay: penaltiesToBeDisplayed
      ? [penaltiesToBeDisplayed[FixtureTeamSide.HOME], penaltiesToBeDisplayed[FixtureTeamSide.AWAY]]
      : undefined,
  };
}

export const createPropsForScoreboardVm = () =>
  createSelector(
    [
      (footballFixture: FootballFixture) => footballFixture,
      (_: FootballFixture, userDetails: UserDetails) => userDetails,
      (_: FootballFixture, __: UserDetails, inplay: boolean) => inplay,
    ],
    (footballFixture, userDetails, inplay): FootballScoreboardProps => {
      const { home, away, scheduledAt, score, firstLegScore, duration, penaltyShootout } = footballFixture;
      const { localeCodeBcp47, timezone } = userDetails;

      let date;
      let time;
      if (scheduledAt) {
        date = formatDateWithToday(scheduledAt, localeCodeBcp47, timezone);
        time = formatTime(scheduledAt, localeCodeBcp47, timezone);
      }

      const opponentsNames = getOpponentsNames(footballFixture);
      const homeTeam = {
        name: opponentsNames?.teamA || home?.name,
        crestUrl: home?.crest?.vector || home?.crest?.large,
        color: home?.color,
      };

      const awayTeam = {
        name: opponentsNames?.teamB || away?.name,
        crestUrl: away?.crest?.vector || away?.crest?.large,
        color: away?.color,
      };

      let scoreboardDuration;
      if (duration) {
        scoreboardDuration = {
          period: duration.period,
          status: duration.status,
          clock: duration?.clock?.minute !== undefined ? duration.clock.minute + 1 : undefined,
          extraTime: duration.stoppageMinutes,
        };
      }

      const penalties = getPenaltyShootoutProps(penaltyShootout, duration);

      const scoreboardI18n: FootballScoreboardI18N = {
        i18n: {
          penalties: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.PENALTIES" }),
          pen: i18n({ key: "I18N.RECENT_FORM.PEN" }),
          half: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.HALF" }),
          full: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FULL" }),
          versus: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.VERSUS" }),
          firstLeg: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.FIRST_LEG" }),
          error: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.ERROR" }),
          extraTime: i18n({ key: "I18N.FOOTBALL_SCOREBOARD.EXTRA_TIME" }),
          inplay: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }),
        },
      };

      const stats = footballFixture.stats?.find(
        ({ periodStatus, period }) => periodStatus === FootballMatchStatus.FULL && !period,
      );

      const redCards = { home: stats?.home?.redCards ?? 0, away: stats?.away?.redCards ?? 0 };

      return {
        home: homeTeam,
        away: awayTeam,
        date,
        time,
        dateTime: scheduledAt,
        score,
        firstLegScore,
        penaltyScore: penalties?.penaltyScore,
        penaltyShootout: penalties?.penaltiesToDisplay,
        duration: scoreboardDuration,
        translations: scoreboardI18n,
        inplay,
        redCards,
      };
    },
  );
