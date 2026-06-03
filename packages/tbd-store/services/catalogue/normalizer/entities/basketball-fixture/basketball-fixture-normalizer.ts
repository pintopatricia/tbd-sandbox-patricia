import {
  BasketballScore,
  BasketballClock,
  BasketballFixture,
  BasketballPeriodScore,
  BasketballPeriod,
  BasketballSegment,
} from "../../../../../state/entities";
import {
  BasketballFixtureFragment,
  BasketballClock as BasketballClockFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBasketballScoreIntoBasketballScore = (
  basketballScore: { scoreHome: number; scoreAway: number } | null,
): BasketballScore | undefined => {
  if (!basketballScore) {
    return undefined;
  }

  return {
    home: basketballScore.scoreHome,
    away: basketballScore.scoreAway,
  };
};

const normalizeBasketballClockIntoBasketballClock = (
  basketballClock: BasketballClockFragment,
): BasketballClock | undefined => {
  if (!basketballClock) {
    return undefined;
  }

  return {
    period: basketballClock.period ? BasketballPeriod[basketballClock.period] : undefined,
    segment: basketballClock.segment ? BasketballSegment[basketballClock.segment] : undefined,
    timeElapsed: basketballClock.timeElapsed ? basketballClock.timeElapsed : undefined,
    timeRemaining: basketballClock.timeRemaining ? basketballClock.timeRemaining : undefined,
  };
};

const normalizeBasketballPeriodScoresIntoBasketballPeriodScores = (
  fixture: BasketballFixtureFragment,
): BasketballPeriodScore[] | undefined => {
  if (!fixture) {
    return undefined;
  }
  const { periodScores } = fixture;

  if (!periodScores) {
    return undefined;
  }

  return periodScores.reduce<BasketballPeriodScore[]>((acc, period) => {
    if (period) {
      acc.push({
        score: normalizeBasketballScoreIntoBasketballScore(period.score),
        period: period.period ? BasketballPeriod[period.period] : undefined,
        segment: period.segment ? BasketballSegment[period.segment] : undefined,
      });
    }
    return acc;
  }, []);
};

const normalizeBasketballFixtureFragmentIntoBasketballFixture = (
  fragment: BasketballFixtureFragment,
): TransformedFragment<BasketballFixture> => {
  const { __typename, urn, score, clock, isAmericanFormat, runnerNames } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeBasketballScoreIntoBasketballScore(score),
      clock: normalizeBasketballClockIntoBasketballClock(clock as BasketballClockFragment),
      periodScores: normalizeBasketballPeriodScoresIntoBasketballPeriodScores(fragment),
    },
  };
};

export default normalizeBasketballFixtureFragmentIntoBasketballFixture;
