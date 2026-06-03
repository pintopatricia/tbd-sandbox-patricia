import {
  AmericanFootballScore,
  AmericanFootballFixture,
  AmericanFootballClock,
  AmericanFootballPeriod,
} from "../../../../../state/entities";
import {
  AmericanFootballFixtureFragment,
  AmericanFootballPeriod as AmericanFootballPeriodFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeAmericanFootballScoreIntoAmericanFootballScore = (
  americanFootballScore: { home: number | null; away: number | null } | null,
): AmericanFootballScore | undefined => {
  if (!americanFootballScore) {
    return undefined;
  }

  return {
    home: americanFootballScore.home ?? 0,
    away: americanFootballScore.away ?? 0,
  };
};

const normalizeAmericanFootballClockIntoAmericanFootballClock = (
  americanFootballClock: { americanFootballPeriod: AmericanFootballPeriodFragment | null } | null,
): AmericanFootballClock | undefined => {
  if (!americanFootballClock) {
    return undefined;
  }

  return {
    period: americanFootballClock.americanFootballPeriod
      ? AmericanFootballPeriod[americanFootballClock.americanFootballPeriod]
      : undefined,
  };
};

const normalizeAmericanFootballQuarterScores = (
  quarterScores: Array<{
    period: AmericanFootballPeriodFragment | null;
    score: { home: number | null; away: number | null } | null;
  } | null> | null,
) => {
  if (!quarterScores) {
    return undefined;
  }

  return quarterScores
    .filter((qs): qs is NonNullable<typeof qs> => qs !== null)
    .map((qs) => ({
      period: qs.period ? AmericanFootballPeriod[qs.period] : undefined,
      score: qs.score
        ? {
            home: qs.score.home ?? 0,
            away: qs.score.away ?? 0,
          }
        : undefined,
    }));
};

const normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture = (
  fragment: AmericanFootballFixtureFragment,
): TransformedFragment<AmericanFootballFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, score, clock, quarterScores } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeAmericanFootballScoreIntoAmericanFootballScore(score),
      clock: normalizeAmericanFootballClockIntoAmericanFootballClock(clock),
      quarterScores: normalizeAmericanFootballQuarterScores(quarterScores),
    },
  };
};

export default normalizeAmericanFootballFixtureFragmentIntoAmericanFootballFixture;
