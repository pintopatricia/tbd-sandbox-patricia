import { createSelector, ParametricSelector } from "reselect";
import { DartsFixture, DartsFixtures } from "./DartsFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: DartsFixture): FixtureStatus {
  if (fixture.score) {
    return FixtureStatus.IN_PLAY;
  }
  return FixtureStatus.PRE_MATCH;
}

/**
 * For a given Darts fixture, returns a boolean for in game status
 */
export const isDartsMatchInplay = (fixture: DartsFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createDartsFixtureByURNSelector = (): ParametricSelector<DartsFixtures, URN, DartsFixture | undefined> =>
  createSelector([(fixtures: DartsFixtures, urn: URN) => fixtures[urn]], (fixture): DartsFixture | undefined => {
    if (!fixture) return undefined;

    const opponentsNames = getOpponentsNames(fixture);

    return {
      ...fixture,
      opponentsNames,
      fixtureStatus: getFixtureStatus(fixture),
    };
  });
