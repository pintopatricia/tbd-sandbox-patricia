import { createSelector, ParametricSelector } from "reselect";
import {
  AmericanFootballFixture,
  AmericanFootballFixtures,
  AmericanFootballFixtureStatusMap,
} from "./AmericanFootballFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: AmericanFootballFixture): FixtureStatus {
  if (fixture.clock?.period) {
    return AmericanFootballFixtureStatusMap[fixture.clock.period];
  }
  return FixtureStatus.UNKNOWN;
}

export const isAmericanFootballMatchInplay = (fixture: AmericanFootballFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createAmericanFootballFixtureByURNSelector = (): ParametricSelector<
  AmericanFootballFixtures,
  URN,
  AmericanFootballFixture | undefined
> =>
  createSelector(
    [(fixtures: AmericanFootballFixtures, urn: URN) => fixtures[urn]],
    (fixture): AmericanFootballFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
        fixtureStatus: getFixtureStatus(fixture),
      };
    },
  );
