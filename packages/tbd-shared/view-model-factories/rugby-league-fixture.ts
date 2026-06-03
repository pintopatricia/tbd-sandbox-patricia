import { createSelector } from "reselect";
import { RugbyLeagueScore } from "@ppb/tbd-store/state/entities/rugby-league-fixture/RugbyLeagueFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type RugbyLeagueScoreData = {
  scoreData: ScoreData[];
  date?: string;
  dateTime?: Date;
  time?: string;
};

type FormatedScore = {
  teamA: number | undefined;
  teamB: number | undefined;
};

type RugbyLeagueProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: RugbyLeagueScore;
  halfTimeScore?: RugbyLeagueScore;
  sportEvent?: SportEvent;
};

type RugbyLeagueDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): RugbyLeagueDates => {
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
  score: FormatedScore | undefined,
  halfTimeScore: FormatedScore | undefined,
): ScoreData[] => {
  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (!score || !halfTimeScore) {
    return data;
  }

  data[0] = {
    teamA: score?.teamA || 0,
    teamB: score?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  data[1] = {
    teamA: halfTimeScore?.teamA || 0,
    teamB: halfTimeScore?.teamB || 0,
    style: ScoreStyle.IN_PLAY,
  };

  return data;
};

export const createRugbyLeagueFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: RugbyLeagueProps) => userDetails,
      ({ sportEvent }: RugbyLeagueProps) => sportEvent,
      ({ isAmericanFormat }: RugbyLeagueProps) => isAmericanFormat,
      ({ score }: RugbyLeagueProps) => score,
      ({ halfTimeScore }: RugbyLeagueProps) => halfTimeScore,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, halfTimeScore): RugbyLeagueScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);

      const formatedScore = isAmericanFormat
        ? { teamA: score?.away, teamB: score?.home }
        : { teamA: score?.home, teamB: score?.away };

      const formatedHalfTimeScore = isAmericanFormat
        ? { teamA: halfTimeScore?.away, teamB: halfTimeScore?.home }
        : { teamA: halfTimeScore?.home, teamB: halfTimeScore?.away };

      const scoreData = formatScoreBoardData(formatedScore, formatedHalfTimeScore);

      return {
        date,
        dateTime,
        time,
        scoreData,
      };
    },
  );
