import { createSelector, ParametricSelector } from "reselect";
import { VolleyballFixture, VolleyballFixtures } from "./VolleyballFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";

export const createVolleyballFixtureByURNSelector = (): ParametricSelector<
  VolleyballFixtures,
  URN,
  VolleyballFixture | undefined
> =>
  createSelector(
    [(fixtures: VolleyballFixtures, urn: URN) => fixtures[urn]],
    (fixture): VolleyballFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
      };
    },
  );
