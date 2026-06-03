import { createSelector } from "reselect";
import {
  AmericanFootballScore,
  AmericanFootballPeriod,
  AmericanFootballClock,
  AmericanFootballQuarterScore,
} from "@ppb/tbd-store/state/entities/american-football-fixture/AmericanFootballFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type AmericanFootballScoreData = {
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

type FormatedQuarterScore = {
  score?: FormatedScore;
  period?: AmericanFootballPeriod;
};

type AmericanFootballProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: AmericanFootballScore;
  clock?: AmericanFootballClock;
  quarterScores?: AmericanFootballQuarterScore[];
  sportEvent?: SportEvent;
};

type AmericanFootballDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): AmericanFootballDates => {
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

const END_STATES = [
  AmericanFootballPeriod.END,
  AmericanFootballPeriod.END_PERIOD_1,
  AmericanFootballPeriod.END_PERIOD_2,
  AmericanFootballPeriod.END_PERIOD_3,
  AmericanFootballPeriod.END_PERIOD_4,
  AmericanFootballPeriod.END_OVERTIME,
];

const formatScoreBoardData = (
  quarterScores: FormatedQuarterScore[] | undefined,
  score: FormatedScore | undefined,
  currentMatchStatus: AmericanFootballPeriod | undefined,
): ScoreData[] => {
  const currentQuarterIndex = quarterScores?.length || 0;
  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (!quarterScores || !score || !currentMatchStatus) {
    return data;
  }

  if (currentMatchStatus === AmericanFootballPeriod.END) {
    return [{ teamA: score?.teamA, teamB: score?.teamB, style: ScoreStyle.FINISHED }];
  }

  data[0] = {
    teamA: score?.teamA || 0,
    teamB: score?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  quarterScores.forEach((element, index) => {
    data[index + 1] = {
      teamA: element.score?.teamA || 0,
      teamB: element.score?.teamB || 0,
      style:
        index + 1 === currentQuarterIndex && !END_STATES.includes(currentMatchStatus)
          ? ScoreStyle.DEFAULT
          : ScoreStyle.FINISHED,
    };
  });

  return data;
};

const getMatchState = (period: AmericanFootballPeriod | undefined): MatchStatus => {
  if (!period) {
    return MatchStatus.PRE_MATCH;
  }

  if (
    [
      AmericanFootballPeriod.PERIOD_1,
      AmericanFootballPeriod.END_PERIOD_1,
      AmericanFootballPeriod.PERIOD_2,
      AmericanFootballPeriod.END_PERIOD_2,
      AmericanFootballPeriod.PERIOD_3,
      AmericanFootballPeriod.END_PERIOD_3,
      AmericanFootballPeriod.PERIOD_4,
      AmericanFootballPeriod.END_PERIOD_4,
      AmericanFootballPeriod.OVERTIME,
      AmericanFootballPeriod.END_OVERTIME,
    ].includes(period)
  ) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.END;
};

export const createAmericanFootballFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: AmericanFootballProps) => userDetails,
      ({ sportEvent }: AmericanFootballProps) => sportEvent,
      ({ isAmericanFormat }: AmericanFootballProps) => isAmericanFormat,
      ({ score }: AmericanFootballProps) => score,
      ({ clock }: AmericanFootballProps) => clock,
      ({ quarterScores }: AmericanFootballProps) => quarterScores,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, clock, quarterScores): AmericanFootballScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(clock?.period);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.away, teamB: score?.home }
        : { teamA: score?.home, teamB: score?.away };

      const formatedQuarterScores = quarterScores?.map((quarterScore) => ({
        ...quarterScore,
        ...(isAmericanFormat
          ? { score: { teamA: quarterScore.score?.away, teamB: quarterScore.score?.home } }
          : { score: { teamA: quarterScore.score?.home, teamB: quarterScore.score?.away } }),
      }));

      const scoreData = formatScoreBoardData(formatedQuarterScores, formatedScore, clock?.period);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
