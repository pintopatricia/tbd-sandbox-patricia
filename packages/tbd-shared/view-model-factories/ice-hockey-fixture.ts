import { createSelector } from "reselect";
import {
  IceHockeyScore,
  IceHockeyPeriod,
  IceHockeyClock,
  IceHockeyPeriodScore,
} from "@ppb/tbd-store/state/entities/ice-hockey-fixture/IceHockeyFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type IceHockeyScoreData = {
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
  period?: IceHockeyPeriod;
};

type IceHockeyProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: IceHockeyScore;
  clock?: IceHockeyClock;
  periodScores?: IceHockeyPeriodScore[];
  sportEvent?: SportEvent;
};

type IceHockeyDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const END_STATES = [
  IceHockeyPeriod.END,
  IceHockeyPeriod.END_PERIOD_1,
  IceHockeyPeriod.END_PERIOD_2,
  IceHockeyPeriod.END_PERIOD_3,
  IceHockeyPeriod.END_OVERTIME,
];

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): IceHockeyDates => {
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
  currentMatchStatus: IceHockeyPeriod | undefined,
): ScoreData[] => {
  const currentPeriodIndex = periodScores?.length || 0;
  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (!periodScores || !score || !currentMatchStatus) {
    return data;
  }

  if (currentMatchStatus === IceHockeyPeriod.END) {
    return [{ teamA: score?.teamA, teamB: score?.teamB, style: ScoreStyle.FINISHED }];
  }

  data[0] = {
    teamA: score?.teamA || 0,
    teamB: score?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  periodScores.forEach((element, index) => {
    data[index + 1] = {
      teamA: element.score?.teamA || 0,
      teamB: element.score?.teamB || 0,
      style:
        index + 1 === currentPeriodIndex && !END_STATES.includes(currentMatchStatus)
          ? ScoreStyle.DEFAULT
          : ScoreStyle.FINISHED,
    };
  });

  return data;
};

const getMatchState = (period: IceHockeyPeriod | undefined): MatchStatus => {
  if (!period) {
    return MatchStatus.PRE_MATCH;
  }

  if (
    [
      IceHockeyPeriod.PERIOD_1,
      IceHockeyPeriod.END_PERIOD_1,
      IceHockeyPeriod.PERIOD_2,
      IceHockeyPeriod.END_PERIOD_2,
      IceHockeyPeriod.PERIOD_3,
      IceHockeyPeriod.END_PERIOD_3,
      IceHockeyPeriod.PENALTIES,
      IceHockeyPeriod.OVERTIME,
      IceHockeyPeriod.END_OVERTIME,
    ].includes(period)
  ) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.END;
};

export const createIceHockeyFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: IceHockeyProps) => userDetails,
      ({ sportEvent }: IceHockeyProps) => sportEvent,
      ({ isAmericanFormat }: IceHockeyProps) => isAmericanFormat,
      ({ score }: IceHockeyProps) => score,
      ({ clock }: IceHockeyProps) => clock,
      ({ periodScores }: IceHockeyProps) => periodScores,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, clock, periodScores): IceHockeyScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(clock?.period);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.away, teamB: score?.home }
        : { teamA: score?.home, teamB: score?.away };

      const formatedPeriodScores = periodScores?.map((periodScore) => ({
        ...periodScore,
        ...(isAmericanFormat
          ? { score: { teamA: periodScore.score?.away, teamB: periodScore.score?.home } }
          : { score: { teamA: periodScore.score?.home, teamB: periodScore.score?.away } }),
      }));

      const scoreData = formatScoreBoardData(formatedPeriodScores, formatedScore, clock?.period);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
