import { createSelector } from "reselect";
import type { ExchangeMarketStatus, SportsbookMarketStatus } from "@ppb/tbd-store";
import {
  TableTennisFixture,
  TableTennisSet,
  TableTennisScore,
} from "@ppb/tbd-store/state/entities/table-tennis-fixture/TableTennisFixture.types";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, TeamType, TeamSide, ScoreStyle } from "@ppb/the-wall-common/types";
import { getAmericanFormatScoreData, getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type FormatScoreDataPayload = {
  previousSets?: TableTennisSet[];
  currentSet?: TableTennisSet;
  setsWon?: TableTennisScore;
  matchStatus?: MatchStatus;
  isAmericanFormat: boolean;
};

type TableTennisScoreData = {
  currentSet?: TableTennisSet;
  matchStatus?: MatchStatus;
  scoreData: ScoreData[];
  teamA: TeamType;
  teamB: TeamType;
  teamServing?: TeamSide;
  date?: string;
  dateTime?: Date;
  time?: string;
};

type TableTennisProps = {
  fixture: TableTennisFixture;
  sportEvent: SportEvent;
  userDetails: UserDetails;
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus;
  inplay?: boolean;
};

type TableTennisDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): TableTennisDates => {
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

const formatScore = ({
  style,
  score,
  isAmericanFormat,
}: {
  style: ScoreStyle;
  score?: TableTennisScore;
  isAmericanFormat: boolean;
}): ScoreData => ({
  ...getAmericanFormatScoreData({
    teamA: score?.home ?? 0,
    teamB: score?.away ?? 0,
    isAmericanFormat,
  }),
  style,
});

const formatScoreboardData = ({
  previousSets,
  currentSet,
  setsWon,
  matchStatus,
  isAmericanFormat,
}: FormatScoreDataPayload): ScoreData[] => {
  const data: ScoreData[] = [
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
    { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  ];

  if (matchStatus === MatchStatus.END && setsWon) {
    return [{ teamA: setsWon.home, teamB: setsWon.away, style: ScoreStyle.FINISHED }];
  }

  if (!previousSets || !setsWon) {
    return data;
  }

  data[0] = formatScore({ style: ScoreStyle.DEFAULT, score: setsWon, isAmericanFormat });

  previousSets.forEach((previousSet, index) => {
    data[index + 1] = formatScore({ style: ScoreStyle.FINISHED, score: previousSet.score, isAmericanFormat });
  });

  if (currentSet?.number) {
    data[currentSet.number] = formatScore({
      style: ScoreStyle.IN_PLAY,
      score: currentSet.score,
      isAmericanFormat,
    });
  }

  return data;
};

const getMatchState = (
  currentSet?: TableTennisSet,
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus,
  isMarketInplay?: boolean,
  previousSets?: TableTennisSet[],
): MatchStatus => {
  if (marketStatus === "OPEN" && !isMarketInplay) {
    return MatchStatus.PRE_MATCH;
  }

  if (
    marketStatus === "CLOSED" ||
    (isMarketInplay !== undefined && !isMarketInplay) ||
    (!isMarketInplay && previousSets?.length)
  ) {
    return MatchStatus.END;
  }
  return currentSet ? MatchStatus.IN_PLAY : MatchStatus.PRE_MATCH;
};

export const createTableTennisScoreboardByURNSelector = () =>
  createSelector(
    [
      ({ fixture }: TableTennisProps) => fixture,
      ({ sportEvent }: TableTennisProps) => sportEvent,
      ({ userDetails }: TableTennisProps) => userDetails,
      ({ marketStatus }: TableTennisProps) => marketStatus,
      ({ inplay }: TableTennisProps) => inplay,
    ],
    (fixture, sportEvent, userDetails, marketStatus, inplay): TableTennisScoreData | undefined => {
      if (!fixture) return undefined;

      const { currentSet, previousSets, setsWon, isAmericanFormat } = fixture;

      const matchStatus = getMatchState(currentSet, marketStatus, inplay, previousSets);
      const scoreData = formatScoreboardData({ previousSets, currentSet, setsWon, matchStatus, isAmericanFormat });
      const teamServing =
        currentSet?.currentServer && matchStatus === MatchStatus.IN_PLAY
          ? TeamSide[currentSet.currentServer]
          : undefined;

      const { localeCodeBcp47, timezone } = userDetails;
      const { date, dateTime, time } = getDateInformation(sportEvent?.openDate, localeCodeBcp47, timezone);

      const teamA: TeamType = {};
      const teamB: TeamType = {};

      const opponentsNames = getOpponentsNames(fixture);
      if (opponentsNames) {
        teamA.name = opponentsNames.teamA;
        teamB.name = opponentsNames.teamB;
      }

      return {
        currentSet,
        matchStatus,
        scoreData,
        teamA,
        teamB,
        teamServing,
        date,
        dateTime,
        time,
      };
    },
  );
