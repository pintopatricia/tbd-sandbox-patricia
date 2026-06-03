import { createSelector, ParametricSelector } from "reselect";
import { IceHockeyFixture, IceHockeyFixtures, IceHockeyFixtureStatusMap } from "./IceHockeyFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: IceHockeyFixture): FixtureStatus {
  if (fixture.clock?.period) {
    return IceHockeyFixtureStatusMap[fixture.clock.period];
  }
  return FixtureStatus.UNKNOWN;
}

/**
 * For a given IceHockey fixture, returns a boolean for in game status
 */
export const isIceHockeyMatchInplay = (fixture: IceHockeyFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createIceHockeyFixtureByURNSelector = (): ParametricSelector<
  IceHockeyFixtures,
  URN,
  IceHockeyFixture | undefined
> =>
  createSelector(
    [(fixtures: IceHockeyFixtures, urn: URN) => fixtures[urn]],
    (fixture): IceHockeyFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
        fixtureStatus: getFixtureStatus(fixture),
      };
    },
  );
