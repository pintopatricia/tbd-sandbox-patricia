import { createSelectorCreator, defaultMemoize } from "reselect";
import URN from "../../layout/URN";
import { TableTennisFixtures, TableTennisFixture } from "./TableTennisFixture.types";

/**
 * For a given table tennis fixture URN, returns the corresponding fixture or undefined if there's none
 */
const getTableTennisFixtureByURN = (state: TableTennisFixtures, urn: URN): TableTennisFixture | undefined => {
  const fixture = state[urn];

  if (!fixture) return undefined;

  return fixture;
};

const isEqualFixture: (previous: TableTennisFixture, current: TableTennisFixture) => boolean = (previous, current) =>
  previous?.setsWon?.home === current?.setsWon?.home &&
  previous?.setsWon?.away === current?.setsWon?.away &&
  previous?.currentSet?.number === current?.currentSet?.number &&
  previous?.currentSet?.score?.home === current?.currentSet?.score?.home &&
  previous?.currentSet?.score?.away === current?.currentSet?.score?.away &&
  previous?.currentSet?.currentServer === current?.currentSet?.currentServer;

export const createTableTennisFixtureByURNSelector = () =>
  createSelectorCreator(defaultMemoize, isEqualFixture)(
    getTableTennisFixtureByURN,
    (tableTennisFixture: TableTennisFixture | undefined) => tableTennisFixture,
  );
