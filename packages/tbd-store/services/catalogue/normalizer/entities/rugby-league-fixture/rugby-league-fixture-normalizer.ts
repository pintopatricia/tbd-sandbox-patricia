import { RugbyLeagueScore, RugbyLeagueFixture } from "../../../../../state/entities";
import { RugbyLeagueFixtureDeprecatedFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRugbyLeagueScoreIntoRugbyLeagueScore = (
  rugbyLeagueScore: { scoreHome: number; scoreAway: number } | null,
): RugbyLeagueScore | undefined => {
  if (!rugbyLeagueScore) {
    return undefined;
  }

  return {
    home: rugbyLeagueScore.scoreHome,
    away: rugbyLeagueScore.scoreAway,
  };
};

const normalizeRugbyLeagueHalfTimeScoreIntoRugbyLeagueHalfTimeScore = (
  rugbyLeagueHalfTimeScore: { halfTimeScoreHome: number; halfTimeScoreAway: number } | null,
): RugbyLeagueScore | undefined => {
  if (!rugbyLeagueHalfTimeScore) {
    return undefined;
  }

  return {
    home: rugbyLeagueHalfTimeScore.halfTimeScoreHome,
    away: rugbyLeagueHalfTimeScore.halfTimeScoreAway,
  };
};

const normalizeRugbyLeagueFixtureFragmentIntoRugbyLeagueFixture = (
  fragment: RugbyLeagueFixtureDeprecatedFragment,
): TransformedFragment<RugbyLeagueFixture> => {
  const { __typename, urn, score, halfTimeScore, isAmericanFormat, runnerNames } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      score: normalizeRugbyLeagueScoreIntoRugbyLeagueScore(score),
      halfTimeScore: normalizeRugbyLeagueHalfTimeScoreIntoRugbyLeagueHalfTimeScore(halfTimeScore),
    },
  };
};

export default normalizeRugbyLeagueFixtureFragmentIntoRugbyLeagueFixture;
