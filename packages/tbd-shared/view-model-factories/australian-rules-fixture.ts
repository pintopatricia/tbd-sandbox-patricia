import { createSelector } from "reselect";
import {
  AustralianRulesScoreBoard,
  AustralianRulesPeriod,
  AustralianRulesPeriodScore,
} from "@ppb/tbd-store/state/entities/australian-rules-fixture/AustralianRulesFixture.types";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type AustralianRulesScoreData = {
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

type FormatedPeriodScore = {
  score?: FormatedScore;
  period?: AustralianRulesPeriod;
};

type AustralianRulesProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: AustralianRulesScoreBoard;
  periodScores?: AustralianRulesPeriodScore[];
  sportEvent?: SportEvent;
};

type AustralianRulesDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): AustralianRulesDates => {
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
  periodScores: FormatedPeriodScore[] | undefined,
  score: FormatedScore | undefined,
): ScoreData[] => {
  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (!periodScores || !score) {
    return data;
  }

  data[0] = {
    teamA: score.teamA || 0,
    teamB: score.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  periodScores.forEach((element, index) => {
    data[index + 1] = {
      teamA: element.score?.teamA || 0,
      teamB: element.score?.teamB || 0,
      style: ScoreStyle.DEFAULT,
    };
  });

  return data;
};

const getMatchState = (score: AustralianRulesScoreBoard | undefined): MatchStatus => {
  if (!score || (!score?.goals && !score?.points && !score?.behinds)) {
    return MatchStatus.PRE_MATCH;
  }
  return MatchStatus.IN_PLAY;
};

export const createAustralianRulesFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: AustralianRulesProps) => userDetails,
      ({ sportEvent }: AustralianRulesProps) => sportEvent,
      ({ isAmericanFormat }: AustralianRulesProps) => isAmericanFormat,
      ({ score }: AustralianRulesProps) => score,
      ({ periodScores }: AustralianRulesProps) => periodScores,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, periodScores): AustralianRulesScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(score);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.points?.away, teamB: score?.points?.home }
        : { teamA: score?.points?.home, teamB: score?.points?.away };

      const formatedPeriodScores = periodScores?.map((periodScore) => ({
        ...periodScore,
        ...(isAmericanFormat
          ? { score: { teamA: periodScore.score?.points?.away, teamB: periodScore.score?.points?.home } }
          : { score: { teamA: periodScore.score?.points?.home, teamB: periodScore.score?.points?.away } }),
      }));

      const scoreData = formatScoreBoardData(formatedPeriodScores, formatedScore);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
