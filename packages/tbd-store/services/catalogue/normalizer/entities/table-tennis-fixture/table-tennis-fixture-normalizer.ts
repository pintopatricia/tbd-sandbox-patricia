import { TableTennisFixture, TableTennisScore, TableTennisSet, TeamSide } from "../../../../../state/entities";
import {
  TableTennisFixtureFragment,
  TableTennisScore as TableTennisScoreFragment,
  TableTennisSet as TableTennisSetFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

export function normalizeTableTennisScore(score: TableTennisScoreFragment): TableTennisScore {
  return {
    home: score.home,
    away: score.away,
  };
}

export function normalizeTableTennisSet(set: TableTennisSetFragment): TableTennisSet {
  return {
    number: set.number,
    score: normalizeTableTennisScore(set.score),
    currentServer: set.currentServer ? TeamSide[set.currentServer] : undefined,
  };
}

export function normalizeTableTennisSets(sets: (TableTennisSetFragment | null)[]): TableTennisSet[] {
  return sets.reduce((acc, set): TableTennisSet[] => {
    if (set) {
      acc.push(normalizeTableTennisSet(set));
    }
    return acc;
  }, [] as TableTennisSet[]);
}

const normalizeTableTennisFixtureFragmentIntoTableTennisFixture = (
  fragment: TableTennisFixtureFragment,
): TransformedFragment<TableTennisFixture> => {
  const { urn, __typename, runnerNames, isAmericanFormat, currentSet, setsWon, previousSets } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      currentSet: currentSet ? normalizeTableTennisSet(currentSet) : undefined,
      setsWon: setsWon ? normalizeTableTennisScore(setsWon) : undefined,
      previousSets: previousSets && previousSets.length ? normalizeTableTennisSets(previousSets) : undefined,
    },
  };
};

export default normalizeTableTennisFixtureFragmentIntoTableTennisFixture;
