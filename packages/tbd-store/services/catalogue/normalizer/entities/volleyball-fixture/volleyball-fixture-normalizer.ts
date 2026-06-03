import { VolleyballFixture, VolleyballScore, VolleyballSet, TeamSide } from "../../../../../state/entities";
import { VolleyballFixtureDeprecatedFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

type VolleyballSetFragmentAliased = {
  volleyballSetNumber: number | null;
  volleyballSetScore: { home: number; away: number } | null;
  volleyballCurrentServer: string | null;
};

export function normalizeVolleyballScore(score: { home: number; away: number }): VolleyballScore {
  return {
    home: score.home,
    away: score.away,
  };
}

export function normalizeVolleyballSet(set: VolleyballSetFragmentAliased): VolleyballSet {
  return {
    number: set.volleyballSetNumber ?? undefined,
    score: set.volleyballSetScore ? normalizeVolleyballScore(set.volleyballSetScore) : undefined,
    currentServer: set.volleyballCurrentServer
      ? TeamSide[set.volleyballCurrentServer as keyof typeof TeamSide]
      : undefined,
  };
}

export function normalizeVolleyballSets(sets: (VolleyballSetFragmentAliased | null)[]): VolleyballSet[] {
  return sets.reduce((acc, set): VolleyballSet[] => {
    if (set) {
      acc.push(normalizeVolleyballSet(set));
    }
    return acc;
  }, [] as VolleyballSet[]);
}

const normalizeVolleyballFixtureFragmentIntoVolleyballFixture = (
  fragment: VolleyballFixtureDeprecatedFragment,
): TransformedFragment<VolleyballFixture> => {
  const { urn, __typename, runnerNames, isAmericanFormat, currentSet, homeScore, awayScore, previousSets } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      currentSet: currentSet ? normalizeVolleyballSet(currentSet) : undefined,
      homeScore: homeScore ?? undefined,
      awayScore: awayScore ?? undefined,
      previousSets: previousSets && previousSets.length ? normalizeVolleyballSets(previousSets) : undefined,
    },
  };
};

export default normalizeVolleyballFixtureFragmentIntoVolleyballFixture;
