import {
  BaseballScore,
  BaseballFixture,
  BaseballClock,
  BaseballPeriod,
  BaseballInningScore,
} from "../../../../../state/entities";
import { BaseballFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBaseballScoreIntoBaseballScore = (
  baseballScore: { scoreHome: number; scoreAway: number } | null,
): BaseballScore | undefined => {
  if (!baseballScore) {
    return undefined;
  }

  return {
    home: baseballScore.scoreHome,
    away: baseballScore.scoreAway,
  };
};

const normalizeBaseballClockIntoBaseballClock = (
  baseballClock: { baseballClockPeriod: BaseballPeriod | null } | null,
): BaseballClock | undefined => {
  if (!baseballClock) {
    return undefined;
  }

  return {
    period: baseballClock.baseballClockPeriod ? BaseballPeriod[baseballClock.baseballClockPeriod] : undefined,
  };
};

const normalizeBaseballScorePerInningIntoBaseballInningScores = (
  fixture: BaseballFixtureFragment,
): BaseballInningScore[] | undefined => {
  if (!fixture) {
    return undefined;
  }
  const { scorePerInning } = fixture;

  if (!scorePerInning) {
    return undefined;
  }

  return scorePerInning.reduce<BaseballInningScore[]>((acc, inning) => {
    if (inning) {
      acc.push({
        score: normalizeBaseballScoreIntoBaseballScore(inning.score),
        period: inning.baseballInningPeriod ? BaseballPeriod[inning.baseballInningPeriod] : undefined,
      });
    }
    return acc;
  }, []);
};

const normalizeBaseballFixtureFragmentIntoBaseballFixture = (
  fragment: BaseballFixtureFragment,
): TransformedFragment<BaseballFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, score, clock } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeBaseballScoreIntoBaseballScore(score),
      clock: normalizeBaseballClockIntoBaseballClock(clock as { baseballClockPeriod: BaseballPeriod | null }),
      scorePerInning: normalizeBaseballScorePerInningIntoBaseballInningScores(fragment),
    },
  };
};

export default normalizeBaseballFixtureFragmentIntoBaseballFixture;
