import { createSelector } from "reselect";
import {
  BasketballPeriodScore,
  BasketballScore,
  BasketballPeriod,
  BasketballClock,
  BasketballSegment,
} from "@ppb/tbd-store/state/entities/basketball-fixture/BasketballFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type BasketballScoreData = {
  scoreData: ScoreData[];
  matchStatus: MatchStatus;
  prefixLabel: string;
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
  period?: BasketballPeriod;
  segment?: BasketballSegment;
};

type BasketballProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: BasketballScore;
  clock?: BasketballClock;
  periodScores?: BasketballPeriodScore[];
  sportEvent?: SportEvent;
};

type BasketballDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const END_STATES = [
  BasketballPeriod.END,
  BasketballPeriod.END_PERIOD_1,
  BasketballPeriod.END_PERIOD_2,
  BasketballPeriod.END_PERIOD_3,
  BasketballPeriod.END_PERIOD_4,
  BasketballPeriod.END_OVERTIME,
];

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): BasketballDates => {
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
  currentMatchStatus: BasketballPeriod | undefined,
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

  if (currentMatchStatus === BasketballPeriod.END) {
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

const getMatchState = (period: BasketballPeriod | undefined): MatchStatus => {
  if (!period || period === BasketballPeriod.UNKNOWN_PERIOD) {
    return MatchStatus.PRE_MATCH;
  }

  if (
    [
      BasketballPeriod.PERIOD_1,
      BasketballPeriod.END_PERIOD_1,
      BasketballPeriod.PERIOD_2,
      BasketballPeriod.END_PERIOD_2,
      BasketballPeriod.PERIOD_3,
      BasketballPeriod.END_PERIOD_3,
      BasketballPeriod.PERIOD_4,
      BasketballPeriod.END_PERIOD_4,
      BasketballPeriod.OVERTIME,
      BasketballPeriod.END_OVERTIME,
    ].includes(period)
  ) {
    return MatchStatus.IN_PLAY;
  }

  return MatchStatus.END;
};

const getPrefixLabel = (matchStatus: MatchStatus, clock?: BasketballClock): BasketballSegment | string => {
  if (!clock) {
    return "";
  }

  const { segment, timeRemaining } = clock;

  if (matchStatus === MatchStatus.END || !segment || timeRemaining === undefined) {
    return "";
  }

  return segment;
};

export const createBasketballFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: BasketballProps) => userDetails,
      ({ sportEvent }: BasketballProps) => sportEvent,
      ({ isAmericanFormat }: BasketballProps) => isAmericanFormat,
      ({ score }: BasketballProps) => score,
      ({ clock }: BasketballProps) => clock,
      ({ periodScores }: BasketballProps) => periodScores,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, clock, periodScores): BasketballScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(clock?.period);
      const prefixLabel = getPrefixLabel(matchStatus, clock);

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
        prefixLabel,
      };
    },
  );
