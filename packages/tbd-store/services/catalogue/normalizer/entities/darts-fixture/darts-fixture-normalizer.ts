import { DartsFixture, DartsFixtureType, DartsScore, DartsSet } from "../../../../../state/entities";
import { DartsFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeDartsScoreIntoDartsScore = (
  dartsScore: { home: number; away: number } | null | undefined,
): DartsScore | undefined => {
  if (!dartsScore) {
    return undefined;
  }

  return {
    home: dartsScore.home,
    away: dartsScore.away,
  };
};

const normalizeDartsSetIntoDartsSet = (
  dartsSet: { number: number; score: { home: number; away: number } } | null | undefined,
): DartsSet | undefined => {
  if (!dartsSet) {
    return undefined;
  }

  return {
    number: dartsSet.number,
    score: normalizeDartsScoreIntoDartsScore(dartsSet.score),
  };
};

const normalizeDartsFixtureFragmentIntoDartsFixture = (
  fragment: DartsFixtureFragment,
): TransformedFragment<DartsFixture> => {
  const { urn, __typename, isAmericanFormat, runnerNames, dartsFixtureType, dartsScore, currentSet, previousSets } =
    fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      type: dartsFixtureType ? (dartsFixtureType as unknown as DartsFixtureType) : undefined,
      score: normalizeDartsScoreIntoDartsScore(dartsScore),
      currentSet: normalizeDartsSetIntoDartsSet(currentSet),
      previousSets: previousSets
        ? previousSets
            .map((set) => normalizeDartsSetIntoDartsSet(set))
            .filter((set): set is DartsSet => set !== undefined)
        : undefined,
    },
  };
};

export default normalizeDartsFixtureFragmentIntoDartsFixture;
