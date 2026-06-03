import { createSelector } from "reselect";
import type { ExchangeMarketStatus, SportsbookMarketStatus } from "@ppb/tbd-store";
import {
  VolleyballFixture,
  VolleyballSet,
  VolleyballScore,
} from "@ppb/tbd-store/state/entities/volleyball-fixture/VolleyballFixture";
import { SportEvent } from "@ppb/tbd-store/state/entities/sport-events/SportEvent.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MatchStatus, ScoreData, TeamType, TeamSide, ScoreStyle } from "@ppb/the-wall-common/types";
import { getAmericanFormatScoreData, getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";

type FormatScoreDataPayload = {
  previousSets?: VolleyballSet[];
  currentSet?: VolleyballSet;
  homeScore?: number;
  awayScore?: number;
  matchStatus?: MatchStatus;
  isAmericanFormat: boolean;
};

type VolleyballScoreData = {
  currentSet?: VolleyballSet;
  matchStatus?: MatchStatus;
  scoreData: ScoreData[];
  teamA: TeamType;
  teamB: TeamType;
  teamServing?: TeamSide;
  date?: string;
  dateTime?: Date;
  time?: string;
};

type VolleyballProps = {
  fixture: VolleyballFixture;
  sportEvent: SportEvent;
  userDetails: UserDetails;
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus;
  inplay?: boolean;
};

type VolleyballDates = {
  date?: string;
  dateTime?: Date;
  time?: string;
};

const getDateInformation = (
  openDate: string | undefined,
  localeCodeBcp47: string,
  timezone: string,
): VolleyballDates => {
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
  score?: VolleyballScore;
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
  homeScore,
  awayScore,
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

  if (matchStatus === MatchStatus.END && homeScore !== undefined && awayScore !== undefined) {
    return [{ teamA: homeScore, teamB: awayScore, style: ScoreStyle.FINISHED }];
  }

  if (homeScore === undefined || awayScore === undefined) {
    return data;
  }

  data[0] = formatScore({
    style: ScoreStyle.DEFAULT,
    score: { home: homeScore, away: awayScore },
    isAmericanFormat,
  });

  if (previousSets) {
    previousSets.forEach((previousSet, index) => {
      data[index + 1] = formatScore({ style: ScoreStyle.FINISHED, score: previousSet.score, isAmericanFormat });
    });
  }

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
  currentSet?: VolleyballSet,
  marketStatus?: ExchangeMarketStatus | SportsbookMarketStatus,
  isMarketInplay?: boolean,
  previousSets?: VolleyballSet[],
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

export const createVolleyballScoreboardByURNSelector = () =>
  createSelector(
    [
      ({ fixture }: VolleyballProps) => fixture,
      ({ sportEvent }: VolleyballProps) => sportEvent,
      ({ userDetails }: VolleyballProps) => userDetails,
      ({ marketStatus }: VolleyballProps) => marketStatus,
      ({ inplay }: VolleyballProps) => inplay,
    ],
    (fixture, sportEvent, userDetails, marketStatus, inplay): VolleyballScoreData | undefined => {
      if (!fixture) return undefined;

      const { currentSet, previousSets, homeScore, awayScore, isAmericanFormat } = fixture;

      const matchStatus = getMatchState(currentSet, marketStatus, inplay, previousSets);
      const scoreData = formatScoreboardData({
        previousSets,
        currentSet,
        homeScore,
        awayScore,
        matchStatus,
        isAmericanFormat,
      });
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
