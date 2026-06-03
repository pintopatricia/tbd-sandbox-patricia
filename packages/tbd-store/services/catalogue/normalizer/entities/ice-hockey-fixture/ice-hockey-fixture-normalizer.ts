import {
  IceHockeyScore,
  IceHockeyFixture,
  IceHockeyClock,
  IceHockeyPeriod,
  IceHockeyPeriodScore,
} from "../../../../../state/entities";
import { IceHockeyFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeIceHockeyScoreIntoIceHockeyScore = (
  iceHockeyScore: { scoreHome: number; scoreAway: number } | null,
): IceHockeyScore | undefined => {
  if (!iceHockeyScore) {
    return undefined;
  }

  return {
    home: iceHockeyScore.scoreHome,
    away: iceHockeyScore.scoreAway,
  };
};

const normalizeIceHockeyClockIntoIceHockeyClock = (
  iceHockeyClock: { clockPeriod: IceHockeyPeriod | null } | null,
): IceHockeyClock | undefined => {
  if (!iceHockeyClock) {
    return undefined;
  }

  return {
    period: iceHockeyClock.clockPeriod ? IceHockeyPeriod[iceHockeyClock.clockPeriod] : undefined,
  };
};

const normalizeIceHockeyPeriodScoresIntoIceHockeyPeriodScores = (
  fixture: IceHockeyFixtureFragment,
): IceHockeyPeriodScore[] | undefined => {
  if (!fixture) {
    return undefined;
  }
  const { periodScores } = fixture;

  if (!periodScores) {
    return undefined;
  }

  return periodScores.reduce<IceHockeyPeriodScore[]>((acc, period) => {
    if (period) {
      acc.push({
        score: normalizeIceHockeyScoreIntoIceHockeyScore(period.score),
        period: period.periodScoresPeriod ? IceHockeyPeriod[period.periodScoresPeriod] : undefined,
      });
    }
    return acc;
  }, []);
};

const normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture = (
  fragment: IceHockeyFixtureFragment,
): TransformedFragment<IceHockeyFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, score, clock } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeIceHockeyScoreIntoIceHockeyScore(score),
      clock: normalizeIceHockeyClockIntoIceHockeyClock(clock as { clockPeriod: IceHockeyPeriod | null }),
      periodScores: normalizeIceHockeyPeriodScoresIntoIceHockeyPeriodScores(fragment),
    },
  };
};

export default normalizeIceHockeyFixtureFragmentIntoIceHockeyFixture;
