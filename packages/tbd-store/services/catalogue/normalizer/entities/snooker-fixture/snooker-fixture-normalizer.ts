import { SnookerScore, SnookerFixture } from "../../../../../state/entities";
import { SnookerFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSnookerScoreIntoSnookerScore = (
  snookerScore: { scoreHome: number; scoreAway: number } | null,
): SnookerScore | undefined => {
  if (!snookerScore) {
    return undefined;
  }

  return {
    home: snookerScore.scoreHome,
    away: snookerScore.scoreAway,
  };
};

const normalizeSnookerFixtureFragmentIntoSnookerFixture = (
  fragment: SnookerFixtureFragment,
): TransformedFragment<SnookerFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, score } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeSnookerScoreIntoSnookerScore(score),
    },
  };
};

export default normalizeSnookerFixtureFragmentIntoSnookerFixture;
