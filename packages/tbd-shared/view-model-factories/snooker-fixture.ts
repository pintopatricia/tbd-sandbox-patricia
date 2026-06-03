import { createSelector } from "reselect";
import { SnookerScore } from "@ppb/tbd-store/state/entities/snooker-fixture/SnookerFixture.types";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type SnookerScoreData = {
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

type SnookerProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: SnookerScore;
  sportEvent?: SportEvent;
};

type SnookerDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (openDate: string | undefined, localeCodeBcp47: string, timezone: string): SnookerDates => {
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

const formatScoreBoardData = (score: FormatedScore | undefined): ScoreData[] => {
  const data: ScoreData[] = [{ teamA: "-", teamB: "-", style: ScoreStyle.EMPTY }];

  if (!score) {
    return data;
  }

  data[0] = {
    teamA: score?.teamA || 0,
    teamB: score?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  return data;
};

const getMatchState = (score: SnookerScore | undefined): MatchStatus => {
  if (!score) {
    return MatchStatus.PRE_MATCH;
  }
  return MatchStatus.IN_PLAY;
};

export const createSnookerFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: SnookerProps) => userDetails,
      ({ sportEvent }: SnookerProps) => sportEvent,
      ({ isAmericanFormat }: SnookerProps) => isAmericanFormat,
      ({ score }: SnookerProps) => score,
    ],
    (userDetails, sportEvent, isAmericanFormat, score): SnookerScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);
      const matchStatus = getMatchState(score);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.away, teamB: score?.home }
        : { teamA: score?.home, teamB: score?.away };

      const scoreData = formatScoreBoardData(formatedScore);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
