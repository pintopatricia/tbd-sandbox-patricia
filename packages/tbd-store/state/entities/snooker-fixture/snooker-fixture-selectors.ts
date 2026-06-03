import { createSelector, ParametricSelector } from "reselect";
import { SnookerFixture, SnookerFixtures } from "./SnookerFixture.types";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: SnookerFixture): FixtureStatus {
  if (fixture.score) {
    return FixtureStatus.IN_PLAY;
  }
  return FixtureStatus.PRE_MATCH;
}

export const createSnookerFixtureByURNSelector = (): ParametricSelector<
  SnookerFixtures,
  URN,
  SnookerFixture | undefined
> =>
  createSelector([(fixtures: SnookerFixtures, urn: URN) => fixtures[urn]], (fixture): SnookerFixture | undefined => {
    if (!fixture) return undefined;

    const opponentsNames = getOpponentsNames(fixture);

    return {
      ...fixture,
      opponentsNames,
      fixtureStatus: getFixtureStatus(fixture),
    };
  });
