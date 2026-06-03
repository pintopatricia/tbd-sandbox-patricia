import { createSelector } from "reselect";
import { CricketFixture, CricketScore } from "@ppb/tbd-store/state/entities/cricket-fixture/CricketFixture.types";
import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle, TeamSide, TeamType } from "@ppb/the-wall-common/types";
import { getAmericanFormatScoreData, getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type FormatScoreLabelPayload = {
  matchStatus: MatchStatus;
  runs?: number;
  wickets?: number;
  teamSide?: TeamSide;
  inningNumber?: number;
  currentTeamBatting?: TeamSide;
  currentInning?: number;
};

type FormatCricketScoreDataPayload = {
  matchStatus: MatchStatus;
  score?: CricketScore;
  currentTeamBatting?: TeamSide;
  currentInning?: number;
  isAmericanFormat: boolean;
};

/**
 * Object that represents the cricket scoreData to use in the visual components
 */
export type CricketScoreData = {
  scoreData: ScoreData[];
  teamATotalRuns: number;
  teamBTotalRuns: number;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): {
  date?: string;
  dateTime?: Date;
  time?: string;
} => {
  if (!openDate) {
    return {};
  }

  const sportEventDate = new Date(openDate);

  return {
    date: formatDateWithToday(sportEventDate, localeCodeBcp47, timezone),
    time: formatTime(sportEventDate, localeCodeBcp47, timezone),
    dateTime: sportEventDate,
  };
};

/**
 * Return the correct MatchStatus
 */
const getMatchState = (
  marketInplay: boolean,
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus,
  hasScores?: boolean,
): MatchStatus.END | MatchStatus.IN_PLAY | MatchStatus.PRE_MATCH => {
  if (marketStatus === ExchangeMarketStatus.Closed) {
    return MatchStatus.END;
  }

  if (marketInplay || hasScores) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.PRE_MATCH;
};

/**
 * Return the correct score label
 *
 * If the corresponding teamSide is not the same as the current team batting in the store
 *            AND
 * the wickets are 0
 * - return a hyphen
 *
 * If the wickets are defined (including the value 0)
 *            AND
 * the corresponding teamSide is the same as the current team batting in the store
 *            AND
 * the corresponding inningNumber is the same as the current inning in the store
 *            AND
 * the matchStatus is not END
 * - return the runs and the wickets with a / in between
 *
 * In any other case
 * - return only the runs
 */
const formatScoreLabel = ({
  matchStatus,
  runs,
  wickets,
  teamSide,
  inningNumber,
  currentTeamBatting,
  currentInning,
}: FormatScoreLabelPayload): string => {
  if (teamSide !== currentTeamBatting && runs === 0) {
    return "-";
  }

  if (
    (wickets || wickets === 0) &&
    teamSide === currentTeamBatting &&
    inningNumber === currentInning &&
    matchStatus !== MatchStatus.END
  ) {
    return `${runs}/${wickets}`;
  }

  return `${runs}`;
};

/**
 * Return the correct ScoreStyle
 *
 * If this is the last inning and the match status is IN_PLAY
 * - return the GREEN_BACKGROUND style
 *
 * In any other case
 * - retuen the BORDER style
 */
const formatScoreStyle = (lastInning: boolean | undefined, matchStatus: MatchStatus): ScoreStyle => {
  if (lastInning && matchStatus === MatchStatus.IN_PLAY) {
    return ScoreStyle.IN_PLAY;
  }

  return ScoreStyle.FINISHED;
};

type RawScoreData = {
  score: Required<FormatCricketScoreDataPayload>["score"];
  matchStatus: FormatCricketScoreDataPayload["matchStatus"];
  currentTeamBatting: FormatCricketScoreDataPayload["currentTeamBatting"];
  currentInning: FormatCricketScoreDataPayload["currentInning"];
  isAmericanFormat: FormatCricketScoreDataPayload["isAmericanFormat"];
};

const getLastInningNumber = (score: CricketScore): number => {
  let lastInning = 0;
  score.home?.forEach(({ inningNumber }) => {
    if (inningNumber && inningNumber > lastInning) {
      lastInning = inningNumber;
    }
  });
  score.away?.forEach(({ inningNumber }) => {
    if (inningNumber && inningNumber > lastInning) {
      lastInning = inningNumber;
    }
  });
  return lastInning;
};

/**
 * Format the CricketScore (the store format) to a CricketScoreData (to use in the visual components)
 */
const formatCricketScoreData = ({
  matchStatus,
  score,
  currentTeamBatting,
  currentInning,
  isAmericanFormat,
}: RawScoreData): CricketScoreData => {
  let teamATotalRuns = 0;
  let teamBTotalRuns = 0;
  const scoreData = [{ teamA: "-", teamB: "-", style: formatScoreStyle(true, matchStatus) }];

  const { home: homeScore, away: awayScore } = score;

  const lastInningNumber = getLastInningNumber(score);

  homeScore?.forEach(({ runs, wickets, inningNumber }, index) => {
    if (runs || runs === 0) {
      const isLastInning = lastInningNumber === index + 1;

      scoreData[index] = {
        teamA: formatScoreLabel({
          matchStatus,
          runs,
          wickets,
          teamSide: TeamSide.HOME,
          inningNumber,
          currentTeamBatting,
          currentInning,
        }),
        teamB: "-",
        style: formatScoreStyle(isLastInning, matchStatus),
      };
      teamATotalRuns += runs;
    }
  });

  awayScore?.forEach(({ runs, wickets, inningNumber }, index) => {
    if (runs || runs === 0) {
      let teamA;
      let style;
      if (!scoreData[index]) {
        teamA = "-";

        const isLastInning = lastInningNumber === index + 1;
        style = formatScoreStyle(isLastInning, matchStatus);
      } else {
        ({ teamA, style } = scoreData[index]);
      }

      scoreData[index] = {
        teamA,
        teamB: formatScoreLabel({
          matchStatus,
          runs,
          wickets,
          teamSide: TeamSide.AWAY,
          inningNumber,
          currentTeamBatting,
          currentInning,
        }),
        style,
      };
      teamBTotalRuns += runs;
    }
  });

  return {
    teamATotalRuns: isAmericanFormat ? teamBTotalRuns : teamATotalRuns,
    teamBTotalRuns: isAmericanFormat ? teamATotalRuns : teamBTotalRuns,
    scoreData: scoreData.map(({ teamA, teamB, style }) => ({
      ...getAmericanFormatScoreData({ teamA, teamB, isAmericanFormat }),
      style,
    })),
  };
};

type CricketScoreboardData = {
  matchStatus: MatchStatus;
  cricketScoreData?: CricketScoreData;
  teamA: TeamType;
  teamB: TeamType;
  teamServing?: TeamSide;
  date?: string;
  dateTime?: Date;
  time?: string;
};

type CricketData = {
  fixture: CricketFixture;
  userDetails: UserDetails;
  sportEvent?: SportEvent;
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus;
  marketInplay: boolean;
};

export const createCricketFixtureViewModel = () =>
  createSelector(
    [
      ({ fixture }: CricketData) => fixture,
      ({ userDetails }: CricketData) => userDetails,
      ({ sportEvent }: CricketData) => sportEvent,
      ({ marketStatus }: CricketData) => marketStatus,
      ({ marketInplay }: CricketData) => marketInplay,
    ],
    (fixture, userDetails, sportEvent, marketStatus, marketInplay): CricketScoreboardData => {
      const { score, currentTeamBatting, currentTime, isAmericanFormat } = fixture;
      const { localeCodeBcp47, timezone } = userDetails;

      const teamA: TeamType = {};
      const teamB: TeamType = {};

      const opponentsNames = getOpponentsNames(fixture);
      if (opponentsNames) {
        teamA.name = opponentsNames.teamA;
        teamB.name = opponentsNames.teamB;
      }

      const matchStatus = getMatchState(marketInplay, marketStatus, !!score);

      const canHaveScore = [MatchStatus.IN_PLAY, MatchStatus.END].includes(matchStatus) && !!score;

      const cricketScoreData = canHaveScore
        ? formatCricketScoreData({
            matchStatus,
            score,
            currentTeamBatting,
            currentInning: currentTime?.inning,
            isAmericanFormat,
          })
        : undefined;

      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);

      const teamServing =
        matchStatus === MatchStatus.IN_PLAY && currentTeamBatting ? TeamSide[currentTeamBatting] : undefined;

      return {
        matchStatus,
        cricketScoreData,
        teamA,
        teamB,
        teamServing,
        date,
        dateTime,
        time,
      };
    },
  );
