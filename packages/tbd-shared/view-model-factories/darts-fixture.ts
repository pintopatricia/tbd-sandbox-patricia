import { createSelector } from "reselect";
import { DartsFixtureType, DartsScore, DartsSet } from "@ppb/tbd-store/state/entities/darts-fixture/DartsFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, ScoreStyle } from "@ppb/the-wall-common/types";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type DartsScoreData = {
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

type DartsProps = {
  userDetails: UserDetails;
  isAmericanFormat: boolean;
  score?: DartsScore;
  currentSet?: DartsSet;
  type?: DartsFixtureType;
  sportEvent?: SportEvent;
};

type DartsDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (openDate: string | undefined, localeCodeBcp47: string, timezone: string): DartsDates => {
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

const getMatchStatus = (score: DartsScore | undefined, currentSet: DartsSet | undefined): MatchStatus => {
  // If explicit set data exists, match is IN_PLAY
  if (currentSet) {
    return MatchStatus.IN_PLAY;
  }
  // If valid score exists (not 0-0), match is IN_PLAY
  if (score) {
    const home = score.home || 0;
    const away = score.away || 0;
    if (home === 0 && away === 0) return MatchStatus.PRE_MATCH;
    return MatchStatus.IN_PLAY;
  }
  return MatchStatus.PRE_MATCH;
};

const formatScoreBoardData = (
  score: DartsScore | undefined,
  currentSet: DartsSet | undefined,
  type: DartsFixtureType | undefined,
  matchStatus: MatchStatus,
  isAmericanFormat: boolean,
): ScoreData[] => {
  const data: ScoreData[] = [{ teamA: "-", teamB: "-", style: ScoreStyle.EMPTY }];

  if (!score) {
    return data;
  }

  const getTeamScores = (s: DartsScore): FormatedScore =>
    isAmericanFormat ? { teamA: s.away, teamB: s.home } : { teamA: s.home, teamB: s.away };

  const mainScore = getTeamScores(score);

  // LOGIC FOR SETS MATCH (White Sets | Blue Legs)
  if (type === DartsFixtureType.SETS) {
    // Column 1: Main Score (Sets Won)
    // Style: DEFAULT (White Background)
    data[0] = {
      teamA: mainScore.teamA ?? 0,
      teamB: mainScore.teamB ?? 0,
      style: ScoreStyle.DEFAULT,
    };

    // Column 2: Current Set (Legs)
    // Style: IN_PLAY (Blue Background)
    if (currentSet?.score) {
      const currentSetScore = getTeamScores(currentSet.score);
      data[1] = {
        teamA: currentSetScore.teamA ?? 0,
        teamB: currentSetScore.teamB ?? 0,
        style: ScoreStyle.IN_PLAY,
      };
    }
    return data;
  }

  // LOGIC FOR LEGS MATCH (Blue Legs)
  // Just show one column with IN_PLAY style
  data[0] = {
    teamA: mainScore.teamA ?? 0,
    teamB: mainScore.teamB ?? 0,
    style: matchStatus === MatchStatus.IN_PLAY ? ScoreStyle.IN_PLAY : ScoreStyle.DEFAULT,
  };

  return data;
};

export const createDartsFixtureViewModel = () =>
  createSelector(
    [
      ({ userDetails }: DartsProps) => userDetails,
      ({ sportEvent }: DartsProps) => sportEvent,
      ({ isAmericanFormat }: DartsProps) => isAmericanFormat,
      ({ score }: DartsProps) => score,
      ({ currentSet }: DartsProps) => currentSet,
      ({ type }: DartsProps) => type,
    ],
    (userDetails, sportEvent, isAmericanFormat, score, currentSet, type): DartsScoreData | undefined => {
      if (!sportEvent) {
        return undefined;
      }

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);

      const matchStatus = getMatchStatus(score, currentSet);

      const scoreData = formatScoreBoardData(score, currentSet, type, matchStatus, isAmericanFormat);

      return {
        date,
        dateTime,
        time,
        scoreData,
        matchStatus,
      };
    },
  );
