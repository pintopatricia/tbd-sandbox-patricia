import { createSelector, ParametricSelector } from "reselect";
import { BasketballFixture, BasketballFixtures, BasketballFixtureStatusMap } from "./BasketballFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: BasketballFixture): FixtureStatus {
  if (fixture.clock?.period) {
    return BasketballFixtureStatusMap[fixture.clock.period];
  }

  return FixtureStatus.UNKNOWN;
}

/**
 * For a given basketball fixture, returns a boolean for in game status
 */
export const isBasketballMatchInplay = (fixture: BasketballFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createBasketballFixtureByURNSelector = (): ParametricSelector<
  BasketballFixtures,
  URN,
  BasketballFixture | undefined
> =>
  createSelector(
    [(fixtures: BasketballFixtures, urn: URN) => fixtures[urn]],
    (fixture): BasketballFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
        fixtureStatus: getFixtureStatus(fixture),
      };
    },
  );
