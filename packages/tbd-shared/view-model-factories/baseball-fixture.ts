import { createSelector } from "reselect";
import {
  BaseballScore,
  BaseballPeriod,
  BaseballClock,
  BaseballInningScore,
} from "@ppb/tbd-store/state/entities/baseball-fixture/BaseballFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type BaseballScoreData = {
  scoreData: ScoreData[];
  matchStatus: MatchStatus;
  date?: string;
  dateTime?: Date;
  time?: string;
};

type FormatedScore = {
  teamA: number | undefined;
  teamB: number | undefined;
};

type FormatedInningScore = {
  score?: FormatedScore;
  period?: BaseballPeriod;
};

type BaseballProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: BaseballScore;
  clock?: BaseballClock;
  scorePerInning?: BaseballInningScore[];
  sportEvent?: SportEvent;
};

type BaseballDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (openDate: string | undefined, localeCodeBcp47: string, timezone: string): BaseballDates => {
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

const formatScoreBoardData = (
  inningScores: FormatedInningScore[] | undefined,
  score: FormatedScore | undefined,
  currentMatchStatus: BaseballPeriod | undefined,
): ScoreData[] => {
  const currentInningIndex = inningScores?.length || 0;

  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (!inningScores || !score || !currentMatchStatus) {
    return data;
  }

  if (currentMatchStatus === BaseballPeriod.END) {
    return [{ teamA: score?.teamA, teamB: score?.teamB, style: ScoreStyle.FINISHED }];
  }

  data[0] = {
    teamA: score?.teamA || 0,
    teamB: score?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  inningScores.forEach((element, index) => {
    data[index + 1] = {
      teamA: element.score?.teamA || 0,
      teamB: element.score?.teamB || 0,
      style: index + 1 === currentInningIndex ? ScoreStyle.DEFAULT : ScoreStyle.FINISHED,
    };
  });

  return data;
};

const getMatchState = (period: BaseballPeriod | undefined): MatchStatus => {
  if (!period || period === BaseballPeriod.PRE_MATCH) {
    return MatchStatus.PRE_MATCH;
  }

  if (period === BaseballPeriod.END) {
    return MatchStatus.END;
  }

  if (period === BaseballPeriod.UNKNOWN) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.IN_PLAY;
};

export const createBaseballFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: BaseballProps) => userDetails,
      ({ sportEvent }: BaseballProps) => sportEvent,
      ({ isAmericanFormat }: BaseballProps) => isAmericanFormat,
      ({ score }: BaseballProps) => score,
      ({ clock }: BaseballProps) => clock,
      ({ scorePerInning }: BaseballProps) => scorePerInning,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, clock, scorePerInning): BaseballScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(clock?.period);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.away, teamB: score?.home }
        : { teamA: score?.home, teamB: score?.away };

      const formatedInningScores = scorePerInning?.map((inningScore) => ({
        ...inningScore,
        ...(isAmericanFormat
          ? { score: { teamA: inningScore.score?.away, teamB: inningScore.score?.home } }
          : { score: { teamA: inningScore.score?.home, teamB: inningScore.score?.away } }),
      }));

      const scoreData = formatScoreBoardData(formatedInningScores, formatedScore, clock?.period);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
