import { createSelector, ParametricSelector } from "reselect";
import { RugbyUnionFixture, RugbyUnionFixtures } from "./RugbyUnionFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";

export const createRugbyUnionFixtureByURNSelector = (): ParametricSelector<
  RugbyUnionFixtures,
  URN,
  RugbyUnionFixture | undefined
> =>
  createSelector(
    [(fixtures: RugbyUnionFixtures, urn: URN) => fixtures[urn]],
    (fixture): RugbyUnionFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
      };
    },
  );
