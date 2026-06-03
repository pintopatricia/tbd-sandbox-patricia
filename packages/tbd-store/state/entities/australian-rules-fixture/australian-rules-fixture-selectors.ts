import { createSelector, ParametricSelector } from "reselect";
import { AustralianRulesFixture, AustralianRulesFixtures } from "./AustralianRulesFixture.types";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";
import { FixtureStatus } from "../../constants";

function getFixtureStatus(fixture: AustralianRulesFixture): FixtureStatus {
  const { score } = fixture;
  const { goals, behinds, points } = score || {};

  if (score && (goals || behinds || points)) {
    return FixtureStatus.IN_PLAY;
  }

  return FixtureStatus.UNKNOWN;
}

/**
 * For a given australian rules fixture, returns a boolean for in game status
 */
export const isAustralianRulesMatchInplay = (fixture: AustralianRulesFixture): boolean =>
  getFixtureStatus(fixture) === FixtureStatus.IN_PLAY;

export const createAustralianRulesFixtureByURNSelector = (): ParametricSelector<
  AustralianRulesFixtures,
  URN,
  AustralianRulesFixture | undefined
> =>
  createSelector(
    [(fixtures: AustralianRulesFixtures, urn: URN) => fixtures[urn]],
    (fixture): AustralianRulesFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
        fixtureStatus: getFixtureStatus(fixture),
      };
    },
  );
