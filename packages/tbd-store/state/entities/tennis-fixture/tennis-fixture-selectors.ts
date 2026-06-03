import { createSelectorCreator, defaultMemoize, createSelector } from "reselect";
import { ScoreData } from "../Fixture.types";
import {
  TennisFixtures,
  TennisFixtureStatusMap,
  TennisMatch,
  TennisStatus,
  TennisMatchScore,
  TennisStatusReason,
  TennisSet,
  TeamSide,
} from "./TennisFixture";

import { getAmericanFormatScoreData } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus, ScoreStyle } from "../../constants";

type TennisScoreData = TennisMatch & {
  teamServing?: TeamSide;
  score?: TennisMatchScore;
  scoreData?: ScoreData[];
};

type FormatScoreboardDataPayload = {
  currentSet?: TennisSet;
  status?: TennisStatus;
  teamAScore?: number;
  teamBScore?: number;
  isAmericanFormat: boolean;
};

type GetTennisScorePayload = Omit<FormatScoreboardDataPayload, "status"> & { currentSet: TennisSet };

const SCOREBOARD_DEFAULT_DATA: ScoreData[] = [
  { teamA: 0, teamB: 0, style: ScoreStyle.EMPTY },
  { teamA: 0, teamB: 0, style: ScoreStyle.EMPTY },
  { teamA: 0, teamB: 0, style: ScoreStyle.EMPTY },
];

const getFixtureStatus = (fixture: TennisMatch): FixtureStatus => {
  if (fixture.status?.status) {
    return TennisFixtureStatusMap[fixture.status.status];
  }

  return FixtureStatus.UNKNOWN;
};

/**
 * For a given tennis fixture, returns a boolean for in game status
 */
export const isTennisMatchInplay = (fixture: TennisMatch): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

/**
 * For a given tennis fixture URN, returns the corresponding fixture or undefined if there's none
 */
const getTennisFixtureByURN = (state: TennisFixtures, urn: URN): TennisMatch | undefined => {
  const fixture = state[urn];

  if (!fixture) return undefined;

  return {
    ...fixture,
    fixtureStatus: getFixtureStatus(fixture),
  };
};

const isEqualFixture: (previous: TennisMatch, current: TennisMatch) => boolean = (previous, current) =>
  previous?.teamAScore === current?.teamAScore &&
  previous?.teamBScore === current?.teamBScore &&
  previous?.status?.status === current?.status?.status &&
  previous?.currentSet?.teamAScore === current?.currentSet?.teamAScore &&
  previous?.currentSet?.teamBScore === current?.currentSet?.teamBScore &&
  previous?.currentSet?.currentGame?.teamAScore === current?.currentSet?.currentGame?.teamAScore &&
  previous?.currentSet?.currentGame?.teamBScore === current?.currentSet?.currentGame?.teamBScore &&
  previous?.currentSet?.currentGame?.teamServing === current?.currentSet?.currentGame?.teamServing &&
  previous?.currentSet?.currentGame?.type === current?.currentSet?.currentGame?.type;

const formatScoreboardData = ({
  currentSet,
  status = TennisStatus.FINISHED,
  teamAScore,
  teamBScore,
  isAmericanFormat,
}: FormatScoreboardDataPayload): ScoreData[] => {
  if (status === TennisStatus.FINISHED) {
    return [{ teamA: teamAScore, teamB: teamBScore, style: ScoreStyle.FINISHED }];
  }
  if (!currentSet) return SCOREBOARD_DEFAULT_DATA;

  return [
    {
      ...getAmericanFormatScoreData({ teamA: teamAScore, teamB: teamBScore, isAmericanFormat }),
      style: ScoreStyle.FINISHED,
    },
    {
      ...getAmericanFormatScoreData({ teamA: currentSet.teamAScore, teamB: currentSet.teamBScore, isAmericanFormat }),
      style: ScoreStyle.DEFAULT,
    },
    {
      ...getAmericanFormatScoreData({
        teamA: currentSet.currentGame?.teamAScore,
        teamB: currentSet.currentGame?.teamBScore,
        isAmericanFormat,
      }),
      style: status === TennisStatus.INTERRUPTED ? ScoreStyle.PAUSED : ScoreStyle.IN_PLAY,
    },
  ];
};

const getTennisScore = (payload: GetTennisScorePayload): TennisMatchScore | undefined => {
  const { currentSet, isAmericanFormat } = payload;
  const homeKey = isAmericanFormat ? "teamBScore" : "teamAScore";
  const awayKey = isAmericanFormat ? "teamAScore" : "teamBScore";

  return {
    currentMatch: {
      home: payload[homeKey] ?? 0,
      away: payload[awayKey] ?? 0,
    },
    currentSet: {
      home: currentSet[homeKey],
      away: currentSet[awayKey],
    },
    currentGame: {
      home: currentSet.currentGame?.[homeKey] || 0,
      away: currentSet.currentGame?.[awayKey] || 0,
    },
  };
};

export const createTennisFixtureByURNSelector = () =>
  createSelectorCreator(defaultMemoize, isEqualFixture)(
    getTennisFixtureByURN,
    (tennisFixture: TennisMatch | undefined) => tennisFixture,
  );

export const createTennisScoreboardByURNSelector = () => {
  const getTennisFixture = createTennisFixtureByURNSelector();

  return createSelector([getTennisFixture], (tennisFixture): TennisScoreData | undefined => {
    if (!tennisFixture) {
      return undefined;
    }

    const { teamAScore, teamBScore, currentSet, status: matchStatus, isAmericanFormat } = tennisFixture;

    // TODO: Remove score after 1006346
    const score = currentSet && getTennisScore({ currentSet, teamAScore, teamBScore, isAmericanFormat });

    const notSupportedStatusReasons = [TennisStatusReason.TOILET_BREAK, TennisStatusReason.ON_COURT_COACHING];
    const ignoreStatusReason = matchStatus?.reason ? notSupportedStatusReasons.includes(matchStatus.reason) : false;

    const tennisStatus = matchStatus?.status && TennisStatus[matchStatus.status];

    const status = {
      status: tennisStatus && ignoreStatusReason ? TennisStatus.IN_RUNNING : tennisStatus,
      reason: !ignoreStatusReason ? matchStatus?.reason : undefined,
    };

    const scoreData = formatScoreboardData({
      currentSet,
      status: status?.status,
      teamAScore,
      teamBScore,
      isAmericanFormat,
    });

    return {
      ...tennisFixture,
      score,
      scoreData,
      status,
    };
  });
};
