import { RugbyUnionScore, RugbyUnionFixture } from "../../../../../state/entities";
import { RugbyUnionFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRugbyUnionScoreIntoRugbyUnionScore = (
  rugbyUnionScore: { scoreHome: number; scoreAway: number } | null,
): RugbyUnionScore | undefined => {
  if (!rugbyUnionScore) {
    return undefined;
  }

  return {
    home: rugbyUnionScore.scoreHome,
    away: rugbyUnionScore.scoreAway,
  };
};

const normalizeRugbyUnionHalfTimeScoreIntoRugbyUnionHalfTimeScore = (
  rugbyUnionHalfTimeScore: { halfTimeScoreHome: number; halfTimeScoreAway: number } | null,
): RugbyUnionScore | undefined => {
  if (!rugbyUnionHalfTimeScore) {
    return undefined;
  }

  return {
    home: rugbyUnionHalfTimeScore.halfTimeScoreHome,
    away: rugbyUnionHalfTimeScore.halfTimeScoreAway,
  };
};

const normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture = (
  fragment: RugbyUnionFixtureFragment,
): TransformedFragment<RugbyUnionFixture> => {
  const { __typename, urn, score, halfTimeScore, isAmericanFormat, runnerNames } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeRugbyUnionScoreIntoRugbyUnionScore(score),
      halfTimeScore: normalizeRugbyUnionHalfTimeScoreIntoRugbyUnionHalfTimeScore(halfTimeScore),
    },
  };
};

export default normalizeRugbyUnionFixtureFragmentIntoRugbyUnionFixture;
