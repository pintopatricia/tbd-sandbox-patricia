import { createSelector, ParametricSelector } from "reselect";
import { BaseballFixture, BaseballFixtures, BaseballFixtureStatusMap } from "./BaseballFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: BaseballFixture): FixtureStatus {
  if (fixture.clock?.period) {
    return BaseballFixtureStatusMap[fixture.clock.period];
  }
  return FixtureStatus.UNKNOWN;
}

/**
 * For a given Baseball fixture, returns a boolean for in game status
 */
export const isBaseballMatchInplay = (fixture: BaseballFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createBaseballFixtureByURNSelector = (): ParametricSelector<
  BaseballFixtures,
  URN,
  BaseballFixture | undefined
> =>
  createSelector([(fixtures: BaseballFixtures, urn: URN) => fixtures[urn]], (fixture): BaseballFixture | undefined => {
    if (!fixture) return undefined;

    const opponentsNames = getOpponentsNames(fixture);

    return {
      ...fixture,
      opponentsNames,
      fixtureStatus: getFixtureStatus(fixture),
    };
  });
