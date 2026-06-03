import { createSelectorCreator, defaultMemoize } from "reselect";
import URN from "../../layout/URN";
import { CricketFixtures, CricketFixture } from "./CricketFixture.types";

const getCricketFixtureByURN = (state: CricketFixtures, urn: URN): CricketFixture | undefined => {
  const fixture = state[urn];

  if (!fixture) return undefined;

  return {
    ...fixture,
  };
};

const isEqualFixture: (previous: CricketFixture, current: CricketFixture) => boolean = (previous, current) =>
  JSON.stringify(previous?.score?.home) === JSON.stringify(current?.score?.home) &&
  JSON.stringify(previous?.score?.away) === JSON.stringify(current?.score?.away) &&
  previous?.currentTeamBatting === current?.currentTeamBatting &&
  previous?.currentTime?.inning === current?.currentTime?.inning &&
  previous?.currentTime?.over === current?.currentTime?.over;

export const createCricketFixtureByURNSelector = () =>
  createSelectorCreator(defaultMemoize, isEqualFixture)(
    getCricketFixtureByURN,
    (cricketFixture: CricketFixture | undefined) => cricketFixture,
  );
